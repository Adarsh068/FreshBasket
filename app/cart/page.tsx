import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { CartView } from "@/components/cart-view"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"

export const metadata = {
  title: "My Basket | FreshBasket",
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav items={[{ label: "My Basket" }]} />
      <CartView />
      <SiteFooter />
    </main>
  )
}
