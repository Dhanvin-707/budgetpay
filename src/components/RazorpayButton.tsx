"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
        description: productName,
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
            router.push(`/order/confirmation?id=${orderId}`)
          } else {
            alert("Payment verification failed. Please contact support.")
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      })
      rzp.open()
    } catch (err: any) {
      alert(err?.message || "Something went wrong. Please try again.")
      setStep("form")
    } finally {
      setLoading(false)
    }
  }

  if (step === "paying") {
    return (
      <Button disabled className="w-full sm:w-auto">
        Processing…
      </Button>
    )
  }

  return (
    <form onSubmit={handlePay} className="space-y-3">
      <Input name="name" placeholder="Full Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" placeholder="Phone" />
      <LocationPicker name="address" />
      <Button type="submit" className="w-full sm:w-auto">
        Pay ₹{(amountPaise / 100).toLocaleString("en-IN")}
      </Button>
    </form>
  )
}