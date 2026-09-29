"use client";

import Link from "next/link";
import { getPosts } from "@/services/api";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import CoverImage from "@/components/CoverImage";
import RatingMeter from "@/components/RatingMeter";

const CATEGORIES = ["All", "Games", "Movies", "Books", "Philosophy", "Thoughts"];
const EASE = [0.2, 0.7, 0.2, 1] as const;

const readMinutes = (content?: string) =>
  Math.max(1, Math.ceil((content?.trim().split(/\s+/).length ?? 0) / 200));

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getPosts()
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.categoryName?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <MotionConfig reducedMotion="user">
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <SiteNav />

        <section
          className="page-pad"
          style={{
            position: "relative",
            padding: "96px 56px 64px",
            textAlign: "center",
            overflow: "hidden",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="hero-grid" />
          <motion.div
            style={{ position: "relative" }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p
              className="font-mono-ui"
              style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--text-tertiary)", textTransform: "uppercase", margin: "0 0 20px" }}
            >
              Personal Journal
            </p>
            <h1
              className="font-display hero-title"
              style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.01em", margin: "0 0 20px" }}
            >
              Fragments worth <span className="grad-text">keeping.</span>
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              A collection of pieces of my mind.
            </p>
          </motion.div>
        </section>

        <section
          className="page-pad"
          style={{ maxWidth: 1160, width: "100%", boxSizing: "border-box", margin: "0 auto", padding: "40px 56px 100px", flexGrow: 1 }}
        >
          <motion.div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 44 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="pill"
                data-active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="post-grid">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ aspectRatio: "4 / 3", marginBottom: 18 }} />
                  <div className="skeleton" style={{ height: 18, width: "70%", marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 12, width: "90%" }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="font-mono-ui" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
              Nothing here yet.
            </p>
          ) : (
            <motion.div layout className="post-grid">
              <AnimatePresence mode="popLayout">
                {filtered.map((post: any, i: number) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 8) * 0.06 }}
                  >
                    <Link href={`/post/${post.slug}`} className="post-card">
                      <CoverImage src={post.coverImageUrl} alt={post.title}>
                        <div className="cover-shade" />
                        <span
                          className="font-mono-ui"
                          style={{ position: "absolute", top: 12, left: 14, fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="category-tag" style={{ position: "absolute", bottom: 12, left: 12 }}>
                          {post.categoryName}
                        </span>
                      </CoverImage>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <h2
                          className="font-display post-title"
                          style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.35 }}
                        >
                          {post.title}
                        </h2>
                        <span className="post-arrow" aria-hidden>
                          →
                        </span>
                      </div>
                      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>
                        {post.content?.substring(0, 110)}...
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="font-mono-ui" style={{ fontSize: 11.5, color: "var(--text-quiet)" }}>
                          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}
                          {readMinutes(post.content)} min
                        </span>
                        {post.rating && <RatingMeter rating={post.rating} />}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        <footer
          className="page-pad"
          style={{
            maxWidth: 1160,
            width: "100%",
            boxSizing: "border-box",
            margin: "0 auto",
            padding: "28px 56px 40px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className="font-mono-ui" style={{ fontSize: 11, color: "var(--text-quiet)" }}>
            © 2026 Diego Sebastian
          </span>
          <span className="font-mono-ui" style={{ fontSize: 11, color: "var(--text-quiet)" }}>
            Next.js × ASP.NET Core
          </span>
        </footer>
      </main>
    </MotionConfig>
  );
}
