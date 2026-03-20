"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePost, getCategories, getPostById } from "@/services/api";
import Link from "next/link";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [published, setPublished] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [id, setId] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        params.then(({ id }) => {
        setId(id);
        getPostById(id).then((res) => res.json()).then((post) => {
            setTitle(post.title);
            setContent(post.content);
            setRating(post.rating?.toString() ?? "");
            setCoverImageUrl(post.coverImageUrl ?? "");
            setPublished(post.published);
        });
        });

        getCategories().then((res) => res.json()).then((data) => setCategories(data));
    }, []);

    const handleSubmit = async () => {
        if (!title || !content || !categoryId) {
        setError("Título, contenido y categoría son obligatorios");
        return;
        }
        const res = await updatePost(id, {
        title, content,
        rating: rating ? parseInt(rating) : null,
        coverImageUrl,
        categoryId: parseInt(categoryId),
        published,
        tagIds: []
        });
        if (res.ok) { router.push("/admin"); }
        else { setError("Error al editar el post"); }
    };

    const inputStyle = {
        width: "100%", background: "#111", border: "0.5px solid #2a2a2a",
        borderRadius: 8, padding: "10px 14px", color: "#e8e8e8", fontSize: 14,
        boxSizing: "border-box" as const, outline: "none"
    };

    return (
        <main style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e8e8e8", fontFamily: "sans-serif" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderBottom: "0.5px solid #2a2a2a" }}>
            <Link href="/" style={{ fontSize: 15, fontWeight: 500, color: "#fff", textDecoration: "none" }}>Diego's Mind</Link>
        </nav>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
            <Link href="/admin" style={{ fontSize: 13, color: "#555", textDecoration: "none", display: "inline-block", marginBottom: 32 }}>← Volver al admin</Link>
            <h1 style={{ fontSize: 24, fontWeight: 500, color: "#fff", marginBottom: 32 }}>Editar Post</h1>

            {error && <p style={{ fontSize: 13, color: "#f87171", marginBottom: 16 }}>{error}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
            <textarea
                placeholder="Contenido" value={content} onChange={(e) => setContent(e.target.value)} rows={10}
                style={{ ...inputStyle, resize: "none" as const }}
            />
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={inputStyle}>
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            <input placeholder="Rating (1-10, opcional)" value={rating} onChange={(e) => setRating(e.target.value)} type="number" min="1" max="10" style={inputStyle} />
            <input placeholder="URL de imagen de portada (opcional)" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: 13, color: "#888" }}>Publicar</span>
            </label>
            <button
                onClick={handleSubmit}
                style={{ background: "#a78bfa", border: "none", borderRadius: 8, padding: "12px", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 8 }}
            >
                Guardar cambios
            </button>
            </div>
        </div>
        </main>
    );
}