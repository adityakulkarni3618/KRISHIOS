"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SCHEMES_DATA, SchemeData } from "./schemesData";
import "./corridor3d.css";

interface SchemesCorridor3DProps {
  lang?: "mr" | "en" | "hi";
  onSelectScheme?: (schemeId: string) => void;
}

export default function SchemesCorridor3D({
  lang = "mr",
  onSelectScheme,
}: SchemesCorridor3DProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const [autoTour, setAutoTour] = useState(false);
  const [activePortalIndex, setActivePortalIndex] = useState(0);

  // 3D Corridor Physics State
  const SPACING = 680; // Distance between portals in Z depth
  const maxZ = (SCHEMES_DATA.length - 1) * SPACING;

  const currentZRef = useRef(0);
  const targetZRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartTargetZRef = useRef(0);

  // Smooth RAF physics loop
  useEffect(() => {
    if (viewMode !== "3d") return;

    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      // Auto-tour progression
      if (autoTour && !isDraggingRef.current) {
        targetZRef.current += 1.6;
        if (targetZRef.current > maxZ + 200) {
          targetZRef.current = 0;
          currentZRef.current = 0;
        }
      }

      // Smooth Lerp Damping
      const diff = targetZRef.current - currentZRef.current;
      currentZRef.current += diff * 0.085;

      // Calculate which portal is closest to viewer focus
      const closestIdx = Math.max(
        0,
        Math.min(
          SCHEMES_DATA.length - 1,
          Math.round(currentZRef.current / SPACING)
        )
      );
      setActivePortalIndex(closestIdx);

      // Apply 3D transforms to cards
      SCHEMES_DATA.forEach((scheme, i) => {
        const el = document.getElementById(`corridor-card-${scheme.id}`);
        if (!el) return;

        const cardZ = i * SPACING;
        const relZ = currentZRef.current - cardZ;

        // Is card within visible corridor range (-2200 to +350)
        if (relZ < -2400 || relZ > 400) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.style.visibility = "hidden";
          return;
        }

        el.style.visibility = "visible";

        // Responsive X offset based on viewport width
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1100;
        const baseOffset = isMobile ? 0 : isTablet ? 240 : 390;
        const xOffset = i % 2 === 0 ? -baseOffset : baseOffset;
        const yOffset = isMobile ? 0 : (i % 2 === 0 ? -12 : 12);
        const yAngle = isMobile ? 0 : (i % 2 === 0 ? 11 : -11);

        let opacity = 1;
        let scale = 1;
        let blur = 0;

        if (relZ > 0) {
          // Card passing camera into foreground
          opacity = Math.max(0, 1 - relZ / 350);
          scale = 1 + (relZ / 350) * 0.15;
          el.style.pointerEvents = opacity < 0.25 ? "none" : "auto";
        } else {
          // Card deep in corridor
          const dist = Math.abs(relZ);
          opacity = Math.max(0.12, 1 - Math.pow(dist / 2100, 1.3));
          scale = Math.max(0.48, 1 - dist / 2800);
          blur = Math.min(6, dist / 380);
          el.style.pointerEvents = "auto";
        }

        const zIndex = Math.max(1, Math.round(1000 - Math.abs(relZ)));

        el.style.transform = `translate3d(${xOffset}px, ${yOffset}px, ${relZ}px) rotateY(${yAngle}deg) scale(${scale})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : "none";
        el.style.zIndex = zIndex.toString();
      });

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [viewMode, autoTour, maxZ]);

  // Wheel scrolling handler
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (viewMode !== "3d") return;
      e.preventDefault();
      setAutoTour(false);

      const delta = e.deltaY * 1.35;
      targetZRef.current = Math.max(-100, Math.min(maxZ + 150, targetZRef.current + delta));
    },
    [viewMode, maxZ]
  );

  // Mouse & Touch Drag interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode !== "3d") return;
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartTargetZRef.current = targetZRef.current;
    setAutoTour(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || viewMode !== "3d") return;
    const deltaY = dragStartYRef.current - e.clientY;
    targetZRef.current = Math.max(-100, Math.min(maxZ + 150, dragStartTargetZRef.current + deltaY * 2.2));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Jump to specific portal index
  const jumpToPortal = (index: number) => {
    setAutoTour(false);
    targetZRef.current = Math.max(0, Math.min(maxZ, index * SPACING));
  };

  const handlePrev = () => {
    jumpToPortal(Math.max(0, activePortalIndex - 1));
  };

  const handleNext = () => {
    jumpToPortal(Math.min(SCHEMES_DATA.length - 1, activePortalIndex + 1));
  };

  // Handle Card Click -> Navigate to Scheme Detail
  const handleCardClick = (schemeId: string) => {
    if (onSelectScheme) {
      onSelectScheme(schemeId);
    } else {
      router.push(`/schemes/${schemeId}`);
    }
  };

  const currentScheme = SCHEMES_DATA[activePortalIndex] || SCHEMES_DATA[0];

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      {/* 3D Viewport Mode */}
      {viewMode === "3d" ? (
        <div
          ref={containerRef}
          className="corridor-viewport-container"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Atmospheric Overlays */}
          <div className="corridor-ambient-overlay" />
          <div className="corridor-runway-grid" />
          <div className="corridor-pathway-light" />

          {/* Top HUD Bar */}
          <div className="corridor-hud-header">
            <div className="corridor-title-badge">
              <span className="pulse-dot" />
              <span>
                {lang === "mr"
                  ? "कृषी योजना 3D कॉरिडॉर"
                  : lang === "hi"
                  ? "कृषि योजना 3D कॉरिडोर"
                  : "3D Schemes Portal Corridor"}
              </span>
            </div>

            <div className="corridor-controls-top">
              <button
                type="button"
                className={`corridor-mode-btn ${autoTour ? "active" : ""}`}
                onClick={() => setAutoTour((prev) => !prev)}
                title="Automatically cruise down the corridor"
              >
                <span>{autoTour ? "⏸ Auto Tour" : "▶ Auto Cruise"}</span>
              </button>

              <button
                type="button"
                className="corridor-mode-btn"
                onClick={() => setViewMode("grid")}
                title="Switch to catalog grid view"
              >
                <span>▦ Grid View</span>
              </button>
            </div>
          </div>

          {/* 3D Perspective Stage containing floating cards */}
          <div className="corridor-3d-stage">
            {SCHEMES_DATA.map((scheme, index) => {
              const glow = scheme.accentColor || "#10b981";
              return (
                <div
                  key={scheme.id}
                  id={`corridor-card-${scheme.id}`}
                  className="corridor-card-wrapper"
                  onClick={() => handleCardClick(scheme.id)}
                  style={
                    {
                      "--card-glow": glow,
                      "--card-glow-subtle": `${glow}40`,
                    } as React.CSSProperties
                  }
                >
                  <div className="corridor-card-hud">
                    {/* Sci-Fi Corner Brackets */}
                    <div className="card-hud-corner-tl" />
                    <div className="card-hud-corner-tr" />
                    <div className="card-hud-corner-bl" />
                    <div className="card-hud-corner-br" />
                    <div className="card-hologram-scan" />

                    {/* Top Bar */}
                    <div className="card-hud-top">
                      <span className="card-portal-number">
                        [{scheme.portalNumber}]
                      </span>
                      <span className="card-category-pill">
                        {scheme.category[lang]}
                      </span>
                    </div>

                    {/* Visual Media */}
                    <div className="card-hud-media">
                      <img
                        src={scheme.bgImage}
                        alt={scheme.fullName[lang]}
                        loading="lazy"
                      />
                      <div className="card-benefit-badge">
                        ✨ {scheme.benefitBadge[lang]}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="card-hud-content">
                      <h4 className="card-hud-title">
                        {scheme.fullName[lang]}
                      </h4>
                      <p className="card-hud-tagline">
                        {scheme.tagline[lang]}
                      </p>
                    </div>

                    {/* Footer HUD */}
                    <div className="card-hud-footer">
                      <div className="card-sponsor-tag">
                        🏛️ {scheme.sponsor[lang]}
                      </div>
                      <button
                        type="button"
                        className="card-enter-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(scheme.id);
                        }}
                      >
                        <span>
                          {lang === "mr"
                            ? "योजना माहिती पहा"
                            : lang === "hi"
                            ? "योजना विवरण"
                            : "Enter Portal"}
                        </span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Scroll Hint */}
          <div className="corridor-scroll-hint">
            <div className="mouse-icon" />
            <span>
              {lang === "mr"
                ? "स्क्रोल करा किंवा ड्रॅग करा"
                : lang === "hi"
                ? "स्क्रॉल या ड्रैग करें"
                : "Scroll or Drag to Walk Corridor"}
            </span>
          </div>

          {/* Bottom HUD Scrubber Console */}
          <div className="corridor-hud-console">
            <div className="corridor-nav-actions">
              <button
                type="button"
                className="corridor-arrow-btn"
                onClick={handlePrev}
                title="Previous Scheme Portal"
                aria-label="Previous Portal"
              >
                ‹
              </button>

              <div className="corridor-status-center">
                <span className="corridor-portal-caption">
                  PORTAL [{currentScheme.portalNumber} / {SCHEMES_DATA.length.toString().padStart(2, "0")}]
                </span>
                <span className="corridor-scheme-title-sub">
                  {currentScheme.fullName[lang]}
                </span>
              </div>

              <button
                type="button"
                className="corridor-arrow-btn"
                onClick={handleNext}
                title="Next Scheme Portal"
                aria-label="Next Portal"
              >
                ›
              </button>
            </div>

            {/* Scrubber Progress Bar */}
            <div
              className="corridor-scrubber-track"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const targetIdx = Math.round(ratio * (SCHEMES_DATA.length - 1));
                jumpToPortal(targetIdx);
              }}
            >
              <div
                className="corridor-scrubber-fill"
                style={{
                  width: `${(activePortalIndex / (SCHEMES_DATA.length - 1)) * 100}%`,
                }}
              />
              <div className="corridor-scrubber-dots">
                {SCHEMES_DATA.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`corridor-scrubber-dot ${
                      idx === activePortalIndex ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      jumpToPortal(idx);
                    }}
                    title={`${s.portalNumber}: ${s.shortName}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Classic Grid Mode */
        <div className="corridor-grid-mode">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
                🏛️ {lang === "mr" ? "शासकीय योजना सूची" : lang === "hi" ? "सरकारी योजना सूची" : "Government Schemes Catalog"}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                {lang === "mr"
                  ? "शेतकऱ्यांसाठी सर्व केंद्र व राज्य पुरस्कृत योजनांची सविस्तर माहिती"
                  : lang === "hi"
                  ? "किसानों हेतु समस्त केंद्रीय एवं राज्य प्रायोजित योजनाओं की विस्तृत जानकारी"
                  : "Detailed portal guides for all central and state agriculture DBT schemes."}
              </p>
            </div>
            <button
              type="button"
              className="corridor-mode-btn active"
              onClick={() => setViewMode("3d")}
            >
              <span>🪐 Enter 3D Corridor</span>
            </button>
          </div>

          <div className="corridor-grid-container">
            {SCHEMES_DATA.map((scheme) => (
              <div
                key={scheme.id}
                className="corridor-card-hud"
                onClick={() => handleCardClick(scheme.id)}
                style={{
                  height: 540,
                  cursor: "pointer",
                  "--card-glow": scheme.accentColor,
                  "--card-glow-subtle": `${scheme.accentColor}35`,
                } as React.CSSProperties}
              >
                <div className="card-hud-corner-tl" />
                <div className="card-hud-corner-tr" />
                <div className="card-hud-corner-bl" />
                <div className="card-hud-corner-br" />

                <div className="card-hud-top">
                  <span className="card-portal-number">[{scheme.portalNumber}]</span>
                  <span className="card-category-pill">{scheme.category[lang]}</span>
                </div>

                <div className="card-hud-media" style={{ height: 180 }}>
                  <img src={scheme.bgImage} alt={scheme.fullName[lang]} />
                  <div className="card-benefit-badge">✨ {scheme.benefitBadge[lang]}</div>
                </div>

                <div className="card-hud-content">
                  <h4 className="card-hud-title" style={{ fontSize: 18 }}>
                    {scheme.fullName[lang]}
                  </h4>
                  <p className="card-hud-tagline">{scheme.tagline[lang]}</p>
                </div>

                <div className="card-hud-footer">
                  <div className="card-sponsor-tag">🏛️ {scheme.sponsor[lang]}</div>
                  <button type="button" className="card-enter-btn">
                    <span>{lang === "mr" ? "सविस्तर माहिती" : lang === "hi" ? "पूर्ण विवरण" : "View Details"}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
