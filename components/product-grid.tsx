"use client"

import { useState } from "react"
import { ChevronDown, PackageSearch } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/products"

export type SortOption =
  | "Popularity"
  | "Price - Low to High"
  | "Price - High to Low"
  | "Discount"
  | "Rating"
  | "Alphabetical (A - Z)"

const SORT_OPTIONS: SortOption[] = [
  "Popularity",
  "Price - Low to High",
  "Price - High to Low",
  "Discount",
  "Rating",
  "Alphabetical (A - Z)",
]

export function sortProducts(products: Product[], sort: SortOption) {
  const list = [...products]
  switch (sort) {
    case "Price - Low to High":
      return list.sort((a, b) => a.price - b.price)
    case "Price - High to Low":
      return list.sort((a, b) => b.price - a.price)
    case "Discount":
      return list.sort(
        (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp,
      )
    case "Rating":
      return list.sort((a, b) => b.rating - a.rating)
    case "Alphabetical (A - Z)":
      return list.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return list.sort((a, b) => b.ratingCount - a.ratingCount)
  }
}

export function ProductGrid({
  products,
  title,
  totalCount,
  sort,
  onSortChange,
}: {
  products: Product[]
  title: string
  totalCount: number
  sort: SortOption
  onSortChange: (s: SortOption) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <section className="flex-1">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-xs text-muted-foreground">
            Showing {products.length} of {totalCount} products
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded border border-border px-3 py-1.5 text-xs hover:border-primary"
          >
            <span className="text-muted-foreground">Sort By:</span>
            <span className="font-semibold">{sort}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {open && (
            <ul className="absolute top-full right-0 z-20 mt-1 w-56 rounded-md border border-border bg-popover py-1 shadow-lg">
              {SORT_OPTIONS.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange(opt)
                      setOpen(false)
                    }}
                    className={`block w-full px-3 py-2 text-left text-xs hover:bg-muted ${
                      sort === opt ? "font-bold text-primary" : ""
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-card px-6 py-16 text-center">
          <PackageSearch className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-semibold">No products match your filters</p>
          <p className="mt-1 text-xs text-muted-foreground">Try clearing some filters or changing your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
