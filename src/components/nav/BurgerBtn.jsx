"use client"

import { HiOutlineMenuAlt3 } from "react-icons/hi"
import { useNav } from "./NavContext"
import styles from "./BurgerBtn.module.scss"

export default function BurgerBtn({ className }) {
  const { toggle } = useNav()

  return (
    <button className={`${styles.burgerBtn}${className ? ` ${className}` : ""}`} onClick={toggle} aria-label="Open menu">
      <HiOutlineMenuAlt3 size={33} strokeWidth={2.5}/>
    </button>
  )
}
