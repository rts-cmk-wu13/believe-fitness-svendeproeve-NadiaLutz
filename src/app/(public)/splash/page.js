"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import styles from "./splash.module.scss"

const images = ["/imgs/splash.png", "/imgs/splash2.png"]

export default function SplashPage() {
  const [bg, setBg] = useState(images[0])
  const [btnVisible, setBtnVisible] = useState(false)

  useEffect(() => {
    setBg(images[Math.floor(Math.random() * images.length)])
    const timer = setTimeout(() => setBtnVisible(true), 700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.splash} style={{ backgroundImage: `url(${bg})` }}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Believe<br />Fitness
        </h1>
        <p className={styles.tagline}>Train like a pro</p>
      </div>
      <Link
        href="/"
        className={`${styles.btn} ${btnVisible ? styles.btnVisible : ""}`}
        onClick={() => sessionStorage.setItem("splashSeen", "1")}
      >
        Start Training
      </Link>
    </div>
  )
}
