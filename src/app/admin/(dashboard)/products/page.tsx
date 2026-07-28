import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function deleteProduct(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export default async function AdminProductsPage() {
  const all = await db.query.products.findMany({
    with: { images: true },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-dark">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {all.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="py-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-primary hover:text-primary-dark">
                    {p.name}
                  </Link>
                </td>
                <td className="py-3">₹{(p.pricePaise / 100).toLocaleString("en-IN")}</td>
                <td className="py-3 text-muted">{p.category}</td>
                <td className="py-3">{p.stock}</td>
                <td className="py-3">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-sm text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}