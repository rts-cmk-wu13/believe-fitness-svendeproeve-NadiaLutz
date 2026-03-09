export async function getSession() {
  const res = await fetch("/api/auth/session")
  const data = await res.json().catch(() => null)
  return { ok: res.ok, data }
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" })
}
