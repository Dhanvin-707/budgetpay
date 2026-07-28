"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary-dark">
          budgetpay<span className="text-primary">.store</span>
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          <Link href="/products" className="text-sm font-medium text-muted hover:text-primary">
            Products
          </Link>
          <Link href="/cart" className="relative text-muted hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="sm:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 pb-4 sm:hidden">
          <Link href="/products" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
            Products
          </Link>
          <Link href="/cart" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
            Cart
          </Link>
        </div>
      )}
    </nav>
  )
}