import { db } from "@/db"
import { products, productImages, productVideos } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { nanoid } from "nanoid"
import Link from "next/link"
import { notFound } from "next/navigation"
import { extractYoutubeId } from "@/lib/youtube"
import ClientImageInput from "@/components/ClientImageInput"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { images: true, videos: true },
  })
  if (!product) notFound()

  async function updateProduct(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const pricePaise = Number(formData.get("pricePaise"))
    const originalPricePaise = Number(formData.get("originalPricePaise")) || null
    const category = formData.get("category") as string
    const condition = formData.get("condition") as string
    const stock = Number(formData.get("stock"))
    const featured = formData.get("featured") === "on"
    const refurbished = formData.get("refurbished") === "on"
    const imageUrl = formData.get("imageUrl") as string
    const youtubeId = formData.get("youtubeId") as string

    await db.update(products).set({
      name, slug, description, pricePaise, originalPricePaise,
      category, condition, stock, featured, refurbished, updatedAt: "datetime('now')",
    }).where(eq(products.id, id))

    if (imageUrl) {
      await db.insert(productImages).values({ id: nanoid(), productId: id, url: imageUrl, sortOrder: 99 })
    }
    const videoId = youtubeId ? extractYoutubeId(youtubeId) : null
    if (videoId) {
      await db.delete(productVideos).where(eq(productVideos.productId, id))
      await db.insert(productVideos).values({ id: nanoid(), productId: id, youtubeId: videoId, sortOrder: 0 })
    }

    revalidatePath("/admin/products")
    redirect("/admin/products")
  }

  async function deleteImage(formData: FormData) {
    "use server"
    const imgId = formData.get("imageId") as string
    await db.delete(productImages).where(eq(productImages.id, imgId))
    revalidatePath(`/admin/products/${id}/edit`)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin/products" className="text-sm text-muted hover:text-primary">&larr; Back</Link>
      <h1 className="mt-4 text-3xl font-bold text-primary-dark">Edit: {product.name}</h1>

      {/* Existing images */}
      {product.images.length > 0 && (
        <div className="mt-6 border-b border-border pb-6">
          <label className="block text-sm font-medium">Current Images</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.images.map((img) => (
              <div key={img.id} className="relative">
                <img src={img.url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <form action={deleteImage}>
                  <input type="hidden" name="imageId" value={img.id} />
                  <button type="submit" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    &times;
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      <form action={updateProduct} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" defaultValue={product.name} required className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium">Slug</label>
            <input name="slug" defaultValue={product.slug} required className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" defaultValue={product.description || ""} rows={4} className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Price (paise)</label>
            <input name="pricePaise" type="number" defaultValue={product.pricePaise} required className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium">Original Price</label>
            <input name="originalPricePaise" type="number" defaultValue={product.originalPricePaise || ""} className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select name="category" defaultValue={product.category || ""} className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm">
              <option value="">Select</option>
              <option>Chairs</option><option>Tables</option><option>Shelving</option>
              <option>Desks</option><option>Cabinets</option><option>Bedroom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Condition</label>
            <select name="condition" defaultValue={product.condition || ""} className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm">
              <option value="">Select</option>
              <option>excellent</option><option>good</option><option>fair</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input name="stock" type="number" defaultValue={product.stock ?? 1} className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input name="featured" type="checkbox" id="featured" defaultChecked={!!product.featured} className="rounded border-border" />
          <label htmlFor="featured" className="text-sm font-medium">Featured</label>
        </div>

        <div className="flex items-center gap-2">
          <input name="refurbished" type="checkbox" id="refurbished" defaultChecked={!!product.refurbished} className="rounded border-border" />
          <label htmlFor="refurbished" className="text-sm font-medium">Refurbished</label>
        </div>

        <ClientImageInput />

        <div>
          <label className="block text-sm font-medium">YouTube Video ID</label>
          <input name="youtubeId" defaultValue={product.videos?.[0]?.youtubeId || ""} className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm" />
        </div>

        <button type="submit" className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
          Save Changes
        </button>
      </form>
    </div>
  )
}