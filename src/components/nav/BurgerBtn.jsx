"use client"

import { HiOutlineMenuAlt3 } from "react-icons/hi"
import { useNav } from "./NavContext"
import styles from "./BurgerBtn.module.scss"

export default function BurgerBtn() {
  const { toggle } = useNav()

  return (
    <button className={styles.burgerBtn} onClick={toggle} aria-label="Open menu">
      <HiOutlineMenuAlt3 size={32} strokeWidth={2}/>
    </button>
  )
}
