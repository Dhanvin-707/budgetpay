import type { Metadata } from "next"
import { Geist, Geist_Mono, MuseoModerno } from "next/font/google"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Logo from "@/components/Logo"
import Script from "next/script"
import AuthProvider from "@/components/AuthProvider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const museo = MuseoModerno({
  variable: "--font-museo",
  subsets: ["latin"],
  weight: ["500", "700"],
})

export const metadata: Metadata = {
  title: "budgetpay.store — Affordable Furniture",
  description: "Quality furniture without the premium markup. Affordable styles, budget-friendly prices.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${museo.variable} ${geistSans.variable} h-full antialiased`}>
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
        <footer className="border-t border-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted">
            <p className="flex items-center justify-center gap-2">
              <Logo className="h-7 w-auto" />
              <span className="font-semibold text-primary-dark [font-family:var(--font-museo)]">budgetPay</span>
            </p>
            <p className="mt-1">Affordable furniture. Honest prices.</p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs">
              <Link href="/privacy" className="text-muted hover:text-primary-dark transition-colors">Privacy Policy</Link>
              <span className="text-border">|</span>
              <Link href="/terms" className="text-muted hover:text-primary-dark transition-colors">Terms &amp; Conditions</Link>
            </div>
            <p className="mt-3">&copy; {new Date().getFullYear()} budgetpay.store</p>
          </div>
        </footer>
      </body>
    </html>
  )
}