"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SchemesCorridor3D from "./SchemesCorridor3D";

type Language = "mr" | "en" | "hi";

export default function SchemesPage() {
  const [lang, setLang] = useState<Language>("mr");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("krishios_lang") as Language;
      if (savedLang && ["mr", "en", "hi"].includes(savedLang)) {
        setLang(savedLang);
      }
    } catch {}
  }, []);

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem("krishios_lang", newLang);
    } catch {}
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "#020704",
        color: "#f8fafc",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Top Floating Glassmorphism Navigation Bar (Techkriti reference style) */}
      <header
        style={{
          position: "absolute",
          top: 16,
          left: 20,
          right: 20,
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 24px",
          background: "rgba(3, 14, 8, 0.65)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(74, 222, 128, 0.22)",
          borderRadius: 999,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Brand Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "#000",
              fontSize: 16,
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.6)",
            }}
          >
            K
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: "0.12em", color: "#fff", lineHeight: 1 }}>
              KRISHIOS
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: "#34d399", textTransform: "uppercase" }}>
              MAHARASHTRA AGRI-TECH
            </div>
          </div>
        </div>

        {/* Center Pill Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(0, 0, 0, 0.45)",
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
          className="hide-mobile"
        >
          <span
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.2)",
              border: "1px solid #10b981",
              color: "#34d399",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            SCHEMES 3D
          </span>
          <Link
            href="/"
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              color: "#94a3b8",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            OUR FARMS
          </Link>
          <Link
            href="/"
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              color: "#94a3b8",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            WEATHER
          </Link>
          <Link
            href="/"
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              color: "#94a3b8",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            MANDI RATES
          </Link>
        </nav>

        {/* Language Toggles + Back to Home */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              padding: 3,
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(74, 222, 128, 0.2)",
              borderRadius: 30,
            }}
          >
            {(["mr", "hi", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  background: lang === l ? "#10b981" : "transparent",
                  color: lang === l ? "#041308" : "#94a3b8",
                  transition: "all 0.2s ease",
                }}
              >
                {l === "mr" ? "मराठी" : l === "hi" ? "हिंदी" : "EN"}
              </button>
            ))}
          </div>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              background: "#10b981",
              borderRadius: 30,
              color: "#031409",
              fontSize: 12,
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 0 16px rgba(16, 185, 129, 0.5)",
              transition: "all 0.2s ease",
            }}
          >
            <span>HOME PORTAL</span>
            <span>↗</span>
          </Link>
        </div>
      </header>

      {/* Edge-to-edge 3D Corridor Experience */}
      <div style={{ width: "100%", height: "100%" }}>
        <SchemesCorridor3D lang={lang} />
      </div>
    </main>
  );
}
