import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/components/AuthProvider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "budgetpay.store — Refurbished Furniture",
  description: "Quality refurbished furniture at budget-friendly prices. Sustainable, affordable, stylish.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
        <footer className="border-t border-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted">
            <p className="font-medium text-primary-dark">budgetpay.store</p>
            <p className="mt-1">Refurbished furniture. Sustainable living. Smart prices.</p>
            <p className="mt-4">&copy; {new Date().getFullYear()} budgetpay.store</p>
          </div>
        </footer>
      </body>
    </html>
  )
}