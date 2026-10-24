"use client";

import React, { useState, useEffect } from "react";

interface FeederSchedule {
  district: string;
  substation: string;
  feeder_name: string;
  current_shift: string;
  active_hours_today: string;
  next_shift_start: string;
  is_power_available_now: boolean;
  voltage_health_volts: number;
  low_voltage_warning: boolean;
  pump_recommendation_mr: string;
  pump_recommendation_en: string;
  emergency_helpline: string;
  provenance: string;
}

interface HospitalASV {
  id: string;
  name: string;
  name_mr: string;
  district: string;
  taluka: string;
  asv_vials_available: number;
  anti_rabies_available: boolean;
  has_ventilator_icu: boolean;
  emergency_phone: string;
  distance_km: number;
  twenty_four_seven_emergency: boolean;
  provenance: string;
}

interface FirstAidGuide {
  emergency_contacts: Record<string, string>;
  snakebite_golden_rules: Array<{ do: string; do_mr: string; dont: string; dont_mr: string }>;
  pesticide_poisoning_steps: Array<{ step: number; action_en: string; action_mr: string }>;
  source_citation: string;
}

interface BioRecipe {
  id: string;
  name: string;
  name_mr: string;
  target_benefit: string;
  target_benefit_mr: string;
  cost_estimate_per_100l_inr: number;
  market_chemical_cost_equiv_inr: number;
  shelf_life_days: number;
  preparation_days: number;
  ingredients: Array<{ item: string; item_mr: string; quantity: string }>;
  preparation_steps: string[];
  preparation_steps_mr: string[];
  provenance: string;
}

interface RuralOpsModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function RuralOpsModule({ district, lang, apiUrl }: RuralOpsModuleProps) {
  const [subTab, setSubTab] = useState<"electricity" | "sos" | "bioinputs">("electricity");
  const [feeder, setFeeder] = useState<FeederSchedule | null>(null);
  const [hospitals, setHospitals] = useState<HospitalASV[]>([]);
  const [firstAid, setFirstAid] = useState<FirstAidGuide | null>(null);
  const [recipes, setRecipes] = useState<BioRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<BioRecipe | null>(null);

  useEffect(() => {
    const fetchRuralOpsData = async () => {
      setLoading(true);
      try {
        const [feedRes, hospRes, aidRes, bioRes] = await Promise.all([
          fetch(`${apiUrl}/rural-ops/feeder-schedule?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/rural-ops/emergency-sos/hospitals?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/rural-ops/emergency-sos/first-aid`),
          fetch(`${apiUrl}/rural-ops/bio-inputs/recipes`),
        ]);

        if (feedRes.ok) setFeeder(await feedRes.json());
        if (hospRes.ok) setHospitals(await hospRes.json());
        if (aidRes.ok) setFirstAid(await aidRes.json());
        if (bioRes.ok) {
          const recList = await bioRes.json();
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
              <div className="metric-val">{feeder?.is_power_available_now ? "ON" : "OFF"}</div>
              <div className="metric-lbl">{lang === "mr" ? "३-फेज वीज स्थिती" : "3-Phase Power"}</div>
            </div>
          </div>
          <div className="metric-pill emergency-pill">
            <span className="metric-icon">🚨</span>
            <div>
              <div className="metric-val">108 / 112</div>
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
              <span className="source-chip">⚡ {feeder.provenance}</span>
              <span className={`status-badge ${feeder.is_power_available_now ? "badge-success" : "badge-danger"}`}>
                {feeder.is_power_available_now
                  ? (lang === "mr" ? "🟢 वीज सुरू आहे (POWER ON)" : "🟢 POWER ACTIVE")
                  : (lang === "mr" ? "🔴 वीज बंद आहे (OFF SHIFT)" : "🔴 POWER OFF")}
              </span>
            </div>

            <h3 className="feeder-name">{feeder.feeder_name}</h3>
            <p className="feeder-substation">📍 {feeder.substation}, {feeder.district}</p>

            <div className="feeder-time-box">
              <div className="time-col">
                <span className="time-lbl">{lang === "mr" ? "आजची वीज पाळी (Shift)" : "Today's Shift"}</span>
                <span className="time-val highlight">{feeder.current_shift}</span>
              </div>
              <div className="time-col">
                <span className="time-lbl">{lang === "mr" ? "सक्रिय तास" : "Active Hours"}</span>
                <span className="time-val">{feeder.active_hours_today}</span>
              </div>
              <div className="time-col">
                <span className="time-lbl">{lang === "mr" ? "पुढील पाळी सुरू" : "Next Shift Starts"}</span>
                <span className="time-val">{feeder.next_shift_start}</span>
              </div>
            </div>

            <div className="voltage-monitor-box">
              <div className="voltage-meta">
                <span>{lang === "mr" ? "व्होल्टेज गुणवत्ता" : "Voltage Health"}: <strong>{feeder.voltage_health_volts} V</strong></span>
                {feeder.low_voltage_warning ? (
                  <span className="warning-pill">⚠️ {lang === "mr" ? "कमी व्होल्टेज - स्टार्टर ट्रिप होऊ शकतो" : "Low Voltage Alert"}</span>
                ) : (
                  <span className="safe-pill">✅ {lang === "mr" ? "३-फेज स्थिर व्होल्टेज" : "Stable 3-Phase Voltage"}</span>
                )}
              </div>
              <div className="voltage-bar">
                <div
                  className="voltage-fill"
                  style={{
                    width: `${Math.min(100, (feeder.voltage_health_volts / 440) * 100)}%`,
                    background: feeder.low_voltage_warning ? "#ef4444" : "#22c55e",
                  }}
                />
              </div>
            </div>

            <div className="recommendation-box">
              <div className="rec-title">💡 {lang === "mr" ? "पंप चालवण्याचा सल्ला" : "Motor Operation Advisory"}</div>
              <p className="rec-text">{lang === "mr" ? feeder.pump_recommendation_mr : feeder.pump_recommendation_en}</p>
            </div>

            <div className="feeder-actions">
              <a href={`tel:${feeder.emergency_helpline}`} className="action-btn-call">
                📞 {lang === "mr" ? `महावितरण तक्रार निवारण (${feeder.emergency_helpline})` : `MSEDCL Helpline (${feeder.emergency_helpline})`}
              </a>
            </div>
          </div>

          <div className="glass-card feeder-tips-card">
            <h4>⚡ {lang === "mr" ? "शेतकरी वीज बचत व मोटर सुरक्षा नियमावली" : "Pump & Phase Safety Protocols"}</h4>
            <ul className="safety-list">
              <li>
                <strong>{lang === "mr" ? "सिंगल फेजिंग प्रतिबंधक (Single Phase Preventer):" : "Single Phase Preventer:"}</strong>{" "}
                {lang === "mr" ? "दोन फेजवर मोटर चालू झाल्यास कॉईल जळते; ऑटोमॅटिक कट-ऑफ बसवा." : "Ensures motor trips immediately if any one phase drops."}
              </li>
              <li>
                <strong>{lang === "mr" ? "कॅपॅसिटर बँक जोडणी:" : "Shunt Capacitor Attachment:"}</strong>{" "}
                {lang === "mr" ? "५ HP पंपासाठी २ KVAR कॅपॅसिटर वापरावा. यामुळे व्होल्टेज सुधारून वीज बिल कमी होते." : "Improves power factor and prevents starter burning."}
              </li>
              <li>
                <strong>{lang === "mr" ? "रात्रपाळी ठिबक ऑटोमेशन:" : "Night Shift Drip Automation:"}</strong>{" "}
                {lang === "mr" ? "रात्री ११ ते सकाळी ७ दरम्यान वीज असल्यास ऑटोमॅटिक व्हॉल्व्ह वापरून ओलीत करावे." : "Utilize off-peak tariff and lower evaporation during night cycles."}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SNAKEBITE & POISON SOS */}
      {!loading && subTab === "sos" && (
        <div className="sos-section-wrapper">
          {/* Emergency Alert Banner */}
          <div className="sos-emergency-banner">
            <div className="sos-icon">🚨</div>
            <div className="sos-banner-content">
              <h3>{lang === "mr" ? "आणीबाणी: त्वरित 108 किंवा नजीकच्या ASV केंद्रात जा" : "EMERGENCY: Call 108 or Reach ASV Hospital Immediately"}</h3>
              <p>
                {lang === "mr"
                  ? "सर्पदंश किंवा कीटकनाशक पोटात गेल्यास पहिली ६० मिनिटे (Golden Hour) अत्यंत मोलाची आहेत. झाडफूक किंवा बांधणी करू नका."
                  : "First 60 minutes (Golden Hour) determine survival. Administer Anti-Snake Venom at certified government centers immediately."}
              </p>
            </div>
            <div className="sos-call-buttons">
              <a href="tel:108" className="btn-call-emergency">
                📞 {lang === "mr" ? "१०८ रुग्णवाहिका" : "CALL 108"}
              </a>
              <a href="tel:104" className="btn-call-helpline">
                🏥 {lang === "mr" ? "१०४ आरोग्य मदत" : "CALL 104"}
              </a>
            </div>
          </div>

          <div className="sos-grid">
            {/* Hospital ASV Locator */}
            <div className="glass-card asv-hospitals-box">
              <h4>🏥 {lang === "mr" ? `जिल्हा रुग्णालये व सर्पदंश लस (ASV) साठा - ${district}` : `ASV Stocked Centers in ${district}`}</h4>
              <div className="hospital-list">
                {hospitals.map((hosp) => (
                  <div key={hosp.id} className="hospital-item-card">
                    <div className="hospital-item-top">
                      <span className="hosp-name">{lang === "mr" ? hosp.name_mr : hosp.name}</span>
                      <span className="hosp-asv-badge">
                        💉 {hosp.asv_vials_available} {lang === "mr" ? "डोस उपलब्ध" : "ASV Vials"}
                      </span>
                    </div>
                    <div className="hosp-details">
                      <span>📍 {hosp.taluka} ({hosp.distance_km} km)</span>
                      <span>{hosp.has_ventilator_icu ? "✅ व्हेंटिलेटर/ICU उपलब्ध" : "ℹ️ प्राथमिक उपचार केंद्र"}</span>
                      <span>🕒 {hosp.twenty_four_seven_emergency ? "२४x७ आपत्कालीन" : "Day Care"}</span>
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
              <h4>⚕️ {lang === "mr" ? "सर्पदंश प्रथमोपचार: काय करावे आणि काय टाळावे" : "Snakebite First-Aid Protocol"}</h4>
              {firstAid?.snakebite_golden_rules && (
                <div className="rules-table">
                  <div className="rules-header">
                    <span className="rule-col-title do-title">✅ {lang === "mr" ? "काय करावे (DOs)" : "DO"}</span>
                    <span className="rule-col-title dont-title">❌ {lang === "mr" ? "काय करू नये (DON'Ts)" : "DON'T"}</span>
                  </div>
                  {firstAid.snakebite_golden_rules.map((rule, idx) => (
                    <div key={idx} className="rule-row">
                      <div className="rule-do">{lang === "mr" ? rule.do_mr : rule.do}</div>
                      <div className="rule-dont">{lang === "mr" ? rule.dont_mr : rule.dont}</div>
                    </div>
                  ))}
                </div>
              )}

              <h4 style={{ marginTop: "1.5rem" }}>☣️ {lang === "mr" ? "कीटकनाशक विषबाधा झाल्यास" : "Pesticide Poisoning Actions"}</h4>
              <div className="pesticide-steps">
                {firstAid?.pesticide_poisoning_steps.map((st) => (
                  <div key={st.step} className="pesticide-step-item">
                    <span className="step-circle">{st.step}</span>
                    <span className="step-desc">{lang === "mr" ? st.action_mr : st.action_en}</span>
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
                  <span className="source-chip">🏛️ {selectedRecipe.provenance}</span>
                  <h3 className="recipe-title">{lang === "mr" ? selectedRecipe.name_mr : selectedRecipe.name}</h3>
                  <p className="recipe-target">🎯 {lang === "mr" ? selectedRecipe.target_benefit_mr : selectedRecipe.target_benefit}</p>
                </div>
                <div className="cost-saving-badge">
                  <div className="saving-value">₹{selectedRecipe.cost_estimate_per_100l_inr} <span className="sub-val">/ 100L</span></div>
                  <div className="saving-sub">
                    {lang === "mr"
                      ? `बाजारातील रासायनिक खर्च ₹${selectedRecipe.market_chemical_cost_equiv_inr} - बचत ९०%+`
                      : `Saves vs ₹${selectedRecipe.market_chemical_cost_equiv_inr} chemicals`}
                  </div>
                </div>
              </div>

              <div className="recipe-meta-strip">
                <div>⏱️ {lang === "mr" ? "तयार होण्यास वेळ" : "Fermentation Time"}: <strong>{selectedRecipe.preparation_days} {lang === "mr" ? "दिवस" : "days"}</strong></div>
                <div>📦 {lang === "mr" ? "वापरण्याची मुदत" : "Shelf Life"}: <strong>{selectedRecipe.shelf_life_days} {lang === "mr" ? "दिवस" : "days"}</strong></div>
              </div>

              <div className="recipe-body-grid">
                <div className="ingredients-box">
                  <h4>🥣 {lang === "mr" ? "आवश्यक देशी साहित्य (Ingredients)" : "Required Ingredients"}</h4>
                  <ul className="ingredient-list">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        <span className="ing-name">{lang === "mr" ? ing.item_mr : ing.item}</span>
                        <span className="ing-qty">{ing.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="preparation-box">
                  <h4>🧑‍🌾 {lang === "mr" ? "तयार करण्याची सोपी पद्धत (Steps)" : "Preparation Steps"}</h4>
                  <ol className="prep-steps-list">
                    {(lang === "mr" ? selectedRecipe.preparation_steps_mr : selectedRecipe.preparation_steps).map((step, idx) => (
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
