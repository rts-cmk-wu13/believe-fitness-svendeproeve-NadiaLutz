"use client"

import { useRouter } from "next/navigation"
import { IoArrowBack } from "react-icons/io5"
import BurgerBtn from "@/components/nav/BurgerBtn"
import styles from "./PageHeader.module.scss"

export default function PageHeader({ title, showBack, light }) {
  const router = useRouter()

  return (
    <header className={`${styles.header} ${light ? styles.light : ""}`}>
      {showBack ? (
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <IoArrowBack />
        </button>
      ) : null}
      {title && <h1 className={styles.title}>{title}</h1>}
      <BurgerBtn />
    </header>
  )
}
