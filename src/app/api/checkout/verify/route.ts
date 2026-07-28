import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { eq } from "drizzle-orm"
import { sendOrderConfirmation } from "@/lib/email"

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex")

  if (generated !== razorpay_signature) {
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
  }

  await db.update(orders)
    .set({ status: "paid", razorpayPaymentId: razorpay_payment_id })
    .where(eq(orders.razorpayOrderId, razorpay_order_id))

  // Send confirmation email (non-blocking)
  const order = await db.query.orders.findFirst({
    where: eq(orders.razorpayOrderId, razorpay_order_id),
  })
  if (order?.customerEmail) {
    sendOrderConfirmation({
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      amountPaise: order.amountPaise,
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, orderId: razorpay_order_id })
}