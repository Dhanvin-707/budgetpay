import { NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const key = formData.get("key") as string

    if (!file || !key) {
      return NextResponse.json({ error: "Missing file or key" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadToR2(key, buffer, file.type)

    return NextResponse.json({ url })
  } catch (err: any) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: err.message || "Failed to upload file to R2" }, { status: 500 })
  }
}
