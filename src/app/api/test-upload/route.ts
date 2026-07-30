import { NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("Testing R2 Upload...")
    const testBuffer = Buffer.from("Hello Cloudflare R2! " + new Date().toISOString())
    const key = `test/test-${Date.now()}.txt`

    const url = await uploadToR2(key, testBuffer, "text/plain")

    return NextResponse.json({
      success: true,
      url,
      keys: {
        hasEndpoint: !!process.env.R2_ENDPOINT,
        hasKeyId: !!process.env.R2_ACCESS_KEY_ID,
        hasSecret: !!process.env.R2_SECRET_ACCESS_KEY,
        hasBucket: !!process.env.R2_BUCKET_NAME,
        hasPublicUrl: !!process.env.R2_PUBLIC_URL,
      }
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      errorName: err?.name,
      errorMessage: err?.message,
      errorStack: err?.stack,
      keys: {
        hasEndpoint: !!process.env.R2_ENDPOINT,
        hasKeyId: !!process.env.R2_ACCESS_KEY_ID,
        hasSecret: !!process.env.R2_SECRET_ACCESS_KEY,
        hasBucket: !!process.env.R2_BUCKET_NAME,
        hasPublicUrl: !!process.env.R2_PUBLIC_URL,
      }
    }, { status: 500 })
  }
}
