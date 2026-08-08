"use client"

import Link from "next/link"
import FadeIn from "@/components/FadeIn"
import BlurText from "@/components/react-bits/BlurText"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background border-b border-border">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:py-32 text-center relative z-10 flex flex-col items-center">
        {/* Animated Badge */}
        <FadeIn dir="down" delay={100}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-dark mb-8 shadow-sm scale-110">
            100% Satisfaction Guaranteed
          </span>
        </FadeIn>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl flex flex-col items-center gap-2 select-none">
          <BlurText
            text="Affordable Furniture,"
            delay={80}
            animateBy="words"
            direction="top"
            className="justify-center text-center text-primary-dark [font-family:var(--font-museo)] leading-tight"
          />
          <BlurText
            text="Beautifully Done."
            delay={80}
            animateBy="words"
            direction="bottom"
            className="justify-center text-center text-accent [font-family:var(--font-museo)] leading-tight"
          />
        </h1>

        {/* Subtitle */}
        <FadeIn dir="up" delay={500} className="w-full">
          <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl text-muted leading-relaxed">
            Quality design without the premium markup. Curated pieces at honest, budget-friendly prices.
          </p>
        </FadeIn>

        {/* Action buttons */}
        <FadeIn dir="up" delay={700} className="w-full">
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Browse Products
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-lg border border-border bg-white/80 backdrop-blur px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-surface hover:scale-105 active:scale-95"
            >
              How It Works
            </Link>
          </div>
        </FadeIn>

        {/* Support items */}
        <FadeIn dir="up" delay={900} className="w-full">
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Final polish before shipping
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Delivered right to your home
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Secure payments via Razorpay
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}