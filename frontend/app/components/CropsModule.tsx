"use client";

import React, { useState } from "react";

interface IntercropOption {
  companion_crop: string;
  companion_crop_mr: string;
  row_ratio: string;
  rationale: string;
  rationale_mr: string;
}

interface CropItem {
  crop_id: string;
  name: string;
  name_mr: string;
  name_hi: string;
  suitability_score: number;
  suitability_grade: string;
  sowing_window: string;
  sowing_window_mr: string;
  duration_days: string;
  expected_yield_quintals_per_acre: number;
  recommended_varieties: string[];
  intercrop?: IntercropOption | null;
  water_requirement_mm: number;
  key_advantages: string[];
  key_advantages_mr: string[];
  provenance: string;
  source_citation: string;
}

interface CropsModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function CropsModule({ district, lang, apiUrl }: CropsModuleProps) {
  const [season, setSeason] = useState("kharif");
  const [soilTexture, setSoilTexture] = useState("medium_black");
  const [irrigation, setIrrigation] = useState("protective_1_2");
  const [soilPh, setSoilPh] = useState(7.2);
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState<CropItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`${apiUrl}/crops/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district,
          season,
          soil_ph: soilPh,
          soil_texture: soilTexture,
          irrigation,
          organic_carbon_pct: 0.65,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCrops(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-lime)", margin: 0 }}>
            🌱 {lang === "mr" ? "वैज्ञानिक पीक निवड व आंतरपीक पद्धत" : "Scientific Crop Recommendation & Intercropping"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "राहुरी कृषी विद्यापीठ (MPKV) व अकोला विद्यापीठ (PDKV) प्रमाणित वाण व आंतरपीक शिफारशी."
              : "State Agricultural University (MPKV Rahuri & PDKV Akola) verified varietal packages & intercrop row ratios."}
          </p>
        </div>
        <span className="prov-badge live">MPKV / ICAR VERIFIED</span>
      </div>

      {/* Input Parameters Box */}
      <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <div>
            <label className="input-label">{lang === "mr" ? "हंगाम (Season)" : "Season"}</label>
            <select className="modern-select" value={season} onChange={(e) => setSeason(e.target.value)}>
              <option value="kharif">{lang === "mr" ? "खरीप (Kharif - पावसाळी)" : "Kharif (Monsoon)"}</option>
              <option value="rabi">{lang === "mr" ? "रब्बी (Rabi - हिवाळी)" : "Rabi (Winter)"}</option>
              <option value="summer">{lang === "mr" ? "उन्हाळी (Summer / Zaid)" : "Summer (Zaid)"}</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "मातीचा प्रकार (Soil Type)" : "Soil Type"}</label>
            <select className="modern-select" value={soilTexture} onChange={(e) => setSoilTexture(e.target.value)}>
              <option value="medium_black">{lang === "mr" ? "मध्यम काळी जमीन (Medium Black)" : "Medium Black Soil"}</option>
              <option value="deep_black">{lang === "mr" ? "भारी काळी कसदार जमीन (Deep Black)" : "Deep Black Clayey"}</option>
              <option value="light_sandy">{lang === "mr" ? "हलकी / मुरमाड जमीन (Light Sandy)" : "Light Sandy / Red"}</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "पाण्याची उपलब्धता (Water Availability)" : "Water Availability"}</label>
            <select className="modern-select" value={irrigation} onChange={(e) => setIrrigation(e.target.value)}>
              <option value="protective_1_2">{lang === "mr" ? "१-२ संरक्षणात्मक पाणी (Protective)" : "1-2 Protective Irrigations"}</option>
              <option value="rainfed">{lang === "mr" ? "पूर्णतः जिरायती / पावसावर (Rainfed)" : "Strictly Rainfed"}</option>
              <option value="well_irrigated">{lang === "mr" ? "मुबलक पाणी / बागायत (Well Irrigated)" : "Perennial Drip / Well Irrigated"}</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "जमिनीचा सामू (Soil pH)" : "Soil pH"}</label>
            <input
              type="number"
              step="0.1"
              className="modern-input"
              value={soilPh}
              onChange={(e) => setSoilPh(parseFloat(e.target.value) || 7.0)}
            />
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-lime-pill" onClick={fetchRecommendations} disabled={loading} style={{ padding: "10px 24px" }}>
            <span>{loading ? "Analyzing Agronomy..." : lang === "mr" ? "🔍 योग्य पिके शोधा" : "Find Optimal Crops"}</span>
            <span className="circle-arrow-icon">↗</span>
          </button>
        </div>
      </div>

      {/* Results List */}
      {crops.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {crops.map((c) => (
            <div
              key={c.crop_id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-md)",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <h5 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {lang === "mr" ? c.name_mr : c.name}
                  </h5>
                  <span style={{ fontSize: 12, color: "var(--accent-lime)", fontWeight: 700 }}>
                    ⏱️ {c.duration_days} · 🌾 {c.expected_yield_quintals_per_acre} Qtl/Acre
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background: c.suitability_score >= 80 ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                      color: c.suitability_score >= 80 ? "#10b981" : "#f59e0b",
                      padding: "4px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    ★ {c.suitability_score}% Match
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
                📅 <strong>{lang === "mr" ? "पेरणी कालावधी:" : "Sowing Window:"}</strong> {lang === "mr" ? c.sowing_window_mr : c.sowing_window}
              </div>

              <div style={{ background: "var(--bg-card-subtle)", padding: 10, borderRadius: 8, marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                  🌾 {lang === "mr" ? "विद्यापीठ शिफारस केलेले वाण:" : "Recommended Varieties:"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.recommended_varieties.map((v, i) => (
                    <span key={i} style={{ background: "rgba(212, 249, 54, 0.12)", color: "var(--accent-lime)", fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Intercropping Highlight */}
              {c.intercrop && (
                <div style={{ borderLeft: "3px solid #10b981", paddingLeft: 10, marginBottom: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                  <strong style={{ color: "#10b981" }}>
                    🔄 {lang === "mr" ? "नफा वाढवणारे आंतरपीक:" : "Profit-Multiplying Intercrop:"}
                  </strong>{" "}
                  {lang === "mr" ? c.intercrop.companion_crop_mr : c.intercrop.companion_crop} (प्रमाण {c.intercrop.row_ratio})
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {lang === "mr" ? c.intercrop.rationale_mr : c.intercrop.rationale}
                  </div>
                </div>
              )}

              <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--border-card)", fontSize: 11, color: "var(--text-muted)" }}>
                🏛️ {c.source_citation}
              </div>
            </div>
          ))}
        </div>
      )}

      {!hasSearched && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-card)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)" }}>
            {lang === "mr" ? "आपला हंगाम व माती निवडून 'योग्य पिके शोधा' वर क्लिक करा" : "Select season & soil conditions above to generate verified crop recommendations"}
          </div>
        </div>
      )}
    </div>
  );
}
