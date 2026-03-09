"use client"

import { useEffect, useRef, useState } from "react"
import { bfFetch } from "@/lib/api"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import styles from "./Testimonials.module.scss"

export default function Testimonials() {
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)
  const trackRef = useRef(null)

  useEffect(() => {
    bfFetch("/testimonials").then((res) => {
      if (res.ok) {
        const arr = Array.isArray(res.data) ? res.data : res.data?.data ?? []
        setItems(arr)
      }
    })
  }, [])

  function scrollTo(nextIndex) {
    const el = trackRef.current
    if (!el) return
    el.children[nextIndex]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }

  function prev() {
    const next = (index - 1 + items.length) % items.length
    setIndex(next)
    scrollTo(next)
  }

  function next() {
    const next = (index + 1) % items.length
    setIndex(next)
    scrollTo(next)
  }

  if (items.length === 0) return null

  return (
    <section className={styles.testimonials}>
      <h2 className={styles.testimonialsTitle}>A word from other Believers</h2>
      <div className={styles.testimonialsTrack} ref={trackRef}>
        {items.map((t) => (
          <article key={t.id} className={styles.testimonialsCard}>
            <p className={styles.testimonialsText}>"{t.content}"</p>
            <p className={styles.testimonialsName}>{t.name}</p>
            {t.occupation && <p className={styles.testimonialsOccupation}>{t.occupation}</p>}
          </article>
        ))}
      </div>
      <div className={styles.testimonialsControls}>
        <button className={styles.testimonialsBtn} onClick={prev} aria-label="Previous">
          <MdChevronLeft size={28} />
        </button>
        <button className={styles.testimonialsBtn} onClick={next} aria-label="Next">
          <MdChevronRight size={28} />
        </button>
      </div>
    </section>
  )
}
