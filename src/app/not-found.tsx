import Link from "next/link"
import FadeIn from "@/components/FadeIn"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <FadeIn dir="none">
        <h1 className="text-6xl font-bold text-primary/30 animate-bounce-in">404</h1>
      </FadeIn>
      <FadeIn dir="up" delay={200}>
        <h2 className="mt-4 text-2xl font-semibold text-primary-dark">Page not found</h2>
      </FadeIn>
      <FadeIn dir="up" delay={350}>
        <p className="mt-2 text-muted">This page doesn&apos;t exist or has been moved.</p>
      </FadeIn>
      <FadeIn dir="up" delay={500}>
        <Link href="/" className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary-dark hover:scale-105 active:scale-95">
          Go Home
        </Link>
      </FadeIn>
    </div>
  )
}