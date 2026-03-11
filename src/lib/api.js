export async function bfFetch(path, options = {}) {
  const res = await fetch(`/api/bf${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, status: res.status, data }
}
