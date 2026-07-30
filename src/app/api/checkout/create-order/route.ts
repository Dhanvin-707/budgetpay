import { NextResponse } from "next/server"
import { getRazorpay } from "@/lib/razorpay"
import { db } from "@/db"
import { products, orders, orderItems } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const { productSlug, cartItems, customerName, customerEmail, customerPhone, address, latitude, longitude } = await req.json()

    let totalAmount = 0
    let itemsToInsert: { productId: string; productName: string; quantity: number; pricePaise: number }[] = []
    let descriptionLine = ""

    // Case 1: Multiple items from cart
    if (cartItems && cartItems.length > 0) {
      const productSlugs = cartItems.map((item: any) => item.slug)
      const dbProducts = await db.query.products.findMany({
        where: inArray(products.slug, productSlugs),
      })

      const productMap = new Map(dbProducts.map((p) => [p.slug, p]))

      for (const item of cartItems) {
        const dbProduct = productMap.get(item.slug)
        if (!dbProduct) {
          return NextResponse.json({ error: `Product not found: ${item.slug}` }, { status: 404 })
        }
        const qty = Number(item.quantity) || 1
        const price = dbProduct.pricePaise
        totalAmount += price * qty
        itemsToInsert.push({
          productId: dbProduct.id,
          productName: dbProduct.name,
          quantity: qty,
          pricePaise: price,
        })
      }
      descriptionLine = cartItems.map((item: any) => `${item.name} x${item.quantity}`).join(", ").slice(0, 255)
    }
    // Case 2: Single product checkout
    else if (productSlug) {
      const product = await db.query.products.findFirst({
        where: eq(products.slug, productSlug),
      })
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })

      totalAmount = product.pricePaise
      itemsToInsert.push({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        pricePaise: product.pricePaise,
      })
      descriptionLine = product.name
    } else {
      return NextResponse.json({ error: "No product provided" }, { status: 400 })
    }

    const receipt = `rcpt_${nanoid(8)}`

    const rzpOrder = await getRazorpay().orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt,
      notes: {
        description: descriptionLine.slice(0, 100),
      },
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
      amountPaise: totalAmount,
      status: "pending",
    })

    for (const item of itemsToInsert) {
      await db.insert(orderItems).values({
        id: nanoid(),
        orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        pricePaise: item.pricePaise,
      })
    }

    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
    })
  } catch (err: any) {
    console.error("create-order error:", err)
    const errMsg = err?.message || String(err)
    const errCause = err?.cause?.message || err?.cause || ""
    const fullMsg = errCause ? `${errMsg}\n\nCause: ${errCause}` : errMsg
    return NextResponse.json({ error: fullMsg }, { status: 500 })
  }
}
