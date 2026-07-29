import { db } from "@/db"
import { products } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export async function getProducts() {
  try {
    return await db.query.products.findMany({
      where: eq(products.published, true),
      with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
      orderBy: [desc(products.createdAt)],
    })
  } catch (err) {
    console.error("error in getProducts:", err)
    return []
  }
}

export async function getFeaturedProducts() {
  try {
    return await db.query.products.findMany({
      where: (p, { and, eq }) => and(eq(p.featured, true), eq(p.published, true)),
      with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
      orderBy: [desc(products.createdAt)],
    })
  } catch (err) {
    console.error("error in getFeaturedProducts:", err)
    return []
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] },
        videos: { orderBy: (v, { asc }) => [asc(v.sortOrder)] },
      },
    })
  } catch {
    return null
  }
}