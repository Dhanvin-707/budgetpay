import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug } from "@/lib/products"
import RazorpayButton from "@/components/RazorpayButton"

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
          {product.videos && product.videos.length > 0 ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${product.videos[0].youtubeId}`}
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-muted">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0].url} alt={product.name} className="h-full w-full rounded-xl object-cover" />
              ) : (
                <span className="opacity-50">Photo coming soon</span>
              )}
            </div>
          )}
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

          <div className="mt-8">
            <RazorpayButton
              productSlug={product.slug}
              productName={product.name}
              amountPaise={product.pricePaise}
            />
          </div>
        </div>
      </div>
    </div>
  )
}