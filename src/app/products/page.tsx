import Link from "next/link"
import type { Metadata } from "next"
import ProductCard from "@/components/ProductCard"
import { getProducts } from "@/lib/products"
import FadeIn from "@/components/FadeIn"
import ProductsGrid from "@/components/ProductsGrid"

export const metadata: Metadata = {
  title: "All Products — budgetpay.store",
  description: "Browse our full catalog of refurbished furniture. Chairs, tables, desks, shelving, and more — restored and ready for a new home.",
}

export default async function ProductsPage() {
  const products = await getProducts()

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <FadeIn dir="up">
        <h1 className="text-3xl font-bold text-primary-dark">All Products</h1>
        <p className="mt-2 text-muted">Refurbished furniture, ready for a new home.</p>
      </FadeIn>

      {categories.length > 0 && (
        <FadeIn dir="up" delay={150}>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium text-muted transition-all hover:border-primary hover:text-primary hover:scale-105"
              >
                {cat}
              </Link>
            ))}
          </div>
        </FadeIn>
      )}

      <ProductsGrid className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="col-span-full py-12 text-center text-muted">No products yet. Check back soon!</p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.pricePaise,
                category: p.category || "",
                image: p.images?.[0]?.url || "",
              }}
            />
          ))
        )}
      </ProductsGrid>
    </div>
  )
}