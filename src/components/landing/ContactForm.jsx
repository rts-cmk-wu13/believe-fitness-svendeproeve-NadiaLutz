"use client"

import { useActionState } from "react"
import { contactAction } from "@/app/(public)/actions"
import styles from "./ContactForm.module.scss"

export default function ContactForm() {
  const [state, action, isPending] = useActionState(contactAction, null)

  if (state?.success) {
    return (
      <section className={styles.contact}>
        <p className={styles.contactMessage}>Thanks for your message! <br />We will get back to you as soon as possible.</p>
      </section>
    )
  }

  return (
    <section className={styles.contact}>
      <h2 className={styles.contactTitle}>Contact us</h2>
      <p className={styles.contactSubtitle}>Ask us anything about Believe Fitness!</p>
      <form className={styles.contactForm} action={action} noValidate>
        <div className={styles.contactField}>
          <input
            className={styles.contactInput}
            type="text"
            name="name"
            placeholder="Enter your name..."
            autoComplete="name"
          />
          {state?.errors?.name && (
            <p role="alert" className={styles.contactError}>{state.errors.name[0]}</p>
          )}
        </div>
        <div className={styles.contactField}>
          <input
            className={styles.contactInput}
            type="email"
            name="email"
            placeholder="Enter your email..."
            autoComplete="email"
          />
          {state?.errors?.email && (
            <p role="alert" className={styles.contactError}>{state.errors.email[0]}</p>
          )}
        </div>
        <div className={styles.contactField}>
          <textarea
            className={styles.contactTextarea}
            name="message"
            placeholder="Enter your message..."
            rows={4}
          />
          {state?.errors?.message && (
            <p role="alert" className={styles.contactError}>{state.errors.message[0]}</p>
          )}
        </div>
        <button className={styles.contactBtn} type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send message"}
        </button>
      </form>
    </section>
  )
}
