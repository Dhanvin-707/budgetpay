"use client"

import { useState } from "react"
import ImageUploader from "./ImageUploader"

export default function ClientImageInput() {
  const [url, setUrl] = useState("")

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Add Image</label>
        <ImageUploader onUpload={(newUrl) => setUrl(newUrl)} />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted">Or Add Image URL manually</label>
        <input
          name="imageUrl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://pub-xxxx.r2.dev/products/abc.jpg"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  )
}
