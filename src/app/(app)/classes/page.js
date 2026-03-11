"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { bfFetch } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import { FaStar } from "react-icons/fa"
import styles from "./classes.module.scss"

function getAverage(ratings) {
  if (!ratings.length) return 0
  return Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length)
}

function Stars({ count }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: count }, (_, i) => <FaStar key={i} />)}
    </div>
  )
}

export default function ClassesPage() {
  const [classes, setClasses] = useState([])
  const [featured, setFeatured] = useState(null)
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    bfFetch("/api/v1/classes").then(async (res) => {
      if (res.ok) {
        const data = res.data?.data ?? res.data ?? []
        setClasses(data)
        setFeatured(data[Math.floor(Math.random() * data.length)] ?? null)

        const ratingsResults = await Promise.all(
          data.map((cls) => bfFetch(`/api/v1/classes/${cls.id}/ratings`))
        )
        const ratingsMap = {}
        data.forEach((cls, i) => {
          ratingsMap[cls.id] = ratingsResults[i].ok ? ratingsResults[i].data ?? [] : []
        })
        setRatings(ratingsMap)
      }
    })
  }, [])

  return (
    <main className={styles.page}>
      <PageHeader title="Popular classes" />

      {featured && (
        <Link href={`/classes/${featured.id}`} className={styles.featured}>
          <img src={featured.asset.url} alt={featured.className} className={styles.featuredImg} />
          <div className={styles.featuredOverlay}>
            <h2 className={styles.featuredName}>
              {featured.className}
              <Stars count={getAverage(ratings[featured.id] ?? [])} />
            </h2>
          </div>
        </Link>
      )}

      <h2 className={styles.listTitle}>Classes for you</h2>
      <div className={styles.list}>
        {classes.map((cls) => (
          <Link key={cls.id} href={`/classes/${cls.id}`} className={styles.card}>
            <img src={cls.asset.url} alt={cls.className} className={styles.cardImg} />
            <div className={styles.cardLabel}>
              <p className={styles.cardName}>{cls.className}</p>
              <Stars count={getAverage(ratings[cls.id] ?? [])} />
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
