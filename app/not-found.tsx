import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <section className="mx-auto max-w-[640px] px-4 py-20 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">404</p>
        <h1 className="mt-2 text-3xl font-extrabold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Back to Home
          </Link>
          <Link
            href="/fruits"
            className="rounded-md border-2 border-primary bg-card px-5 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Browse Fruits
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
