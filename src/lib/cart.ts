export type CartItem = {
  id: string
  slug: string
  name: string
  price: number // in paise
  image?: string
  quantity: number
}

const CART_KEY = "budgetpay_cart"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(CART_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"))
  } catch (e) {
    console.error("Failed to save cart", e)
  }
}

export function addToCart(product: { id: string; slug: string; name: string; pricePaise: number; image?: string }, quantity = 1): void {
  const cart = getCart()
  const existing = cart.find((item) => item.slug === product.slug)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.pricePaise,
      image: product.image,
      quantity,
    })
  }
  saveCart(cart)
}

export function removeFromCart(slug: string): void {
  const cart = getCart()
  const filtered = cart.filter((item) => item.slug !== slug)
  saveCart(filtered)
}

export function updateCartQuantity(slug: string, quantity: number): void {
  const cart = getCart()
  const item = cart.find((i) => i.slug === slug)
  if (item) {
    item.quantity = Math.max(1, quantity)
    saveCart(cart)
  }
}

export function clearCart(): void {
  saveCart([])
}
