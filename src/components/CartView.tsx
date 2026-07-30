"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCart, removeFromCart, updateCartQuantity, clearCart, CartItem } from "@/lib/cart"
import dynamic from "next/dynamic"

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false })

export default function CartView() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "paying">("cart")

  useEffect(() => {
    setMounted(true)
    setItems(getCart())

    function handleSync() {
      setItems(getCart())
    }
    window.addEventListener("cart-updated", handleSync)
    return () => window.removeEventListener("cart-updated", handleSync)
  }, [])

  if (!mounted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-muted">
        Loading cart…
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-primary-dark">Your Cart is Empty</h2>
        <p className="mt-2 text-muted">Add some quality refurbished pieces to your home.</p>
        <Link href="/products" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
          Browse Products
        </Link>
      </div>
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCheckoutStep("paying")
    setLoading(true)
    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items.map(item => ({
            slug: item.slug,
            name: item.name,
            quantity: item.quantity,
          })),
          customerName: form.get("name"),
          customerEmail: form.get("email"),
          customerPhone: form.get("phone"),
          address: form.get("address"),
          latitude: form.get("latitude"),
          longitude: form.get("longitude"),
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP error! Status: ${res.status}`)
      }

      const { orderId, amount } = await res.json()

      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "budgetpay.store",
        description: `Cart Order (${items.length} items)`,
        order_id: orderId,
        prefill: {
          name: form.get("name") || "",
          email: form.get("email") || "",
          contact: form.get("phone") || "",
        },
        notes: {
          address: form.get("address") || "",
          latitude: form.get("latitude") || "",
          longitude: form.get("longitude") || "",
        },
        handler: async function (response: any) {
          const verify = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          const data = await verify.json()
          if (data.success) {
            clearCart()
            router.push(`/order/confirmation?id=${orderId}`)
          } else {
            alert("Payment verification failed. Please contact support.")
          }
        },
        modal: { ondismiss: () => {
          setLoading(false)
          setCheckoutStep("form")
        } },
      })
      rzp.open()
    } catch (err: any) {
      alert(err?.message || "Something went wrong. Please try again.")
      setCheckoutStep("form")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary-dark">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Items List */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.slug} className="flex gap-4 rounded-xl border border-border bg-white p-4 items-center">
              <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-muted opacity-50">No photo</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-dark">{item.name}</h3>
                <p className="text-sm text-foreground font-bold mt-0.5">₹{(item.price / 100).toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(item.slug, item.quantity - 1)}
                  className="h-7 w-7 rounded border border-border flex items-center justify-center text-sm font-semibold hover:bg-surface active:scale-95"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(item.slug, item.quantity + 1)}
                  className="h-7 w-7 rounded border border-border flex items-center justify-center text-sm font-semibold hover:bg-surface active:scale-95"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.slug)}
                className="text-muted hover:text-red-500 text-xs ml-2 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary / Form */}
        <div className="rounded-xl border border-border bg-white p-6 h-fit space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-primary-dark">Order Summary</h2>
            <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold text-foreground">
              <span>Subtotal</span>
              <span>₹{(subtotal / 100).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {checkoutStep === "cart" && (
            <button
              onClick={() => setCheckoutStep("form")}
              className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Proceed to Checkout
            </button>
          )}

          {checkoutStep === "form" && (
            <form onSubmit={handleCheckout} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase text-accent tracking-wider">Delivery Details</h3>
              <input name="name" placeholder="Full Name" required className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
              <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
              <input name="phone" placeholder="Phone" className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
              <LocationPicker name="address" />
              <button type="submit" className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-dark transition-colors">
                Pay ₹{(subtotal / 100).toLocaleString("en-IN")}
              </button>
              <button
                type="button"
                onClick={() => setCheckoutStep("cart")}
                className="w-full text-center text-xs text-muted hover:underline"
              >
                Back to Cart
              </button>
            </form>
          )}

          {checkoutStep === "paying" && (
            <button disabled className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white opacity-50 cursor-not-allowed">
              Processing Order…
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
