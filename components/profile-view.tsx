"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LogOut, User, ShoppingBag, Package, ChevronDown, ChevronUp, CalendarDays } from "lucide-react"

import { getApiBase } from "@/lib/api-url"
const API = getApiBase()

type OrderItem = { id: string; name: string; image: string; price: number; quantity: number; weight: string }
type Order = {
  orderId: string
  createdAt: string
  customerName: string
  status: string
  total: number
  subtotal: number
  deliveryFee: number
  payment: string
  address: string
  city: string
  pincode: string
  items: OrderItem[]
}

type Subscription = {
  subscriptionId: string
  planName: string
  category: "fruits" | "vegetables" | "combo"
  frequency: "daily" | "weekly" | "monthly"
  price: number
  customerName: string
  phone: string
  address: string
  startDate: string
  status: "active" | "paused" | "cancelled"
  createdAt: string
}

const STATUS_COLOR: Record<string, string> = {
  placed: "bg-blue-100 text-blue-700",
  "out-for-delivery": "bg-yellow-100 text-yellow-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export function ProfileView() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [expandedSubscription, setExpandedSubscription] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<"orders" | "subscriptions">("orders")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  // Fetch orders linked to user's name/email from backend
  useEffect(() => {
    if (!user) return
    setLoadingOrders(true)
    fetch(`${API}/orders/user/mine`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [user])

  useEffect(() => {
    if (!user) return
    setLoadingSubscriptions(true)
    fetch(`${API}/subscriptions/user/mine`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((data) => setSubscriptions(Array.isArray(data) ? data : []))
      .catch(() => setSubscriptions([]))
      .finally(() => setLoadingSubscriptions(false))
  }, [user])

  function handleLogout() {
    logout()
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.role === "admin" && (
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                Admin
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-red-300 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <ShoppingBag className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="text-2xl font-extrabold">{orders.length}</p>
          <p className="text-xs text-muted-foreground">Total Orders</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Package className="mx-auto mb-1 h-5 w-5 text-green-500" />
          <p className="text-2xl font-extrabold">
            {orders.filter((o) => o.status === "delivered").length}
          </p>
          <p className="text-xs text-muted-foreground">Delivered</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center col-span-2 sm:col-span-1">
          <User className="mx-auto mb-1 h-5 w-5 text-blue-500" />
          <p className="text-2xl font-extrabold">
            ₹{orders.reduce((s, o) => s + o.total, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Total Spent</p>
        </div>
      </div>

      {/* Orders / subscriptions switch */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setActiveView("orders")}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
            activeView === "orders"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          My Orders
        </button>
        <button
          type="button"
          onClick={() => setActiveView("subscriptions")}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
            activeView === "subscriptions"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          My Subscriptions
        </button>
      </div>

      {/* Orders list */}
      {activeView === "orders" && (
        <div>
          <h2 className="mb-3 text-lg font-bold">My Orders</h2>

          {loadingOrders && (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Loading orders...
            </div>
          )}

          {!loadingOrders && orders.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-semibold">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Start shopping to see your orders here.</p>
            </div>
          )}

          <div className="space-y-3">
            {orders.map((order) => (
            <div key={order.orderId} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Order header */}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-sm">#{order.orderId}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOR[order.status] || "bg-muted"}`}>
                    {order.status.replace("-", " ")}
                  </span>
                  <span className="font-bold text-sm">₹{order.total}</span>
                  {expandedOrder === order.orderId
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </button>

              {/* Expanded details */}
              {expandedOrder === order.orderId && (
                <div className="border-t border-border p-4 space-y-3">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name}
                          className="h-10 w-10 rounded-md object-cover border border-border" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.weight} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <span>Subtotal</span><span className="text-right">₹{order.subtotal}</span>
                    <span>Delivery</span><span className="text-right">₹{order.deliveryFee}</span>
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-right font-bold text-foreground">₹{order.total}</span>
                    <span>Payment</span><span className="text-right uppercase">{order.payment}</span>
                    <span>Address</span>
                    <span className="text-right">{order.address}, {order.city} - {order.pincode}</span>
                  </div>
                </div>
              )}
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions list */}
      {activeView === "subscriptions" && (
        <div>
          <h2 className="mb-3 text-lg font-bold">My Subscriptions</h2>

          {loadingSubscriptions && (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Loading subscriptions...
            </div>
          )}

          {!loadingSubscriptions && subscriptions.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-semibold">No subscriptions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Subscribe to a fresh produce plan to see it here.</p>
            </div>
          )}

          <div className="space-y-3">
            {subscriptions.map((subscription) => (
              <div key={subscription.subscriptionId} className="overflow-hidden rounded-xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSubscription(
                      expandedSubscription === subscription.subscriptionId ? null : subscription.subscriptionId,
                    )
                  }
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/30"
                >
                  <div>
                    <p className="text-sm font-semibold">#{subscription.subscriptionId}</p>
                    <p className="text-xs text-muted-foreground">{subscription.planName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        subscription.status === "active"
                          ? "bg-green-100 text-green-700"
                          : subscription.status === "paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {subscription.status}
                    </span>
                    <span className="text-sm font-bold">
                      ₹{subscription.price}/{subscription.frequency === "daily" ? "day" : subscription.frequency === "weekly" ? "week" : "month"}
                    </span>
                    {expandedSubscription === subscription.subscriptionId ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedSubscription === subscription.subscriptionId && (
                  <div className="grid grid-cols-2 gap-1 border-t border-border p-4 text-xs text-muted-foreground">
                    <span>Category</span>
                    <span className="text-right capitalize">{subscription.category}</span>
                    <span>Frequency</span>
                    <span className="text-right capitalize">{subscription.frequency}</span>
                    <span>Start date</span>
                    <span className="text-right">
                      {new Date(subscription.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>Phone</span>
                    <span className="text-right">{subscription.phone}</span>
                    <span>Address</span>
                    <span className="text-right">{subscription.address}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
