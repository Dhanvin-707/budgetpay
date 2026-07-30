import { NextResponse } from "next/server"
import { getRazorpay } from "@/lib/razorpay"
import { db } from "@/db"
import { products, orders, orderItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const { productSlug, customerName, customerEmail, customerPhone, address, latitude, longitude } = await req.json()

    const product = await db.query.products.findFirst({
      where: eq(products.slug, productSlug),
    })
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    const amount = product.pricePaise
    const receipt = `rcpt_${nanoid(8)}`

    const rzpOrder = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: { productId: product.id },
    })

    const orderId = nanoid()
    await db.insert(orders).values({
      id: orderId,
      customerName: customerName || "Guest",
      customerEmail: customerEmail || "guest@example.com",
      customerPhone,
      address: address || "",
      latitude: latitude || null,
      longitude: longitude || null,
      razorpayOrderId: rzpOrder.id,
      amountPaise: amount,
      status: "pending",
    })

    await db.insert(orderItems).values({
      id: nanoid(),
      orderId,
      productId: product.id,
      productName: product.name,
      quantity: 1,
      pricePaise: amount,
    })

    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
    })
  } catch (err: any) {
    console.error("create-order error:", err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}