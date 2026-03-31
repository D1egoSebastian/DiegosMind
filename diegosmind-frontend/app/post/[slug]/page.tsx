"use client";

import { getPostBySlug } from "@/services/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function StarRating({ rating }: { rating: number }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{ color: rating / 2 >= star ? "#a78bfa" : "#2a2a2a", fontSize: 18 }}>★</span>
        ))}
        <span style={{ fontSize: 14, color: "#555", marginLeft: 6 }}>{rating}/10</span>
        </div>
    );
}

export default function PostPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        if (slug) {
            getPostBySlug(slug).then((res) => {
                if (!res.ok) return;
                res.json().then((data) => setPost(data));
            });
        }
    }, [slug]);

    if (!post) return (
        <main style={{ background: "#0d0d0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#333", fontSize: 14 }}>Loading...</p>
        </main>
    );

    const paragraphs = post.content?.split("\n\n") ?? [post.content];

    return (
        <main style={{ background: "#0d0d0f", minHeight: "100vh", color: "#e8e8e8", fontFamily: "sans-serif" }}>

        {/* Nav */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #1e1e1e" }}>
            <Link href="/" style={{ fontSize: 16, fontWeight: 500, color: "#fff", textDecoration: "none" }}>Diego's Mind</Link>
            <div style={{ display: "flex", gap: 28 }}>
            <Link href="/" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>Journal</Link>
            <Link href="/about" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>About</Link>
            </div>
        </nav>

        {/* Cover image con gradient */}
        {post.coverImageUrl && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", width: "100%", height: "55vh" }}
            >
            <img
                src={post.coverImageUrl}
                alt={post.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, #0d0d0f 0%, rgba(13,13,15,0.4) 50%, transparent 100%)"
            }} />
            </motion.div>
        )}

        {/* Content */}
        <article style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: post.coverImageUrl ? "0 40px 80px" : "56px 40px 80px",
            marginTop: post.coverImageUrl ? "-120px" : 0,
            position: "relative",
            zIndex: 10
        }}>
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            >
            {/* Back link */}
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555", textDecoration: "none", marginBottom: 32 }}>
                ← Back to journal
            </Link>

            {/* Badge + read time */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{
                fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em",
                padding: "4px 12px", borderRadius: 20,
                background: "rgba(167, 139, 250, 0.15)", color: "#a78bfa",
                border: "0.5px solid rgba(167, 139, 250, 0.3)"
                }}>
                {post.categoryName}
                </span>
                <span style={{ fontSize: 12, color: "#444" }}>5 min read</span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 46, fontWeight: 500, color: "#fff", lineHeight: 1.2, margin: "0 0 20px" }}>
                {post.title}
            </h1>

            {/* Date + Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40, paddingBottom: 32, borderBottom: "0.5px solid #1e1e1e" }}>
                <span style={{ fontSize: 13, color: "#333", fontFamily: "monospace" }}>
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                {post.rating && <StarRating rating={post.rating} />}
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 40 }}>
                {post.tags.map((tag: string) => (
                    <span key={tag} style={{ fontSize: 12, color: "#3a3a3a", border: "0.5px solid #222", padding: "3px 10px", borderRadius: 20 }}>
                    {tag}
                    </span>
                ))}
                </div>
            )}

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {paragraphs.map((p: string, i: number) => (
                <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    style={{ fontSize: 18, color: "#888", lineHeight: 1.9, margin: 0 }}
                >
                    {p}
                </motion.p>
                ))}
            </div>

            </motion.div>
        </article>
        </main>
    );
}
