"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCart, removeFromCart, updateCartQuantity, clearCart, CartItem } from "@/lib/cart"
import FadeIn from "@/components/FadeIn"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-muted animate-pulse-soft">
        Loading cart…
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <FadeIn dir="up">
          <h2 className="text-2xl font-bold text-primary-dark">Your Cart is Empty</h2>
          <p className="mt-2 text-muted">Add some quality affordable pieces to your home.</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary-dark hover:scale-105 active:scale-95"
          >
            Browse Products
          </Link>
        </FadeIn>
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
      <FadeIn dir="up">
        <h1 className="text-3xl font-bold text-primary-dark">Shopping Cart</h1>
      </FadeIn>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Items List */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item, i) => (
            <FadeIn key={item.slug} dir="up" delay={i * 75}>
              <div className="flex gap-4 rounded-xl border border-border bg-white p-4 items-center transition-all hover:shadow-md">
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
                    onClick={() => { updateCartQuantity(item.slug, item.quantity - 1); setItems(getCart()) }}
                    className="h-7 w-7 rounded border border-border flex items-center justify-center text-sm font-semibold transition-all hover:bg-surface active:scale-95 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => { updateCartQuantity(item.slug, item.quantity + 1); setItems(getCart()) }}
                    className="h-7 w-7 rounded border border-border flex items-center justify-center text-sm font-semibold transition-all hover:bg-surface active:scale-95 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => { removeFromCart(item.slug); setItems(getCart()) }}
                  className="text-muted transition-all hover:text-red-500 hover:scale-110 text-xs ml-2 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Summary / Form */}
        <div className="space-y-6">
          <FadeIn dir="up" delay={items.length * 75 + 50}>
            <div className="rounded-xl border border-border bg-white p-6 h-fit space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-primary-dark">Order Summary</h2>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold text-foreground">
                  <span>Subtotal</span>
                  <span>₹{(subtotal / 100).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {checkoutStep === "cart" && (
                <Button
                  onClick={() => setCheckoutStep("form")}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>
              )}

              {checkoutStep === "paying" && (
                <Button disabled className="w-full animate-pulse opacity-50 cursor-not-allowed">
                  Processing Order…
                </Button>
              )}
            </div>
          </FadeIn>

          {checkoutStep === "form" && (
            <FadeIn dir="up">
              <form onSubmit={handleCheckout} className="rounded-xl border border-border bg-white p-6 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-accent tracking-wider">Delivery Details</h3>
                <Input name="name" placeholder="Full Name" required />
                <Input name="email" type="email" placeholder="Email" required />
                <Input name="phone" placeholder="Phone" />
                <LocationPicker name="address" />
                <Button type="submit" className="w-full">
                  Pay ₹{(subtotal / 100).toLocaleString("en-IN")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCheckoutStep("cart")}
                  className="w-full text-xs text-muted hover:underline active:scale-100"
                >
                  Back to Cart
                </Button>
              </form>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  )
}
