import { NextResponse } from "next/server"
import { db } from "@/db"
import { products, productImages, productVideos } from "@/db/schema"
import { nanoid } from "nanoid"
import { eq } from "drizzle-orm"

export async function GET() {
  const all = await db.query.products.findMany({
    with: { images: true, videos: true },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  })
  return NextResponse.json(all)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, slug, description, pricePaise, originalPricePaise, category, condition, stock, featured, images, youtubeId } = body

  const id = nanoid()
  await db.insert(products).values({
    id,
    name,
    slug,
    description,
    pricePaise,
    originalPricePaise: originalPricePaise || null,
    category,
    condition,
    stock: stock ?? 1,
    featured: featured ?? false,
    published: true,
  })

  if (images?.length) {
    for (let i = 0; i < images.length; i++) {
      await db.insert(productImages).values({ id: nanoid(), productId: id, url: images[i], alt: name, sortOrder: i })
    }
  }

  if (youtubeId) {
    await db.insert(productVideos).values({ id: nanoid(), productId: id, youtubeId, sortOrder: 0 })
  }

  return NextResponse.json({ id })
}