import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  return (
    <div>
      <nav className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-semibold text-primary-dark">Dashboard</Link>
          <Link href="/admin/products" className="text-sm text-muted hover:text-primary">Products</Link>
          <Link href="/admin/orders" className="text-sm text-muted hover:text-primary">Orders</Link>
          <Link href="/" className="text-sm text-muted hover:text-primary">View Site &rarr;</Link>
        </div>
        <a href="/api/auth/signout" className="text-sm text-muted hover:text-red-500">Logout</a>
      </nav>
      {children}
    </div>
  )
}