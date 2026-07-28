import { NextResponse } from "next/server"
import { getUploadUrl, BUCKET } from "@/lib/r2"

export async function POST(req: Request) {
  const { key, contentType } = await req.json()
  if (!key || !contentType) {
    return NextResponse.json({ error: "Missing key or contentType" }, { status: 400 })
  }

  try {
    const url = await getUploadUrl(key, contentType)
    return NextResponse.json({ url, key, bucket: BUCKET })
  } catch {
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 })
  }
}