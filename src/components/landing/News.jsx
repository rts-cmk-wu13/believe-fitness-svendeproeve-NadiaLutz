"use client"

import { useEffect, useState } from "react"
import { bfFetch } from "@/lib/api"
import styles from "./News.module.scss"

export default function News() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    bfFetch("/news").then((res) => {
      if (res.ok && Array.isArray(res.data)) setPosts(res.data)
    })
  }, [])

  return (
    <section className={styles.news}>
      <h2 className={styles.newsTitle}>News</h2>
      <ul className={styles.newsList}>
        {posts.map((post) => (
          <li key={post.id} className={styles.newsItem}>
            {post.image && (
              <img
                className={styles.newsImage}
                src={post.image}
                alt={post.title}
              />
            )}
            <div className={styles.newsBody}>
              <h3 className={styles.newsHeading}>{post.title}</h3>
              <p className={styles.newsExcerpt}>{post.excerpt ?? post.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
