import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary-dark">Admin Dashboard</h1>
      <p className="mt-2 text-muted">Manage your store.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/products" className="rounded-xl border border-border bg-white p-6 transition hover:shadow-md">
          <h2 className="text-lg font-semibold text-primary-dark">Products</h2>
          <p className="mt-1 text-sm text-muted">Add, edit, or remove products from your catalog.</p>
        </Link>
        <Link href="/admin/products/new" className="rounded-xl border border-border bg-white p-6 transition hover:shadow-md">
          <h2 className="text-lg font-semibold text-primary-dark">Add Product</h2>
          <p className="mt-1 text-sm text-muted">Upload a new product with images and video.</p>
        </Link>
        <Link href="/admin/orders" className="rounded-xl border border-border bg-white p-6 transition hover:shadow-md">
          <h2 className="text-lg font-semibold text-primary-dark">Orders</h2>
          <p className="mt-1 text-sm text-muted">View and manage customer orders.</p>
        </Link>
      </div>
    </div>
  )
}