"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

type Tab = "overview" | "orders" | "subscriptions" | "products"

type Order = {
  orderId: string; createdAt: string; customerName: string; phone: string
  address: string; city: string; pincode: string; payment: string
  items: { id: string; name: string; price: number; quantity: number; weight: string }[]
  subtotal: number; deliveryFee: number; total: number
  status: "placed" | "out-for-delivery" | "delivered" | "cancelled"
}

type Sub = {
  subscriptionId: string; createdAt: string; customerName: string; phone: string
  planName: string; category: string; frequency: string; price: number; startDate: string
  status: "active" | "paused" | "cancelled"
}

type Product = {
  _id: string; id: string; name: string; type: string; category: string
  brand: string; weight: string; price: number; mrp: number
  rating: number; ratingCount: number; inStock: boolean; image: string
}

const STATUS_COLOR: Record<string, string> = {
  placed: "bg-blue-100 text-blue-700",
  "out-for-delivery": "bg-yellow-100 text-yellow-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
}

const IChart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const IOrders = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
const ISub = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IProduct = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
const ITrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const IUsers = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IRupee = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12M6 8h12M6 13l8.5 8L20 13"/><path d="M6 8a4 4 0 0 0 0 8"/></svg>

const EMPTY_PRODUCT = { name: "", brand: "", category: "", weight: "", price: "", mrp: "", type: "fruit", image: "" }

export function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [subs, setSubs] = useState<Sub[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (!user) { router.replace("/admin/login"); return }
    if (user.role !== "admin") { router.replace("/admin/login"); return }
    fetchAll()
  }, [mounted, user])

  async function fetchAll() {
    if (!user) return
    setLoading(true)
    const h = { Authorization: `Bearer ${user.token}` }
    const [o, s, p] = await Promise.all([
      fetch(`${API}/orders`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/subscriptions`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/products`).then(r => r.json()).catch(() => []),
    ])
    setOrders(Array.isArray(o) ? o : [])
    setSubs(Array.isArray(s) ? s : [])
    setProducts(Array.isArray(p) ? p : [])
    setLoading(false)
  }

  async function updateOrderStatus(orderId: string, status: string) {
    if (!user) return
    await fetch(`${API}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status }),
    })
    fetchAll()
  }

  async function deleteOrder(orderId: string) {
    if (!user || !confirm("Delete this order?")) return
    await fetch(`${API}/orders/${orderId}`, { method: "DELETE", headers: { Authorization: `Bearer ${user.token}` } })
    fetchAll()
  }

  async function updateSubStatus(id: string, status: string) {
    if (!user) return
    await fetch(`${API}/subscriptions/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status }),
    })
    fetchAll()
  }

  async function deleteSub(id: string) {
    if (!user || !confirm("Delete this subscription?")) return
    await fetch(`${API}/subscriptions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${user.token}` } })
    fetchAll()
  }

  async function saveEdit() {
    if (!user || !editProduct) return
    await fetch(`${API}/products/${editProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({
        ...editData,
        price: Number(editData.price),
        mrp: Number(editData.mrp),
      }),
    })
    setEditProduct(null)
    fetchAll()
  }

  async function addProduct() {
    if (!user) return
    if (!newProduct.name || !newProduct.price || !newProduct.mrp) { alert("Name, price and MRP required"); return }
    const slug = newProduct.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const id = "p" + Date.now()
    await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({
        ...newProduct, id, slug,
        price: Number(newProduct.price),
        mrp: Number(newProduct.mrp),
        rating: 0, ratingCount: 0, inStock: true,
        deliveryTime: "Tomorrow 7AM", description: "",
      }),
    })
    setShowAddProduct(false)
    setNewProduct(EMPTY_PRODUCT)
    fetchAll()
  }

  async function toggleStock(product: Product) {
    if (!user) return
    await fetch(`${API}/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ inStock: !product.inStock }),
    })
    fetchAll()
  }

  if (!mounted) return null
  if (!user || user.role !== "admin") return null

  const totalRevenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0)
  const activeSubs = subs.filter(s => s.status === "active").length
  const customers = new Set([...orders.map(o => o.phone), ...subs.map(s => s.phone)]).size
  const outOfStock = products.filter(p => !p.inStock).length

  const TABS = [
    { id: "overview" as Tab, label: "Overview", I: IChart },
    { id: "orders" as Tab, label: `Orders (${orders.length})`, I: IOrders },
    { id: "subscriptions" as Tab, label: `Subs (${subs.length})`, I: ISub },
    { id: "products" as Tab, label: `Products (${products.length})`, I: IProduct },
  ]

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">FreshBasket Admin</p>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <button onClick={fetchAll} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">↻ Refresh</button>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border mb-5">
        {TABS.map(({ id, label, I }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-colors ${tab === id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <I />{label}
          </button>
        ))}
      </div>

      {loading && <p className="py-10 text-center text-sm text-muted-foreground">Loading...</p>}

      {!loading && tab === "overview" && (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, I: IRupee, color: "bg-primary/10 text-primary" },
              { label: "Total Orders", value: orders.length, I: IOrders, color: "bg-blue-100 text-blue-700" },
              { label: "Active Subs", value: activeSubs, I: ISub, color: "bg-green-100 text-green-700" },
              { label: "Customers", value: customers, I: IUsers, color: "bg-purple-100 text-purple-700" },
            ].map(({ label, value, I, color }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-md ${color}`}><I /></span>
                </div>
                <p className="text-2xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-bold text-sm">Recent Orders</h2>
              <span className="text-xs text-muted-foreground">{orders.length} total</span>
            </div>
            {orders.length === 0
              ? <p className="p-8 text-center text-sm text-muted-foreground">No orders yet</p>
              : <ul className="divide-y divide-border">
                {orders.slice(0, 6).map((o, i) => (
                  <li key={o.orderId || i} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">#{o.orderId} · {new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOR[o.status] || "bg-muted"}`}>{o.status}</span>
                      <span className="font-bold">₹{o.total}</span>
                    </div>
                  </li>
                ))}
              </ul>
            }
          </div>
          {outOfStock > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold">
              ⚠️ {outOfStock} product{outOfStock > 1 ? "s" : ""} out of stock
            </div>
          )}
        </div>
      )}

      {!loading && tab === "orders" && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          {orders.length === 0
            ? <p className="p-10 text-center text-sm text-muted-foreground">No orders yet</p>
            : <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o, i) => (
                  <tr key={o.orderId || i} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <p className="font-semibold">#{o.orderId}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.phone} · {o.city}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{o.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{o.items.map(i => i.name).join(", ")}</p>
                    </td>
                    <td className="px-4 py-3 font-bold">₹{o.total}</td>
                    <td className="px-4 py-3 text-xs uppercase font-semibold">{o.payment}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e => updateOrderStatus(o.orderId, e.target.value)}
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold outline-none">
                        <option value="placed">Placed</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteOrder(o.orderId)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-50">
                        <ITrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      )}

      {!loading && tab === "subscriptions" && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          {subs.length === 0
            ? <p className="p-10 text-center text-sm text-muted-foreground">No subscriptions yet</p>
            : <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Sub ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subs.map((s, i) => (
                  <tr key={s.subscriptionId || i} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-semibold">#{s.subscriptionId}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{s.customerName}</p>
                      <p className="text-xs text-muted-foreground">{s.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{s.planName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{s.category} · {s.frequency}</p>
                    </td>
                    <td className="px-4 py-3 font-bold">₹{s.price}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.startDate}</td>
                    <td className="px-4 py-3">
                      <select value={s.status} onChange={e => updateSubStatus(s.subscriptionId, e.target.value)}
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold outline-none">
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteSub(s.subscriptionId)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-50">
                        <ITrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      )}

      {!loading && tab === "products" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{products.length} products</span>
              {outOfStock > 0 && <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-bold">{outOfStock} out of stock</span>}
            </div>
            <button onClick={() => setShowAddProduct(!showAddProduct)}
              className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90">
              + Add Product
            </button>
          </div>

          {showAddProduct && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-bold mb-4">Add New Product</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { key: "name", label: "Product Name", type: "text" },
                  { key: "brand", label: "Brand", type: "text" },
                  { key: "category", label: "Category", type: "text" },
                  { key: "weight", label: "Weight (e.g. 500g)", type: "text" },
                  { key: "price", label: "Price (₹)", type: "number" },
                  { key: "mrp", label: "MRP (₹)", type: "number" },
                ].map(({ key, label, type }) => (
                  <label key={key} className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">{label}</span>
                    <input type={type} value={(newProduct as Record<string, string>)[key] || ""}
                      onChange={e => setNewProduct(p => ({ ...p, [key]: e.target.value }))}
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                  </label>
                ))}
                <label className="flex flex-col gap-1 text-xs">
                  <span className="font-semibold">Type</span>
                  <select value={newProduct.type}
                    onChange={e => setNewProduct(p => ({ ...p, type: e.target.value }))}
                    className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                    <option value="fruit">Fruit</option>
                    <option value="vegetable">Vegetable</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs col-span-2">
                  <span className="font-semibold">Image URL</span>
                  <input type="text" value={newProduct.image || ""}
                    onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))}
                    placeholder="/your-image.jpg"
                    className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={addProduct}
                  className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90">
                  Save Product
                </button>
                <button onClick={() => setShowAddProduct(false)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {editProduct && (
            <div className="rounded-xl border border-primary bg-card p-5">
              <h3 className="font-bold mb-4">Edit: {editProduct.name}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { key: "name", label: "Product Name" },
                  { key: "brand", label: "Brand" },
                  { key: "category", label: "Category" },
                  { key: "weight", label: "Weight" },
                  { key: "price", label: "Price (₹)" },
                  { key: "mrp", label: "MRP (₹)" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">{label}</span>
                    <input type="text" value={editData[key] || ""}
                      onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                  </label>
                ))}
                <label className="flex flex-col gap-1 text-xs col-span-2">
                  <span className="font-semibold">Image URL</span>
                  <input type="text" value={editData.image || ""}
                    onChange={e => setEditData(d => ({ ...d, image: e.target.value }))}
                    className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={saveEdit}
                  className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </button>
                <button onClick={() => setEditProduct(null)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">MRP</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map(p => (
                  <tr key={p._id} className={`hover:bg-muted/20 ${!p.inStock ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p>
                    </td>
                    <td className="px-4 py-3 text-xs capitalize text-muted-foreground">{p.type}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.weight}</td>
                    <td className="px-4 py-3 font-bold">₹{p.price}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground line-through">₹{p.mrp}</td>
                    <td className="px-4 py-3 text-xs">{p.rating} ⭐ ({p.ratingCount})</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditProduct(p); setEditData({ name: p.name, brand: p.brand, category: p.category, weight: p.weight, price: String(p.price), mrp: String(p.mrp), image: p.image }) }}
                          className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted">
                          Edit
                        </button>
                        <button onClick={() => toggleStock(p)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${p.inStock ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"}`}>
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}