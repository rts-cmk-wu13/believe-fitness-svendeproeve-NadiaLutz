"use client"

import Link from "next/link"
import styles from "./Hero.module.scss"

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroHeading}>Welcome to<br />Believe Fitness</h1>
        <div className={styles.heroActions}>
          <Link className={styles.heroBtn} href="/classes">Classes</Link>
          <Link className={`${styles.heroBtn} ${styles.heroBtnOutline}`} href="/login">Log in</Link>
        </div>
      </div>
    </section>
  )
}
