"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { bfFetch } from "@/lib/api"
import { useNav } from "@/components/nav/NavContext"
import PageHeader from "@/components/PageHeader"
import { FaUser } from "react-icons/fa6"
import { FiEdit } from "react-icons/fi"
import { AiOutlineDelete } from "react-icons/ai"
import ConfirmModal from "@/components/ConfirmModal"
import styles from "./profile.module.scss"

export default function ProfilePage() {
  const router = useRouter()
  const { isLoggedIn, isAdmin, token, userId, loaded } = useNav()
  const [user, setUser] = useState(null)
  const [classes, setClasses] = useState([])
  const [allClasses, setAllClasses] = useState([])
  const [participantsView, setParticipantsView] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    if (!loaded) return
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    bfFetch(`/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) {
        setUser(res.data)
        setClasses(res.data?.Classes ?? res.data?.classes ?? [])
      }
    })

    if (isAdmin) {
      bfFetch("/api/v1/classes", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.ok) {
          const data = res.data?.data ?? res.data ?? []
          Promise.all(
            data.map((cls) =>
              bfFetch(`/api/v1/classes/${cls.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }).then((r) => r.ok ? { ...cls, users: r.data?.users ?? [] } : { ...cls, users: [] })
            )
          ).then(setAllClasses)
        }
      })
    }
  }, [isLoggedIn, isAdmin, token, userId, loaded])

  async function handleLeave(classId) {
    const res = await bfFetch(`/api/v1/users/${userId}/classes/${classId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setClasses((prev) => prev.filter((c) => c.id !== classId))
  }

  async function handleDeleteClass(classId) {
    const res = await bfFetch(`/api/v1/classes/${classId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setAllClasses((prev) => prev.filter((c) => c.id !== classId))
    setPendingDelete(null)
  }

  if (!isLoggedIn) return null

  const fullName = user ? ((user.userFirstName ?? "") + " " + (user.userLastName ?? "")).trim() || localStorage.getItem("displayName") || user.username : ""
  const role = user?.role === "admin" ? "Instructor" : "Member"


  if (participantsView) {
    return (
      <main className={styles.page}>
        <PageHeader title="My Profile" onBack={() => setParticipantsView(null)} />
        <div className={styles.userCard}>
          <FaUser className={styles.avatar} />
          <div>
            <p className={styles.name}>{fullName}</p>
            <p className={styles.role}>{role}</p>
          </div>
        </div>
        <div className={styles.participantsPage}>
          <p className={styles.participantsClassName}>{participantsView.className}</p>
          <p className={styles.participantsLabel}>Participants:</p>
          {participantsView.users.length > 0 ? (
            participantsView.users.map((p) => (
              <div key={p.id} className={styles.participantRow}>
                <FaUser className={styles.participantIcon} />
                <span>{p.userFirstName || p.username} {p.userLastName}</span>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No participants yet.</p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <PageHeader title="My Profile" />
      {pendingDelete && (
        <ConfirmModal
          title="Delete class"
          message={`Are you sure you want to delete "${pendingDelete.className}"?`}
          onConfirm={() => handleDeleteClass(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <div className={styles.userCard}>
        <FaUser className={styles.avatar} />
        <div>
          <p className={styles.name}>{fullName}</p>
          <p className={styles.role}>{role}</p>
        </div>
      </div>

      {isAdmin ? (
        <div className={styles.classList}>
          {allClasses.length > 0 ? allClasses.map((cls) => (
            <div key={cls.id} className={styles.classCard}>
              <p className={styles.className}>{cls.className}</p>
              <p className={styles.classTime}>{cls.classDay} - {cls.classTime}</p>
              <div className={styles.classMeta}>
                <span>Max. participants: {cls.maxParticipants}</span>
                <span>Joined: {cls.users.length}</span>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.actionBtn} onClick={() => setParticipantsView(cls)}>
                  Participants
                </button>
                <div className={styles.iconActions}>
                  <Link href={`/classes/${cls.id}/edit`} className={styles.iconBtn}><FiEdit /></Link>
                  <button className={styles.iconBtn} onClick={() => setPendingDelete(cls)}><AiOutlineDelete /></button>
                </div>
              </div>
            </div>
          )) : (
            <p className={styles.empty}>No classes found.</p>
          )}
          <Link href="/classes/new" className={styles.addClassBtn}>Add class</Link>
        </div>
      ) : (
        <div className={styles.classList}>
          {classes.length ? (
            classes.map((cls) => (
              <div key={cls.id} className={styles.classCard}>
                <p className={styles.className}>{cls.className}</p>
                <p className={styles.classTime}>{cls.classDay} - {cls.classTime}</p>
                <div className={styles.cardActions}>
                  <Link href={`/classes/${cls.id}`} className={styles.actionBtn}>Show class</Link>
                  <button className={styles.actionBtn} onClick={() => handleLeave(cls.id)}>Leave</button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No classes joined yet.</p>
          )}
        </div>
      )}
    </main>
  )
}
