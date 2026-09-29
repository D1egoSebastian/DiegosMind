"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { login } from "@/services/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        const res = await login({ email, password });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("token", data.token);
            router.push("/admin");
        } else {
            setError("Email o contraseña incorrectos");
        }
    };

    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div className="hero-grid" />
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                style={{ position: "relative", width: "100%", maxWidth: 360, padding: "0 32px" }}
            >
                <h1 className="font-display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px" }}>Admin</h1>
                <p className="font-mono-ui" style={{ fontSize: 12, color: "var(--text-tertiary)", margin: "0 0 32px" }}>A collection of pieces of my mind.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="field" />

                    {error && <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>{error}</p>}

                    <button onClick={handleSubmit} className="btn" style={{ padding: "10px 14px", fontSize: 14 }}>
                        Entrar
                    </button>
                </div>
            </motion.div>
        </main>
    );
}
