"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { bfFetch } from "@/lib/api"
import { useNav } from "@/components/nav/NavContext"
import PageHeader from "@/components/PageHeader"
import { FaStar } from "react-icons/fa"
import styles from "./classDetail.module.scss"

function getAverage(ratings) {
  if (!ratings.length) return 0
  return Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length)
}

export default function ClassDetailPage() {
  const { id } = useParams()
const { isLoggedIn, isAdmin, token, userId } = useNav()
  const [cls, setCls] = useState(null)
  const [ratings, setRatings] = useState([])
  const [trainerAsset, setTrainerAsset] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [userClasses, setUserClasses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    bfFetch(`/api/v1/classes/${id}`).then((res) => {
      if (res.ok) {
        setCls(res.data)
        if (userId) {
          const users = res.data?.users ?? []
          setEnrolled(users.some((u) => String(u.id) === String(userId)))
        }
        const trainerId = res.data?.trainer?.id
        if (trainerId) {
          bfFetch(`/api/v1/trainers/${trainerId}`).then((r) => {
            if (r.ok) setTrainerAsset(r.data?.asset?.url ?? null)
          })
        }
      }
    })

    bfFetch(`/api/v1/classes/${id}/ratings`).then((res) => {
      if (res.ok) setRatings(Array.isArray(res.data) ? res.data : [])
    })

    if (userId) {
      bfFetch(`/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.ok) {
          const enrolled = res.data?.Classes ?? res.data?.classes ?? []
          setUserClasses(enrolled)
        }
      })
    }
  }, [id, userId])

  async function handleJoin() {
    setLoading(true)
    const res = await bfFetch(`/api/v1/users/${userId}/classes/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
    if (res.ok) setEnrolled(true)
    setLoading(false)
  }

  async function handleLeave() {
    setLoading(true)
    const res = await bfFetch(`/api/v1/users/${userId}/classes/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
    if (res.ok) setEnrolled(false)
    setLoading(false)
  }

  if (!cls) return <main className={styles.page}><div className={styles.hero}><PageHeader showBack light /></div></main>


  const participants = cls.users ?? []
  const isFull = cls.maxParticipants != null && participants.length >= cls.maxParticipants
  const sameDayConflict = !enrolled && userClasses.some(
    (c) => c.classDay === cls.classDay && String(c.id) !== String(id)
  )

  let joinBtn = null
  if (isLoggedIn && !isAdmin) {
    if (enrolled) {
      joinBtn = <button className={styles.btn} onClick={handleLeave} disabled={loading}>Leave class</button>
    } else if (isFull) {
      joinBtn = <button className={styles.btn} disabled>Class is full</button>
    } else if (sameDayConflict) {
      joinBtn = <button className={styles.btn} disabled>Already have a class this day</button>
    } else {
      joinBtn = <button className={styles.btn} onClick={handleJoin} disabled={loading}>Sign up</button>
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <PageHeader showBack light />
        <img className={styles.heroImage} src={cls.asset?.url} alt={cls.className} />
        <div className={styles.heroOverlay}>
          <h2 className={styles.className}>{cls.className}</h2>
          {getAverage(ratings) > 0 && (
            <div className={styles.rating}>
              {Array.from({ length: getAverage(ratings) }, (_, i) => <FaStar key={i} />)}
              <span className={styles.ratingText}>{getAverage(ratings)}/5</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.schedule}>{cls.classDay} - {cls.classTime}</p>
        <p className={styles.description}>{cls.classDescription}</p>

        <div className={styles.trainerSection}>
          <h3 className={styles.trainerLabel}>Trainer</h3>
          <div className={styles.trainerInfo}>
            {trainerAsset && (
              <img className={styles.trainerImage} src={trainerAsset} alt={cls.trainer?.trainerName} />
            )}
            <span className={styles.trainerName}>{cls.trainer?.trainerName}</span>
          </div>
        </div>

        {joinBtn}
      </div>
    </main>
  )
}
