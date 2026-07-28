"use client"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-primary-dark">Something went wrong</h1>
      <p className="mt-2 text-muted">{error.message || "An unexpected error occurred."}</p>
      <button onClick={reset} className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
        Try Again
      </button>
    </div>
  )
}