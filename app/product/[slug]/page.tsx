import { notFound } from "next/navigation"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ProductDetail } from "@/components/product-detail"
import { ProductCard } from "@/components/product-card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TopPromoBar } from "@/components/top-promo-bar"
import { getProductBySlug, getProductsByType } from "@/lib/products"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: "Product not found | FreshBasket" }
  return {
    title: `${product.name} | FreshBasket`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const typeLabel = product.type === "fruit" ? "Fresh Fruits" : "Fresh Vegetables"
  const typeHref = product.type === "fruit" ? "/fruits" : "/vegetables"

  const related = getProductsByType(product.type)
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  // If not enough same-category items, fill with same-type items
  if (related.length < 4) {
    const fillers = getProductsByType(product.type)
      .filter((p) => p.id !== product.id && !related.some((r) => r.id === p.id))
      .slice(0, 4 - related.length)
    related.push(...fillers)
  }

  return (
    <main className="min-h-screen bg-background">
      <TopPromoBar />
      <SiteHeader />
      <BreadcrumbNav
        items={[
          { label: "Fruits & Vegetables", href: "/" },
          { label: typeLabel, href: typeHref },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 pb-10">
          <h2 className="mb-4 text-lg font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}
