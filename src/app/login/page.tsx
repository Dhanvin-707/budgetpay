"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import FadeIn from "@/components/FadeIn"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session) {
      if (session.user?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/my-orders")
      }
    }
  }, [session, status, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const form = new FormData(e.currentTarget)

    try {
      const email = form.get("email") as string
      const password = form.get("password") as string

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password")
      } else {
        router.refresh()
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12">
      <FadeIn dir="up">
        <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Sign In</h1>
          <p className="text-xs text-muted mt-1">Access your customer orders or admin panel.</p>
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <div>
          <label className="block text-xs font-semibold text-muted">Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted">Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-[11px] text-muted leading-relaxed">
          Customer accounts are created automatically upon completing a checkout purchase.
        </p>
      </form>
      </FadeIn>
    </div>
  )
}
