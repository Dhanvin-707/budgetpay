/** Extract YouTube video ID from a URL or bare ID string. Returns null if invalid. */
export function extractYoutubeId(input: string): string | null {
  const s = input.trim()
  if (!s) return null

  // Bare 11-char ID (most YouTube IDs are exactly 11 chars, alphanumeric + - + _)
  if (/^[\w-]{11}$/.test(s)) return s

  // URL patterns: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  try {
    const url = new URL(s)
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1).split("/")[0] || null
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v")
      if (v) return v
      const match = url.pathname.match(/\/(embed|shorts|v)\/([\w-]+)/)
      if (match) return match[2]
    }
  } catch {
    // not a URL — might be a longer/shorter ID, accept if alphanumeric
    if (/^[\w-]+$/.test(s)) return s
  }

  return null
}
