"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        <main style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 360, padding: "0 32px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Admin</h1>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 32 }}>Diego's Mind</p>

            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", background: "#111", border: "0.5px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", color: "#e8e8e8", fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none" }}
            />
            <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", background: "#111", border: "0.5px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", color: "#e8e8e8", fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none" }}
            />

            {error && <p style={{ fontSize: 13, color: "#f87171", marginBottom: 12 }}>{error}</p>}

            <button
            onClick={handleSubmit}
            style={{ width: "100%", background: "#a78bfa", border: "none", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
            >
            Entrar
            </button>
        </div>
        </main>
    );
}