export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname
    if (host === "localhost" || host === "127.0.0.1") {
      return "/api/backend"
    }
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
}
