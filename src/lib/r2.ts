import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Strip newlines/whitespace from keys pasted into Vercel
const endpoint = (process.env.R2_ENDPOINT || "").trim().replace(/\s+/g, "")
const accessKeyId = (process.env.R2_ACCESS_KEY_ID || "").trim().replace(/\s+/g, "")
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || "").trim().replace(/\s+/g, "")

const s3 = new S3Client({
  region: "auto",
  endpoint: endpoint || undefined,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

export const BUCKET = (process.env.R2_BUCKET_NAME || "").trim().replace(/\s+/g, "")
export const PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").trim().replace(/\s+/g, "")

export async function getUploadUrl(key: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(s3, cmd, { expiresIn: 3600 })
}

export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  })
  await s3.send(cmd)
  return `${PUBLIC_URL}/${key}`
}

export function publicUrl(key: string) {
  return `${PUBLIC_URL}/${key}`
}
