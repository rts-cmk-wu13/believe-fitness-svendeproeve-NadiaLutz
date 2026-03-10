"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { bfFetch } from "@/lib/api"
import { useNav } from "@/components/nav/NavContext"
import PageHeader from "@/components/PageHeader"
import styles from "./profile.module.scss"

export default function ProfilePage() {
  const router = useRouter()
  const { isLoggedIn, isAdmin, token, userId } = useNav()
  const [user, setUser] = useState(null)
  const [allClasses, setAllClasses] = useState([])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    bfFetch(`/api/v1/users/${userId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) setUser(res.data)
    })

    if (isAdmin) {
      bfFetch("/api/v1/classes", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.ok) {
          const data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
          setAllClasses(data)
        }
      })
    }
  }, [isLoggedIn, isAdmin, token, userId])

  if (!isLoggedIn) return null

  return (
    <main className={styles.page}>
      <PageHeader title="My profile" />
      <p>{user?.username}</p>

      <h2>My classes</h2>
      {user?.Classes?.length ? (
        user.Classes.map((cls) => (
          <Link key={cls.id} href={`/classes/${cls.id}`}>
            {cls.className}
          </Link>
        ))
      ) : (
        <p>No classes joined yet.</p>
      )}

      {isAdmin && (
        <>
          <h2>All classes</h2>
          {allClasses.map((cls) => (
            <Link key={cls.id} href={`/classes/${cls.id}`} style={{ display: "block" }}>
              {cls.className}
            </Link>
          ))}
        </>
      )}
    </main>
  )
}
