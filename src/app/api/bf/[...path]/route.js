import { NextResponse } from "next/server"

const API_BASE = process.env.API_URL

async function handler(request, { params }) {
  const { path } = await params
  const url = `${API_BASE}/${path.join("/")}`
  const res = await fetch(url, {
    method: request.method,
    headers: { "Content-Type": "application/json" },
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
  })
  const data = await res.json().catch(() => null)
  return NextResponse.json(data, { status: res.status })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
