"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { SCHEMES_DATA, getSchemeById, SchemeData } from "../schemesData";

type Language = "mr" | "en" | "hi";

export default function SchemeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const scheme = getSchemeById(params.id);

  const [lang, setLang] = useState<Language>("mr");
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});

  // Sync initial language preference from localStorage if present
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

  if (!scheme) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#06130b", color: "#fff", padding: 20 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Scheme Not Found</h2>
        <p style={{ color: "#94a3b8", marginBottom: 24 }}>The requested scheme portal could not be located in the catalog.</p>
        <Link href="/" className="btn-lime-pill">
          <span>← Return to KRISHIOS Main Portal</span>
        </Link>
      </div>
    );
  }

  const toggleCriterion = (id: string) => {
    setCheckedCriteria((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalCriteria = scheme.eligibilityCriteria.checklist.length;
  const checkedCount = scheme.eligibilityCriteria.checklist.filter(
    (c) => checkedCriteria[c.id]
  ).length;
  const isEligible = checkedCount === totalCriteria;

  const glow = scheme.accentColor || "#10b981";

  // Related schemes (excluding current)
  const relatedSchemes = SCHEMES_DATA.filter((s) => s.id !== scheme.id).slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main, #041008)", color: "var(--text-primary, #ffffff)" }}>
      {/* 1. Header Navigation Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(4, 16, 8, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "14px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="/#schemes"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#e2e8f0",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <span>←</span>
              <span>
                {lang === "mr"
                  ? "3D कॉरिडॉर कडे परत जा"
                  : lang === "hi"
                  ? "3D कॉरिडोर पर वापस"
                  : "Back to 3D Corridor"}
              </span>
            </Link>

            <span style={{ color: "rgba(255, 255, 255, 0.2)", fontSize: 14 }}>/</span>

            <span style={{ fontSize: 13, color: glow, fontWeight: 700 }}>
              [{scheme.portalNumber}] {scheme.shortName}
            </span>
          </div>

          {/* Language Switcher Pill */}
          <div className="lang-switcher-pill" style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => handleLangChange("mr")}
              style={{
                background: lang === "mr" ? "var(--accent-lime, #10b981)" : "transparent",
                color: lang === "mr" ? "#04140a" : "var(--text-secondary, #94a3b8)",
                border: "none",
                borderRadius: 14,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              मराठी
            </button>
            <button
              onClick={() => handleLangChange("hi")}
              style={{
                background: lang === "hi" ? "var(--accent-lime, #10b981)" : "transparent",
                color: lang === "hi" ? "#04140a" : "var(--text-secondary, #94a3b8)",
                border: "none",
                borderRadius: 14,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              हिंदी
            </button>
            <button
              onClick={() => handleLangChange("en")}
              style={{
                background: lang === "en" ? "var(--accent-lime, #10b981)" : "transparent",
                color: lang === "en" ? "#04140a" : "var(--text-secondary, #94a3b8)",
                border: "none",
                borderRadius: 14,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Holographic Scheme Visual */}
      <section
        style={{
          position: "relative",
          padding: "50px 24px 60px",
          background: `radial-gradient(circle at 80% 20%, ${glow}18 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)`,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 36, alignItems: "center" }}>
            {/* Left Column: Scheme Title & Details */}
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span
                  style={{
                    background: `${glow}25`,
                    color: glow,
                    border: `1px solid ${glow}60`,
                    padding: "4px 12px",
                    borderRadius: 999,
                    fontFamily: "monospace",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  PORTAL [{scheme.portalNumber}]
                </span>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#cbd5e1",
                    padding: "4px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {scheme.category[lang]}
                </span>
                <span className="prov-badge live">REVIEWED • {scheme.lastReviewedDate}</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(26px, 4vw, 38px)",
                  fontWeight: 900,
                  lineHeight: 1.25,
                  marginBottom: 16,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                {scheme.fullName[lang]}
              </h1>

              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "#cbd5e1",
                  marginBottom: 28,
                  maxWidth: 680,
                }}
              >
                {scheme.tagline[lang]}
              </p>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-lime-pill"
                  style={{
                    padding: "12px 24px",
                    fontSize: 14,
                    textDecoration: "none",
                    boxShadow: `0 0 25px ${glow}60`,
                  }}
                >
                  <span>
                    {lang === "mr"
                      ? "शासकीय पोर्टलवर ऑनलाइन अर्ज करा"
                      : lang === "hi"
                      ? "सरकारी पोर्टल पर ऑनलाइन आवेदन"
                      : "Apply on Official Govt Portal"}
                  </span>
                  <span className="circle-arrow-icon">↗</span>
                </a>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    borderRadius: 999,
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: 13,
                    color: "#e2e8f0",
                  }}
                >
                  <span>📞 Helpline:</span>
                  <strong style={{ color: glow }}>{scheme.helplineNumber}</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card with Neon Glowing Frame */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: 24,
                  overflow: "hidden",
                  border: `2px solid ${glow}`,
                  boxShadow: `0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px ${glow}40`,
                }}
              >
                <img
                  src={scheme.bgImage}
                  alt={scheme.fullName[lang]}
                  style={{
                    width: "100%",
                    height: 340,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(2, 10, 6, 0.9) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <div>
                    <span style={{ fontSize: 12, color: "#94a3b8", display: "block" }}>
                      {lang === "mr" ? "प्रायोजक / मंत्रालय" : lang === "hi" ? "मंत्रालय / प्रायोजक" : "Sponsoring Authority"}
                    </span>
                    <strong style={{ fontSize: 15, color: "#ffffff" }}>{scheme.sponsor[lang]}</strong>
                  </div>
                  <div
                    style={{
                      background: glow,
                      color: "#03140a",
                      fontWeight: 800,
                      padding: "6px 14px",
                      borderRadius: 12,
                      fontSize: 13,
                    }}
                  >
                    ✨ {scheme.benefitBadge[lang]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginTop: 40,
            }}
          >
            {scheme.quickStats.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(10, 26, 17, 0.65)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 18,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span style={{ fontSize: 28 }}>{stat.icon}</span>
                <div>
                  <span style={{ fontSize: 12, color: "#94a3b8", display: "block" }}>
                    {stat[`label${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "labelEn" | "labelMr" | "labelHi"]}
                  </span>
                  <strong style={{ fontSize: 18, color: "#ffffff", fontWeight: 800 }}>
                    {stat.value}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Main Detail Content Grid */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40 }}>
          
          {/* Left Main Content Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 36, gridColumn: "span 2" }}>
            
            {/* Section A: Overview & Objective */}
            <div
              style={{
                background: "rgba(8, 22, 14, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 22,
                padding: 28,
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span>📖</span>
                <span>{lang === "mr" ? "योजनेचे स्वरूप व उद्दिष्ट" : lang === "hi" ? "योजना का उद्देश्य एवं विवरण" : "Scheme Overview & Objectives"}</span>
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#cbd5e1", marginBottom: 20 }}>
                {scheme.overview[lang]}
              </p>

              <h4 style={{ fontSize: 16, fontWeight: 700, color: glow, marginBottom: 12 }}>
                {lang === "mr" ? "मुख्य वैशिष्ट्ये व फायदे:" : lang === "hi" ? "प्रमुख विशेषताएं एवं लाभ:" : "Key Scheme Highlights:"}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {scheme.keyBenefits[lang].map((benefit, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#e2e8f0" }}>
                    <span style={{ color: glow, fontSize: 16 }}>✔</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section B: Financial Subsidy & Slabs Breakdown */}
            <div
              style={{
                background: "rgba(8, 22, 14, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 22,
                padding: 28,
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span>💰</span>
                <span>{lang === "mr" ? "अनुदान व आर्थिक लाभ तपशील" : lang === "hi" ? "सब्सिडी एवं वित्तीय लाभ विवरण" : "Financial Subsidy & Payment Slabs"}</span>
              </h3>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
                <div style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>{lang === "mr" ? "शासकीय हिस्सा" : "Subsidy Percentage"}</span>
                  <strong style={{ fontSize: 16, color: "#34d399" }}>{scheme.financialSubsidyDetails.subsidyPct}</strong>
                </div>
                <div style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(6, 182, 212, 0.12)", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>{lang === "mr" ? "कमाल मर्यादा" : "Maximum Grant"}</span>
                  <strong style={{ fontSize: 16, color: "#38bdf8" }}>{scheme.financialSubsidyDetails.maxAmount}</strong>
                </div>
                <div style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(234, 179, 8, 0.12)", border: "1px solid rgba(234, 179, 8, 0.3)" }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>{lang === "mr" ? "जमा पद्धत" : "Disbursement Mode"}</span>
                  <strong style={{ fontSize: 16, color: "#facc15" }}>{scheme.financialSubsidyDetails.disbursementMode}</strong>
                </div>
              </div>

              {/* Breakdown Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "rgba(255, 255, 255, 0.05)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: "#94a3b8" }}>{lang === "mr" ? "हप्ता / घटक" : "Slab / Component"}</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: glow }}>{lang === "mr" ? "अनुदान रक्कम" : "Grant Amount"}</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: "#94a3b8" }}>{lang === "mr" ? "तपशील" : "Remarks"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheme.financialSubsidyDetails.breakdown.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "#ffffff" }}>
                          {lang === "mr" ? row.slabMr : row.slabEn}
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: 800, color: glow }}>
                          {row.subsidy}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#94a3b8" }}>
                          {lang === "mr" ? row.notesMr : row.notesEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section C: Step-by-Step Application Roadmap */}
            <div
              style={{
                background: "rgba(8, 22, 14, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 22,
                padding: 28,
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span>🗺️</span>
                <span>{lang === "mr" ? "अर्ज करण्याची टप्प्याटप्प्याने पद्धत" : lang === "hi" ? "आवेदन की चरणबद्ध प्रक्रिया" : "Step-by-Step Application Procedure"}</span>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {scheme.applicationSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    style={{
                      display: "flex",
                      gap: 16,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: 16,
                      padding: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: `${glow}25`,
                        border: `2px solid ${glow}`,
                        color: glow,
                        fontWeight: 900,
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {step.stepNumber}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
                        {step[`title${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "titleEn" | "titleMr" | "titleHi"]}
                      </h4>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "#94a3b8" }}>
                        {step[`description${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "descriptionEn" | "descriptionMr" | "descriptionHi"]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section D: Maharashtra Specific Guidance */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                borderRadius: 22,
                padding: 26,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#34d399", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <span>🚩</span>
                <span>{lang === "mr" ? "महाराष्ट्र विशेष मार्गदर्शक सूचना" : lang === "hi" ? "महाराष्ट्र राज्य विशेष दिशा-निर्देश" : "Maharashtra State Specific Provisions"}</span>
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#e2e8f0" }}>
                {scheme.maharashtraSpecifics[lang]}
              </p>
            </div>

            {/* Section E: FAQs */}
            <div
              style={{
                background: "rgba(8, 22, 14, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 22,
                padding: 28,
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                <span>❓</span>
                <span>{lang === "mr" ? "वारंवार विचारले जाणारे प्रश्न (FAQ)" : lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}</span>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {scheme.faqs.map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: 14,
                      padding: 16,
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <strong style={{ fontSize: 15, color: "#ffffff", display: "block", marginBottom: 8 }}>
                      Q: {faq[`question${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "questionEn" | "questionMr" | "questionHi"]}
                    </strong>
                    <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                      A: {faq[`answer${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "answerEn" | "answerMr" | "answerHi"]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Interactive Eligibility Checker & Required Documents */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Interactive Eligibility Self-Check Card */}
            <div
              style={{
                background: "rgba(8, 22, 14, 0.8)",
                backdropFilter: "blur(16px)",
                border: isEligible ? "2px solid #10b981" : "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 22,
                padding: 24,
                boxShadow: isEligible ? "0 0 30px rgba(16, 185, 129, 0.3)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <span>✅</span>
                <span>{lang === "mr" ? "पात्रता पडताळणी" : lang === "hi" ? "पात्रता स्व-परीक्षण" : "Eligibility Self-Check"}</span>
              </h3>
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
                {lang === "mr"
                  ? "खालील निकष तपासून तुमची पात्रता तपासा:"
                  : "Check the criteria below to verify if you qualify:"}
              </p>

              {/* Progress counter */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: "#cbd5e1" }}>Checked: {checkedCount} of {totalCriteria}</span>
                  <strong style={{ color: isEligible ? "#34d399" : "#e2e8f0" }}>
                    {isEligible ? "100% Eligible! 🎉" : `${Math.round((checkedCount / totalCriteria) * 100)}%`}
                  </strong>
                </div>
                <div style={{ height: 6, background: "rgba(255, 255, 255, 0.1)", borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(checkedCount / totalCriteria) * 100}%`,
                      background: isEligible ? "#10b981" : glow,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Checklist items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {scheme.eligibilityCriteria.checklist.map((item) => {
                  const isChecked = !!checkedCriteria[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCriterion(item.id)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: 12,
                        borderRadius: 12,
                        background: isChecked ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.03)",
                        border: isChecked ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.08)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by div onClick
                        style={{ marginTop: 3, accentColor: "#10b981", cursor: "pointer" }}
                      />
                      <div>
                        <strong style={{ fontSize: 14, color: isChecked ? "#34d399" : "#ffffff", display: "block", marginBottom: 3 }}>
                          {item[`title${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "titleEn" | "titleMr" | "titleHi"]}
                        </strong>
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>
                          {item[`description${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "descriptionEn" | "descriptionMr" | "descriptionHi"]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Eligibility Verdict Banner */}
              {isEligible ? (
                <div style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", borderRadius: 12, padding: 12, textAlign: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#34d399" }}>
                    🎉 {lang === "mr" ? "अभिनंदन! तुम्ही या योजनेसाठी पात्र आहात." : "You fulfill all criteria to apply!"}
                  </span>
                </div>
              ) : (
                <p style={{ fontSize: 11, color: "#64748b", textAlign: "center", margin: "0 0 16px" }}>
                  {lang === "mr" ? "सर्व अटी पूर्ण झाल्यावरच अर्ज करा." : "Select all conditions to verify your complete eligibility."}
                </p>
              )}

              {/* Exclusions Warning Accordion */}
              <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#f87171", display: "block", marginBottom: 6 }}>
                  ⚠️ {lang === "mr" ? "अपात्रतेच्या अटी (Exclusions):" : "Who is NOT eligible:"}
                </span>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 11, color: "#94a3b8", display: "flex", flexDirection: "column", gap: 4 }}>
                  {scheme.eligibilityCriteria.exclusions[lang].map((exc, i) => (
                    <li key={i}>• {exc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Required Documents Card */}
            <div
              style={{
                background: "rgba(8, 22, 14, 0.8)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 22,
                padding: 24,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span>📁</span>
                <span>{lang === "mr" ? "आवश्यक कागदपत्रे" : lang === "hi" ? "आवश्यक दस्तावेज" : "Mandatory Documents"}</span>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {scheme.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <strong style={{ fontSize: 14, color: "#ffffff" }}>
                        {doc[`name${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "nameEn" | "nameMr" | "nameHi"]}
                      </strong>
                      {doc.isMandatory && (
                        <span style={{ fontSize: 10, background: "rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "2px 6px", borderRadius: 6, fontWeight: 700 }}>
                          Required
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 6px", lineHeight: 1.4 }}>
                      {doc[`description${lang === "mr" ? "Mr" : lang === "hi" ? "Hi" : "En"}` as "descriptionEn" | "descriptionMr" | "descriptionHi"]}
                    </p>
                    <span style={{ fontSize: 11, color: "#64748b" }}>
                      Issuing Authority: {doc.authority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Portal Action Card */}
            <div
              style={{
                background: `linear-gradient(135deg, ${glow}20 0%, rgba(4, 16, 10, 0.9) 100%)`,
                border: `1px solid ${glow}40`,
                borderRadius: 22,
                padding: 24,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>🚀</span>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>
                {scheme.applicationPortalName}
              </h4>
              <p style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 18 }}>
                {lang === "mr"
                  ? "थेट शासकीय वेबसाइटवर जाऊन आपला अर्ज नोंदवा."
                  : "Submit your authenticated application on the official central/state portal."}
              </p>
              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-lime-pill"
                style={{ width: "100%", justifyContent: "center", padding: "10px 18px", fontSize: 13, textDecoration: "none" }}
              >
                <span>Visit {scheme.shortName} Portal</span>
                <span className="circle-arrow-icon">↗</span>
              </a>
            </div>

          </div>
        </div>

        {/* 4. Explore More Schemes in the 3D Corridor */}
        <section style={{ marginTop: 70, paddingTop: 40, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
                🪐 {lang === "mr" ? "इतर शासकीय योजनांचे 3D पोर्टल्स" : lang === "hi" ? "अन्य योजनाओं के पोर्टल्स" : "Explore Other Scheme Portals"}
              </h3>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>
                {lang === "mr" ? "कॉरिडॉरमधील इतर महत्त्वाच्या योजनांची माहिती तपासा" : "Discover more farmer welfare and subsidy initiatives"}
              </p>
            </div>
            <Link href="/#schemes" className="btn-lime-pill" style={{ textDecoration: "none", fontSize: 12, padding: "8px 16px" }}>
              <span>Enter 3D Corridor</span>
              <span>→</span>
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {relatedSchemes.map((rel) => (
              <Link
                key={rel.id}
                href={`/schemes/${rel.id}`}
                style={{
                  background: "rgba(10, 24, 16, 0.7)",
                  border: `1px solid ${rel.accentColor}40`,
                  borderRadius: 18,
                  padding: 18,
                  display: "flex",
                  gap: 16,
                  textDecoration: "none",
                  alignItems: "center",
                  transition: "all 0.25s ease",
                }}
              >
                <div style={{ width: 80, height: 80, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                  <img src={rel.bgImage} alt={rel.shortName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: rel.accentColor, fontWeight: 700, fontFamily: "monospace" }}>
                    PORTAL [{rel.portalNumber}]
                  </span>
                  <h5 style={{ fontSize: 15, fontWeight: 800, color: "#ffffff", margin: "2px 0 4px" }}>
                    {rel.shortName}
                  </h5>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    {rel.category[lang]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
