"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Hero from "@/components/landing/Hero"
import News from "@/components/landing/News"
import Testimonials from "@/components/landing/Testimonials"
import NewsletterForm from "@/components/landing/NewsletterForm"
import ContactForm from "@/components/landing/ContactForm"
import Footer from "@/components/landing/Footer"
import styles from "./landing.module.scss"

export default function LandingPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem("splashSeen")) {
      router.replace("/splash")
    } else {
      setReady(true)
    }
  }, [])

  if (!ready) return null

  return (
    <div className={styles.landing}>
      <Hero />
      <News />
      <NewsletterForm />
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  )
}
