import styles from "./Brand.module.scss"

export default function Brand({ className }) {
  return (
    <div className={`${styles.brand} ${className}`}>
      <h1 className={styles.brandName}>Believe Fitness</h1>
      <p className={styles.brandTagline}>Train like a pro</p>
    </div>
  )
}
