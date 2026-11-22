import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { CategoryPage } from "@/components/category-page"
import { HeroBanner } from "@/components/hero-banner"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"
import { fetchPublicProducts } from "@/lib/products"

export const metadata = {
  title: "Fresh Vegetables | FreshBasket",
  description: "Buy fresh vegetables online — farm-fresh greens delivered to your doorstep with FreshBasket.",
}

export default async function VegetablesPage() {
  const catalog = await fetchPublicProducts()
  const products = catalog.filter((product) => product.type === "vegetable")
  const categoryMap = new Map<string, number>()
  products.forEach((product) => categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1))
  const categoryOptions = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))

  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav
        items={[
          { label: "Fruits & Vegetables", href: "/" },
          { label: "Fresh Vegetables" },
        ]}
      />
      <HeroBanner
        eyebrow="Farm Fresh Daily"
        title="Fresh Vegetables Delivered to Your Doorstep"
        description="Crisp, locally-sourced vegetables at the best prices. Stock up the kitchen this week."
        ctaLabel="Shop Now"
        ctaHref="#products"
        image="/fresh-vegetables-assortment-banner.jpg"
      />
      <div id="products" className="scroll-mt-[88px]">
        <CategoryPage title="Fresh Vegetables" products={products} categoryOptions={categoryOptions} />
      </div>
      <SiteFooter />
    </main>
  )
}
