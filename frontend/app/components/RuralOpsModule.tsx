"use client";

import React, { useState, useEffect } from "react";

interface FeederScheduleItem {
  district: string;
  substation_name: string;
  feeder_name: string;
  current_status: string;
  active_shift: string;
  shift_hours: string;
  shift_hours_mr: string;
  next_shift_rotation_date: string;
  current_voltage: number;
  voltage_health: string;
  irrigation_advisory: string;
  irrigation_advisory_mr: string;
  helpline_number: string;
  schedule_note?: string;
  schedule_note_mr?: string;
  provenance: string;
  source_citation: string;
}

interface EmergencyHospital {
  name: string;
  name_mr: string;
  facility_type: string;
  taluka: string;
  district: string;
  availability_note?: string;
  availability_note_mr?: string;
  emergency_phone: string;
  distance_km: number;
  ambulance_available: boolean;
}

interface FirstAidProtocol {
  hazard_title: string;
  hazard_title_mr: string;
  critical_time_window: string;
  critical_time_window_mr: string;
  immediate_dos: string[];
  immediate_dos_mr: string[];
  strict_donts: string[];
  strict_donts_mr: string[];
  medical_action_info?: string;
  medical_action_info_mr?: string;
}

interface EmergencySOSResult {
  district: string;
  emergency_toll_free: string;
  hospital_directory_note?: string;
  hospital_directory_note_mr?: string;
  snakebite_protocol: FirstAidProtocol;
  pesticide_poisoning_protocol: FirstAidProtocol;
  nearby_asv_hospitals: EmergencyHospital[];
  provenance: string;
  source_citation: string;
}

interface BioInputRecipe {
  id: string;
  name: string;
  name_mr: string;
  category: string;
  target_problems: string[];
  target_problems_mr: string[];
  preparation_time_days: number;
  shelf_life_days: number;
  cost_per_acre_inr: number;
  ingredients: string[];
  ingredients_mr: string[];
  step_by_step_instructions: string[];
  step_by_step_instructions_mr: string[];
  dosage_and_application: string;
  dosage_and_application_mr: string;
  key_benefit: string;
  key_benefit_mr: string;
  provenance: string;
  source_citation: string;
}

interface RuralOpsModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function RuralOpsModule({ district, lang, apiUrl }: RuralOpsModuleProps) {
  const [subTab, setSubTab] = useState<"electricity" | "sos" | "bioinputs">("electricity");
  const [feeder, setFeeder] = useState<FeederScheduleItem | null>(null);
  const [sosData, setSosData] = useState<EmergencySOSResult | null>(null);
  const [recipes, setRecipes] = useState<BioInputRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<BioInputRecipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRuralOpsData = async () => {
      setLoading(true);
      try {
        const [feedRes, sosRes, bioRes] = await Promise.all([
          fetch(`${apiUrl}/rural-ops/electricity?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/rural-ops/emergency-sos?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/rural-ops/bio-recipes`),
        ]);

        if (feedRes.ok) setFeeder(await feedRes.json());
        if (sosRes.ok) setSosData(await sosRes.json());
        if (bioRes.ok) {
          const recList: BioInputRecipe[] = await bioRes.json();
          setRecipes(recList);
          if (recList.length > 0) setSelectedRecipe(recList[0]);
        }
      } catch (err) {
        console.error("Rural ops fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRuralOpsData();
  }, [apiUrl, district]);

  const isPowerOn = feeder?.current_status === "POWER_ACTIVE";

  return (
    <div className="rural-ops-container">
      {/* Module Header */}
      <div className="module-banner-header">
        <div className="banner-text">
          <div className="banner-tag">⚡ {lang === "mr" ? "ग्रामीण वीज, सुरक्षा व सेंद्रिय निविष्ठा" : "RURAL OPS, SAFETY & BIO-INPUTS"}</div>
          <h2 className="banner-title">
            {lang === "mr" ? "शेतकरी दैनंदिन समस्या निवारण केंद्र" : "Rural Lifeline & Emergency Action Center"}
          </h2>
          <p className="banner-subtitle">
            {lang === "mr"
              ? "३-फेज वीज वेळापत्रक, सर्पदंश/विषबाधा आणीबाणी ASV लस उपलब्धता आणि शून्य खर्चाचे देशी जीवामृत सूत्र."
              : "3-Phase feeder roster, Anti-Snake Venom (ASV) hospital locator, and ₹0-cost university bio-input lab."}
          </p>
        </div>
        <div className="banner-metrics">
          <div className="metric-pill">
            <span className="metric-icon">🔌</span>
            <div>
              <div className="metric-val">{isPowerOn ? (lang === "mr" ? "सुरू (ON)" : "POWER ON") : (lang === "mr" ? "बंद (OFF)" : "POWER OFF")}</div>
              <div className="metric-lbl">{lang === "mr" ? "३-फेज वीज स्थिती" : "3-Phase Power"}</div>
            </div>
          </div>
          <div className="metric-pill emergency-pill">
            <span className="metric-icon">🚨</span>
            <div>
              <div className="metric-val">108 / 104</div>
              <div className="metric-lbl">{lang === "mr" ? "आणीबाणी रुग्णवाहिका" : "Ambulance SOS"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Subtabs */}
      <div className="subtab-pills">
        <button
          className={`subtab-pill ${subTab === "electricity" ? "active" : ""}`}
          onClick={() => setSubTab("electricity")}
        >
          ⚡ {lang === "mr" ? "३-फेज वीज वेळापत्रक" : "3-Phase Feeder Roster"}
        </button>
        <button
          className={`subtab-pill emergency-tab ${subTab === "sos" ? "active" : ""}`}
          onClick={() => setSubTab("sos")}
        >
          🚨 {lang === "mr" ? "सर्पदंश व विषबाधा SOS" : "Snakebite & Poison SOS"}
        </button>
        <button
          className={`subtab-pill ${subTab === "bioinputs" ? "active" : ""}`}
          onClick={() => setSubTab("bioinputs")}
        >
          🌿 {lang === "mr" ? "शून्य-खर्च देशी औषधे (जीवामृत)" : "Zero-Cost Desi Bio-Inputs"}
        </button>
      </div>

      {loading && <div className="loading-spinner">⌛ {lang === "mr" ? "माहिती लोड होत आहे..." : "Loading records..."}</div>}

      {/* SUBTAB 1: ELECTRICITY */}
      {!loading && subTab === "electricity" && feeder && (
        <div className="feeder-section-grid">
          <div className="glass-card feeder-status-card">
            <div className="card-top-header">
              <span className="source-chip">⚡ {feeder.provenance} • {feeder.source_citation}</span>
              <span className={`status-badge ${isPowerOn ? "badge-success" : "badge-danger"}`}>
                {isPowerOn
                  ? (lang === "mr" ? "🟢 वीज सुरू आहे (POWER ON)" : "🟢 POWER ACTIVE")
                  : (lang === "mr" ? "🔴 वीज बंद आहे (OFF SHIFT)" : "🔴 POWER OFF")}
              </span>
            </div>

            <h3 className="feeder-name">{feeder.feeder_name}</h3>
            <p className="feeder-substation">📍 {feeder.substation_name}, {feeder.district}</p>

            {/* Feeder schedule sample notice */}
            <div style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid #f59e0b",
              borderRadius: "8px",
              padding: "8px 12px",
              margin: "10px 0 14px 0",
              fontSize: 12,
              color: "#fbbf24",
              display: "flex",
              alignItems: "center",
              gap: 8,
              lineHeight: 1.4
            }}>
              <span>ℹ️</span>
              <span>
                {lang === "mr"
                  ? (feeder.schedule_note_mr || "नमुना माहिती - वेळापत्रक प्रत्येक फिडरनुसार बदलते. कृपया आपल्या स्थानिक महावितरण (MSEDCL) कार्यालयातून खात्री करा.")
                  : (feeder.schedule_note || "Sample data - schedules vary by feeder. Confirm with your local MSEDCL office.")}
              </span>
            </div>

            <div className="feeder-time-box">
              <div className="time-col">
                <span className="time-lbl">{lang === "mr" ? "सध्याची पाळी" : "Current Shift"}</span>
                <span className="time-val highlight">
                  {feeder.active_shift === "day_shift" ? (lang === "mr" ? "दिवस पाळी (Day)" : "Day Shift") : (lang === "mr" ? "रात्र पाळी (Night)" : "Night Shift")}
                </span>
              </div>
              <div className="time-col">
                <span className="time-lbl">{lang === "mr" ? "८ तास वीज वेळ" : "Active Hours"}</span>
                <span className="time-val">{lang === "mr" ? feeder.shift_hours_mr : feeder.shift_hours}</span>
              </div>
              <div className="time-col">
                <span className="time-lbl">{lang === "mr" ? "पुढील पाळी बदल" : "Rotation Date"}</span>
                <span className="time-val">{feeder.next_shift_rotation_date}</span>
              </div>
            </div>

            <div className="voltage-monitor-box">
              <div className="voltage-meta">
                <span>{lang === "mr" ? "व्होल्टेज गुणवत्ता" : "Voltage Health"}: <strong>{feeder.current_voltage} V</strong></span>
                {feeder.voltage_health === "OPTIMAL_NORMAL" ? (
                  <span className="safe-pill">✅ {lang === "mr" ? "३-फेज स्थिर व्होल्टेज" : "Stable 3-Phase"}</span>
                ) : (
                  <span className="warning-pill">⚠️ {lang === "mr" ? "कमी व्होल्टेज इशारा" : "Low Voltage Alert"}</span>
                )}
              </div>
              <div className="voltage-bar">
                <div
                  className="voltage-fill"
                  style={{
                    width: `${Math.min(100, (feeder.current_voltage / 440) * 100)}%`,
                    background: feeder.voltage_health === "OPTIMAL_NORMAL" ? "#22c55e" : "#ef4444",
                  }}
                />
              </div>
            </div>

            <div className="recommendation-box">
              <div className="rec-title">💡 {lang === "mr" ? "पंप व ओलीत सल्ला" : "Irrigation Advisory"}</div>
              <p className="rec-text">{lang === "mr" ? feeder.irrigation_advisory_mr : feeder.irrigation_advisory}</p>
            </div>

            <div className="feeder-actions">
              <a href={`tel:${feeder.helpline_number}`} className="action-btn-call">
                📞 {lang === "mr" ? `महावितरण हेल्पलाइन (${feeder.helpline_number})` : `MSEDCL Helpline (${feeder.helpline_number})`}
              </a>
            </div>
          </div>

          <div className="glass-card feeder-tips-card">
            <h4>⚡ {lang === "mr" ? "शेतकरी वीज बचत व मोटर सुरक्षा नियमावली" : "Pump & Phase Safety Protocols"}</h4>
            <ul className="safety-list">
              <li>
                <strong>{lang === "mr" ? "सिंगल फेजिंग प्रतिबंधक (Single Phase Preventer):" : "Single Phase Preventer:"}</strong>{" "}
                {lang === "mr" ? "दोन फेजवर मोटर चालू झाल्यास कॉईल जळते; ऑटोमॅटिक कट-ऑफ स्टार्टर बसवा." : "Ensures motor trips immediately if any one phase drops."}
              </li>
              <li>
                <strong>{lang === "mr" ? "कॅपॅसिटर बँक जोडणी:" : "Shunt Capacitor Attachment:"}</strong>{" "}
                {lang === "mr" ? "५ HP पंपासाठी २ KVAR कॅपॅसिटर वापरावा. यामुळे व्होल्टेज सुधारून वीज बिल कमी होते." : "Improves power factor and prevents starter burning."}
              </li>
              <li>
                <strong>{lang === "mr" ? "रात्रपाळी ठिबक ऑटोमेशन:" : "Night Shift Drip Automation:"}</strong>{" "}
                {lang === "mr" ? "रात्री वीज असताना शेतात न जाता ऑटोमॅटिक व्हॉल्व्ह वापरून ओलीत करावे, जेणेकरून सर्पदंशाचा धोका टळेल." : "Utilize off-peak tariff and lower evaporation safely during night cycles."}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SNAKEBITE & POISON SOS */}
      {!loading && subTab === "sos" && sosData && (
        <div className="sos-section-wrapper">
          {/* Emergency Alert Banner */}
          <div className="sos-emergency-banner">
            <div className="sos-icon">🚨</div>
            <div className="sos-banner-content">
              <h3>{lang === "mr" ? "आणीबाणी: त्वरित १०८ किंवा नजीकच्या ASV केंद्रात जा" : "EMERGENCY: Call 108 or Reach ASV Hospital Immediately"}</h3>
              <p>
                {lang === "mr"
                  ? "सर्पदंश किंवा कीटकनाशक विषबाधा झाल्यास पहिली ६० मिनिटे (Golden Hour) अत्यंत मोलाची आहेत. झाडफूक, कापणे किंवा जखम चोखणे टाळा."
                  : "First 60 minutes (Golden Hour) determine survival. Administer Anti-Snake Venom at certified government centers immediately."}
              </p>
            </div>
            <div className="sos-call-buttons">
              <a href={`tel:${sosData.emergency_toll_free}`} className="btn-call-emergency">
                📞 {lang === "mr" ? "१०८ रुग्णवाहिका" : "CALL 108"}
              </a>
              <a href="tel:104" className="btn-call-helpline">
                🏥 {lang === "mr" ? "१०४ आरोग्य मदत" : "CALL 104"}
              </a>
            </div>
          </div>

          <div className="sos-grid">
            {/* Hospital Directory */}
            <div className="glass-card asv-hospitals-box">
              <h4>🏥 {lang === "mr" ? `आपत्कालीन रुग्णालय सूची - ${district}` : `Emergency Hospital Directory - ${district}`}</h4>
              <p style={{ fontSize: 13, color: "#fbbf24", margin: "6px 0 12px 0", lineHeight: 1.4 }}>
                ⚠️ {lang === "mr" ? (sosData.hospital_directory_note_mr || "नमुना सूची - उपलब्धतेची खात्री करण्यासाठी कॉल करा") : (sosData.hospital_directory_note || "sample directory - call to confirm availability")}
              </p>
              <div className="hospital-list">
                {sosData.nearby_asv_hospitals.map((hosp, idx) => (
                  <div key={idx} className="hospital-item-card">
                    <div className="hospital-item-top">
                      <span className="hosp-name">{lang === "mr" ? hosp.name_mr : hosp.name}</span>
                      <span className="hosp-asv-badge">
                        📞 {lang === "mr" ? "उपलब्धता खात्री करा" : "Call to Confirm"}
                      </span>
                    </div>
                    <div className="hosp-details">
                      <span>📍 {hosp.taluka} ({hosp.distance_km} km)</span>
                      <span>🏥 {hosp.facility_type}</span>
                      <span>🚑 {hosp.ambulance_available ? (lang === "mr" ? "रुग्णवाहिका सज्ज" : "Ambulance Ready") : "On Request"}</span>
                    </div>
                    <div className="hosp-action">
                      <a href={`tel:${hosp.emergency_phone}`} className="hosp-call-btn">
                        📞 {lang === "mr" ? "थेट फोन करा" : "Call Hospital"}: {hosp.emergency_phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* First Aid DOs & DONTs */}
            <div className="glass-card first-aid-box">
              <h4>⚕️ {lang === "mr" ? sosData.snakebite_protocol.hazard_title_mr : sosData.snakebite_protocol.hazard_title}</h4>
              <p className="timeline-badge">⏱️ {lang === "mr" ? sosData.snakebite_protocol.critical_time_window_mr : sosData.snakebite_protocol.critical_time_window}</p>

              <div className="rules-table">
                <div className="rules-header">
                  <span className="rule-col-title do-title">✅ {lang === "mr" ? "काय करावे (DOs)" : "DO"}</span>
                  <span className="rule-col-title dont-title">❌ {lang === "mr" ? "काय करू नये (DON'Ts)" : "DON'T"}</span>
                </div>
                {sosData.snakebite_protocol.immediate_dos.map((doItem, idx) => (
                  <div key={idx} className="rule-row">
                    <div className="rule-do">{lang === "mr" ? sosData.snakebite_protocol.immediate_dos_mr[idx] || doItem : doItem}</div>
                    <div className="rule-dont">
                      {lang === "mr" ? sosData.snakebite_protocol.strict_donts_mr[idx] || sosData.snakebite_protocol.strict_donts[idx] : sosData.snakebite_protocol.strict_donts[idx]}
                    </div>
                  </div>
                ))}
              </div>

              <div className="antidote-box" style={{ marginTop: 14 }}>
                <strong>🏥 {lang === "mr" ? "वैद्यकीय उपाययोजना" : "Medical Action"}:</strong>
                <p>{lang === "mr" ? (sosData.snakebite_protocol.medical_action_info_mr || sosData.snakebite_protocol.medical_action_info) : (sosData.snakebite_protocol.medical_action_info || "")}</p>
              </div>

              <h4 style={{ marginTop: "1.5rem" }}>☣️ {lang === "mr" ? sosData.pesticide_poisoning_protocol.hazard_title_mr : sosData.pesticide_poisoning_protocol.hazard_title}</h4>
              <div className="pesticide-steps">
                {(lang === "mr" ? sosData.pesticide_poisoning_protocol.immediate_dos_mr : sosData.pesticide_poisoning_protocol.immediate_dos).map((step, idx) => (
                  <div key={idx} className="pesticide-step-item">
                    <span className="step-circle">{idx + 1}</span>
                    <span className="step-desc">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ZERO-COST DESI BIO-INPUTS */}
      {!loading && subTab === "bioinputs" && (
        <div className="bioinputs-wrapper">
          <div className="bio-selector-row">
            {recipes.map((rec) => (
              <button
                key={rec.id}
                className={`bio-tab-chip ${selectedRecipe?.id === rec.id ? "active" : ""}`}
                onClick={() => setSelectedRecipe(rec)}
              >
                🌿 {lang === "mr" ? rec.name_mr : rec.name}
              </button>
            ))}
          </div>

          {selectedRecipe && (
            <div className="glass-card bio-recipe-card">
              <div className="recipe-hero">
                <div>
                  <span className="source-chip">🏛️ {selectedRecipe.provenance} • {selectedRecipe.source_citation}</span>
                  <h3 className="recipe-title">{lang === "mr" ? selectedRecipe.name_mr : selectedRecipe.name}</h3>
                  <p className="recipe-target">🎯 {lang === "mr" ? selectedRecipe.key_benefit_mr : selectedRecipe.key_benefit}</p>
                </div>
                <div className="cost-saving-badge">
                  <div className="saving-value">₹{selectedRecipe.cost_per_acre_inr} <span className="sub-val">/ {lang === "mr" ? "एकर" : "acre"}</span></div>
                  <div className="saving-sub">
                    {lang === "mr"
                      ? "बाजारातील रासायनिक टॉनिक खर्च ₹२,५०० पेक्षा ९०%+ बचत"
                      : "Saves 90%+ vs ₹2,500 synthetic chemicals"}
                  </div>
                </div>
              </div>

              <div className="recipe-meta-strip">
                <div>⏱️ {lang === "mr" ? "तयार होण्यास वेळ" : "Fermentation Time"}: <strong>{selectedRecipe.preparation_time_days} {lang === "mr" ? "दिवस" : "days"}</strong></div>
                <div>📦 {lang === "mr" ? "वापरण्याची मुदत" : "Shelf Life"}: <strong>{selectedRecipe.shelf_life_days} {lang === "mr" ? "दिवस" : "days"}</strong></div>
                <div>🌱 {lang === "mr" ? "प्रकार" : "Category"}: <strong>{selectedRecipe.category}</strong></div>
              </div>

              <div className="recipe-body-grid">
                <div className="ingredients-box">
                  <h4>🥣 {lang === "mr" ? "आवश्यक देशी साहित्य (Ingredients)" : "Required Ingredients"}</h4>
                  <ul className="ingredient-list">
                    {(lang === "mr" ? selectedRecipe.ingredients_mr : selectedRecipe.ingredients).map((ing, idx) => (
                      <li key={idx}>
                        <span className="ing-name">{ing}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 14 }}>
                    <strong>🌾 {lang === "mr" ? "वापरण्याचे प्रमाण (Dosage)" : "Dosage & Application"}:</strong>
                    <p style={{ fontSize: 13, marginTop: 4 }}>
                      {lang === "mr" ? selectedRecipe.dosage_and_application_mr : selectedRecipe.dosage_and_application}
                    </p>
                  </div>
                </div>

                <div className="preparation-box">
                  <h4>🧑‍🌾 {lang === "mr" ? "तयार करण्याची सोपी पद्धत (Steps)" : "Preparation Steps"}</h4>
                  <ol className="prep-steps-list">
                    {(lang === "mr" ? selectedRecipe.step_by_step_instructions_mr : selectedRecipe.step_by_step_instructions).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
