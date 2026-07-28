import Link from "next/link"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function updateStatus(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  const status = formData.get("status") as string
  await db.update(orders).set({ status }).where(eq(orders.id, id))
  revalidatePath("/admin/orders")
  redirect("/admin/orders")
}

export default async function AdminOrdersPage() {
  const all = await db.query.orders.findMany({
    with: { items: true },
    orderBy: [desc(orders.createdAt)],
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary-dark">Orders</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {all.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-muted">No orders yet.</td></tr>
            ) : (
              all.map((o) => (
                <tr key={o.id} className="border-b border-border">
                  <td className="py-3">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-muted">{o.customerEmail}</p>
                  </td>
                  <td className="py-3">₹{(o.amountPaise / 100).toLocaleString("en-IN")}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      o.status === "paid" ? "bg-green-100 text-green-700" :
                      o.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      o.status === "delivered" ? "bg-green-100 text-green-700" :
                      o.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted">{o.createdAt}</td>
                  <td className="py-3">
                    <form action={updateStatus}>
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status || "pending"} onChange={e => e.target.form?.requestSubmit()} className="rounded border border-border bg-surface px-2 py-1 text-xs">
                        <option value="pending">pending</option>
                        <option value="paid">paid</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}