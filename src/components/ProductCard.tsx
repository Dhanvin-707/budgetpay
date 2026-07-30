import Link from "next/link"

type Product = {
  id: string
  slug: string
  name: string
  price: number
  category: string
  image: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl border border-border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-muted text-sm">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full rounded-lg object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="opacity-50">Photo coming soon</span>
        )}
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-accent">{product.category}</p>
      <h3 className="mt-1 font-semibold text-primary-dark transition-colors group-hover:text-primary">{product.name}</h3>
      <p className="mt-1 text-lg font-bold text-foreground">₹{(product.price / 100).toLocaleString("en-IN")}</p>
    </Link>
  )
}