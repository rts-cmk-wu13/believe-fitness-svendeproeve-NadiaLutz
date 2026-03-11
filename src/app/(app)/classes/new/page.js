"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { bfFetch } from "@/lib/api"
import { useNav } from "@/components/nav/NavContext"
import PageHeader from "@/components/PageHeader"
import { createClassSchema } from "@/lib/schemas"
import styles from "./createClass.module.scss"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const TIMES = []
for (let hour = 6; hour <= 22; hour++) {
  TIMES.push(`${String(hour).padStart(2, "0")}:00`)
  TIMES.push(`${String(hour).padStart(2, "0")}:30`)
}
TIMES.push("23:00")

function CustomSelect({ name, placeholder, options, selectedClassName }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  return (
    <div className={styles.customSelect} ref={ref}>
      <input type="hidden" name={name} value={selected?.value ?? ""} />
      <button
        type="button"
        className={`${styles.input} ${styles.selectBtn} ${!selected ? styles.selectPlaceholder : (selectedClassName ?? "")}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {selected?.label ?? placeholder}
      </button>
      {open && (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.dropdownItem} ${selected?.value === option.value ? styles.dropdownItemActive : ""}`}
              onMouseDown={() => { setSelected(option); setOpen(false) }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function CreateClassPage() {
  const router = useRouter()
  const { isLoggedIn, isAdmin, token } = useNav()
  const fileRef = useRef(null)
  const [trainers, setTrainers] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      router.push("/")
      return
    }
    bfFetch("/api/v1/trainers").then((res) => {
      if (res.ok) setTrainers(Array.isArray(res.data) ? res.data : [])
    })
  }, [isLoggedIn, isAdmin])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setErrors({})

    const formData = new FormData(event.target)

    const result = createClassSchema.safeParse({
      className: formData.get("className"),
      classDescription: formData.get("classDescription"),
      classDay: formData.get("classDay"),
      classTime: formData.get("classTime"),
      trainerId: formData.get("trainerId"),
      maxParticipants: formData.get("maxParticipants"),
    })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setIsPending(true)

    let assetId = null
    if (imageFile) {
      const imageFormData = new FormData()
      imageFormData.append("file", imageFile)
      const assetResponse = await fetch("/api/bf/api/v1/assets", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: imageFormData,
      })
      const assetResponseData = await assetResponse.json().catch(() => null)
      if (!assetResponse.ok) {
        setError("Image upload failed.")
        setIsPending(false)
        return
      }
      assetId = assetResponseData?.id
    }

    const body = new URLSearchParams({
      className: formData.get("className"),
      classDescription: formData.get("classDescription"),
      classDay: formData.get("classDay"),
      classTime: formData.get("classTime"),
      maxParticipants: formData.get("maxParticipants"),
      trainerId: formData.get("trainerId"),
      ...(assetId && { assetId }),
    })

    const classResponse = await bfFetch("/api/v1/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: body.toString(),
    })

    setIsPending(false)

    if (classResponse.ok) {
      router.push("/profile")
    } else {
      setError("Could not create class. Please try again.")
    }
  }

  return (
    <main className={styles.page}>
      <PageHeader showBack />
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Create a new class</h2>

        <input className={styles.input} name="className" placeholder="Class name..." />
        {errors.className && <p className={styles.error}>{errors.className[0]}</p>}

        <textarea className={styles.textarea} name="classDescription" rows={4} placeholder="Class description..." />

        <div className={styles.row}>
          <CustomSelect name="classDay" placeholder="Class day..." options={DAYS.map((day) => ({ value: day, label: day }))} />
          <CustomSelect name="classTime" placeholder="Class time..." options={TIMES.map((time) => ({ value: time, label: time }))} selectedClassName={styles.classTime} />
        </div>
        {errors.classDay && <p className={styles.error}>{errors.classDay[0]}</p>}
        {errors.classTime && <p className={styles.error}>{errors.classTime[0]}</p>}

        <CustomSelect name="trainerId" placeholder="Class trainer..." options={trainers.map((trainer) => ({ value: String(trainer.id), label: trainer.trainerName }))} />
        {errors.trainerId && <p className={styles.error}>{errors.trainerId[0]}</p>}

        <input className={styles.input} type="number" min="1" name="maxParticipants" placeholder="Max participants in class..." />
        {errors.maxParticipants && <p className={styles.error}>{errors.maxParticipants[0]}</p>}

        <div className={styles.fileRow}>
          <span className={styles.fileLabel}>Choose an image:</span>
          <div className={styles.fileInputRow}>
            <button type="button" className={styles.fileBtn} onClick={() => fileRef.current?.click()}>
              Browse...
            </button>
            <span className={styles.fileName}>{imageFile?.name ?? "No file chosen"}</span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.hiddenFile}
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.btn} type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create class"}
        </button>
      </form>
    </main>
  )
}
