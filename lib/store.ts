// Lightweight localStorage-backed store for orders & subscriptions.
// Used by checkout, subscriptions page and admin dashboard.

import type { CartItem } from "@/lib/cart-context"

const ORDERS_KEY = "freshbasket:orders"
const SUBS_KEY = "freshbasket:subscriptions"

export type OrderRecord = {
  id: string
  createdAt: number
  customerName: string
  phone: string
  address: string
  city: string
  pincode: string
  payment: "cod" | "upi" | "card"
  items: { id: string; name: string; image: string; price: number; quantity: number; weight: string }[]
  subtotal: number
  deliveryFee: number
  total: number
  status: "placed" | "out-for-delivery" | "delivered" | "cancelled"
}

export type SubscriptionRecord = {
  id: string
  planId: string
  planName: string
  category: "fruits" | "vegetables" | "combo"
  frequency: "daily" | "weekly" | "monthly"
  price: number
  customerName: string
  phone: string
  address: string
  startDate: string
  status: "active" | "paused" | "cancelled"
  createdAt: number
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}

// ---------- Orders ----------

export function loadOrders(): OrderRecord[] {
  if (typeof window === "undefined") return []
  return safeParse<OrderRecord[]>(localStorage.getItem(ORDERS_KEY), [])
}

export function saveOrder(order: OrderRecord) {
  const orders = loadOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function updateOrderStatus(id: string, status: OrderRecord["status"]) {
  const orders = loadOrders().map((o) => (o.id === id ? { ...o, status } : o))
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function deleteOrder(id: string) {
  const orders = loadOrders().filter((o) => o.id !== id)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function buildOrderFromCart(args: {
  cartItems: CartItem[]
  subtotal: number
  deliveryFee: number
  customerName: string
  phone: string
  address: string
  city: string
  pincode: string
  payment: OrderRecord["payment"]
}): OrderRecord {
  return {
    id: "FB" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    createdAt: Date.now(),
    customerName: args.customerName,
    phone: args.phone,
    address: args.address,
    city: args.city,
    pincode: args.pincode,
    payment: args.payment,
    subtotal: args.subtotal,
    deliveryFee: args.deliveryFee,
    total: args.subtotal + args.deliveryFee,
    status: "placed",
    items: args.cartItems.map((it) => ({
      id: it.product.id,
      name: it.product.name,
      image: it.product.image,
      price: it.product.price,
      quantity: it.quantity,
      weight: it.product.weight,
    })),
  }
}

// ---------- Subscriptions ----------

export function loadSubscriptions(): SubscriptionRecord[] {
  if (typeof window === "undefined") return []
  return safeParse<SubscriptionRecord[]>(localStorage.getItem(SUBS_KEY), [])
}

export async function saveSubscription(sub: SubscriptionRecord) {
  // Save to MongoDB
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    await fetch(`${API}/subscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: sub.planId,
        planName: sub.planName,
        category: sub.category,
        frequency: sub.frequency,
        price: sub.price,
        customerName: sub.customerName,
        phone: sub.phone,
        address: sub.address,
        startDate: sub.startDate,
        status: "active",
      }),
    })
  } catch (e) {
    console.error("Failed to save subscription", e)
  }
  // Also keep localStorage as backup
  const all = loadSubscriptions()
  all.unshift(sub)
  localStorage.setItem(SUBS_KEY, JSON.stringify(all))
}

export function updateSubscriptionStatus(id: string, status: SubscriptionRecord["status"]) {
  const all = loadSubscriptions().map((s) => (s.id === id ? { ...s, status } : s))
  localStorage.setItem(SUBS_KEY, JSON.stringify(all))
}

export function deleteSubscription(id: string) {
  const all = loadSubscriptions().filter((s) => s.id !== id)
  localStorage.setItem(SUBS_KEY, JSON.stringify(all))
}
