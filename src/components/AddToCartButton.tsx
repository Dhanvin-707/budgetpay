"use client"

import { useState, useCallback } from "react"
import { addToCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"

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
    <Button
      onClick={handleAdd}
      variant={added ? "default" : "outline"}
      className={`w-full sm:w-auto ${
        added
          ? "border-green-600 bg-green-50 text-green-700 hover:bg-green-50 cursor-default scale-105 active:scale-105 shadow-none"
          : ""
      }`}
    >
      {added ? "Added to Cart! ✔" : "Add to Cart"}
    </Button>
  )
}
