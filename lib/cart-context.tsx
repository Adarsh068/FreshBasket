"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Product } from "@/lib/products"

export type CartItem = {
  product: Product
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  totalQuantity: number
  subtotal: number
  mrpTotal: number
  savings: number
  add: (product: Product) => void
  increment: (productId: string) => void
  decrement: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
  getQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "freshbasket:cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((s, it) => s + it.quantity, 0)
    const subtotal = items.reduce((s, it) => s + it.product.price * it.quantity, 0)
    const mrpTotal = items.reduce((s, it) => s + it.product.mrp * it.quantity, 0)

    return {
      items,
      totalQuantity,
      subtotal,
      mrpTotal,
      savings: mrpTotal - subtotal,
      getQuantity: (id) => items.find((it) => it.product.id === id)?.quantity ?? 0,
      add: (product) =>
        setItems((prev) => {
          const found = prev.find((it) => it.product.id === product.id)
          if (found) {
            return prev.map((it) =>
              it.product.id === product.id ? { ...it, quantity: it.quantity + 1 } : it,
            )
          }
          return [...prev, { product, quantity: 1 }]
        }),
      increment: (id) =>
        setItems((prev) =>
          prev.map((it) => (it.product.id === id ? { ...it, quantity: it.quantity + 1 } : it)),
        ),
      decrement: (id) =>
        setItems((prev) =>
          prev
            .map((it) => (it.product.id === id ? { ...it, quantity: it.quantity - 1 } : it))
            .filter((it) => it.quantity > 0),
        ),
      remove: (id) => setItems((prev) => prev.filter((it) => it.product.id !== id)),
      clear: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
