"use client"

import { useEffect, useState } from "react"
import { bfFetch } from "@/lib/api"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import styles from "./Testimonials.module.scss"

export default function Testimonials() {
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    bfFetch("/api/v1/testimonials").then((res) => {
      if (res.ok) {
        const arr = Array.isArray(res.data) ? res.data : res.data?.data ?? []
        setItems(arr)
      }
    })
  }, [])

  function prev() {
    setIndex((i) => (i - 1 + items.length) % items.length)
  }

  function next() {
    setIndex((i) => (i + 1) % items.length)
  }

  if (items.length === 0) return null

  const current = items[index]

  return (
    <section className={styles.testimonials}>
      <h2 className={styles.testimonialsTitle}>A word from other Believers</h2>
      <p className={styles.testimonialsText}>{current.text}</p>
      <p className={styles.testimonialsName}>{current.name}</p>
      <div className={styles.testimonialsControls}>
        <button className={styles.testimonialsBtn} onClick={prev} aria-label="Previous">
          <FiChevronLeft size={30} strokeWidth={3} />
        </button>
        <button className={styles.testimonialsBtn} onClick={next} aria-label="Next">
          <FiChevronRight size={30} strokeWidth={3} />
        </button>
      </div>
    </section>
  )
}
