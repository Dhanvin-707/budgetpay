"use client"

import { useState } from "react"
import { setPasswordAction } from "@/app/order/confirmation/actions"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

type Props = {
  email: string
  orderId: string
}

export default function SetPasswordForm({ email, orderId }: Props) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setError("")
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("orderId", orderId)

      await setPasswordAction(formData)
      setSuccess(true)

      // Auto login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!result?.error) {
        setTimeout(() => {
          router.push("/products")
          router.refresh()
        }, 1500)
      } else {
        setError("Account created, but autologin failed. Please login manually.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to set password.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center text-green-800">
        <p className="font-semibold text-lg flex items-center justify-center gap-1.5">
          <span>✔</span> Account Created!
        </p>
        <p className="text-sm mt-1 text-green-700">Logging you in and redirecting...</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-primary-dark">Create Your Account</h3>
      <p className="text-xs text-muted mt-1 leading-relaxed">
        Set a password for <span className="font-semibold text-accent">{email}</span> to track your order, view order history, and speed up future checkouts.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {error && <p className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <div>
          <label className="block text-xs font-semibold text-muted">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted">Confirm Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? "Saving..." : "Create Account & Log In"}
        </button>
      </form>
    </div>
  )
}
