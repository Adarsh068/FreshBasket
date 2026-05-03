"use client"

import Link from "next/link"
import { useState } from "react"
import { Calendar, CheckCircle2 } from "lucide-react"
import type { SubscriptionPlan } from "@/lib/subscription-plans"
import { saveSubscription } from "@/lib/store"

export function SubscribeForm({ plan }: { plan: SubscriptionPlan }) {
  const [submitting, setSubmitting] = useState(false)
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const frequencyLabel = plan.frequency === "daily" ? "/day" : plan.frequency === "weekly" ? "/week" : "/month"
  const discount = Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    const id = "SUB" + Math.random().toString(36).slice(2, 8).toUpperCase()

    setTimeout(() => {
      saveSubscription({
        id,
        planId: plan.id,
        planName: plan.name,
        category: plan.category,
        frequency: plan.frequency,
        price: plan.price,
        customerName: String(fd.get("name") || ""),
        phone: String(fd.get("phone") || ""),
        address: `${fd.get("address")}, ${fd.get("city")} - ${fd.get("pincode")}`,
        startDate: String(fd.get("startDate") || tomorrow),
        status: "active",
        createdAt: Date.now(),
      })
      setConfirmedId(id)
      setSubmitting(false)
    }, 700)
  }

  if (confirmedId) {
    return (
      <section className="mx-auto max-w-[720px] px-4 py-16">
        <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">You&apos;re subscribed!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your <span className="font-semibold">{plan.name}</span> plan is active. First delivery on
            schedule.
          </p>
          <p className="mt-3 rounded-md bg-muted/50 px-4 py-2 text-sm">
            Subscription ID: <span className="font-bold">{confirmedId}</span>
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
            <Link
              href="/subscriptions"
              className="rounded-md border border-border px-5 py-2 text-sm font-bold hover:bg-muted"
            >
              Browse more plans
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto grid max-w-[1280px] gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Link href="/subscriptions" className="text-xs text-primary hover:underline">
            ← Back to plans
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold">{plan.name}</h1>
          <p className="text-sm text-muted-foreground">{plan.tagline}</p>
        </div>

        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold">Delivery Details</h2>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required defaultValue="Customer" />
            <Field label="Mobile number" name="phone" required type="tel" defaultValue="9999999999" />
            <Field
              label="Address line"
              name="address"
              required
              className="sm:col-span-2"
              defaultValue="221B, MG Road"
            />
            <Field label="City" name="city" required defaultValue="Bengaluru" />
            <Field label="Pincode" name="pincode" required pattern="[0-9]{6}" defaultValue="560001" />
            <Field
              label="Start date"
              name="startDate"
              required
              type="date"
              defaultValue={tomorrow}
              className="sm:col-span-2"
            />
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <h2 className="text-sm font-bold">What you get</h2>
          <ul className="mt-2 space-y-1.5">
            {plan.contents.map((c) => (
              <li key={c} className="flex items-start gap-2 text-xs">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Calendar className="h-4 w-4" />
          {submitting ? "Activating..." : `Confirm Subscription · ₹${plan.price}${frequencyLabel}`}
        </button>
      </form>

      <aside className="h-fit rounded-md border border-border bg-card lg:sticky lg:top-[88px]">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold">Plan Summary</h2>
        </div>
        <dl className="space-y-3 px-4 py-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Plan</dt>
            <dd className="font-semibold capitalize">{plan.category}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Frequency</dt>
            <dd className="font-semibold capitalize">{plan.frequency}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Original</dt>
            <dd className="line-through text-muted-foreground">₹{plan.originalPrice}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-accent">You save</dt>
            <dd className="font-semibold text-accent">₹{plan.originalPrice - plan.price} ({discount}%)</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <dt className="font-bold">You pay</dt>
            <dd>
              <span className="text-lg font-extrabold">₹{plan.price}</span>
              <span className="text-xs text-muted-foreground">{frequencyLabel}</span>
            </dd>
          </div>
          <p className="rounded-md bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
            Cancel anytime · Pause for vacation · Free swaps
          </p>
        </dl>
      </aside>
    </section>
  )
}

function Field({
  label,
  className,
  ...rest
}: {
  label: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-1 text-xs ${className || ""}`}>
      <span className="font-medium">{label}</span>
      <input
        {...rest}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
      />
    </label>
  )
}
