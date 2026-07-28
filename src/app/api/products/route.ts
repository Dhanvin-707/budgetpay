import { NextResponse } from "next/server"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")

  if (slug) {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: { images: true, videos: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  }

  const all = await db.query.products.findMany({
    where: eq(products.published, true),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  })
  return NextResponse.json(all)
}