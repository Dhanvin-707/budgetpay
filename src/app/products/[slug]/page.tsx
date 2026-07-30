import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug } from "@/lib/products"
import RazorpayButton from "@/components/RazorpayButton"
import ProductGallery from "@/components/ProductGallery"
import AddToCartButton from "@/components/AddToCartButton"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product Not Found" }
  return {
    title: `${product.name} — budgetpay.store`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/products" className="text-sm text-muted hover:text-primary">&larr; Back to Products</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <ProductGallery
            images={product.images || []}
            videos={product.videos || []}
            productName={product.name}
          />
        </div>

        {/* Details */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent">
            {product.category}
            {product.condition && <span className="ml-2 text-muted">· {product.condition}</span>}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-primary-dark">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ₹{(product.pricePaise / 100).toLocaleString("en-IN")}
            </span>
            {product.originalPricePaise && (
              <span className="text-lg text-muted line-through">
                ₹{(product.originalPricePaise / 100).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                pricePaise: product.pricePaise,
                image: product.images?.[0]?.url,
              }}
            />
            <div className="flex-1">
              <RazorpayButton
                productSlug={product.slug}
                productName={product.name}
                amountPaise={product.pricePaise}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}