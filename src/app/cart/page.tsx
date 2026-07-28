import Link from "next/link"

export default function CartPage() {
  // ponytail: localStorage cart — no DB persistence needed for v1
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-primary-dark">Cart</h1>
      <p className="mt-4 text-muted">Cart uses localStorage — add items from product pages and checkout.</p>
      <Link href="/products" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
        Browse Products
      </Link>
    </div>
  )
}