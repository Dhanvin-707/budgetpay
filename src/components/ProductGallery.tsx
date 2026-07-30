"use client"

import { useState } from "react"

type ImageType = {
  id: string
  url: string
  alt?: string | null
  sortOrder?: number | null
}

type VideoType = {
  id: string
  youtubeId: string
  title?: string | null
  sortOrder?: number | null
}

type Props = {
  images: ImageType[]
  videos: VideoType[]
  productName: string
}

type MediaItem =
  | { type: "image"; id: string; url: string; alt: string }
  | { type: "video"; id: string; youtubeId: string; title: string }

export default function ProductGallery({ images, videos, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Construct media list with first image, first video, then other images, then other videos
  const mediaItems: MediaItem[] = []

  if (images && images.length > 0) {
    mediaItems.push({
      type: "image",
      id: images[0].id,
      url: images[0].url,
      alt: images[0].alt || productName,
    })
  }

  if (videos && videos.length > 0) {
    mediaItems.push({
      type: "video",
      id: videos[0].id,
      youtubeId: videos[0].youtubeId,
      title: videos[0].title || `${productName} Video`,
    })
  }

  if (images && images.length > 1) {
    for (let i = 1; i < images.length; i++) {
      mediaItems.push({
        type: "image",
        id: images[i].id,
        url: images[i].url,
        alt: images[i].alt || productName,
      })
    }
  }

  if (videos && videos.length > 1) {
    for (let i = 1; i < videos.length; i++) {
      mediaItems.push({
        type: "video",
        id: videos[i].id,
        youtubeId: videos[i].youtubeId,
        title: videos[i].title || `${productName} Video ${i + 1}`,
      })
    }
  }

  if (mediaItems.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-muted">
        <span className="opacity-50">Photo coming soon</span>
      </div>
    )
  }

  const activeMedia = mediaItems[activeIndex] || mediaItems[0]

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black flex items-center justify-center relative">
        {activeMedia.type === "image" ? (
          <img
            src={activeMedia.url}
            alt={activeMedia.alt}
            className="h-full w-full object-contain"
          />
        ) : (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${activeMedia.youtubeId}?autoplay=1`}
            title={activeMedia.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Thumbnails Bar */}
      {mediaItems.length > 1 && (
        <div className="flex flex-wrap gap-2 overflow-x-auto py-1">
          {mediaItems.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-video w-20 overflow-hidden rounded-lg border-2 bg-muted transition-all cursor-pointer ${
                  isActive ? "border-primary scale-95" : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                {item.type === "image" ? (
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="relative h-full w-full">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 text-white drop-shadow"
                      >
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
