import styles from "./Brand.module.scss"

export default function Brand() {
  return (
    <div className={styles.brand}>
      <p className={styles.brandName}>Believe Fitness</p>
      <p className={styles.brandTagline}>Train like a pro</p>
    </div>
  )
}
