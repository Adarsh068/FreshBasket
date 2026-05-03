import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { SearchResults } from "@/components/search-results"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"

export const metadata = {
  title: "Search | FreshBasket",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q || "").trim()

  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav
        items={[
          { label: "Search", href: "/search" },
          { label: query ? `"${query}"` : "All results" },
        ]}
      />
      <SearchResults query={query} />
      <SiteFooter />
    </main>
  )
}
