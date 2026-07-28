"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })
    if (res?.error) {
      setError("Invalid credentials")
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm items-center px-4">
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <h1 className="text-2xl font-bold text-primary-dark">Admin Login</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        <button type="submit" className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark">
          Sign In
        </button>
      </form>
    </div>
  )
}