// lib/api.ts
// Central API client — calls Express backend

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || "Request failed")
  }
  return res.json() as Promise<T>
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; name: string; email: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string, phone?: string) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    }),
}

// ── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (type?: "fruit" | "vegetable") =>
    request<Product[]>(`/products${type ? `?type=${type}` : ""}`),
  getBySlug: (slug: string) => request<Product>(`/products/${slug}`),
  search: (q: string) => request<Product[]>(`/products/search?q=${encodeURIComponent(q)}`),
}

// ── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: (order: Omit<OrderRecord, "id" | "orderId" | "createdAt">) =>
    request<OrderRecord>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),
  getAll: (token: string) =>
    request<OrderRecord[]>("/orders", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    }),
  updateStatus: (orderId: string, status: string, token: string) =>
    request(`/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),
  delete: (orderId: string, token: string) =>
    request(`/orders/${orderId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    }),
}

// ── Subscriptions ────────────────────────────────────────────────────────────
export const subscriptionsApi = {
  create: (sub: Record<string, unknown>) =>
    request("/subscriptions", {
      method: "POST",
      body: JSON.stringify(sub),
    }),
  getAll: (token: string) =>
    request("/subscriptions", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    }),
  updateStatus: (id: string, status: string, token: string) =>
    request(`/subscriptions/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),
  delete: (id: string, token: string) =>
    request(`/subscriptions/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    }),
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type Product = {
  id: string; slug: string; name: string; brand: string; weight: string
  price: number; mrp: number; rating: number; ratingCount: number
  image: string; deliveryTime: string; type: "fruit" | "vegetable"
  category: string; description: string; inStock: boolean
}

export type OrderRecord = {
  orderId: string; createdAt: string; customerName: string; phone: string
  address: string; city: string; pincode: string; payment: "cod" | "upi" | "card"
  items: { id: string; name: string; image: string; price: number; quantity: number; weight: string }[]
  subtotal: number; deliveryFee: number; total: number
  status: "placed" | "out-for-delivery" | "delivered" | "cancelled"
}
