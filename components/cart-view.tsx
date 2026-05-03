"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartView() {
  const { items, increment, decrement, remove, subtotal, mrpTotal, savings, totalQuantity, clear } = useCart()

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-[1280px] px-4 py-16">
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Your basket is empty</h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Looks like you haven&apos;t added anything yet. Browse fresh fruits and vegetables to get started.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/fruits"
              className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Shop Fruits
            </Link>
            <Link
              href="/vegetables"
              className="rounded-md border-2 border-primary bg-card px-5 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Shop Vegetables
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const deliveryFee = subtotal >= 499 ? 0 : 29
  const total = subtotal + deliveryFee

  return (
    <section className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
      {/* Items */}
      <div className="rounded-md border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h1 className="text-base font-bold">
            My Basket{" "}
            <span className="text-muted-foreground">
              ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
            </span>
          </h1>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-medium text-muted-foreground hover:text-primary"
          >
            Clear basket
          </button>
        </div>

        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.product.id} className="flex gap-3 p-4">
              <Link
                href={`/product/${item.product.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted/30"
              >
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-1">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {item.product.brand}
                </p>
                <Link
                  href={`/product/${item.product.slug}`}
                  className="text-sm font-medium leading-snug hover:text-primary"
                >
                  {item.product.name}
                </Link>
                <span className="text-xs text-muted-foreground">{item.product.weight}</span>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold">₹{item.product.price * item.quantity}</span>
                    {item.product.mrp > item.product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.product.mrp * item.quantity}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center overflow-hidden rounded border-2 border-primary bg-primary text-primary-foreground">
                      <button
                        type="button"
                        onClick={() => decrement(item.product.id)}
                        className="px-2 py-1 hover:bg-primary/80"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-7 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increment(item.product.id)}
                        className="px-2 py-1 hover:bg-primary/80"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.product.id)}
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-md border border-border bg-card lg:sticky lg:top-[88px]">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold">Order Summary</h2>
        </div>
        <dl className="space-y-3 px-4 py-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">MRP Total</dt>
            <dd className="text-muted-foreground line-through">₹{mrpTotal}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold">₹{subtotal}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-accent">Discount</dt>
            <dd className="font-semibold text-accent">- ₹{savings}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Delivery Fee</dt>
            <dd className="font-semibold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <dt className="font-bold">Total</dt>
            <dd className="text-lg font-extrabold">₹{total}</dd>
          </div>
        </dl>
        <div className="border-t border-border p-4">
          <Link
            href="/checkout"
            className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Proceed to Checkout
          </Link>
          {subtotal < 499 && (
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Add ₹{499 - subtotal} more for free delivery
            </p>
          )}
        </div>
      </aside>
    </section>
  )
}
