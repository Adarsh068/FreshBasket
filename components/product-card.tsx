"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Clock, Plus, Star } from "lucide-react"
import type { Product } from "@/lib/products"
import { useCart } from "@/lib/cart-context"

export function ProductCard({ product }: { product: Product }) {
  const { getQuantity, add, increment, decrement } = useCart()
  const [mounted, setMounted] = useState(false)
  const [inStock, setInStock] = useState(true)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    fetch(`${API}/products/${product.slug}`)
      .then(r => r.json())
      .then(data => { if (data?.inStock === false) setInStock(false) })
      .catch(() => {})
  }, [product.slug])

  const qty = mounted ? getQuantity(product.id) : 0
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-md">
      {discount > 0 && (
        <span className="absolute top-2 left-2 z-10 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
          {discount}% OFF
        </span>
      )}

      {!inStock && (
        <span className="absolute top-2 right-2 z-10 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
          Out of Stock
        </span>
      )}

      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted/30" aria-label={product.name}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform group-hover:scale-105 ${!inStock ? "opacity-50" : ""}`}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{product.deliveryTime}</span>
        </div>

        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{product.brand}</p>

        <h3 className="min-h-[2.5rem] text-sm leading-snug">
          <Link href={`/product/${product.slug}`} className="line-clamp-2 text-foreground hover:text-primary">
            {product.name}
          </Link>
        </h3>

        <div className="rounded border border-border px-2 py-1 text-xs text-muted-foreground">{product.weight}</div>

        <div className="flex items-center gap-1">
          <span className="flex items-center gap-0.5 rounded bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
            {product.rating.toFixed(1)}
            <Star className="h-2.5 w-2.5 fill-current" />
          </span>
          <span className="text-[11px] text-muted-foreground">({product.ratingCount.toLocaleString("en-IN")})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-foreground">₹{product.price}</span>
            <span className="text-[11px] text-muted-foreground line-through">MRP ₹{product.mrp}</span>
          </div>

          {!inStock ? (
            <span className="rounded border-2 border-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
              Out of Stock
            </span>
          ) : qty === 0 ? (
            <button
              type="button"
              onClick={() => add(product)}
              className="flex items-center gap-1 rounded border-2 border-primary bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label={`Add ${product.name} to basket`}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          ) : (
            <div className="flex items-center overflow-hidden rounded border-2 border-primary bg-primary text-primary-foreground">
              <button type="button" onClick={() => decrement(product.id)}
                className="px-2 py-1 text-sm font-bold hover:bg-primary/80" aria-label="Decrease quantity">
                −
              </button>
              <span className="min-w-6 text-center text-xs font-bold">{qty}</span>
              <button type="button" onClick={() => increment(product.id)}
                className="px-2 py-1 text-sm font-bold hover:bg-primary/80" aria-label="Increase quantity">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}