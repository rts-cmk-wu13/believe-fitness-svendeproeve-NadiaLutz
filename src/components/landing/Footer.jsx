import styles from "./Footer.module.scss"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.name}>Believe Fitness</h2>
      <p className={styles.tagline}>Train like a pro</p>
      <p className={styles.info}>Rabalderstræde 48 · 4000 Roskilde</p>
      <p className={styles.info}>hello@believe-fitness.com</p>
    </footer>
  )
}
