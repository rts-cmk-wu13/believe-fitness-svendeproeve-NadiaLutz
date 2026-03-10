"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useNav } from "@/components/nav/NavContext"
import { signupSchema } from "@/lib/schemas"
import { bfFetch } from "@/lib/api"
import Brand from "@/components/Brand"
import BurgerBtn from "@/components/nav/BurgerBtn"
import styles from "./signup.module.scss"

export default function SignupPage() {
  const { login } = useNav()
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.target))
    const result = signupSchema.safeParse(formData)

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setErrors({})
    setServerError(null)
    setIsPending(true)

    const { name, email, password } = result.data
    const res = await bfFetch("/v1/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      setIsPending(false)
      setServerError("Something went wrong. Please try again.")
      return
    }

    await login(email, password)
    router.push("/")
  }

  return (
    <main className={styles.page}>
      <BurgerBtn className={styles.burgerBtn} />
      <Brand className={styles.brand} />
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.heading}>Sign up as a new user</h2>

        <div className={styles.field}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Enter your name..."
            autoComplete="name"
          />
          {errors.name && (
            <p role="alert" className={styles.error}>{errors.name[0]}</p>
          )}
        </div>

        <div className={styles.field}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Enter your email..."
            autoComplete="email"
          />
          {errors.email && (
            <p role="alert" className={styles.error}>{errors.email[0]}</p>
          )}
        </div>

        <div className={styles.field}>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Enter your password..."
            autoComplete="new-password"
          />
          {errors.password && (
            <p role="alert" className={styles.error}>{errors.password[0]}</p>
          )}
        </div>

        <div className={styles.field}>
          <input
            className={styles.input}
            type="password"
            name="repeatPassword"
            placeholder="Repeat your password..."
            autoComplete="new-password"
          />
          {errors.repeatPassword && (
            <p role="alert" className={styles.error}>{errors.repeatPassword[0]}</p>
          )}
        </div>

        {serverError && (
          <p role="alert" className={styles.error}>{serverError}</p>
        )}

        <button className={styles.btn} type="submit" disabled={isPending}>
          {isPending ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </main>
  )
}
