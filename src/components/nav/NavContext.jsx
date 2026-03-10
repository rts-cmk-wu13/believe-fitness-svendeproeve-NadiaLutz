"use client"

import { createContext, useContext, useState } from "react"
import { bfFetch } from "@/lib/api"

const NavContext = createContext(null)

export function NavProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState(null)

  const isLoggedIn = !!token
  const isAdmin = role === "admin"

  function toggle() { setIsOpen((prev) => !prev) }
  function close() { setIsOpen(false) }

  async function login(username, password) {
    const body = new URLSearchParams({ username, password })
    const res = await bfFetch("/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    if (res.ok) {
      setToken(res.data.token)
      setUserId(res.data.userId)
      setRole(res.data.role)
      return true
    }
    return false
  }

  function logout() {
    setToken(null)
    setUserId(null)
    setRole(null)
  }

  return (
    <NavContext.Provider value={{ isOpen, toggle, close, isLoggedIn, isAdmin, token, userId, login, logout }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  return useContext(NavContext)
}
