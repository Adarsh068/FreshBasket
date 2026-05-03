import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { CheckoutView } from "@/components/checkout-view"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"

export const metadata = {
  title: "Checkout | FreshBasket",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav
        items={[
          { label: "My Basket", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <CheckoutView />
      <SiteFooter />
    </main>
  )
}
