import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, ShieldCheck, Truck } from "lucide-react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ProductCard } from "@/components/product-card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"
import { getProductsByType } from "@/lib/products"
import { HomeSubscriptionSection } from "@/components/home-subscription-section"

export default function HomePage() {
  const fruits = getProductsByType("fruit").slice(0, 8)
  const vegetables = getProductsByType("vegetable").slice(0, 8)

  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav items={[{ label: "Home" }]} />

      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-4 py-6">
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-accent/15 via-background to-primary/10">
          <div className="grid items-center gap-6 px-6 py-10 sm:px-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">Farm fresh, every day</p>
              <h1 className="mt-2 text-3xl leading-tight font-extrabold text-balance sm:text-4xl">
                Fruits &amp; vegetables, delivered fresh to your doorstep
              </h1>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Hand-picked produce sourced directly from farmers. Up to 30% off this week — free delivery on orders
                above ₹499.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/fruits"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Shop Fruits <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/vegetables"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-primary bg-card px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Shop Vegetables
                </Link>
              </div>
            </div>
            <div className="relative h-48 sm:h-64 md:h-72">
              <Image
                src="/colorful-assortment-fresh-fruits-banner.jpg"
                alt="Colorful assortment of fresh fruits and vegetables"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-[1280px] px-4">
        <div className="grid grid-cols-1 gap-3 rounded-md border border-border bg-card p-4 sm:grid-cols-3">
          <Feature icon={<Truck className="h-5 w-5" />} title="Free Delivery" subtitle="On orders above ₹499" />
          <Feature
            icon={<Clock className="h-5 w-5" />}
            title="Same Day Delivery"
            subtitle="Order before 4pm in eligible areas"
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="100% Quality Assured"
            subtitle="Easy returns, no questions asked"
          />
        </div>
      </section>

      {/* Fresh fruits */}
      <SectionHeader title="Fresh Fruits" href="/fruits" />
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
        {fruits.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Fresh vegetables */}
      <SectionHeader title="Fresh Vegetables" href="/vegetables" />
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 px-4 pb-10 sm:grid-cols-3 lg:grid-cols-4">
        {vegetables.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <HomeSubscriptionSection />
      <SiteFooter />
    </main>
  )
}

function Feature({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
        {icon}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  )
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mx-auto mt-8 mb-4 flex max-w-[1280px] items-end justify-between px-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
