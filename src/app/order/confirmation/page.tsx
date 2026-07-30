import Link from "next/link"
import { db } from "@/db"
import { orders, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import SetPasswordForm from "@/components/SetPasswordForm"
import FadeIn from "@/components/FadeIn"

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

    let showPasswordSetup = false
    if (order.customerEmail) {
      const user = await db.query.users.findFirst({
        where: eq(users.email, order.customerEmail),
      })
      if (user && !user.passwordHash) {
        showPasswordSetup = true
      }
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="text-center">
          <div className="mb-6 animate-bounce-in inline-block text-5xl">&#9989;</div>
          <FadeIn dir="up" delay={300}>
            <h1 className="text-3xl font-bold text-primary-dark">Order Confirmed!</h1>
          </FadeIn>
          <FadeIn dir="up" delay={450}>
            <p className="mt-2 text-muted">Thanks, {order.customerName}.</p>
          </FadeIn>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          <FadeIn dir="left" delay={600}>
            <div className="rounded-xl border border-border bg-white p-6 text-left h-fit">
              <p className="text-sm text-muted font-medium">Order Details</p>
              <p className="mt-4 text-xs text-muted">Amount paid</p>
              <p className="text-2xl font-bold">₹{(order.amountPaise / 100).toLocaleString("en-IN")}</p>
              {order.items?.map((item) => (
                <div key={item.id} className="mt-4 border-t border-border pt-4 text-sm">
                  <p className="font-medium text-primary-dark">{item.productName}</p>
                  <p className="text-muted">Qty: {item.quantity}</p>
                </div>
              ))}
              <p className="mt-4 text-xs text-muted">We&apos;ll email you the shipping update.</p>
            </div>
          </FadeIn>

          {showPasswordSetup && (
            <FadeIn dir="right" delay={750}>
              <SetPasswordForm email={order.customerEmail!} orderId={id} />
            </FadeIn>
          )}
        </div>

        <FadeIn dir="up" delay={900}>
          <div className="text-center mt-10">
            <Link href="/products" className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary-dark hover:scale-105 active:scale-95">
              Continue Shopping
            </Link>
          </div>
        </FadeIn>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mb-6 animate-bounce-in inline-block text-5xl">&#9989;</div>
      <FadeIn dir="up" delay={300}>
        <h1 className="text-3xl font-bold text-primary-dark">Order Confirmed!</h1>
      </FadeIn>
      <FadeIn dir="up" delay={450}>
        <p className="mt-4 text-lg text-muted">Thank you for your purchase. We&apos;ll send you an email with the order details and delivery updates.</p>
      </FadeIn>
      <FadeIn dir="up" delay={600}>
        <Link href="/products" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary-dark hover:scale-105 active:scale-95">
          Continue Shopping
        </Link>
      </FadeIn>
    </div>
  )
}