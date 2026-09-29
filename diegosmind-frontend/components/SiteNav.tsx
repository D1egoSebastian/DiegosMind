"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function SiteNav({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.header
      className="site-nav"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <Link href="/" className="brand">
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="brand-dot" />
          <span
            className="font-display"
            style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", color: "var(--text-primary)" }}
          >
            DIEGO&apos;S MIND
          </span>
        </span>
        <span
          className="font-mono-ui brand-tagline"
          style={{ fontSize: 10.5, letterSpacing: "0.03em", color: "var(--text-tertiary)", paddingLeft: 18 }}
        >
          A collection of pieces of my mind.
        </span>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Link href="/" className="nav-link" data-active={pathname === "/" || pathname.startsWith("/post")}>
          Journal
        </Link>
        <Link href="/about" className="nav-link" data-active={pathname === "/about"}>
          About
        </Link>
        {children}
      </nav>
    </motion.header>
  );
}
