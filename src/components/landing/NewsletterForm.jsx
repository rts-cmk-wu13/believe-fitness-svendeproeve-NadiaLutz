"use client"

import { useActionState } from "react"
import { newsletterAction } from "@/app/(public)/actions"
import styles from "./NewsletterForm.module.scss"

export default function NewsletterForm() {
  const [state, action, isPending] = useActionState(newsletterAction, null)

  if (state?.success) {
    return (
      <section className={styles.newsletter}>
        <p className={styles.newsletterMessage}>Thanks! You are now subscribed to our newsletter.</p>
      </section>
    )
  }

  return (
    <section className={styles.newsletter}>
      <h2 className={styles.newsletterTitle}>Sign up for our newsletter</h2>
      <p className={styles.newsletterText}>
       Sign up to receive the latest news and announcements from Believe Fitness
      </p>
      <form className={styles.newsletterForm} action={action} noValidate>
        <input
          className={styles.newsletterInput}
          type="email"
          name="email"
          placeholder="Enter your email..."
          autoComplete="email"
        />
        <button className={styles.newsletterBtn} type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Sign up"}
        </button>
      </form>
      {state?.errors?.email && (
        <p role="alert" className={styles.newsletterError}>{state.errors.email[0]}</p>
      )}
    </section>
  )
}
