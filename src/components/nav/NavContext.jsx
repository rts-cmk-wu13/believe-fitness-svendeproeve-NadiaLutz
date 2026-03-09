"use client"

import { createContext, useContext, useState } from "react"
import { bfFetch } from "@/lib/api"

const NavContext = createContext(null)

export function NavProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState(null)

  const isLoggedIn = !!token

  function toggle() { setIsOpen((prev) => !prev) }
  function close() { setIsOpen(false) }

  async function login(username, password) {
    const res = await bfFetch("/v1/token", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      setToken(res.data.token)
      return true
    }
    return false
  }

  function logout() {
    setToken(null)
  }

  return (
    <NavContext.Provider value={{ isOpen, toggle, close, isLoggedIn, login, logout }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  return useContext(NavContext)
}
