import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import { getFeaturedProducts } from "@/lib/products"

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl lg:text-6xl">
            Beautiful Furniture,{" "}
            <span className="text-primary">Refurbished</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Quality pre-loved furniture restored to its former glory. Sustainable choices that don&apos;t compromise on style — at prices that make sense.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Browse Products
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary-dark">Featured Pieces</h2>
          <Link href="/products" className="text-sm font-medium text-primary hover:text-primary-dark">
            View All &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 ? (
            <p className="col-span-full py-12 text-center text-muted">No featured products yet.</p>
          ) : (
            featured.map((p) => (
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
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-surface scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-semibold text-primary-dark">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Browse & Select", desc: "Explore our collection of handpicked, high-quality furniture pieces. Every item is unique and listed with high-res photos and video walkthroughs." },
              { step: "02", title: "Simple Payment & Cart", desc: "Add items to your cart and checkout using Razorpay. Pay securely using UPI, Cards, NetBanking, or Wallet." },
              { step: "03", title: "Final Polish & Delivery", desc: "Our craftspeople give the item a final hand-polish before shipping. It is then carefully packed and delivered straight to your room." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-white p-6 relative">
                <span className="absolute right-4 top-4 text-3xl font-extrabold text-primary/10">{item.step}</span>
                <h3 className="text-lg font-semibold text-primary-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-semibold text-primary-dark">Why budgetpay?</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { title: "Restored with Care", desc: "Every piece inspected, cleaned, and restored by hand. Good for your home, good for the planet." },
              { title: "Fair Prices", desc: "No middlemen. We buy smart, restore efficiently, and pass the savings to you." },
              { title: "Delivered Safely", desc: "Careful packing and reliable delivery so your furniture arrives looking its best." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="text-lg font-semibold text-primary-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}