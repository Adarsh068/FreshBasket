import type { Metadata } from "next"
import { TopPromoBar } from "@/components/top-promo-bar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SubscriptionPlansView } from "@/components/subscription-plans-view"

export const metadata: Metadata = {
  title: "Subscription Packs | FreshBasket",
  description:
    "Subscribe to daily, weekly or monthly fruit, vegetable or combo packs and save up to 41%. Cancel anytime.",
}

export default function SubscriptionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <SubscriptionPlansView />
      <SiteFooter />
    </main>
  )
}
