import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export type BreadcrumbItem = { label: string; href?: string }

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/30">
      <ol className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground">
        <li>
          <Link href="/" className="flex items-center hover:text-primary" aria-label="Home">
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              {isLast || !item.href ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
