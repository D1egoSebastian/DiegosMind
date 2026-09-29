"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, deletePost } from "@/services/api";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";

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
        <main style={{ minHeight: "100vh" }}>
            <SiteNav>
                <Link href="/admin/new">
                    <button className="btn">+ Nuevo Post</button>
                </Link>
                <button onClick={handleLogout} className="btn-ghost">
                    Cerrar sesión
                </button>
            </SiteNav>

            <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px" }}>
                <h1 className="font-display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 32px" }}>Panel de Admin</h1>

                <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                    {posts.map((post) => (
                        <div key={post.id} className="admin-row" style={{ background: "var(--bg)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>{post.title}</p>
                                <p className="font-mono-ui" style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0 }}>
                                    {post.categoryName} · {post.published ? "Publicado" : "Borrador"}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <Link href={`/admin/edit/${post.id}`}>
                                    <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>Editar</button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="btn-ghost btn-danger"
                                    style={{ padding: "6px 12px", fontSize: 12 }}
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
