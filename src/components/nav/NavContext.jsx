"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { bfFetch } from "@/lib/api"

const NavContext = createContext(null)

export function NavProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    setToken(localStorage.getItem("token"))
    setUserId(localStorage.getItem("userId"))
    setRole(localStorage.getItem("role"))
  }, [])

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
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data.userId)
      localStorage.setItem("role", res.data.role)
      return true
    }
    return false
  }

  function logout() {
    setToken(null)
    setUserId(null)
    setRole(null)
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    localStorage.removeItem("displayName")
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
