export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-border" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-white p-4">
            <div className="mb-3 aspect-[4/3] w-full animate-pulse rounded-lg bg-border" />
            <div className="mb-2 h-3 w-16 animate-pulse rounded bg-border" />
            <div className="mb-1 h-5 w-3/4 animate-pulse rounded bg-border" />
            <div className="h-6 w-24 animate-pulse rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  )
}