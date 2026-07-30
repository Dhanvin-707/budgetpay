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

      const formData = new FormData()
      formData.append("file", file)
      formData.append("key", key)

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      const { url: publicUrl } = await res.json()
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