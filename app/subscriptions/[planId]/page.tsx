import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { TopPromoBar } from "@/components/top-promo-bar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SubscribeForm } from "@/components/subscribe-form"
import { getPlanById, subscriptionPlans } from "@/lib/subscription-plans"

type Params = { params: Promise<{ planId: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { planId } = await params
  const plan = getPlanById(planId)
  if (!plan) return { title: "Plan | FreshBasket" }
  return {
    title: `${plan.name} | FreshBasket Subscriptions`,
    description: plan.tagline,
  }
}

export function generateStaticParams() {
  return subscriptionPlans.map((p) => ({ planId: p.id }))
}

export default async function SubscribePage({ params }: Params) {
  const { planId } = await params
  const plan = getPlanById(planId)
  if (!plan) notFound()

  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <SubscribeForm plan={plan} />
      <SiteFooter />
    </main>
  )
}
