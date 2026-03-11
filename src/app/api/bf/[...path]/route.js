import { NextResponse } from "next/server"

const API_BASE = process.env.API_URL

async function handler(request, { params }) {
  const { path } = await params
  const url = `${API_BASE}/${path.join("/")}`
  const contentType = request.headers.get("content-type") || "application/json"
  const authorization = request.headers.get("authorization")
  const isMultipart = contentType.includes("multipart/form-data")
  const noBody = ["GET", "HEAD", "DELETE"].includes(request.method)
  const body = noBody
    ? undefined
    : isMultipart ? await request.arrayBuffer() : await request.text()

  const res = await fetch(url, {
    method: request.method,
    headers: {
      ...(!noBody && { "Content-Type": contentType }),
      ...(authorization && { Authorization: authorization }),
    },
    body,
  })
  if (res.status === 204) return new NextResponse(null, { status: 204 })
  const data = await res.json().catch(() => null)
  return NextResponse.json(data, { status: res.status })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
