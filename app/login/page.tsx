import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { LoginForm } from "@/components/login-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"

export const metadata = {
  title: "Login | FreshBasket",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav items={[{ label: "Login" }]} />
      <section className="mx-auto max-w-[480px] px-4 py-10">
        <LoginForm />
      </section>
      <SiteFooter />
    </main>
  )
}
