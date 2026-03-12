"use client"

import { useRouter } from "next/navigation"
import { IoArrowBack } from "react-icons/io5"
import BurgerBtn from "@/components/nav/BurgerBtn"
import styles from "./PageHeader.module.scss"

export default function PageHeader({ title, showBack, onBack, light }) {
  const router = useRouter()

  return (
    <header className={`${styles.header} ${light ? styles.light : ""}`}>
      <div className={styles.left}>
        {(showBack || onBack) ? (
          <button className={styles.backBtn} onClick={onBack ?? (() => router.back())}>
            <IoArrowBack />
          </button>
        ) : null}
        {title && <h1 className={styles.title}>{title}</h1>}
      </div>
      <BurgerBtn />
    </header>
  )
}
