"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { getCart } from "@/lib/cart"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { data: session } = useSession()

  useEffect(() => {
    function updateCount() {
      const items = getCart()
      const total = items.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(total)
    }

    updateCount()
    window.addEventListener("cart-updated", updateCount)
    return () => window.removeEventListener("cart-updated", updateCount)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary-dark">
          budgetpay<span className="text-primary">.store</span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <Link href="/products" className="text-sm font-medium text-muted hover:text-primary">
            Products
          </Link>

          {session ? (
            <>
              {session.user?.role === "admin" ? (
                <Link href="/admin" className="text-sm font-medium text-muted hover:text-primary">
                  Admin
                </Link>
              ) : (
                <Link href="/my-orders" className="text-sm font-medium text-muted hover:text-primary">
                  My Orders
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-muted hover:text-red-500 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-muted hover:text-primary">
              Login
            </Link>
          )}

          <Link href="/cart" className="relative mr-2 text-muted hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="sm:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 pb-4 sm:hidden space-y-1">
          <Link href="/products" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
            Products
          </Link>
          {session ? (
            <>
              {session.user?.role === "admin" ? (
                <Link href="/admin" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                  Admin Dashboard
                </Link>
              ) : (
                <Link href="/my-orders" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                  My Orders
                </Link>
              )}
              <button
                onClick={() => {
                  setOpen(false)
                  signOut({ callbackUrl: "/" })
                }}
                className="block w-full text-left py-2 text-sm font-medium text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
          <Link href="/cart" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
        </div>
      )}
    </nav>
  )
}
