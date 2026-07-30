"use client"

import { useState } from "react"
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

  function handleAdd() {
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full rounded-lg border-2 border-primary bg-transparent px-6 py-3 text-sm font-medium text-primary transition-all active:scale-95 sm:w-auto hover:bg-primary/5 ${
        added ? "bg-green-50 border-green-600 text-green-700 hover:bg-green-50 cursor-default" : ""
      }`}
    >
      {added ? "Added to Cart! ✔" : "Add to Cart"}
    </button>
  )
}
