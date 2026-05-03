"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"

export function AdminLoginView() {
  const { user, login, logout } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.role === "admin") {
      router.replace("/admin")
    }
  }, [user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (user) logout()
      await login(email, password)
      const stored = localStorage.getItem("fb:user")
      const u = stored ? JSON.parse(stored) : null
      if (u?.role !== "admin") {
        logout()
        setError("Access denied. Admin accounts only.")
        setLoading(false)
        return
      }
      router.replace("/admin")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] rounded-xl border border-border bg-card p-8 shadow-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl">
            🛡️
          </div>
          <h1 className="text-2xl font-extrabold">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">FreshBasket staff only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold">Admin Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@freshbasket.com" required
              className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold">Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
          </label>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In to Admin"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Not an admin?{" "}
          <a href="/" className="text-primary hover:underline">Go to website →</a>
        </p>
      </div>
    </div>
  )
}