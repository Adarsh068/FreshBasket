"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ProductGrid, sortProducts, type SortOption } from "@/components/product-grid"
import { products } from "@/lib/products"

const SearchX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0"/>
    <path d="M21 21l-6-6"/>
    <path d="M8 8l4 4m0-4l-4 4"/>
  </svg>
)

export function SearchResults({ query }: { query: string }) {
  const [sort, setSort] = useState<SortOption>("Popularity")

  const matches = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    const list = products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    })
    return sortProducts(list, sort)
  }, [query, sort])

  if (!query) {
    return (
      <section className="mx-auto max-w-[1280px] px-4 py-16 text-center">
        <div className="rounded-md border border-dashed border-border bg-card px-6 py-12">
          <SearchX />
          <h1 className="text-lg font-bold">Start a search</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the search box above to find fruits, vegetables, brands, and more.
          </p>
        </div>
      </section>
    )
  }

  if (matches.length === 0) {
    return (
      <section className="mx-auto max-w-[1280px] px-4 py-16 text-center">
        <div className="rounded-md border border-dashed border-border bg-card px-6 py-12">
          <SearchX />
          <h1 className="text-lg font-bold">No results for &quot;{query}&quot;</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different keyword or browse our{" "}
            <Link href="/fruits" className="text-primary hover:underline">fruits</Link>
            {" "}and{" "}
            <Link href="/vegetables" className="text-primary hover:underline">vegetables</Link>
            {" "}sections.
          </p>
        </div>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-10">
      <ProductGrid
        products={matches}
        title={`Search results for "${query}"`}
        totalCount={matches.length}
        sort={sort}
        onSortChange={setSort}
      />
    </div>
  )
}