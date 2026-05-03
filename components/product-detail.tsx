"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products"

export function ProductDetail({ product }: { product: Product }) {
  const { add, increment, decrement, getQuantity } = useCart()
  const qty = getQuantity(product.id)
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="grid gap-6 rounded-md border border-border bg-card p-4 md:grid-cols-2 md:p-6">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted/30">
          {discount > 0 && (
            <span className="absolute top-3 left-3 z-10 rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
              {discount}% OFF
            </span>
          )}
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              {product.rating.toFixed(1)}
              <Star className="h-3 w-3 fill-current" />
            </span>
            <span className="text-xs text-muted-foreground">
              ({product.ratingCount.toLocaleString("en-IN")} ratings)
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-foreground">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">MRP ₹{product.mrp}</span>
                <span className="text-sm font-semibold text-accent">You save ₹{product.mrp - product.price}</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">(Inclusive of all taxes)</p>

          <div className="mt-4 inline-flex w-fit items-center rounded border border-border px-3 py-1.5 text-xs font-medium">
            Pack: {product.weight}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Delivery by <span className="font-semibold">{product.deliveryTime}</span>
          </div>

          {/* Cart actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {qty === 0 ? (
              <button
                type="button"
                onClick={() => add(product)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Basket
              </button>
            ) : (
              <div className="inline-flex items-center overflow-hidden rounded-md border-2 border-primary bg-primary text-primary-foreground">
                <button
                  type="button"
                  onClick={() => decrement(product.id)}
                  className="px-4 py-2.5 hover:bg-primary/80"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() => increment(product.id)}
                  className="px-4 py-2.5 hover:bg-primary/80"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-md border-2 border-primary bg-card px-6 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Go to Basket
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 rounded-md bg-muted/40 p-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-xs">
              <Truck className="h-4 w-4 text-primary" />
              Free delivery on orders above ₹499
            </div>
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-primary" />
              100% quality guarantee
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mt-6 rounded-md border border-border bg-card p-4 md:p-6">
        <h2 className="text-lg font-bold">About this product</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">Brand</dt>
            <dd className="mt-0.5 font-semibold">{product.brand}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Category</dt>
            <dd className="mt-0.5 font-semibold">{product.category}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pack</dt>
            <dd className="mt-0.5 font-semibold">{product.weight}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Country of Origin</dt>
            <dd className="mt-0.5 font-semibold">India</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
