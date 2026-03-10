"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
  const router = useRouter()
  const { isLoggedIn, token, userId } = useNav()
  const [cls, setCls] = useState(null)
  const [ratings, setRatings] = useState([])
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    bfFetch(`/api/v1/classes/${id}`).then((res) => {
      if (res.ok) {
        setCls(res.data)
        if (userId) {
          const users = res.data?.Users ?? []
          setEnrolled(users.some((u) => String(u.id) === String(userId)))
        }
      }
    })

    bfFetch(`/api/v1/classes/${id}/ratings`).then((res) => {
      if (res.ok) setRatings(Array.isArray(res.data) ? res.data : [])
    })
  }, [id, userId])

  async function handleJoin() {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
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

  if (!cls) return <main className={styles.page}><PageHeader title="" /></main>

  return (
    <main className={styles.page}>
      <PageHeader title={cls.className} />
      <img src={cls.asset?.url} alt={cls.className} />
      <p>{Array.from({ length: getAverage(ratings) }, (_, i) => <FaStar key={i} />)}</p>
      <p>{cls.classDay}</p>
      <p>{cls.classTime}</p>
      <p>{cls.classDescription}</p>
      <p>{cls.Trainer?.name}</p>
      {enrolled ? (
        <button onClick={handleLeave} disabled={loading}>Leave class</button>
      ) : (
        <button onClick={handleJoin} disabled={loading}>
          {isLoggedIn ? "Sign up" : "Log in to join"}
        </button>
      )}
    </main>
  )
}
