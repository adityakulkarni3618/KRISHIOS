"use client";

import React, { useState, useEffect } from "react";

interface VaccineEvent {
  disease_name: string;
  disease_name_mr: string;
  schedule_timing: string;
  schedule_timing_mr: string;
  target_age_or_season: string;
  target_age_or_season_mr: string;
  importance: string;
  importance_mr: string;
  mandatory_govt_free: boolean;
}

interface FeedRationResult {
  species: string;
  body_weight_kg: number;
  daily_milk_litres: number;
  dry_matter_requirement_kg: number;
  green_fodder_kg: number;
  dry_fodder_kg: number;
  concentrate_cattle_feed_kg: number;
  mineral_mixture_grams: number;
  common_salt_grams: number;
  fresh_drinking_water_litres: number;
  estimated_daily_feed_cost_inr: number;
  estimated_daily_milk_revenue_inr: number;
  projected_daily_profit_inr: number;
  nutritional_tips: string[];
  nutritional_tips_mr: string[];
  source_citation: string;
}

interface LivestockModuleProps {
  lang: string;
  apiUrl: string;
}

export default function LivestockModule({ lang, apiUrl }: LivestockModuleProps) {
  const [subTab, setSubTab] = useState<"ration" | "vaccines">("ration");
  const [species, setSpecies] = useState("Crossbred Cow (HF / Jersey)");
  const [weight, setWeight] = useState(420);
  const [milk, setMilk] = useState(14);
  const [fat, setFat] = useState(4.2);
  const [ration, setRation] = useState<FeedRationResult | null>(null);
  const [vaccines, setVaccines] = useState<VaccineEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const res = await fetch(`${apiUrl}/livestock/vaccination-schedule`);
        if (res.ok) {
          setVaccines(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchVaccines();
  }, [apiUrl]);

  const handleCalculateRation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/livestock/feed-ration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species,
          body_weight_kg: weight,
          daily_milk_litres: milk,
          fat_percentage: fat,
        }),
      });
      if (res.ok) {
        setRation(await res.json());
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
            🐄 {lang === "mr" ? "पशु-मित्र: दुग्ध व्यवसाय आहार संतुलन व लसीकरण कॅलेंडर" : "Pashu-Mitra: Dairy Feed Balancer & Vaccination Tracker"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "एनडीआरआय (NDRI) व महाराष्ट्र पशु व मत्स्य विज्ञान विद्यापीठ (MAFSU) आहार मानके."
              : "ICAR-NDRI & MAFSU Nagpur nutritional benchmarks for optimal milk fat, SNF, and herd immunity."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setSubTab("ration")}
            style={{
              background: subTab === "ration" ? "var(--accent-lime)" : "var(--bg-card-subtle)",
              color: subTab === "ration" ? "#08160c" : "var(--text-secondary)",
              border: "1px solid var(--border-card)",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🥗 {lang === "mr" ? "संतुलित आहार (TMR)" : "Feed Balancer"}
          </button>
          <button
            onClick={() => setSubTab("vaccines")}
            style={{
              background: subTab === "vaccines" ? "var(--accent-lime)" : "var(--bg-card-subtle)",
              color: subTab === "vaccines" ? "#08160c" : "var(--text-secondary)",
              border: "1px solid var(--border-card)",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            💉 {lang === "mr" ? "लसीकरण वेळापत्रक" : "Vaccine Calendar"}
          </button>
        </div>
      </div>

      {subTab === "ration" && (
        <div>
          <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              <div>
                <label className="input-label">{lang === "mr" ? "जनावर / जात (Breed)" : "Animal & Breed"}</label>
                <select className="modern-select" value={species} onChange={(e) => setSpecies(e.target.value)}>
                  <option value="Crossbred Cow (HF / Jersey)">Crossbred Cow (HF / Jersey)</option>
                  <option value="Indigenous Cow (Gir / Sahiwal / Khillar)">Gir / Sahiwal / Khillar Cow</option>
                  <option value="Buffalo (Murrah / Pandharpuri)">Murrah / Pandharpuri Buffalo</option>
                  <option value="Goat (Osmanabadi / Sangamneri)">Osmanabadi Goat</option>
                </select>
              </div>

              <div>
                <label className="input-label">{lang === "mr" ? "जनावराचे वजन (Body Weight kg)" : "Body Weight (kg)"}</label>
                <input
                  type="number"
                  step="10"
                  className="modern-input"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 350)}
                />
              </div>

              <div>
                <label className="input-label">{lang === "mr" ? "दैनिक दूध उत्पादन (Litres/Day)" : "Daily Milk (Litres)"}</label>
                <input
                  type="number"
                  step="1"
                  className="modern-input"
                  value={milk}
                  onChange={(e) => setMilk(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="input-label">{lang === "mr" ? "दुधातील फॅट (Fat %)" : "Milk Fat %"}</label>
                <input
                  type="number"
                  step="0.1"
                  className="modern-input"
                  value={fat}
                  onChange={(e) => setFat(parseFloat(e.target.value) || 4.0)}
                />
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-lime-pill" onClick={handleCalculateRation} disabled={loading} style={{ padding: "10px 24px" }}>
                <span>{loading ? "Balancing Feed..." : lang === "mr" ? "🥗 संतुलित दैनंदिन चारा व ढेप काढा" : "Balance Daily Ration"}</span>
                <span className="circle-arrow-icon">↗</span>
              </button>
            </div>
          </div>

          {ration && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "हिरवा चारा (नेपियर / मका)" : "Green Fodder (Napier/Maize)"}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>{ration.green_fodder_kg} kg/day</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Fresh succulent forage</div>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "सुका चारा (सोयाबीन भुसकट / कडबा)" : "Dry Fodder (Straw/Kadba)"}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>{ration.dry_fodder_kg} kg/day</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Essential rumen fiber</div>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "पशुखाद्य / सरकी ढेप (Concentrate)" : "Concentrate Feed (Cattle Feed)"}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#38bdf8" }}>{ration.concentrate_cattle_feed_kg} kg/day</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Energy & crude protein</div>
                </div>

                <div style={{ background: "rgba(212, 249, 54, 0.08)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--accent-lime)", fontWeight: 700 }}>{lang === "mr" ? "दैनंदिन निव्वळ नफा (Profit)" : "Net Daily Profit"}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent-lime)" }}>₹{ration.projected_daily_profit_inr}</div>
                  <div style={{ fontSize: 11, color: "var(--text-primary)" }}>Milk Rev ₹{ration.estimated_daily_milk_revenue_inr} - Feed ₹{ration.estimated_daily_feed_cost_inr}</div>
                </div>
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--accent-lime)", marginBottom: 8 }}>
                  💧 {lang === "mr" ? "पिण्याचे पाणी व क्षार मिश्रण (Minerals):" : "Hydration & Mineral Supplements:"}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-primary)", marginBottom: 6 }}>
                  {lang === "mr"
                    ? `स्वच्छ पिण्याचे पाणी: ${ration.fresh_drinking_water_litres} लिटर | क्षार मिश्रण (Mineral Mixture): ${ration.mineral_mixture_grams} ग्रॅम | साधे मीठ: ${ration.common_salt_grams} ग्रॅम प्रतिदिन.`
                    : `Fresh Drinking Water: ${ration.fresh_drinking_water_litres} Litres | Mineral Mixture: ${ration.mineral_mixture_grams}g | Common Salt: ${ration.common_salt_grams}g per day.`}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {subTab === "vaccines" && (
        <div style={{ display: "grid", gap: 14 }}>
          {vaccines.map((v, idx) => (
            <div key={idx} style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                <h5 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  💉 {lang === "mr" ? v.disease_name_mr : v.disease_name}
                </h5>
                <span className="prov-badge live" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                  {lang === "mr" ? "शासकीय मोफत लस" : "FREE GOVT VACCINE"}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--accent-lime)", fontWeight: 700, marginBottom: 4 }}>
                ⏰ {lang === "mr" ? v.schedule_timing_mr : v.schedule_timing}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
                🎯 <strong>{lang === "mr" ? "पात्र जनावरे:" : "Eligible Cattle:"}</strong> {lang === "mr" ? v.target_age_or_season_mr : v.target_age_or_season}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                🛡️ {lang === "mr" ? v.importance_mr : v.importance}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
