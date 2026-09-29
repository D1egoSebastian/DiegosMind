"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost, getCategories, uploadImage } from "@/services/api";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CoverImage from "@/components/CoverImage";

export default function NewPostPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [published, setPublished] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        getCategories().then((res) => res.json()).then((data) => setCategories(data));
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setCoverImageUrl("");
    };

    const handleSubmit = async () => {
        if (!title || !content || !categoryId) {
            setError("Título, contenido y categoría son obligatorios");
            return;
        }

        let finalImageUrl = coverImageUrl;

        if (imageFile) {
        setUploading(true);
        console.log("Subiendo imagen...", imageFile.name); // agrega esto
        const res = await uploadImage(imageFile);
        console.log("Upload status:", res.status); // agrega esto
        if (res.ok) {
            const data = await res.json();
            finalImageUrl = data.url;
        } else {
            const errorData = await res.text(); // agrega esto
            console.log("Upload error:", errorData); // agrega esto
            setError("Error al subir la imagen");
            setUploading(false);
            return;
        }
        setUploading(false);
        }

        const res = await createPost({
            title, content,
            rating: rating ? parseInt(rating) : null,
            coverImageUrl: finalImageUrl,
            categoryId: parseInt(categoryId),
            published,
            tagIds: []
        });

        if (res.ok) { router.push("/admin"); }
        else { setError("Error al crear el post"); }
    };

    return (
        <main style={{ minHeight: "100vh" }}>
            <SiteNav />

            <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
                <Link href="/admin" className="back-link" style={{ marginBottom: 32 }}>← Volver al admin</Link>
                <h1 className="font-display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 32px" }}>Nuevo Post</h1>

                {error && <p style={{ fontSize: 13, color: "#f87171", marginBottom: 16 }}>{error}</p>}

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="field" />

                    <textarea
                        placeholder="Contenido" value={content} onChange={(e) => setContent(e.target.value)} rows={10}
                        className="field" style={{ resize: "none" }}
                    />

                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field">
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <input
                        placeholder="Rating (1-10, opcional)"
                        value={rating} onChange={(e) => setRating(e.target.value)}
                        type="number" min="1" max="10" className="field"
                    />

                    {/* Preview: recortada igual que en la web, cualquier tamaño funciona */}
                    {(imagePreview || coverImageUrl) && (
                        <CoverImage src={imagePreview || coverImageUrl} alt="preview" aspectRatio="16 / 9" />
                    )}

                    {/* Upload desde PC */}
                    <label style={{ display: "block", cursor: "pointer" }}>
                        <div className="field" style={{ cursor: "pointer", color: imageFile ? "var(--text-primary)" : "var(--text-tertiary)", textAlign: "center" }}>
                            {imageFile ? imageFile.name : "📁 Seleccionar imagen desde tu PC"}
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                    </label>

                    {/* O URL manual */}
                    <input
                        placeholder="O pega una URL de imagen"
                        value={coverImageUrl}
                        onChange={(e) => { setCoverImageUrl(e.target.value); setImageFile(null); setImagePreview(""); }}
                        className="field"
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
                        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Publicar ahora</span>
                    </label>

                    <button
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="btn"
                        style={{ padding: 12, fontSize: 14, marginTop: 8 }}
                    >
                        {uploading ? "Subiendo imagen..." : "Crear Post"}
                    </button>
                </div>
            </div>
        </main>
    );
}