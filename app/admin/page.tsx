import type { Metadata } from "next"
import { TopPromoBar } from "@/components/top-promo-bar"
import { SiteHeader } from "@/components/site-header"
import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | FreshBasket",
  description: "Manage products, orders and subscriptions for FreshBasket.",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <AdminDashboard />
    </main>
  )
}
