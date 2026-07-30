"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUploader from "./ImageUploader"

export default function AdminProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const body = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      pricePaise: Number(form.get("pricePaise")),
      originalPricePaise: Number(form.get("originalPricePaise")) || null,
      category: form.get("category"),
      condition: form.get("condition"),
      stock: Number(form.get("stock")),
      featured: form.get("featured") === "on",
      images,
      youtubeId: form.get("youtubeId"),
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        router.push("/admin/products")
        router.refresh()
      } else {
        alert("Failed to save product")
      }
    } catch {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Name</label>
          <input name="name" required className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Slug (URL)</label>
          <input name="slug" required className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea name="description" rows={4} className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Price (in paise, ₹500 = 50000)</label>
          <input name="pricePaise" type="number" required className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Original Price (optional)</label>
          <input name="originalPricePaise" type="number" className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-foreground">Category</label>
          <select name="category" className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="">Select</option>
            <option>Chairs</option>
            <option>Tables</option>
            <option>Shelving</option>
            <option>Desks</option>
            <option>Cabinets</option>
            <option>Bedroom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Condition</label>
          <select name="condition" className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="">Select</option>
            <option>excellent</option>
            <option>good</option>
            <option>fair</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Stock</label>
          <input name="stock" type="number" defaultValue={1} className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input name="featured" type="checkbox" id="featured" className="rounded border-border" />
        <label htmlFor="featured" className="text-sm font-medium">Featured product</label>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-foreground">Product Images</label>
        <div className="mt-2 space-y-2">
          <ImageUploader onUpload={(url) => setImages((prev) => [...prev, url])} />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video */}
      <div>
        <label className="block text-sm font-medium text-foreground">YouTube Video ID</label>
        <input name="youtubeId" placeholder="e.g. dQw4w9WgXcQ or full YouTube URL" className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        <p className="mt-1 text-xs text-muted">Paste a YouTube video ID or full URL.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save Product"}
      </button>
    </form>
  )
}