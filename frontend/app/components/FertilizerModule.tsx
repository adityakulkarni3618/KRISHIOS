"use client";

import React, { useState } from "react";

interface SplitStage {
  stage_name: string;
  stage_name_mr: string;
  timing: string;
  timing_mr: string;
  urea_kg: number;
  dap_kg: number;
  mop_kg: number;
  notes: string;
  notes_mr: string;
}

interface FertilizerOption {
  name: string;
  name_mr: string;
  description: string;
  description_mr: string;
  urea_bags_45kg: number;
  dap_bags_50kg: number;
  mop_bags_50kg: number;
  ssp_bags_50kg: number;
  estimated_cost_inr: number;
}

interface FertilizerPlanResult {
  crop: string;
  area_acres: number;
  total_pure_nutrients_kg: Record<string, number>;
  recommended_options: FertilizerOption[];
  split_schedule: SplitStage[];
  micronutrient_advisories: string[];
  micronutrient_advisories_mr: string[];
  biofertilizer_seed_treatment: string;
  biofertilizer_seed_treatment_mr: string;
  source_citation: string;
}

interface FertilizerModuleProps {
  lang: string;
  apiUrl: string;
}

export default function FertilizerModule({ lang, apiUrl }: FertilizerModuleProps) {
  const [crop, setCrop] = useState("Soybean");
  const [area, setArea] = useState(2.0);
  const [soilN, setSoilN] = useState("medium");
  const [soilP, setSoilP] = useState("medium");
  const [soilK, setSoilK] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<FertilizerPlanResult | null>(null);

  const calculatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/fertilizer/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          area_acres: area,
          soil_n_status: soilN,
          soil_p_status: soilP,
          soil_k_status: soilK,
        }),
      });
      if (res.ok) {
        setPlan(await res.json());
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
            🧪 {lang === "mr" ? "रासायनिक खत मात्रा व टप्पेवार वेळापत्रक" : "ICAR Fertilizer & Split-Dose Schedule Calculator"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "राहुरी कृषी विद्यापीठ RDF मानकांनुसार जमिनीच्या आरोग्य पत्रिकेनुसार पोत्यांचे अचूक नियोजन."
              : "Calculates exact subsidized fertilizer bags (DAP, Urea, MOP, SSP) and 3-stage split application."}
          </p>
        </div>
        <span className="prov-badge live">ICAR RDF BENCHMARK</span>
      </div>

      {/* Inputs */}
      <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <div>
            <label className="input-label">{lang === "mr" ? "पीक निवडा (Crop)" : "Crop"}</label>
            <select className="modern-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Cotton">Cotton (कापूस)</option>
              <option value="Sugarcane">Sugarcane (ऊस)</option>
              <option value="Onion">Onion (कांदा)</option>
              <option value="Chickpea">Chickpea / Gram (हरभरा)</option>
              <option value="Wheat">Wheat (गहू)</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "क्षेत्र एकर (Acres)" : "Cultivated Acres"}</label>
            <input
              type="number"
              step="0.5"
              className="modern-input"
              value={area}
              onChange={(e) => setArea(parseFloat(e.target.value) || 1.0)}
            />
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "जमिनीतील नत्र (Nitrogen)" : "Soil Nitrogen Level"}</label>
            <select className="modern-select" value={soilN} onChange={(e) => setSoilN(e.target.value)}>
              <option value="medium">{lang === "mr" ? "मध्यम (Medium)" : "Medium (Optimal)"}</option>
              <option value="low">{lang === "mr" ? "कमी / कमी सेंद्रिय कर्ब (Low: +25% Dose)" : "Low (Needs +25%)"}</option>
              <option value="high">{lang === "mr" ? "जास्त (High: -25% Dose)" : "High (Save 25%)"}</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "जमिनीतील स्फुरद (Phosphorus)" : "Soil Phosphorus Level"}</label>
            <select className="modern-select" value={soilP} onChange={(e) => setSoilP(e.target.value)}>
              <option value="medium">{lang === "mr" ? "मध्यम (Medium)" : "Medium (Optimal)"}</option>
              <option value="low">{lang === "mr" ? "कमी (Low: +25% Dose)" : "Low (Needs +25%)"}</option>
              <option value="high">{lang === "mr" ? "जास्त (High: -25% Dose)" : "High (Save 25%)"}</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "जमिनीतील पालाश (Potash)" : "Soil Potash Level"}</label>
            <select className="modern-select" value={soilK} onChange={(e) => setSoilK(e.target.value)}>
              <option value="medium">{lang === "mr" ? "मध्यम (Medium)" : "Medium (Optimal)"}</option>
              <option value="low">{lang === "mr" ? "कमी (Low: +25% Dose)" : "Low (Needs +25%)"}</option>
              <option value="high">{lang === "mr" ? "जास्त (High: -25% Dose)" : "High (Save 25%)"}</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-lime-pill" onClick={calculatePlan} disabled={loading} style={{ padding: "10px 24px" }}>
            <span>{loading ? "Calculating Nutrients..." : lang === "mr" ? "📊 खताची पोती व खर्च काढा" : "Calculate Fertilizer Bags"}</span>
            <span className="circle-arrow-icon">↗</span>
          </button>
        </div>
      </div>

      {plan && (
        <div>
          {/* Options side-by-side */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 20 }}>
            {plan.recommended_options.map((opt, idx) => (
              <div
                key={idx}
                style={{
                  background: idx === 0 ? "rgba(212, 249, 54, 0.05)" : "var(--bg-card)",
                  border: idx === 0 ? "1px solid var(--border-lime)" : "1px solid var(--border-card)",
                  borderRadius: "var(--radius-md)",
                  padding: 18,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                  {lang === "mr" ? opt.name_mr : opt.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
                  {lang === "mr" ? opt.description_mr : opt.description}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                  {opt.dap_bags_50kg > 0 && (
                    <div style={{ background: "var(--bg-card-elevated)", padding: "8px 12px", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>DAP (50kg)</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-lime)" }}>{opt.dap_bags_50kg} Bags</div>
                    </div>
                  )}
                  {opt.ssp_bags_50kg > 0 && (
                    <div style={{ background: "var(--bg-card-elevated)", padding: "8px 12px", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>SSP (50kg)</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-lime)" }}>{opt.ssp_bags_50kg} Bags</div>
                    </div>
                  )}
                  <div style={{ background: "var(--bg-card-elevated)", padding: "8px 12px", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Urea (45kg)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#38bdf8" }}>{opt.urea_bags_45kg} Bags</div>
                  </div>
                  <div style={{ background: "var(--bg-card-elevated)", padding: "8px 12px", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Potash MOP (50kg)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b" }}>{opt.mop_bags_50kg} Bags</div>
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  💰 {lang === "mr" ? "अंदाजे शासकीय अनुदानित खर्च:" : "Estimated Subsidized Cost:"}{" "}
                  <strong style={{ color: "var(--accent-lime)" }}>₹{opt.estimated_cost_inr.toLocaleString()}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Split Schedule Table */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 18, marginBottom: 20 }}>
            <h5 style={{ fontSize: 16, fontWeight: 800, color: "var(--accent-lime)", marginBottom: 12 }}>
              🗓️ {lang === "mr" ? "टप्पेवार खत देण्याचे वेळापत्रक (Split Schedule)" : "3-Stage Application Schedule"}
            </h5>
            <div style={{ display: "grid", gap: 12 }}>
              {plan.split_schedule.map((st, i) => (
                <div key={i} style={{ background: "var(--bg-card-subtle)", padding: 14, borderRadius: 8, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-primary)" }}>
                      {lang === "mr" ? st.stage_name_mr : st.stage_name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--accent-lime)", marginBottom: 4 }}>
                      ⏰ {lang === "mr" ? st.timing_mr : st.timing}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {lang === "mr" ? st.notes_mr : st.notes}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 140 }}>
                    {st.urea_kg > 0 && <div style={{ fontSize: 13, fontWeight: 700, color: "#38bdf8" }}>Urea: {st.urea_kg} kg</div>}
                    {st.dap_kg > 0 && <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-lime)" }}>DAP: {st.dap_kg} kg</div>}
                    {st.mop_kg > 0 && <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>MOP: {st.mop_kg} kg</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Micronutrient & Seed Treatment */}
          <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid #10b981", borderRadius: "var(--radius-md)", padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#10b981", marginBottom: 6 }}>
              🔬 {lang === "mr" ? "जिवाणू संवर्धन व सूक्ष्म अन्नद्रव्ये:" : "Seed Inoculation & Micronutrient Booster:"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
              {lang === "mr" ? plan.biofertilizer_seed_treatment_mr : plan.biofertilizer_seed_treatment}
            </div>
            <ul style={{ paddingLeft: 18, fontSize: 12, color: "var(--text-muted)" }}>
              {(lang === "mr" ? plan.micronutrient_advisories_mr : plan.micronutrient_advisories).map((m, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
