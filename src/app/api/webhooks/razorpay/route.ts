import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  const text = await req.text()
  const signature = req.headers.get("x-razorpay-signature") || ""
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!

  const expected = crypto
    .createHmac("sha256", secret)
    .update(text)
    .digest("hex")

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
  }

  const event = JSON.parse(text)

  // Handle payment captured
  if (event.event === "payment.captured") {
    const razorpayOrderId = event.payload.payment.entity.order_id
    const razorpayPaymentId = event.payload.payment.entity.id
    await db.update(orders)
      .set({ status: "paid", razorpayPaymentId })
      .where(eq(orders.razorpayOrderId, razorpayOrderId))
  }

  // Handle payment failed
  if (event.event === "payment.failed") {
    const razorpayOrderId = event.payload.payment.entity.order_id
    await db.update(orders)
      .set({ status: "cancelled" })
      .where(eq(orders.razorpayOrderId, razorpayOrderId))
  }

  return NextResponse.json({ received: true })
}