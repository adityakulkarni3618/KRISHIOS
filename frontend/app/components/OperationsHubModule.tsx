"use client";

import React, { useState, useEffect } from "react";

interface LaborWageRate {
  district: string;
  operation_name: string;
  operation_name_mr: string;
  daily_wage_inr_male: number;
  daily_wage_inr_female: number;
  standard_working_hours: number;
  is_peak_season_active: boolean;
  notes_mr: string;
  notes_en: string;
}

interface LaborGroup {
  id: string;
  toli_leader_name: string;
  contact_phone: string;
  district: string;
  taluka: string;
  crew_size: number;
  specialization: string;
  specialization_mr: string;
  availability_status: string;
}

interface InputVerificationResult {
  lot_number: string;
  company_name: string;
  product_name: string;
  crop_variety: string;
  manufacturing_date: string;
  expiry_date: string;
  germination_pct_guaranteed: number;
  physical_purity_pct: number;
  authenticity_status: string;
  authenticity_message_mr: string;
  authenticity_message_en: string;
  verification_source: string;
}

interface GroundwaterAdvisory {
  district: string;
  village: string;
  average_depth_to_water_ft_bgl: number;
  water_table_trend: string;
  water_table_trend_mr: string;
  borewell_yield_potential_gph: number;
  critical_recharge_months: string;
  recommended_casing_depth_ft: number;
  recharge_structure_recommendation_mr: string;
  recharge_structure_recommendation_en: string;
  govt_subsidy_scheme: string;
  provenance: string;
}

interface OperationsHubProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function OperationsHubModule({ district, lang, apiUrl }: OperationsHubProps) {
  const [subTab, setSubTab] = useState<"labor" | "seed" | "groundwater">("labor");
  const [wageRates, setWageRates] = useState<LaborWageRate[]>([]);
  const [laborGroups, setLaborGroups] = useState<LaborGroup[]>([]);
  const [groundwater, setGroundwater] = useState<GroundwaterAdvisory | null>(null);
  const [lotInput, setLotInput] = useState("MAHY-COT-2026-9921");
  const [verificationResult, setVerificationResult] = useState<InputVerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchOperationsData = async () => {
      setLoading(true);
      try {
        const [wagesRes, groupsRes, gwRes] = await Promise.all([
          fetch(`${apiUrl}/operations/labor-hub/rates?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/operations/labor-hub/groups?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/operations/groundwater/advisory?district=${encodeURIComponent(district)}`),
        ]);

        if (wagesRes.ok) setWageRates(await wagesRes.json());
        if (groupsRes.ok) setLaborGroups(await groupsRes.json());
        if (gwRes.ok) setGroundwater(await gwRes.json());
      } catch (e) {
        console.error("Operations fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOperationsData();
  }, [apiUrl, district]);

  const handleVerifyInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotInput) return;
    setVerifying(true);
    try {
      const res = await fetch(`${apiUrl}/operations/input-verification/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lot_number: lotInput, dealer_license: "MH-NSK-RET-2025-412" }),
      });
      if (res.ok) {
        setVerificationResult(await res.json());
      }
    } catch (e) {
      console.error("Input verification error:", e);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="operations-hub-container">
      {/* Header */}
      <div className="module-banner-header">
        <div className="banner-text">
          <div className="banner-tag">👥 {lang === "mr" ? "शेत मजुरी, बियाणे पडताळणी व भूजल केंद्र" : "FARM OPERATIONS & VERIFICATION HUB"}</div>
          <h2 className="banner-title">
            {lang === "mr" ? "शेती कामे व निविष्ठा विश्वासार्हता केंद्र" : "Operational Productivity & Ground Integrity"}
          </h2>
          <p className="banner-subtitle">
            {lang === "mr"
              ? "गावनिहाय प्रचलित मजुरी दर, बियाणे/खत अस्सलपणा QR तपासणी आणि बोअरवेल पुनर्भरण सल्ला."
              : "District agricultural wage benchmarks, QR/Lot seed fraud verification, and GSDA aquifer recharge intelligence."}
          </p>
        </div>
      </div>

      {/* Subtab Selector */}
      <div className="subtab-pills">
        <button
          className={`subtab-pill ${subTab === "labor" ? "active" : ""}`}
          onClick={() => setSubTab("labor")}
        >
          👥 {lang === "mr" ? "मजूर दर व टोळी संपर्क" : "Labor Wages & Crew Hub"}
        </button>
        <button
          className={`subtab-pill ${subTab === "seed" ? "active" : ""}`}
          onClick={() => setSubTab("seed")}
        >
          🔍 {lang === "mr" ? "बियाणे अस्सलपणा (QR तपासणी)" : "Seed & Pesticide Authenticity"}
        </button>
        <button
          className={`subtab-pill ${subTab === "groundwater" ? "active" : ""}`}
          onClick={() => setSubTab("groundwater")}
        >
          💧 {lang === "mr" ? "भूजल पातळी व बोअरवेल पुनर्भरण" : "Groundwater Depth & Aquifer"}
        </button>
      </div>

      {loading && <div className="loading-spinner">⌛ {lang === "mr" ? "माहिती लोड होत आहे..." : "Loading records..."}</div>}

      {/* SUBTAB 1: LABOR HUB */}
      {!loading && subTab === "labor" && (
        <div className="labor-hub-grid">
          {/* Wage Rates Table */}
          <div className="glass-card wages-table-box">
            <div className="card-top-header">
              <span className="source-chip">🏛️ Maharashtra Agri Labor Board</span>
              <span className="info-chip">📍 {district}</span>
            </div>
            <h4>📋 {lang === "mr" ? "प्रचलित मजुरी दर (प्रति दिवस)" : "Prevailing Daily Wage Benchmarks"}</h4>
            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>{lang === "mr" ? "कामाचा प्रकार" : "Operation"}</th>
                    <th>{lang === "mr" ? "महिला मजूर" : "Female (₹)"}</th>
                    <th>{lang === "mr" ? "पुरुष मजूर" : "Male (₹)"}</th>
                    <th>{lang === "mr" ? "तास" : "Hours"}</th>
                    <th>{lang === "mr" ? "हंगाम स्थिती" : "Season"}</th>
                  </tr>
                </thead>
                <tbody>
                  {wageRates.map((rate, idx) => (
                    <tr key={idx}>
                      <td><strong>{lang === "mr" ? rate.operation_name_mr : rate.operation_name}</strong></td>
                      <td className="wage-highlight">₹{rate.daily_wage_inr_female}</td>
                      <td className="wage-highlight">₹{rate.daily_wage_inr_male}</td>
                      <td>{rate.standard_working_hours} hrs</td>
                      <td>
                        {rate.is_peak_season_active ? (
                          <span className="tag-peak">🔥 {lang === "mr" ? "गतीचा काळ (Peak)" : "Peak Surge"}</span>
                        ) : (
                          <span className="tag-normal">🟢 {lang === "mr" ? "सामान्य" : "Normal"}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contactable Labor Groups */}
          <div className="glass-card labor-groups-box">
            <h4>🤝 {lang === "mr" ? "उपलब्ध शेतमजूर टोळ्या (Contactable Crews)" : "Available Labor Crews"}</h4>
            <div className="groups-list">
              {laborGroups.map((grp) => (
                <div key={grp.id} className="crew-card">
                  <div className="crew-header">
                    <span className="crew-leader">👤 {grp.toli_leader_name}</span>
                    <span className={`crew-badge ${grp.availability_status === "AVAILABLE_NOW" ? "badge-success" : "badge-booked"}`}>
                      {grp.availability_status === "AVAILABLE_NOW"
                        ? (lang === "mr" ? "🟢 त्वरित उपलब्ध" : "AVAILABLE")
                        : (lang === "mr" ? "🔴 कामावर व्यस्त" : "BOOKED")}
                    </span>
                  </div>
                  <div className="crew-details">
                    <span>📍 {grp.taluka}, {grp.district}</span>
                    <span>👥 {grp.crew_size} {lang === "mr" ? "मजूर" : "members"}</span>
                    <span>🌾 {lang === "mr" ? grp.specialization_mr : grp.specialization}</span>
                  </div>
                  <div className="crew-action">
                    <a href={`tel:${grp.contact_phone}`} className="crew-call-btn">
                      📞 {lang === "mr" ? "मुकादमाला फोन करा" : "Call Leader"}: {grp.contact_phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SEED & INPUT VERIFICATION */}
      {!loading && subTab === "seed" && (
        <div className="seed-verification-box">
          <div className="glass-card verify-form-card">
            <h4>🔍 {lang === "mr" ? "बियाणे, खत किंवा औषध लॉट नंबर तपासा" : "Seed & Chemical Lot Verification"}</h4>
            <p className="verify-hint">
              {lang === "mr"
                ? "पोत्यावरील बारकोड / क्यूआर कोड किंवा लॉट क्रमांक टाकून शासनमान्य अस्सलता व उगवण क्षमता तपासा."
                : "Enter the Lot Number printed on the seed bag to verify Mahabeej / Seed Act certified purity."}
            </p>
            <form onSubmit={handleVerifyInput} className="lot-form">
              <input
                type="text"
                value={lotInput}
                onChange={(e) => setLotInput(e.target.value)}
                placeholder="उदा. MAHY-COT-2026-9921 किंवा BAY-NAT-2026-118"
                className="lot-input"
              />
              <button type="submit" className="verify-btn" disabled={verifying}>
                {verifying ? "तपासत आहे..." : (lang === "mr" ? "अस्सलता पडताळा" : "Verify Authenticity")}
              </button>
            </form>

            <div className="sample-lot-chips">
              <span className="sample-lbl">{lang === "mr" ? "चाचणीसाठी लॉट:" : "Sample Lots:"}</span>
              <button type="button" onClick={() => setLotInput("MAHY-COT-2026-9921")}>MAHY-COT (Genuine)</button>
              <button type="button" onClick={() => setLotInput("BAY-NAT-2026-118")}>BAY-NAT (Fungicide)</button>
              <button type="button" onClick={() => setLotInput("FAKE-LOT-000")}>FAKE-LOT (Spurious)</button>
            </div>
          </div>

          {verificationResult && (
            <div className={`glass-card result-card ${verificationResult.authenticity_status === "GENUINE_CERTIFIED" ? "card-verified" : "card-danger"}`}>
              <div className="result-header">
                <div>
                  <span className="source-chip">🏛️ {verificationResult.verification_source}</span>
                  <h3 className="product-title">{verificationResult.company_name} - {verificationResult.product_name}</h3>
                  <div className="product-variety">🌾 {verificationResult.crop_variety}</div>
                </div>
                <div className="auth-stamp">
                  {verificationResult.authenticity_status === "GENUINE_CERTIFIED" ? (
                    <span className="stamp-valid">✅ {lang === "mr" ? "१००% अस्सल बियाणे" : "GENUINE & CERTIFIED"}</span>
                  ) : (
                    <span className="stamp-invalid">⚠️ {lang === "mr" ? "संशयास्पद / बोगस इशारा" : "SPURIOUS / UNVERIFIED"}</span>
                  )}
                </div>
              </div>

              <div className="result-metrics">
                <div className="metric-box">
                  <span className="m-label">{lang === "mr" ? "उगवण क्षमता (Germination)" : "Germination Rate"}</span>
                  <span className="m-val">{verificationResult.germination_pct_guaranteed}%</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">{lang === "mr" ? "भौतिक शुद्धता (Purity)" : "Physical Purity"}</span>
                  <span className="m-val">{verificationResult.physical_purity_pct}%</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">{lang === "mr" ? "उत्पादन तारीख" : "Mfg Date"}</span>
                  <span className="m-val">{verificationResult.manufacturing_date}</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">{lang === "mr" ? "समाप्ती तारीख" : "Expiry Date"}</span>
                  <span className="m-val">{verificationResult.expiry_date}</span>
                </div>
              </div>

              <div className="auth-message-box">
                <p>{lang === "mr" ? verificationResult.authenticity_message_mr : verificationResult.authenticity_message_en}</p>
              </div>

              {verificationResult.authenticity_status !== "GENUINE_CERTIFIED" && (
                <div className="complaint-action-strip">
                  <span>🚨 {lang === "mr" ? "बोगस बियाणे विकणाऱ्याविरुद्ध तक्रार करा:" : "Report Spurious Input Dealer:"}</span>
                  <a href="tel:02025537553" className="report-btn">
                    📞 {lang === "mr" ? "गुण नियंत्रण कक्ष (020-25537553)" : "Quality Control Inspector"}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: GROUNDWATER & AQUIFER */}
      {!loading && subTab === "groundwater" && groundwater && (
        <div className="groundwater-grid">
          <div className="glass-card gw-stats-card">
            <div className="card-top-header">
              <span className="source-chip">🏛️ {groundwater.provenance}</span>
              <span className="info-chip">📍 {groundwater.village}, {groundwater.district}</span>
            </div>

            <h3 className="gw-depth-val">
              {groundwater.average_depth_to_water_ft_bgl} <span className="sub-unit">ft bgl</span>
            </h3>
            <p className="gw-depth-lbl">{lang === "mr" ? "भूजलाची सरासरी खोली (पाण्याचा थर)" : "Average Static Water Table Depth"}</p>

            <div className="gw-indicators">
              <div className="indicator-pill">
                <span>{lang === "mr" ? "पाणी पातळी कल" : "Water Trend"}:</span>
                <strong>{lang === "mr" ? groundwater.water_table_trend_mr : groundwater.water_table_trend}</strong>
              </div>
              <div className="indicator-pill">
                <span>{lang === "mr" ? "बोअरवेल अंदाज पाणी" : "Expected Yield"}:</span>
                <strong>{groundwater.borewell_yield_potential_gph} GPH (गॅलन/तास)</strong>
              </div>
              <div className="indicator-pill">
                <span>{lang === "mr" ? "केसिंग पाईप शिफारस" : "Recommended Casing"}:</span>
                <strong>{groundwater.recommended_casing_depth_ft} ft</strong>
              </div>
            </div>

            <div className="recharge-tip-box">
              <div className="tip-head">💧 {lang === "mr" ? "बोअरवेल पुनर्भरण (Recharge) उपाय" : "Artificial Recharge Protocol"}</div>
              <p className="tip-body">{lang === "mr" ? groundwater.recharge_structure_recommendation_mr : groundwater.recharge_structure_recommendation_en}</p>
            </div>

            <div className="subsidy-badge-strip">
              <span>🏛️ {lang === "mr" ? "१००% शासकीय अनुदान योजना:" : "Govt Subsidy Linkage:"}</span>
              <strong>{groundwater.govt_subsidy_scheme}</strong>
            </div>
          </div>

          <div className="glass-card recharge-diagram-card">
            <h4>📐 {lang === "mr" ? "बोअरवेल छताचे पाणी पुनर्भरण खड्डा (Recharge Pit)" : "Standard Aquifer Recharge Pit Design"}</h4>
            <div className="recharge-layers">
              <div className="layer-item filter-sand">
                <span className="l-name">1️⃣ {lang === "mr" ? "बारीक वाळूचा थर (६ इंच)" : "Fine River Sand Layer (6 in)"}</span>
                <span className="l-purpose">{lang === "mr" ? "गाळ व कचरा गाळणे" : "Filters silt"}</span>
              </div>
              <div className="layer-item filter-gravel">
                <span className="l-name">2️⃣ {lang === "mr" ? "बारीक खडी/बजरी (१२ इंच)" : "Gravel & Pebbles (12 in)"}</span>
                <span className="l-purpose">{lang === "mr" ? "मध्यम कण रोखणे" : "Filters medium particulates"}</span>
              </div>
              <div className="layer-item filter-boulder">
                <span className="l-name">3️⃣ {lang === "mr" ? "मोठे दगड/दगडी गोटे (१८ इंच)" : "Boulders & Charcoal (18 in)"}</span>
                <span className="l-purpose">{lang === "mr" ? "पाण्याचा वेग नियंत्रित करणे" : "Flow dispersion"}</span>
              </div>
              <div className="layer-item casing-mesh">
                <span className="l-name">4️⃣ {lang === "mr" ? "नायलॉन जाळी वेढलेला छिद्राचा पाईप" : "Slotted Casing with SS Mesh"}</span>
                <span className="l-purpose">{lang === "mr" ? "स्वच्छ पाणी भूगर्भात सोडणे" : "Direct deep injection"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
