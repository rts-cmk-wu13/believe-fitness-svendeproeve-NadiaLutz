import Hero from "@/components/landing/Hero"
import News from "@/components/landing/News"
import NewsletterForm from "@/components/landing/NewsletterForm"
import Testimonials from "@/components/landing/Testimonials"
import ContactForm from "@/components/landing/ContactForm"
import Brand from "@/components/Brand"
import styles from "./landing.module.scss"

export default function LandingPage() {
  return (
    <main className={styles.landing}>
      <Hero />
      <News />
      <NewsletterForm />
      <Testimonials />
      <ContactForm />
      <footer className={styles.landingFooter}>
        <Brand />
        <address className={styles.landingAddress}>
          <p>Rabalderstræde 48 - 4000 Roskilde</p>
          <p>hello@believe-fitness.com</p>
        </address>
      </footer>
    </main>
  )
}
