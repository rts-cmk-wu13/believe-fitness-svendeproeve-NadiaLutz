"use client"

import Link from "next/link"
import { useNav } from "./NavContext"
import styles from "./Nav.module.scss"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/classes", label: "Popular classes" },
  { href: "/search", label: "Search" },
]

export default function Nav() {
  const { isOpen, close, isLoggedIn, logout } = useNav()

  if (!isOpen) return null

  return (
    <div className={styles.nav}>
      <button className={styles.navClose} onClick={close} aria-label="Close menu">✕</button>
      <nav>
        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link className={styles.navLink} href={link.href} onClick={close}>
                {link.label}
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <Link className={styles.navLink} href="/profile" onClick={close}>
                My profile
              </Link>
            </li>
          )}
          <li>
            {isLoggedIn ? (
              <button className={styles.navLink} onClick={() => { logout(); close() }}>
                Log Out
              </button>
            ) : (
              <Link className={styles.navLink} href="/login" onClick={close}>
                Log In
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}
