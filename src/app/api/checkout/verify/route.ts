import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/db"
import { orders, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { sendOrderConfirmation } from "@/lib/email"
import { nanoid } from "nanoid"

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

  const order = await db.query.orders.findFirst({
    where: eq(orders.razorpayOrderId, razorpay_order_id),
  })

  if (order && order.customerEmail) {
    // Create new customer account if it doesn't exist
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, order.customerEmail),
    })
    if (!existingUser) {
      await db.insert(users).values({
        id: nanoid(),
        email: order.customerEmail,
        name: order.customerName,
        passwordHash: null, // To be set on confirmation page
      })
    }
  }

  // Send confirmation email (non-blocking)
  if (order?.customerEmail) {
    sendOrderConfirmation({
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      amountPaise: order.amountPaise,
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, orderId: razorpay_order_id })
}