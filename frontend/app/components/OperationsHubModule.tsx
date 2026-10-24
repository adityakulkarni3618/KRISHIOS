"use client";

import React, { useState, useEffect } from "react";

interface LaborWageBenchmark {
  operation_type: string;
  operation_type_mr: string;
  daily_wage_standard_inr: number;
  piece_rate_rate: string;
  piece_rate_rate_mr: string;
  season: string;
  hours_per_day: number;
}

interface LaborGroup {
  id: string;
  leader_name: string;
  group_size: number;
  taluka: string;
  district: string;
  contact_phone: string;
  specialization: string;
  specialization_mr: string;
  available_now: boolean;
  verified_identity: boolean;
}

interface LaborHubResult {
  district: string;
  prevailing_wages: LaborWageBenchmark[];
  available_labor_groups: LaborGroup[];
  guidelines_for_employers: string[];
  guidelines_for_employers_mr: string[];
  provenance: string;
  source_citation: string;
}

interface SeedVerificationResult {
  is_genuine_format: boolean;
  status: string;
  status_mr: string;
  variety_registered: boolean;
  recommended_germination_pct: number;
  maximum_retail_price_notified: number;
  authenticity_checklist: string[];
  authenticity_checklist_mr: string[];
  complaint_helpline: string;
  provenance: string;
  source_citation: string;
}

interface AuthorizedDealer {
  shop_name: string;
  proprietor: string;
  license_number: string;
  district: string;
  taluka: string;
  contact_phone: string;
  is_active_license: boolean;
}

interface GroundWaterStatus {
  district: string;
  taluka: string;
  watershed_code: string;
  aquifer_classification: string;
  aquifer_classification_mr: string;
  pre_monsoon_water_level_m: number;
  post_monsoon_water_level_m: number;
  recommended_borewell_depth_ft: string;
  recommended_borewell_depth_ft_mr: string;
  deep_drilling_risk: string;
  deep_drilling_risk_mr: string;
  borewell_recharge_design: string[];
  borewell_recharge_design_mr: string[];
  provenance: string;
  source_citation: string;
}

interface OperationsHubProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function OperationsHubModule({ district, lang, apiUrl }: OperationsHubProps) {
  const [subTab, setSubTab] = useState<"labor" | "seed" | "groundwater">("labor");
  const [laborData, setLaborData] = useState<LaborHubResult | null>(null);
  const [dealers, setDealers] = useState<AuthorizedDealer[]>([]);
  const [groundwater, setGroundwater] = useState<GroundWaterStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Seed Verification form state
  const [lotInput, setLotInput] = useState("MH-COT-2026-9921");
  const [cropInput, setCropInput] = useState("Cotton");
  const [companyInput, setCompanyInput] = useState("Mahabeej Seeds Corp");
  const [varietyInput, setVarietyInput] = useState("Ajeet 155 BG-II");
  const [mrpInput, setMrpInput] = useState(864);
  const [verificationResult, setVerificationResult] = useState<SeedVerificationResult | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchOperationsData = async () => {
      setLoading(true);
      try {
        const [laborRes, dealerRes, gwRes] = await Promise.all([
          fetch(`${apiUrl}/operations/labor-hub?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/operations/authorized-dealers?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/operations/groundwater?district=${encodeURIComponent(district)}`),
        ]);

        if (laborRes.ok) setLaborData(await laborRes.json());
        if (dealerRes.ok) setDealers(await dealerRes.json());
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
    setVerifying(true);
    try {
      const res = await fetch(`${apiUrl}/operations/verify-seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: cropInput,
          company_name: companyInput,
          variety_name: varietyInput,
          lot_number: lotInput,
          mrp_inr: Number(mrpInput),
        }),
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
      {!loading && subTab === "labor" && laborData && (
        <div className="labor-hub-grid">
          {/* Wage Rates Table */}
          <div className="glass-card wages-table-box">
            <div className="card-top-header">
              <span className="source-chip">🏛️ {laborData.provenance} • {laborData.source_citation}</span>
              <span className="info-chip">📍 {laborData.district}</span>
            </div>
            <h4>📋 {lang === "mr" ? "प्रचलित मजुरी दर (प्रति दिवस)" : "Prevailing Daily Wage Benchmarks"}</h4>
            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>{lang === "mr" ? "कामाचा प्रकार" : "Operation"}</th>
                    <th>{lang === "mr" ? "दैनिक दर (८ तास)" : "Daily Wage"}</th>
                    <th>{lang === "mr" ? "उखळ/नग दर (Piece Rate)" : "Piece Rate"}</th>
                    <th>{lang === "mr" ? "हंगाम" : "Season"}</th>
                  </tr>
                </thead>
                <tbody>
                  {laborData.prevailing_wages.map((rate, idx) => (
                    <tr key={idx}>
                      <td><strong>{lang === "mr" ? rate.operation_type_mr : rate.operation_type}</strong></td>
                      <td className="wage-highlight">₹{rate.daily_wage_standard_inr}</td>
                      <td>{lang === "mr" ? rate.piece_rate_rate_mr : rate.piece_rate_rate}</td>
                      <td><span className="tag-peak">{rate.season}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 18 }}>
              <h5>💡 {lang === "mr" ? "शेतकऱ्यांसाठी मजुरी मार्गदर्शक तत्त्वे" : "Guidelines for Employers"}:</h5>
              <ul style={{ paddingLeft: 18, marginTop: 6, fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                {(lang === "mr" ? laborData.guidelines_for_employers_mr : laborData.guidelines_for_employers).map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contactable Labor Groups */}
          <div className="glass-card labor-groups-box">
            <h4>🤝 {lang === "mr" ? "उपलब्ध शेतमजूर टोळ्या (Contactable Crews)" : "Available Labor Crews"}</h4>
            <div className="groups-list">
              {laborData.available_labor_groups.map((grp) => (
                <div key={grp.id} className="crew-card">
                  <div className="crew-header">
                    <span className="crew-leader">👤 {grp.leader_name}</span>
                    <span className={`crew-badge ${grp.available_now ? "badge-success" : "badge-booked"}`}>
                      {grp.available_now
                        ? (lang === "mr" ? "🟢 त्वरित उपलब्ध" : "AVAILABLE")
                        : (lang === "mr" ? "🔴 कामावर व्यस्त" : "BOOKED")}
                    </span>
                  </div>
                  <div className="crew-details">
                    <span>📍 {grp.taluka}, {grp.district}</span>
                    <span>👥 {grp.group_size} {lang === "mr" ? "मजूर" : "members"}</span>
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
            <form onSubmit={handleVerifyInput} className="lot-form-grid">
              <div className="form-group">
                <label>{lang === "mr" ? "लॉट क्रमांक (Lot Number)" : "Lot Number"}</label>
                <input
                  type="text"
                  value={lotInput}
                  onChange={(e) => setLotInput(e.target.value)}
                  placeholder="उदा. MH-COT-2026-9921"
                  className="lot-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>{lang === "mr" ? "कंपनीचे नाव" : "Company"}</label>
                <input type="text" value={companyInput} onChange={(e) => setCompanyInput(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>{lang === "mr" ? "वाण / जात" : "Variety"}</label>
                <input type="text" value={varietyInput} onChange={(e) => setVarietyInput(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>{lang === "mr" ? "एमआरपी किंमत (₹)" : "MRP Price (₹)"}</label>
                <input type="number" value={mrpInput} onChange={(e) => setMrpInput(Number(e.target.value))} required />
              </div>
              <div className="form-actions" style={{ gridColumn: "1 / -1" }}>
                <button type="submit" className="verify-btn" disabled={verifying}>
                  {verifying ? "तपासत आहे..." : (lang === "mr" ? "अस्सलता पडताळा" : "Verify Authenticity")}
                </button>
              </div>
            </form>

            <div className="sample-lot-chips">
              <span className="sample-lbl">{lang === "mr" ? "चाचणीसाठी लॉट:" : "Sample Lots:"}</span>
              <button type="button" onClick={() => setLotInput("MH-COT-2026-9921")}>MH-COT-2026-9921 (Certified Genuine)</button>
              <button type="button" onClick={() => setLotInput("MAHY-SOY-2026-4412")}>MAHY-SOY-2026-4412 (Soybean)</button>
              <button type="button" onClick={() => setLotInput("FAKE-LOT-0000-XYZ")}>FAKE-LOT (Spurious Alert)</button>
            </div>
          </div>

          {verificationResult && (
            <div className={`glass-card result-card ${verificationResult.is_genuine_format ? "card-verified" : "card-danger"}`}>
              <div className="result-header">
                <div>
                  <span className="source-chip">🏛️ {verificationResult.provenance} • {verificationResult.source_citation}</span>
                  <h3 className="product-title">{companyInput} - {varietyInput}</h3>
                  <div className="product-variety">🌾 Lot: <strong>{lotInput}</strong></div>
                </div>
                <div className="auth-stamp">
                  {verificationResult.is_genuine_format ? (
                    <span className="stamp-valid">✅ {lang === "mr" ? verificationResult.status_mr : verificationResult.status}</span>
                  ) : (
                    <span className="stamp-invalid">⚠️ {lang === "mr" ? verificationResult.status_mr : verificationResult.status}</span>
                  )}
                </div>
              </div>

              <div className="result-metrics">
                <div className="metric-box">
                  <span className="m-label">{lang === "mr" ? "किमान उगवण क्षमता" : "Germination Rate"}</span>
                  <span className="m-val">{verificationResult.recommended_germination_pct}%</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">{lang === "mr" ? "शासन अधिसूचित कमाल भाव" : "Notified Max MRP"}</span>
                  <span className="m-val">₹{verificationResult.maximum_retail_price_notified}</span>
                </div>
                <div className="metric-box">
                  <span className="m-label">{lang === "mr" ? "बियाणे कायदा नोंदणी" : "Seed Act Status"}</span>
                  <span className="m-val">{verificationResult.variety_registered ? "नोंदणीकृत (Registered)" : "अनोंदणीकृत"}</span>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <h5>📋 {lang === "mr" ? "खरेदी करताना तपासायच्या बाबी" : "Authenticity Checklist"}:</h5>
                <ul style={{ paddingLeft: 18, marginTop: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                  {(lang === "mr" ? verificationResult.authenticity_checklist_mr : verificationResult.authenticity_checklist).map((chk, idx) => (
                    <li key={idx}>{chk}</li>
                  ))}
                </ul>
              </div>

              <div className="complaint-action-strip">
                <span>🚨 {lang === "mr" ? "बोगस बियाणे विकणाऱ्याविरुद्ध तक्रार करा:" : "Report Spurious Input Dealer:"}</span>
                <a href={`tel:${verificationResult.complaint_helpline}`} className="report-btn">
                  📞 {lang === "mr" ? `कृषी विभाग तक्रार कक्ष (${verificationResult.complaint_helpline})` : `Agri Dept Helpline (${verificationResult.complaint_helpline})`}
                </a>
              </div>
            </div>
          )}

          {/* Authorized Dealers in District */}
          {dealers.length > 0 && (
            <div className="glass-card dealers-box" style={{ marginTop: 20 }}>
              <h4>🏛️ {lang === "mr" ? `जिल्ह्यातील परवानाधारक कृषी सेवा केंद्रे (${district})` : `Authorized Dealers in ${district}`}</h4>
              <div className="dealers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginTop: 12 }}>
                {dealers.map((dlr, idx) => (
                  <div key={idx} style={{ background: "var(--bg-card-subtle)", padding: 12, borderRadius: 8, border: "1px solid var(--border-card)" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{dlr.shop_name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>👤 {dlr.proprietor} • 📍 {dlr.taluka}</div>
                    <div style={{ fontSize: 11, color: "var(--accent-lime)", marginTop: 4 }}>📜 परवाना: {dlr.license_number}</div>
                    <a href={`tel:${dlr.contact_phone}`} style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: "#38bdf8", textDecoration: "none" }}>
                      📞 {dlr.contact_phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: GROUNDWATER & AQUIFER */}
      {!loading && subTab === "groundwater" && groundwater && (
        <div className="groundwater-grid">
          <div className="glass-card gw-stats-card">
            <div className="card-top-header">
              <span className="source-chip">🏛️ {groundwater.provenance} • {groundwater.source_citation}</span>
              <span className="info-chip">📍 {groundwater.taluka}, {groundwater.district}</span>
            </div>

            <h3 className="gw-depth-val">
              {groundwater.pre_monsoon_water_level_m} <span className="sub-unit">मीटर भूजल खोली</span>
            </h3>
            <p className="gw-depth-lbl">{lang === "mr" ? "पावसाळ्यापूर्वीची सरासरी भूजल पातळी (भूगर्भात)" : "Pre-Monsoon Static Water Table"}</p>

            <div className="gw-indicators">
              <div className="indicator-pill">
                <span>{lang === "mr" ? "पाणलोट क्षेत्र कोड" : "Watershed Code"}:</span>
                <strong>{groundwater.watershed_code}</strong>
              </div>
              <div className="indicator-pill">
                <span>{lang === "mr" ? "भूजल शोषण स्थिती" : "Aquifer Classification"}:</span>
                <strong>{lang === "mr" ? groundwater.aquifer_classification_mr : groundwater.aquifer_classification}</strong>
              </div>
              <div className="indicator-pill">
                <span>{lang === "mr" ? "पावसाळ्यानंतरची पातळी" : "Post-Monsoon Depth"}:</span>
                <strong>{groundwater.post_monsoon_water_level_m} मीटर</strong>
              </div>
              <div className="indicator-pill">
                <span>{lang === "mr" ? "शिफारस केलेली बोअरवेल खोली" : "Recommended Depth"}:</span>
                <strong>{lang === "mr" ? groundwater.recommended_borewell_depth_ft_mr : groundwater.recommended_borewell_depth_ft}</strong>
              </div>
            </div>

            <div className="recharge-tip-box" style={{ background: "rgba(239, 68, 68, 0.1)", borderLeft: "3px solid #ef4444", padding: 12, borderRadius: 6, margin: "14px 0" }}>
              <div className="tip-head" style={{ fontWeight: 800, color: "#f87171", fontSize: 13 }}>⚠️ {lang === "mr" ? "अतिखोल बोअरवेल धोका इशारा" : "Deep Drilling Hazard"}:</div>
              <p className="tip-body" style={{ fontSize: 13, marginTop: 4, color: "var(--text-primary)" }}>{lang === "mr" ? groundwater.deep_drilling_risk_mr : groundwater.deep_drilling_risk}</p>
            </div>
          </div>

          <div className="glass-card recharge-diagram-card">
            <h4>📐 {lang === "mr" ? "बोअरवेल छताचे पाणी पुनर्भरण खड्डा (Recharge Pit)" : "Standard Aquifer Recharge Pit Design"}</h4>
            <div className="recharge-layers">
              {groundwater.borewell_recharge_design.map((step, idx) => (
                <div key={idx} className={`layer-item ${idx === 0 ? "filter-sand" : idx === 1 ? "filter-gravel" : idx === 2 ? "filter-boulder" : "casing-mesh"}`}>
                  <span className="l-name">{lang === "mr" ? groundwater.borewell_recharge_design_mr[idx] || step : step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
