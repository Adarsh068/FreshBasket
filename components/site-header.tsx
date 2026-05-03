"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronDown, Leaf, MapPin, Search, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export function SiteHeader() {
  const { totalQuantity, subtotal } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get("q") || "")
  const [mounted, setMounted] = useState(false)
  const [city, setCity] = useState("560001, Bengaluru")

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setQuery(params.get("q") || "") }, [params])

  const displayQuantity = mounted ? totalQuantity : 0
  const displaySubtotal = mounted ? subtotal : 0

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-3 py-3">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="FreshBasket home">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-base font-bold text-primary">FreshBasket</span>
            <span className="text-[10px] text-muted-foreground">Farm to your doorstep</span>
          </div>
        </Link>

        {/* Location - desktop only */}
        <button type="button" className="hidden shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:border-primary md:flex">
          <MapPin className="h-4 w-4 text-primary" />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[11px] text-muted-foreground">Deliver to</span>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="bg-transparent font-medium text-sm outline-none cursor-pointer">
              <option>560001, Bengaluru</option>
              <option>400001, Mumbai</option>
              <option>110001, Delhi</option>
              <option>600001, Chennai</option>
              <option>500001, Hyderabad</option>
              <option>411001, Pune</option>
              <option>380001, Ahmedabad</option>
              <option>700001, Kolkata</option>
              <option>302001, Jaipur</option>
              <option>226001, Lucknow</option>
              <option>416001, Kolhapur</option>
            </select>
          </div>
        </button>

        {/* Search */}
        <form onSubmit={onSubmit} className="relative flex-1" role="search">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for fruits, vegetables..."
            aria-label="Search products"
            className="h-10 w-full rounded-md border border-border bg-muted/40 pr-4 pl-10 text-sm outline-none focus:border-primary focus:bg-background"
          />
        </form>

        {/* Nav - desktop only */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Button asChild variant="ghost" size="sm"><Link href="/fruits">Fruits</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link href="/vegetables">Vegetables</Link></Button>
          <Button asChild variant="ghost" size="sm" className="text-primary"><Link href="/subscriptions">Subscriptions</Link></Button>
        </nav>

        {/* Login / Profile - visible on ALL screens */}
        {mounted && user ? (
          <div className="flex items-center gap-1" suppressHydrationWarning>
            {user.role === "admin" && (
              <Button asChild variant="ghost" size="sm" className="text-primary font-bold hidden sm:flex">
                <Link href="/admin">Admin</Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="sm" className="gap-1 px-2">
              <Link href="/profile">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block max-w-[60px] truncate text-sm">{user.name.split(" ")[0]}</span>
              </Link>
            </Button>
            <button onClick={() => { logout(); router.push("/") }}
              className="rounded-md p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Button asChild variant="ghost" size="sm" className="flex items-center gap-1 px-2">
            <Link href="/login">
              <User className="h-4 w-4" />
              <span className="hidden sm:block">Login</span>
            </Link>
          </Button>
        )}

        {/* Cart */}
        <Button asChild className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-3">
          <Link href="/cart" aria-label={`Basket with ${displayQuantity} items`}>
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-[10px] opacity-90">My Basket</span>
              <span className="text-xs font-semibold">
                {displayQuantity} {displayQuantity === 1 ? "item" : "items"} · ₹{displaySubtotal}
              </span>
            </span>
            <span className="ml-1 rounded-full bg-background/20 px-1.5 text-xs font-semibold sm:hidden">
              {displayQuantity}
            </span>
          </Link>
        </Button>

      </div>
    </header>
  )
}