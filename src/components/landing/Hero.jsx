"use client"

import Link from "next/link"
import BurgerBtn from "@/components/nav/BurgerBtn"
import { useNav } from "@/components/nav/NavContext"
import styles from "./Hero.module.scss"

export default function Hero() {
  const { isLoggedIn, logout } = useNav()

  return (
    <section className={styles.hero}>
      <div className={styles.heroBurger}>
        <BurgerBtn />
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroHeading}>Welcome to<br />Believe Fitness</h1>
        <div className={styles.heroActions}>
          <Link className={styles.heroBtn} href="/classes">Classes</Link>
          {isLoggedIn ? (
            <button className={`${styles.heroBtn} ${styles.heroBtnOutline}`} onClick={logout}>Log out</button>
          ) : (
            <Link className={`${styles.heroBtn} ${styles.heroBtnOutline}`} href="/login">Log In</Link>
          )}
        </div>
      </div>
    </section>
  )
}
