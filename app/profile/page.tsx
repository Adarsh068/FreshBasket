import { ProfileView } from "@/components/profile-view"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TopPromoBar } from "@/components/top-promo-bar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export const metadata = { title: "My Profile | FreshBasket" }

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav items={[{ label: "My Profile" }]} />
      <section className="mx-auto max-w-[900px] px-4 py-8">
        <ProfileView />
      </section>
      <SiteFooter />
    </main>
  )
}
