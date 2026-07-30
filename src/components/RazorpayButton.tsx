"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false })

type Props = {
  productSlug: string
  productName: string
  amountPaise: number
}

export default function RazorpayButton({ productSlug, productName, amountPaise }: Props) {
  const [step, setStep] = useState<"form" | "paying">("form")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handlePay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStep("paying")
    setLoading(true)
    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          customerName: form.get("name"),
          customerEmail: form.get("email"),
          customerPhone: form.get("phone"),
          address: form.get("address"),
          latitude: form.get("latitude"),
          longitude: form.get("longitude"),
        }),
      })
      const { orderId, amount } = await res.json()

      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "budgetpay.store",
        description: productName,
        order_id: orderId,
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
            router.push(`/order/confirmation?id=${orderId}`)
          } else {
            alert("Payment verification failed. Please contact support.")
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      })
      rzp.open()
    } catch {
      alert("Something went wrong. Please try again.")
      setStep("form")
    } finally {
      setLoading(false)
    }
  }

  if (step === "paying") {
    return (
      <button disabled className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white opacity-50 sm:w-auto">
        Processing…
      </button>
    )
  }

  return (
    <form onSubmit={handlePay} className="space-y-3">
      <input name="name" placeholder="Full Name" required className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
      <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
      <input name="phone" placeholder="Phone" className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
      <LocationPicker name="address" />
      <button type="submit" className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark sm:w-auto">
        Pay ₹{(amountPaise / 100).toLocaleString("en-IN")}
      </button>
    </form>
  )
}