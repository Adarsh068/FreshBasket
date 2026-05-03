"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export type AuthUser = {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  token: string
}

type AuthCtx = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("fb:user")
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  async function login(email: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Login failed")
    localStorage.setItem("fb:user", JSON.stringify(data))
    setUser(data)
  }

  async function register(name: string, email: string, password: string, phone: string) {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Registration failed")
    localStorage.setItem("fb:user", JSON.stringify(data))
    setUser(data)
  }

  function logout() {
    localStorage.removeItem("fb:user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}