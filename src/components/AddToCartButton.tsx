"use client"

import { useState, useCallback } from "react"
import { addToCart } from "@/lib/cart"

type Props = {
  product: {
    id: string
    slug: string
    name: string
    pricePaise: number
    image?: string
  }
}

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false)

  const handleAdd = useCallback(() => {
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }, [product])

  return (
    <button
      onClick={handleAdd}
      className={`w-full rounded-lg border-2 px-6 py-3 text-sm font-medium transition-all duration-300 active:scale-95 sm:w-auto ${
        added
          ? "border-green-600 bg-green-50 text-green-700 scale-105 cursor-default"
          : "border-primary bg-transparent text-primary hover:bg-primary/5 hover:scale-105"
      }`}
    >
      {added ? "Added to Cart! ✔" : "Add to Cart"}
    </button>
  )
}
