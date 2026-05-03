import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { CategoryPage } from "@/components/category-page"
import { HeroBanner } from "@/components/hero-banner"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"
import { getCategoriesForType, getProductsByType } from "@/lib/products"

export const metadata = {
  title: "Fresh Fruits | FreshBasket",
  description: "Buy fresh fruits online — farm-fresh produce delivered to your doorstep with FreshBasket.",
}

export default function FruitsPage() {
  const products = getProductsByType("fruit")
  const categoryOptions = getCategoriesForType("fruit")

  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav
        items={[
          { label: "Fruits & Vegetables", href: "/" },
          { label: "Fresh Fruits" },
        ]}
      />
      <HeroBanner
        eyebrow="Farm Fresh Daily"
        title="Fresh Fruits Delivered to Your Doorstep"
        description="Hand-picked, farm-fresh fruits at unbeatable prices. Up to 30% off this week."
        ctaLabel="Shop Now"
        ctaHref="#products"
        image="/colorful-assortment-fresh-fruits-banner.jpg"
      />
      <div id="products">
        <CategoryPage title="Fresh Fruits" products={products} categoryOptions={categoryOptions} />
      </div>
      <SiteFooter />
    </main>
  )
}
