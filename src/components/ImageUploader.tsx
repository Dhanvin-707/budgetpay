"use client"

import { useCallback, useState } from "react"

type Props = {
  onUpload: (url: string) => void
}

export default function ImageUploader({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split(".").pop()
      const key = `products/${crypto.randomUUID()}.${ext}`

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, contentType: file.type }),
      })
      const { url: uploadUrl } = await res.json()

      await fetch(uploadUrl, { method: "PUT", body: file })
      const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
      onUpload(publicUrl)
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  return (
    <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface p-6 text-sm text-muted hover:border-primary">
      {uploading ? "Uploading…" : "Click to upload image"}
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </label>
  )
}