"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getApiBase } from "@/lib/api-url"

const API = getApiBase()

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
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    let res: Response
    try {
      res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      })
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Backend request timed out. Please ensure the server is running.")
      }
      throw new Error("Cannot reach the backend. Please ensure the server is running.")
    } finally {
      clearTimeout(timeout)
    }
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Login failed")
    localStorage.setItem("fb:user", JSON.stringify(data))
    setUser(data)
  }

  async function register(name: string, email: string, password: string, phone: string) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    let res: Response
    try {
      res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
        signal: controller.signal,
      })
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Backend request timed out. Please ensure the server is running.")
      }
      throw new Error("Cannot reach the backend. Please ensure the server is running.")
    } finally {
      clearTimeout(timeout)
    }
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