"use client";

import { getPostBySlug } from "@/services/api";
import Link from "next/link";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import CoverImage from "@/components/CoverImage";
import RatingMeter from "@/components/RatingMeter";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const readMinutes = (content?: string) =>
  Math.max(1, Math.ceil((content?.trim().split(/\s+/).length ?? 0) / 200));

export default function PostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then((res) => {
      if (!res.ok) {
        setFailed(true);
        return;
      }
      res.json().then((data) => setPost(data));
    });
  }, [slug]);

  if (!post) {
    return (
      <main style={{ minHeight: "100vh" }}>
        <SiteNav />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <p className="font-mono-ui" style={{ color: "var(--text-tertiary)", fontSize: 13 }}>
            {failed ? "Post not found." : "Loading..."}
          </p>
        </div>
      </main>
    );
  }

  const paragraphs: string[] = post.content?.split("\n\n") ?? [post.content];

  return (
    <MotionConfig reducedMotion="user">
      <main style={{ minHeight: "100vh" }}>
        <motion.div
          style={{
            scaleX: progress,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            transformOrigin: "left",
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            zIndex: 60,
          }}
        />
        <SiteNav />

        <div className="page-pad" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 56px 0" }}>
          <Link href="/" className="back-link">
            ← Back to journal
          </Link>

          {post.coverImageUrl && (
            <motion.div
              style={{ position: "relative", marginTop: 28 }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {/* Ambient glow: the same image, blurred behind the frame, so any photo blends with the page */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImageUrl}
                alt=""
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -24,
                  width: "calc(100% + 48px)",
                  height: "calc(100% + 48px)",
                  objectFit: "cover",
                  filter: "blur(60px) saturate(1.3)",
                  opacity: 0.32,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <CoverImage src={post.coverImageUrl} alt={post.title} aspectRatio="21 / 9" className="post-hero-cover">
                  <div className="cover-shade" style={{ opacity: 0.6 }} />
                </CoverImage>
              </div>
            </motion.div>
          )}
        </div>

        <article className="page-pad" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 40px 100px", position: "relative", zIndex: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span className="category-tag">{post.categoryName}</span>
              <span className="font-mono-ui" style={{ fontSize: 12, color: "var(--text-quiet)" }}>
                {readMinutes(post.content)} min read
              </span>
            </div>

            <h1
              className="font-display"
              style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em", margin: "0 0 22px" }}
            >
              {post.title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
                marginBottom: 36,
                paddingBottom: 28,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span className="font-mono-ui" style={{ fontSize: 13, color: "var(--text-quiet)" }}>
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              {post.rating && <RatingMeter rating={post.rating} size="lg" />}
            </div>

            {post.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 40 }}>
                {post.tags.map((tag: string) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {paragraphs.map((p: string, i: number) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ fontSize: 17.5, color: "var(--text-secondary)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </article>
      </main>
    </MotionConfig>
  );
}
