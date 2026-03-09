import { API_BASE } from "./config"

export async function bfFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, status: res.status, data }
}
