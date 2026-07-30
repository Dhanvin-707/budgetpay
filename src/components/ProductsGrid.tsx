"use client"

import { Children } from "react"
import FadeIn from "./FadeIn"

type Props = {
  children: React.ReactNode
  className?: string
  /** stagger delay between each child (ms) */
  stagger?: number
}

export default function ProductsGrid({ children, className, stagger = 75 }: Props) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => (
        <FadeIn key={i} dir="up" delay={i * stagger}>
          {child}
        </FadeIn>
      ))}
    </div>
  )
}
