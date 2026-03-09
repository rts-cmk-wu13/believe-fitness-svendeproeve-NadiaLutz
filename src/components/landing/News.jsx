"use client"

import { useEffect, useState } from "react"
import { bfFetch } from "@/lib/api"
import styles from "./News.module.scss"

export default function News() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    bfFetch("/v1/news").then((res) => {
      if (res.ok && Array.isArray(res.data)) setPosts(res.data)
    })
  }, [])

  return (
    <section className={styles.news}>
      <h2 className={styles.newsTitle}>News</h2>
      <ul className={styles.newsList}>
        {posts.map((post) => (
          <li key={post.id} className={styles.newsItem}>
            <h3 className={styles.newsHeading}>{post.title}</h3>
            {post.asset && (
              <img
                className={styles.newsImage}
                src={post.asset.url}
                alt={post.title}
              />
            )}
            <p className={styles.newsText}>{post.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
