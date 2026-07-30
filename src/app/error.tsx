"use client"

import FadeIn from "@/components/FadeIn"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <FadeIn dir="up">
        <h1 className="text-4xl font-bold text-primary-dark">Something went wrong</h1>
      </FadeIn>
      <FadeIn dir="up" delay={150}>
        <p className="mt-2 text-muted">{error.message || "An unexpected error occurred."}</p>
      </FadeIn>
      <FadeIn dir="up" delay={300}>
        <button onClick={reset} className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary-dark hover:scale-105 active:scale-95 cursor-pointer">
          Try Again
        </button>
      </FadeIn>
    </div>
  )
}