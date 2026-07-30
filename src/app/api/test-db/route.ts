import { NextResponse } from "next/server"
import { db } from "@/db"
import { products } from "@/db/schema"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("Testing DB connection...")
    console.log("DB URL: ", process.env.TURSO_DATABASE_URL ? "Defined" : "Undefined")
    console.log("DB Token: ", process.env.TURSO_AUTH_TOKEN ? "Defined" : "Undefined")

    const all = await db.select().from(products)
    return NextResponse.json({
      success: true,
      urlExists: !!process.env.TURSO_DATABASE_URL,
      tokenExists: !!process.env.TURSO_AUTH_TOKEN,
      productsCount: all.length,
      products: all.map(p => ({ id: p.id, name: p.name, featured: p.featured }))
    })
  } catch (err: any) {
    const cause = err?.cause;
    return NextResponse.json({
      success: false,
      urlExists: !!process.env.TURSO_DATABASE_URL,
      tokenExists: !!process.env.TURSO_AUTH_TOKEN,
      errorName: err?.name,
      errorMessage: err?.message,
      causeMessage: cause?.message || String(cause),
      causeCode: cause?.code,
      causeName: cause?.name,
      errorStack: err?.stack
    }, { status: 500 })
  }
}
