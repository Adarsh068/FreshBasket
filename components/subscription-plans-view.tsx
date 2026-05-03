"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { Check, Sparkles, TrendingUp } from "lucide-react"
import { type PlanCategory, getPlansByCategory, type SubscriptionPlan } from "@/lib/subscription-plans"

const categories: { id: PlanCategory; label: string; description: string }[] = [
  { id: "fruits", label: "Fruits", description: "Premium seasonal & imported fruits" },
  { id: "vegetables", label: "Vegetables", description: "Farm-fresh daily vegetables" },
  { id: "combo", label: "Combo Pack", description: "Fruits + Vegetables together" },
]

export function SubscriptionPlansView() {
  const [active, setActive] = useState<PlanCategory>("combo")
  const plans = getPlansByCategory(active)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-[1280px] px-4 py-10 text-center sm:py-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            New: FreshBasket Subscriptions
          </span>
          <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            Daily, weekly or monthly packs.
            <span className="block text-primary">Save up to 41% on fresh produce.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[640px] text-pretty text-sm text-muted-foreground sm:text-base">
            Pick a plan, set your address and we&apos;ll deliver fresh fruits and vegetables to your doorstep on
            schedule. Cancel anytime, pause for vacation, swap items free.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-4 py-2.5 text-sm transition-colors min-w-[140px] ${
                active === c.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="font-bold">{c.label}</span>
              <span className={`text-[11px] ${active === c.id ? "opacity-90" : "text-muted-foreground"}`}>
                {c.description}
              </span>
            </button>
          ))}
        </div>

        {/* Plans grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* How it works */}
        <div className="mt-12 rounded-md border border-border bg-card p-6">
          <h2 className="text-lg font-bold">How it works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "Choose a plan", text: "Pick daily, weekly or monthly for fruits, veggies or combo." },
              { step: "2", title: "Set delivery address", text: "Tell us where & when to deliver. Pause anytime." },
              { step: "3", title: "Receive fresh produce", text: "We deliver fresh produce to your door on schedule." },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{s.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const discount = Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
  const frequencyLabel = plan.frequency === "daily" ? "/day" : plan.frequency === "weekly" ? "/week" : "/month"

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-md border bg-card transition-shadow hover:shadow-md ${
        plan.bestValue ? "border-primary ring-2 ring-primary/30" : "border-border"
      }`}
    >
      {plan.bestValue && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
          <TrendingUp className="h-3 w-3" />
          BEST VALUE
        </div>
      )}
      {plan.popular && !plan.bestValue && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground">
          POPULAR
        </div>
      )}

      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={plan.image || "/placeholder.svg"}
          alt={plan.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
          {plan.frequency}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold">{plan.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{plan.tagline}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold">₹{plan.price}</span>
          <span className="text-xs text-muted-foreground">{frequencyLabel}</span>
          <span className="text-xs text-muted-foreground line-through">₹{plan.originalPrice}</span>
          <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">
            {discount}% OFF
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          ₹{plan.pricePerDay}/day · {plan.deliveriesLabel}
        </p>

        <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-[11px]">
          <span className="font-semibold">Each delivery:</span> {plan.itemsPerDelivery}
        </div>

        <ul className="mt-3 space-y-1.5">
          {plan.contents.slice(0, 4).map((c) => (
            <li key={c} className="flex items-start gap-2 text-xs">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{c}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {plan.highlights.map((h) => (
            <span key={h} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {h}
            </span>
          ))}
        </div>

        <div className="mt-4 flex-1" />

        <Link
          href={`/subscriptions/${plan.id}`}
          className={`mt-2 inline-flex items-center justify-center rounded-md py-2.5 text-sm font-bold transition-colors ${
            plan.bestValue
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-accent text-accent-foreground hover:bg-accent/90"
          }`}
        >
          Subscribe Now
        </Link>
      </div>
    </article>
  )
}
