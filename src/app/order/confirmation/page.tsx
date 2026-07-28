import Link from "next/link"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  if (id) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.razorpayOrderId, id),
      with: { items: true },
    })
    if (!order) notFound()

    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mb-6 text-5xl">&#9989;</div>
        <h1 className="text-3xl font-bold text-primary-dark">Order Confirmed!</h1>
        <p className="mt-2 text-muted">Thanks, {order.customerName}.</p>
        <div className="mx-auto mt-8 max-w-sm rounded-xl border border-border bg-white p-6 text-left">
          <p className="text-sm text-muted">Amount paid</p>
          <p className="text-2xl font-bold">₹{(order.amountPaise / 100).toLocaleString("en-IN")}</p>
          {order.items?.map((item) => (
            <div key={item.id} className="mt-4 border-t border-border pt-4 text-sm">
              <p className="font-medium">{item.productName}</p>
              <p className="text-muted">Qty: {item.quantity}</p>
            </div>
          ))}
          <p className="mt-4 text-xs text-muted">We&apos;ll email you the shipping update.</p>
        </div>
        <Link href="/products" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mb-6 text-5xl">&#9989;</div>
      <h1 className="text-3xl font-bold text-primary-dark">Order Confirmed!</h1>
      <p className="mt-4 text-lg text-muted">Thank you for your purchase. We&apos;ll send you an email with the order details and delivery updates.</p>
      <Link href="/products" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
        Continue Shopping
      </Link>
    </div>
  )
}