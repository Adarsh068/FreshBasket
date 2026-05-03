"use client"

import Link from "next/link"
import { useState } from "react"
import { CheckCircle2, CreditCard } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

type PaymentMethod = "cod" | "upi" | "card"

export function CheckoutView() {
  const { items, subtotal, mrpTotal, savings, totalQuantity, clear } = useCart()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [payment, setPayment] = useState<PaymentMethod>("cod")

  const deliveryFee = subtotal >= 499 ? 0 : 29
  const total = subtotal + deliveryFee

  if (orderId) {
    return (
      <section className="mx-auto max-w-[720px] px-4 py-16">
        <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Order placed!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you for shopping with FreshBasket. Your order will be delivered tomorrow morning.
          </p>
          <p className="mt-3 rounded-md bg-muted/50 px-4 py-2 text-sm">
            Order ID: <span className="font-bold">{orderId}</span>
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-[720px] px-4 py-16">
        <div className="rounded-md border border-dashed border-border bg-card px-6 py-12 text-center">
          <h1 className="text-xl font-bold">Your basket is empty</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add some items before checking out.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Browse products
          </Link>
        </div>
      </section>
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const form = e.currentTarget
    const fd = new FormData(form)

    setTimeout(async () => {
      const orderPayload = {
        customerName: String(fd.get("name") || ""),
        phone: String(fd.get("phone") || ""),
        address: String(fd.get("address") || ""),
        city: String(fd.get("city") || ""),
        pincode: String(fd.get("pincode") || ""),
        payment,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        status: "placed",
        items: items.map((it) => ({
          id: it.product.id,
          name: it.product.name,
          image: it.product.image,
          price: it.product.price,
          quantity: it.quantity,
          weight: it.product.weight,
        })),
      }
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (user?.token) headers["Authorization"] = `Bearer ${user.token}`
        const res = await fetch(`${API}/orders`, { method: "POST", headers, body: JSON.stringify(orderPayload) })
        const data = await res.json()
        setOrderId(data.orderId || "FB" + Math.random().toString(36).slice(2, 8).toUpperCase())
      } catch {
        setOrderId("FB" + Math.random().toString(36).slice(2, 8).toUpperCase())
      }
      clear()
      setSubmitting(false)
    }, 800)
  }

  return (
    <section className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address */}
        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold">Delivery Address</h2>
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
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold">Payment Method</h2>
          </div>
          <div className="space-y-2 p-4">
            <PaymentRadio
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
              label="Cash on Delivery"
              description="Pay with cash or UPI when your order arrives"
            />
            <PaymentRadio
              checked={payment === "upi"}
              onChange={() => setPayment("upi")}
              label="UPI"
              description="Pay using any UPI app — GPay, PhonePe, Paytm"
            />
            <PaymentRadio
              checked={payment === "card"}
              onChange={() => setPayment("card")}
              label="Credit / Debit Card"
              description="Secure card payment"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <CreditCard className="h-4 w-4" />
          {submitting ? "Placing order..." : `Place Order · ₹${total}`}
        </button>
      </form>

      {/* Summary */}
      <aside className="h-fit rounded-md border border-border bg-card lg:sticky lg:top-[88px]">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold">Order Summary</h2>
          <p className="text-xs text-muted-foreground">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </p>
        </div>
        <dl className="space-y-3 px-4 py-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">MRP Total</dt>
            <dd className="text-muted-foreground line-through">₹{mrpTotal}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold">₹{subtotal}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-accent">Discount</dt>
            <dd className="font-semibold text-accent">- ₹{savings}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Delivery Fee</dt>
            <dd className="font-semibold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <dt className="font-bold">Total</dt>
            <dd className="text-lg font-extrabold">₹{total}</dd>
          </div>
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

function PaymentRadio({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: () => void
  label: string
  description: string
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors ${
        checked ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <input type="radio" name="payment" checked={checked} onChange={onChange} className="mt-1 accent-primary" />
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </label>
  )
}
