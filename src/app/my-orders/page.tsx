import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"
import Link from "next/link"
import FadeIn from "@/components/FadeIn"

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    redirect("/login")
  }

  // Fetch paid or shipping orders matching this customer's email
  const customerOrders = await db.query.orders.findMany({
    where: and(
      eq(orders.customerEmail, session.user.email),
      eq(orders.status, "paid") // can also include shipped/delivered
    ),
    with: { items: true },
    orderBy: [desc(orders.createdAt)],
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <FadeIn dir="up">
        <h1 className="text-3xl font-bold text-primary-dark">My Orders</h1>
        <p className="mt-1 text-sm text-muted">
          Logged in as <span className="font-semibold text-accent">{session.user.email}</span>
        </p>
      </FadeIn>

      <div className="mt-8 space-y-6">
        {customerOrders.length === 0 ? (
          <FadeIn dir="up" delay={150}>
            <div className="rounded-xl border border-border bg-white p-12 text-center">
              <p className="text-muted font-medium">You haven&apos;t placed any orders yet.</p>
              <Link href="/products" className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:scale-105 active:scale-95">
                Start Shopping
              </Link>
            </div>
          </FadeIn>
        ) : (
          customerOrders.map((order, i) => (
            <FadeIn key={order.id} dir="up" delay={i * 100}>
              <div className="rounded-xl border border-border bg-white overflow-hidden transition-all hover:shadow-md">
                <div className="border-b border-border bg-surface px-6 py-4 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex gap-6 text-xs text-muted">
                    <div>
                      <p className="uppercase font-semibold tracking-wider">Date Placed</p>
                      <p className="mt-0.5 font-medium text-foreground">{order.createdAt}</p>
                    </div>
                    <div>
                      <p className="uppercase font-semibold tracking-wider">Total Amount</p>
                      <p className="mt-0.5 font-bold text-foreground">₹{(order.amountPaise / 100).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  <div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 uppercase tracking-wide">
                      {order.status === "paid" ? "Confirmed" : order.status}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-6 divide-y divide-border">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-primary-dark">{item.productName}</h4>
                        <p className="text-xs text-muted mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-foreground">₹{(item.pricePaise / 100).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))
        )}
      </div>
    </div>
  )
}
