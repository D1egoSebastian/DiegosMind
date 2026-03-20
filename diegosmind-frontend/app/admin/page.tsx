"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, deletePost } from "@/services/api";
import Link from "next/link";

export default function AdminPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        router.push("/login");
        return;
        }
        getPosts().then((res) => res.json()).then((data) => setPosts(data));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("¿Seguro que quieres eliminar este post?")) return;
        await deletePost(id);
        setPosts(posts.filter((p) => p.id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <main style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e8e8e8", fontFamily: "sans-serif" }}>

        {/* Nav */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderBottom: "0.5px solid #2a2a2a" }}>
            <Link href="/" style={{ fontSize: 15, fontWeight: 500, color: "#fff", textDecoration: "none" }}>Diego's Mind</Link>
            <div style={{ display: "flex", gap: 12 }}>
            <Link href="/admin/new">
                <button style={{ background: "#a78bfa", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                + Nuevo Post
                </button>
            </Link>
            <button
                onClick={handleLogout}
                style={{ background: "transparent", border: "0.5px solid #2a2a2a", borderRadius: 8, padding: "8px 16px", color: "#888", fontSize: 13, cursor: "pointer" }}
            >
                Cerrar sesión
            </button>
            </div>
        </nav>

        {/* Content */}
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 500, color: "#fff", marginBottom: 32 }}>Panel de Admin</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1a1a1a" }}>
            {posts.map((post) => (
                <div key={post.id} style={{ background: "#0a0a0a", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", margin: "0 0 4px" }}>{post.title}</p>
                    <p style={{ fontSize: 12, color: "#555", margin: 0 }}>
                    {post.categoryName} · {post.published ? "Publicado" : "Borrador"}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/admin/edit/${post.id}`}>
                    <button style={{ background: "transparent", border: "0.5px solid #2a2a2a", borderRadius: 6, padding: "6px 12px", color: "#888", fontSize: 12, cursor: "pointer" }}>
                        Editar
                    </button>
                    </Link>
                    <button
                    onClick={() => handleDelete(post.id)}
                    style={{ background: "transparent", border: "0.5px solid #3a1a1a", borderRadius: 6, padding: "6px 12px", color: "#f87171", fontSize: 12, cursor: "pointer" }}
                    >
                    Eliminar
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
        </main>
    );
}