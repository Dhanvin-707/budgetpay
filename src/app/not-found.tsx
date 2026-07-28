import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary/30">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-primary-dark">Page not found</h2>
      <p className="mt-2 text-muted">This page doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
        Go Home
      </Link>
    </div>
  )
}