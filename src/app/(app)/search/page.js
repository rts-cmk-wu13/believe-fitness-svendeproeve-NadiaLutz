"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { bfFetch } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import { FaStar } from "react-icons/fa"
import { FiSearch } from "react-icons/fi"
import styles from "./search.module.scss"

function getAverage(ratings) {
  if (!ratings?.length) return 0
  return Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length)
}

function Stars({ count }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: count }, (_, i) => <FaStar key={i} />)}
    </div>
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [classes, setClasses] = useState([])
  const [trainers, setTrainers] = useState([])
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    bfFetch("/api/v1/classes").then(async (res) => {
      if (res.ok) {
        const data = res.data?.data ?? res.data ?? []
        setClasses(data)
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

    bfFetch("/api/v1/trainers").then((res) => {
      if (res.ok) setTrainers(Array.isArray(res.data) ? res.data : [])
    })
  }, [])

  const q = query.trim().toLowerCase()
  const filteredClasses = q ? classes.filter((c) => c.className?.toLowerCase().includes(q)) : classes
  const filteredTrainers = q ? trainers.filter((t) => t.trainerName?.toLowerCase().includes(q)) : trainers

  return (
    <main className={styles.page}>
      <PageHeader title="Search" showBack />

      <div className={styles.searchBar}>
        <FiSearch className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search classes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {(!q || filteredClasses.length > 0) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Popular classes</h2>
          <div className={styles.classRow}>
            {filteredClasses.map((cls) => (
              <Link key={cls.id} href={`/classes/${cls.id}`} className={styles.classCard}>
                <img src={cls.asset?.url} alt={cls.className} className={styles.classImg} />
                <div className={styles.classLabel}>
                  <p className={styles.className}>{cls.className}</p>
                  <Stars count={getAverage(ratings[cls.id])} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(!q || filteredTrainers.length > 0) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Popular Trainers</h2>
          <div className={styles.trainerList}>
            {filteredTrainers.map((trainer) => (
              <div key={trainer.id} className={styles.trainerRow}>
                {trainer.asset?.url ? (
                  <img src={trainer.asset.url} alt={trainer.trainerName} className={styles.trainerImg} />
                ) : (
                  <div className={styles.trainerImgPlaceholder} />
                )}
                <span className={styles.trainerName}>{trainer.trainerName}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
