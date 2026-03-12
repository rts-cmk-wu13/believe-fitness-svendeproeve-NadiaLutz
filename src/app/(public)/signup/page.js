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
    const result = signupSchema.safeParse({
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      repeatPassword: e.target.repeatPassword.value,
    })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setErrors({})
    setServerError(null)
    setIsPending(true)

    const { name, email, password } = result.data
    const res = await bfFetch("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }).toString(),
    })

    if (!res.ok) {
      setIsPending(false)
      setServerError("Something went wrong. Please try again.")
      return
    }

    await login(email, password)
    localStorage.setItem("displayName", name.trim())
    router.push("/")
  }

  return (
    <main className={styles.page}>
      <BurgerBtn className={styles.burgerBtn} />
      <Brand className={styles.brand} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Sign up as a new user</h2>

        <div className={styles.field}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Enter your name..."
          />
          {errors.name && <p className={styles.error}>{errors.name[0]}</p>}
        </div>

        <div className={styles.field}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Enter your email..."
          />
          {errors.email && <p className={styles.error}>{errors.email[0]}</p>}
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

        <div className={styles.field}>
          <input
            className={styles.input}
            type="password"
            name="repeatPassword"
            placeholder="Repeat your password..."
          />
          {errors.repeatPassword && <p className={styles.error}>{errors.repeatPassword[0]}</p>}
        </div>

        {serverError && <p className={styles.error}>{serverError}</p>}

        <button className={styles.btn} type="submit" disabled={isPending}>
          {isPending ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </main>
  )
}
