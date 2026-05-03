"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type CategoryOption = { name: string; count: number }

export type Filters = {
  categories: string[]
  priceBands: string[]
  minDiscount: number | null
}

export const PRICE_BANDS = [
  { label: "Under ₹50", min: 0, max: 50 },
  { label: "₹50 - ₹100", min: 50, max: 100 },
  { label: "₹100 - ₹200", min: 100, max: 200 },
  { label: "₹200 - ₹500", min: 200, max: 500 },
  { label: "Above ₹500", min: 500, max: Number.POSITIVE_INFINITY },
] as const

const DISCOUNT_OPTIONS = [
  { label: "5% & above", value: 5 },
  { label: "10% & above", value: 10 },
  { label: "20% & above", value: 20 },
  { label: "30% & above", value: 30 },
]

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  )
}

export function FilterSidebar({
  categoryOptions,
  filters,
  onFiltersChange,
}: {
  categoryOptions: CategoryOption[]
  filters: Filters
  onFiltersChange: (next: Filters) => void
}) {
  function toggleCategory(name: string) {
    const exists = filters.categories.includes(name)
    onFiltersChange({
      ...filters,
      categories: exists ? filters.categories.filter((c) => c !== name) : [...filters.categories, name],
    })
  }

  function togglePrice(label: string) {
    const exists = filters.priceBands.includes(label)
    onFiltersChange({
      ...filters,
      priceBands: exists ? filters.priceBands.filter((p) => p !== label) : [...filters.priceBands, label],
    })
  }

  function setDiscount(value: number) {
    onFiltersChange({
      ...filters,
      minDiscount: filters.minDiscount === value ? null : value,
    })
  }

  function clearAll() {
    onFiltersChange({ categories: [], priceBands: [], minDiscount: null })
  }

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-[88px] rounded-md border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold">Filters</h2>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="px-4">
          <FilterSection title="Category">
            <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {categoryOptions.map((cat) => (
                <li key={cat.name} className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <Checkbox
                      id={`cat-${cat.name}`}
                      checked={filters.categories.includes(cat.name)}
                      onCheckedChange={() => toggleCategory(cat.name)}
                    />
                    <span>{cat.name}</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">({cat.count})</span>
                </li>
              ))}
            </ul>
          </FilterSection>

          <FilterSection title="Price">
            <ul className="space-y-2">
              {PRICE_BANDS.map((p) => (
                <li key={p.label}>
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <Checkbox
                      id={`price-${p.label}`}
                      checked={filters.priceBands.includes(p.label)}
                      onCheckedChange={() => togglePrice(p.label)}
                    />
                    <span>{p.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </FilterSection>

          <FilterSection title="Discount" defaultOpen={false}>
            <ul className="space-y-2">
              {DISCOUNT_OPTIONS.map((d) => (
                <li key={d.value}>
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <Checkbox
                      id={`disc-${d.value}`}
                      checked={filters.minDiscount === d.value}
                      onCheckedChange={() => setDiscount(d.value)}
                    />
                    <span>{d.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </FilterSection>
        </div>
      </div>
    </aside>
  )
}
