import BurgerBtn from "@/components/nav/BurgerBtn"
import styles from "./PageHeader.module.scss"

export default function PageHeader({ title }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <BurgerBtn />
    </header>
  )
}
