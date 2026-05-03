"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const FEATURED_PLANS = [
  {
    id: "fruits-weekly",
    name: "Weekly Fruit Pack",
    tagline: "7 days of premium fruits, delivered fresh",
    price: 599,
    originalPrice: 840,
    pricePerDay: 86,
    discount: 28,
    deliveriesLabel: "Once a week · 7 AM",
    contents: ["Bananas, apples & oranges", "Seasonal premium fruits", "1 imported fruit"],
    badge: "⭐ Most Popular",
    badgeClass: "bg-primary text-primary-foreground",
    color: "from-orange-50 to-amber-50 border-orange-200",
    href: "/subscriptions",
  },
  {
    id: "combo-weekly",
    name: "Weekly Combo Pack",
    tagline: "Fruits + Vegetables together every week",
    price: 999,
    originalPrice: 1500,
    pricePerDay: 142,
    discount: 33,
    deliveriesLabel: "Once a week · 7 AM",
    contents: ["Full Weekly Fruit Pack", "Full Weekly Veggie Pack", "Free recipe ideas"],
    badge: "⚡ Best Combo",
    badgeClass: "bg-accent text-accent-foreground",
    color: "from-green-50 to-emerald-50 border-green-200",
    href: "/subscriptions",
  },
  {
    id: "combo-monthly",
    name: "Monthly Family Combo",
    tagline: "30 days of fruits + veggies for the family",
    price: 3499,
    originalPrice: 6000,
    pricePerDay: 116,
    discount: 41,
    deliveriesLabel: "Daily · 7 AM",
    contents: ["Monthly Fruit Bonanza", "Monthly Veggie Saver", "Free swaps + priority delivery"],
    badge: "👑 Best Value",
    badgeClass: "bg-yellow-400 text-yellow-900",
    color: "from-yellow-50 to-orange-50 border-yellow-200",
    href: "/subscriptions",
  },
]

export function HomeSubscriptionSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-10">
      <div className="mt-8 mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold">Subscription Packs</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Save up to 41% with weekly & monthly plans</p>
        </div>
        <Link href="/subscriptions" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border bg-gradient-to-br ${plan.color} p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
          >
            <span className={`absolute -top-2.5 left-4 rounded-full px-3 py-0.5 text-xs font-bold ${plan.badgeClass}`}>
              {plan.badge}
            </span>

            <div className="pt-1">
              <h3 className="font-bold text-base">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{plan.tagline}</p>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-2xl font-extrabold">₹{plan.price}</span>
              <span className="text-sm text-muted-foreground line-through mb-0.5">₹{plan.originalPrice}</span>
              <span className="ml-auto rounded-full bg-green-500 text-white text-xs font-bold px-2 py-0.5">
                -{plan.discount}%
              </span>
            </div>

            <p className="text-xs text-muted-foreground -mt-1">₹{plan.pricePerDay}/day · {plan.deliveriesLabel}</p>

            <ul className="space-y-1">
              {plan.contents.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className="mt-auto flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Subscribe Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="font-bold text-sm">Not sure which plan to pick?</p>
          <p className="text-xs text-muted-foreground">Browse all plans — daily, weekly & monthly for fruits, veggies and combos.</p>
        </div>
        <Link
          href="/subscriptions"
          className="shrink-0 inline-flex items-center gap-2 rounded-md border-2 border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Explore All Plans <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}