"use client";

import Link from "next/link";
import { getPosts } from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: rating / 2 >= star ? "#a78bfa" : "#2a2a2a", fontSize: 14 }}>★</span>
      ))}
      <span style={{ fontSize: 12, color: "#555", marginLeft: 4 }}>{rating}/10</span>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Games", "Movies", "Books", "Philosophy", "Thoughts"];

  useEffect(() => {
    getPosts().then((res) => res.json()).then((data) => setPosts(data));
  }, []);

  const filtered = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.categoryName?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <main style={{ background: "#0d0d0f", minHeight: "100vh", color: "#e8e8e8", fontFamily: "sans-serif" }}>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #1e1e1e" }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>Diego's Mind</span>
        <div style={{ display: "flex", gap: 28 }}>
          <Link href="/" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>Journal</Link>
          <Link href="/about" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>About</Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ padding: "72px 40px 56px", textAlign: "center", borderBottom: "0.5px solid #1e1e1e" }}
      >
        <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 16px" }}>Personal Journal</p>
        <h1 style={{ fontSize: 64, fontWeight: 500, color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>
          Diego's <span style={{ color: "#a78bfa", fontStyle: "italic" }}>Mind</span>
        </h1>
        <p style={{ fontSize: 15, color: "#555", margin: "0 auto", maxWidth: 480, lineHeight: 1.7 }}>
          Reviews, reflections, and raw thoughts on games, films, books, and the human condition.
        </p>
      </motion.div>

      {/* Posts */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 40px" }}>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ display: "flex", gap: 8, marginBottom: 48, flexWrap: "wrap" }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em",
                padding: "6px 14px", borderRadius: 20, border: "0.5px solid",
                borderColor: activeCategory === cat ? "#a78bfa" : "#2a2a2a",
                color: activeCategory === cat ? "#0d0d0f" : "#555",
                background: activeCategory === cat ? "#a78bfa" : "transparent",
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px 32px" }}>
          {filtered.map((post: any, i: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Link href={`/post/${post.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>

                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: "100%", height: 220, borderRadius: 8, overflow: "hidden", marginBottom: 16, background: "#1a1a1a" }}
                >
                  {post.coverImageUrl ? (
                    <img src={post.coverImageUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#111" }} />
                  )}
                </motion.div>

                {/* Badge + read time */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em",
                    padding: "3px 10px", borderRadius: 20,
                    background: "rgba(167, 139, 250, 0.15)", color: "#a78bfa",
                    border: "0.5px solid rgba(167, 139, 250, 0.3)"
                  }}>
                    {post.categoryName}
                  </span>
                  <span style={{ fontSize: 12, color: "#444" }}>5 min</span>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: 18, fontWeight: 500, color: "#e8e8e8", margin: "0 0 10px", lineHeight: 1.4 }}>
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: "0 0 14px", flex: 1 }}>
                  {post.content?.substring(0, 110)}...
                </p>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#333" }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {post.rating && <StarRating rating={post.rating} />}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "32px 40px", borderTop: "0.5px solid #1a1a1a", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#2a2a2a" }}>© 2026 Diego Sebastian</span>
        <span style={{ fontSize: 12, color: "#2a2a2a" }}>Built with Next.js + ASP.NET Core</span>
      </div>
    </main>
  );
}