"use client"

import { useMemo, useState } from "react"
import { FilterSidebar, PRICE_BANDS, type CategoryOption, type Filters } from "@/components/filter-sidebar"
import { ProductGrid, sortProducts, type SortOption } from "@/components/product-grid"
import type { Product } from "@/lib/products"

export function CategoryPage({
  title,
  products,
  categoryOptions,
}: {
  title: string
  products: Product[]
  categoryOptions: CategoryOption[]
}) {
  const [filters, setFilters] = useState<Filters>({ categories: [], priceBands: [], minDiscount: null })
  const [sort, setSort] = useState<SortOption>("Popularity")

  const filtered = useMemo(() => {
    const passes = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false

      if (filters.priceBands.length) {
        const band = PRICE_BANDS.find((b) => filters.priceBands.includes(b.label) && p.price >= b.min && p.price < b.max)
        if (!band) return false
      }

      if (filters.minDiscount != null) {
        const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100)
        if (discount < filters.minDiscount) return false
      }

      return true
    })
    return sortProducts(passes, sort)
  }, [products, filters, sort])

  return (
    <div className="mx-auto flex max-w-[1280px] gap-5 px-4 pb-10">
      <FilterSidebar categoryOptions={categoryOptions} filters={filters} onFiltersChange={setFilters} />
      <ProductGrid
        products={filtered}
        title={title}
        totalCount={products.length}
        sort={sort}
        onSortChange={setSort}
      />
    </div>
  )
}
