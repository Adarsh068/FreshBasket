"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Leaf, Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type Tab = "login" | "signup"

export function LoginForm() {
  const router = useRouter()
  const { login, register } = useAuth()
  const [tab, setTab] = useState<Tab>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !password) return setError("Email and password required.")
    if (tab === "signup" && !name.trim()) return setError("Name required.")
    if (tab === "signup" && !phone.trim()) return setError("Phone number required.")
    if (tab === "signup" && phone.length < 10) return setError("Enter valid 10-digit phone number.")
    if (password.length < 6) return setError("Password must be at least 6 characters.")
    setLoading(true)
    try {
      if (tab === "login") {
        await login(email, password)
      } else {
        await register(name.trim(), email, password, phone.trim())
      }
      router.push("/profile")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-md border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Leaf className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold">Welcome to FreshBasket</h1>
        <p className="text-sm text-muted-foreground">Fresh produce, delivered to your door</p>
      </div>

      <div className="mb-5 flex rounded-md border border-border overflow-hidden">
        <button type="button" onClick={() => { setTab("login"); setError(null) }}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === "login" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted"}`}>
          Login
        </button>
        <button type="button" onClick={() => { setTab("signup"); setError(null) }}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === "signup" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted"}`}>
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "signup" && (
          <>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium">Full Name</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
            </label>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium">Phone Number 📱</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
            </label>
          </>
        )}

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-medium">Email Address</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-medium">Password</span>
          <div className="relative">
            <input type={showPass ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === "signup" ? "Min. 6 characters" : "Your password"}
              className="h-11 w-full rounded-md border border-border bg-background px-3 pr-10 text-sm outline-none focus:border-primary" />
            <button type="button" onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {tab === "login" ? "Login" : "Create Account"}
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          By continuing you agree to our{" "}
          <Link href="/" className="text-primary hover:underline">Terms</Link>{" & "}
          <Link href="/" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  )
}