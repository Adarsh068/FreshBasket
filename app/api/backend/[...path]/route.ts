import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

async function proxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params
    const url = new URL(`/api/${path.join("/")}`, BACKEND_URL)
    url.search = req.nextUrl.search

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    let response: Response
    try {
      response = await fetch(url, {
        method: req.method,
        headers: {
          "Content-Type": req.headers.get("content-type") || "application/json",
          Authorization: req.headers.get("authorization") || "",
        },
        body: ["GET", "HEAD"].includes(req.method)
          ? undefined
          : await req.text(),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    const contentType = response.headers.get("content-type") || "application/json"
    const body = await response.text()
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": contentType },
    })
  } catch (error) {
    const message = error instanceof Error ? error.name === "AbortError"
      ? "Backend request timed out"
      : "Cannot reach the backend"
      : "Cannot reach the backend"
    return NextResponse.json({ message }, { status: 502 })
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context)
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context)
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context)
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context)
}
