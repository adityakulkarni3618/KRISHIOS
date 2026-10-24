"use client";

import React, { useState } from "react";

interface ClaimStep {
  step_number: number;
  title: string;
  title_mr: string;
  timeline: string;
  timeline_mr: string;
  action_required: string;
  action_required_mr: string;
  urgent: boolean;
}

interface InsuranceClaimEstimateResult {
  crop: string;
  district: string;
  area_hectares: number;
  total_sum_insured_inr: number;
  farmer_token_premium_inr: number;
  state_subsidy_borne_inr: number;
  estimated_claim_payout_inr: number;
  intimation_deadline_warning: string;
  intimation_deadline_warning_mr: string;
  action_checklist: ClaimStep[];
  toll_free_helpline: string;
  required_documents: string[];
  required_documents_mr: string[];
  official_portal_url: string;
  source_citation: string;
}

interface InsuranceModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function InsuranceModule({ district, lang, apiUrl }: InsuranceModuleProps) {
  const [crop, setCrop] = useState("Soybean");
  const [areaHa, setAreaHa] = useState(1.5);
  const [lossPct, setLossPct] = useState(60);
  const [calamity, setCalamity] = useState("excess_rain");
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<InsuranceClaimEstimateResult | null>(null);

  const calculateClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/insurance/estimate-claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          district,
          area_hectares: areaHa,
          calamity_type: calamity,
          estimated_loss_percentage: lossPct,
        }),
      });
      if (res.ok) {
        setEstimate(await res.json());
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
            🛡️ {lang === "mr" ? "प्रधानमंत्री पीक विमा (PMFBY) ₹१ योजना व क्लेम मदत कक्ष" : "PMFBY ₹1 Crop Insurance & Emergency Claim Desk"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "महाराष्ट्र शासनाचा ₹१ हप्ता निर्णय, ७२ तासांत नुकसानीची पूर्वसूचना व पंचनामा मार्गदर्शक."
              : "Official Maharashtra ₹1 token premium policy, 72-hour disaster intimation rules, and payout estimation."}
          </p>
        </div>
        <span className="prov-badge live" style={{ background: "#f59e0b", color: "#000" }}>₹1 GOVT SCHEME</span>
      </div>

      {/* Inputs */}
      <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <div>
            <label className="input-label">{lang === "mr" ? "पीक (Crop)" : "Crop"}</label>
            <select className="modern-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Cotton">Cotton (कापूस)</option>
              <option value="Pigeonpea">Pigeonpea (तूर)</option>
              <option value="Paddy">Paddy / Rice (भात)</option>
              <option value="Onion">Onion (कांदा)</option>
              <option value="Sugarcane">Sugarcane (ऊस)</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "क्षेत्र हेक्टर (Area in Ha)" : "Area (Hectares)"}</label>
            <input
              type="number"
              step="0.1"
              className="modern-input"
              value={areaHa}
              onChange={(e) => setAreaHa(parseFloat(e.target.value) || 1.0)}
            />
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "आपत्तीचा प्रकार (Calamity)" : "Calamity Cause"}</label>
            <select className="modern-select" value={calamity} onChange={(e) => setCalamity(e.target.value)}>
              <option value="excess_rain">{lang === "mr" ? "अतिवृष्टी (Excessive Rain)" : "Excessive Rain"}</option>
              <option value="inundation_flood">{lang === "mr" ? "पूर / शेतात पाणी साचणे (Flood)" : "Inundation / Waterlogging"}</option>
              <option value="drought_dry_spell">{lang === "mr" ? "पावसाचा खंड / दुष्काळ (Dry Spell)" : "Severe Dry Spell"}</option>
              <option value="hailstorm">{lang === "mr" ? "गारपीट (Hailstorm)" : "Hailstorm"}</option>
              <option value="pest_epidemic">{lang === "mr" ? "कीड-रोग प्रादुर्भाव (Pest Outbreak)" : "Pest / Disease Epidemic"}</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "अंदाजे नुकसान टक्के (% Loss)" : "Estimated Crop Loss %"}</label>
            <input
              type="number"
              min="10"
              max="100"
              className="modern-input"
              value={lossPct}
              onChange={(e) => setLossPct(parseInt(e.target.value) || 50)}
            />
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-lime-pill" onClick={calculateClaim} disabled={loading} style={{ padding: "10px 24px" }}>
            <span>{loading ? "Calculating Claim..." : lang === "mr" ? "🛡️ संभाव्य भरपाई व क्लेम पायऱ्या पाहा" : "Calculate Claim & Checklist"}</span>
            <span className="circle-arrow-icon">↗</span>
          </button>
        </div>
      </div>

      {estimate && (
        <div>
          {/* Emergency Alert Banner */}
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: "var(--radius-md)", padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#f87171" }}>
              {lang === "mr" ? estimate.intimation_deadline_warning_mr : estimate.intimation_deadline_warning}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-primary)" }}>
              📞 {lang === "mr" ? "टोल-फ्री विमा तक्रार निवारण क्रमांक:" : "National Toll-Free Claim Helpline:"}{" "}
              <strong style={{ color: "var(--accent-lime)", fontSize: 16 }}>{estimate.toll_free_helpline}</strong>
            </div>
          </div>

          {/* Economics Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "शेतकरी हप्ता (आपण भरलेला)" : "Farmer Paid Premium"}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#10b981" }}>₹{estimate.farmer_token_premium_inr}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>महाराष्ट्र शासन ₹१ योजना</div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "शासनाने उचललेला विमा भार" : "State Premium Subsidy"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>₹{estimate.state_subsidy_borne_inr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Actuarial Subsidy Borne</div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "एकूण विमा संरक्षित रक्कम" : "Total Sum Insured"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>₹{estimate.total_sum_insured_inr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Official Per Hectare Norm</div>
            </div>

            <div style={{ background: "rgba(212, 249, 54, 0.08)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--accent-lime)", fontWeight: 700 }}>{lang === "mr" ? "संभाव्य नुकसान भरपाई (Claim)" : "Estimated Claim Payout"}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent-lime)" }}>₹{estimate.estimated_claim_payout_inr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-primary)" }}>Direct DBT into Bank Account</div>
            </div>
          </div>

          {/* Action Checklist */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 18, marginBottom: 20 }}>
            <h5 style={{ fontSize: 16, fontWeight: 800, color: "var(--accent-lime)", marginBottom: 14 }}>
              📋 {lang === "mr" ? "क्लेम मिळवण्यासाठी ३ अनिवार्य पायऱ्या (Checklist)" : "Mandatory 3-Step Claim Action Plan"}
            </h5>
            <div style={{ display: "grid", gap: 12 }}>
              {estimate.action_checklist.map((step) => (
                <div key={step.step_number} style={{ background: "var(--bg-card-subtle)", padding: 14, borderRadius: 8, borderLeft: step.urgent ? "4px solid #ef4444" : "4px solid #10b981" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                    <strong style={{ fontSize: 14, color: "var(--text-primary)" }}>
                      {lang === "mr" ? step.title_mr : step.title}
                    </strong>
                    <span style={{ fontSize: 11, color: step.urgent ? "#f87171" : "#10b981", fontWeight: 700 }}>
                      ⏱️ {lang === "mr" ? step.timeline_mr : step.timeline}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
                    {lang === "mr" ? step.action_required_mr : step.action_required}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents */}
          <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-primary)", marginBottom: 8 }}>
              📁 {lang === "mr" ? "पंचनाम्यासाठी आवश्यक कागदपत्रे:" : "Documents Required for Field Verification:"}
            </div>
            <ul style={{ paddingLeft: 18, fontSize: 12, color: "var(--text-secondary)" }}>
              {(lang === "mr" ? estimate.required_documents_mr : estimate.required_documents).map((doc, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{doc}</li>
              ))}
            </ul>
            <div style={{ marginTop: 12 }}>
              <a
                href={estimate.official_portal_url}
                target="_blank"
                rel="noreferrer"
                className="btn-lime-pill"
                style={{ padding: "8px 18px", fontSize: 12, textDecoration: "none", display: "inline-flex", width: "fit-content" }}
              >
                <span>PMFBY Portal (pmfby.gov.in)</span>
                <span className="circle-arrow-icon">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
