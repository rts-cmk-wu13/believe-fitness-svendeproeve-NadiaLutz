"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useNav } from "./NavContext"
import styles from "./Nav.module.scss"

export default function Nav() {
  const router = useRouter()
  const { isOpen, close, isLoggedIn, logout } = useNav()

  if (!isOpen) return null

  return (
    <div className={styles.nav}>
      <button className={styles.navClose} onClick={close}>✕</button>
      <nav>
        <ul className={styles.navList}>
          <li><Link className={styles.navLink} href="/" onClick={close}>Home</Link></li>
          <li><Link className={styles.navLink} href="/classes" onClick={close}>Popular classes</Link></li>
          <li><Link className={styles.navLink} href="/search" onClick={close}>Search</Link></li>
          {isLoggedIn && (
            <li><Link className={styles.navLink} href="/profile" onClick={close}>My profile</Link></li>
          )}
          <li>
            {isLoggedIn ? (
              <button className={styles.navLink} onClick={() => { logout(); close(); router.push("/") }}>Log Out</button>
            ) : (
              <Link className={styles.navLink} href="/login" onClick={close}>Log In</Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}
