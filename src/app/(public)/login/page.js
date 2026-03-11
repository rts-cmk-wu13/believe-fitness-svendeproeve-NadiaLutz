"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useNav } from "@/components/nav/NavContext"
import { loginSchema } from "@/lib/schemas"
import Brand from "@/components/Brand"
import BurgerBtn from "@/components/nav/BurgerBtn"
import styles from "./login.module.scss"

export default function LoginPage() {
  const { login } = useNav()
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const result = loginSchema.safeParse({
      username: e.target.username.value,
      password: e.target.password.value,
    })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setErrors({})
    setServerError(null)
    setIsPending(true)

    const ok = await login(result.data.username, result.data.password)

    setIsPending(false)

    if (ok) {
      router.push("/")
    } else {
      setServerError("Invalid username or password.")
    }
  }

  return (
    <main className={styles.page}>
      <BurgerBtn className={styles.burgerBtn} />
      <Brand className={styles.brand} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Log in with your credentials</h2>

        <div className={styles.field}>
          <input
            className={styles.input}
            type="text"
            name="username"
            placeholder="Enter your email..."
          />
          {errors.username && <p className={styles.error}>{errors.username[0]}</p>}
        </div>

        <div className={styles.field}>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Enter your password..."
          />
          {errors.password && <p className={styles.error}>{errors.password[0]}</p>}
        </div>

        {serverError && <p className={styles.error}>{serverError}</p>}

        <button className={styles.btn} type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Log in"}
        </button>
        <p className={styles.formText}>Are You not yet a Believer?</p>
        <p className={styles.formText}>
          <a href="/signup" className={styles.redirectLink}>Sign up here</a>{" "}
          to start training like a pro.
        </p>
      </form>
      
    </main>
  )
}
