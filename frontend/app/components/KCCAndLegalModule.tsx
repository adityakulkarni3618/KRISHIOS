"use client";

import React, { useState, useEffect } from "react";

interface KCCDossierResult {
  farmer_name: string;
  district: string;
  crop_breakdown: Array<{
    crop_name: string;
    area_hectares: number;
    scale_of_finance_per_ha_inr: number;
    crop_component_inr: number;
  }>;
  base_crop_loan_inr: number;
  post_harvest_household_10pct_inr: number;
  maintenance_farm_assets_20pct_inr: number;
  total_kcc_limit_recommended_inr: number;
  applicable_interest_subvention_pct: number;
  effective_interest_rate_pct: number;
  required_documents_checklist: string[];
  bank_application_summary_mr: string;
  provenance: string;
}

interface LegalRemedyGuide {
  dispute_category: string;
  dispute_title: string;
  dispute_title_mr: string;
  applicable_act_section: string;
  competent_authority: string;
  timeframe_days: number;
  steps_to_resolve_mr: string[];
  key_legal_protections_mr: string[];
  provenance: string;
}

interface KCCAndLegalModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function KCCAndLegalModule({ district, lang, apiUrl }: KCCAndLegalModuleProps) {
  const [subTab, setSubTab] = useState<"kcc" | "legal" | "omnichannel">("kcc");
  const [remedies, setRemedies] = useState<LegalRemedyGuide[]>([]);
  const [dossier, setDossier] = useState<KCCDossierResult | null>(null);
  const [loading, setLoading] = useState(false);

  // KCC Form inputs
  const [farmerName, setFarmerName] = useState("Aditya Kulkarni");
  const [cropArea, setCropArea] = useState(2.0);
  const [selectedCrop, setSelectedCrop] = useState("Soybean");
  const [calculatingKcc, setCalculatingKcc] = useState(false);

  // Omnichannel simulator states
  const [ivrPhone, setIvrPhone] = useState("9822012345");
  const [ivrResponse, setIvrResponse] = useState<any | null>(null);
  const [waMessage, setWaMessage] = useState("bhav soybean");
  const [waResponse, setWaResponse] = useState<string | null>(null);

  useEffect(() => {
    const fetchLegalData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/institutional/kisan-nyay/remedies`);
        if (res.ok) setRemedies(await res.json());
      } catch (e) {
        console.error("Legal remedies fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLegalData();
  }, [apiUrl]);

  const handleGenerateKcc = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculatingKcc(true);
    try {
      const res = await fetch(`${apiUrl}/institutional/kcc/dossier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_name: farmerName,
          district: district,
          aadhaar_last4: "8891",
          seven_twelve_gut_no: "142/A",
          crops: [{ crop_name: selectedCrop, area_hectares: Number(cropArea) }],
        }),
      });

      if (res.ok) {
        setDossier(await res.json());
      }
    } catch (e) {
      console.error("KCC dossier error:", e);
    } finally {
      setCalculatingKcc(false);
    }
  };

  const handleSimulateIvr = async () => {
    try {
      const res = await fetch(`${apiUrl}/institutional/omnichannel/simulate-ivr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caller_phone: ivrPhone, language: lang }),
      });
      if (res.ok) {
        setIvrResponse(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateWa = async () => {
    try {
      const res = await fetch(`${apiUrl}/institutional/omnichannel/simulate-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_phone: ivrPhone, incoming_text: waMessage }),
      });
      if (res.ok) {
        const data = await res.json();
        setWaResponse(data.reply_text);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="kcc-legal-container">
      {/* Banner */}
      <div className="module-banner-header">
        <div className="banner-text">
          <div className="banner-tag">💳 {lang === "mr" ? "केसीसी बँक कर्ज, शेतकरी न्याय व हेल्पलाइन" : "KCC LOAN DOSSIER, LEGAL RIGHTS & ACCESS"}</div>
          <h2 className="banner-title">
            {lang === "mr" ? "शेतकरी संस्थात्मक हक्क व कायदेशीर संरक्षण" : "Agrarian Financial Rights & Legal Justice"}
          </h2>
          <p className="banner-subtitle">
            {lang === "mr"
              ? "४% सवलतीचे केसीसी पीक कर्ज प्रस्ताव, शेतरस्ता वाद (मामलतदार कोर्ट कलम १४३) आणि २४x७ मिस्ड कॉल/व्हॉट्सॲप सुविधा."
              : "RBI 4% effective interest KCC loan dossier, Mamlatdar Courts Act farm right-of-way resolution, and omnichannel bots."}
          </p>
        </div>
      </div>

      {/* Subtabs */}
      <div className="subtab-pills">
        <button
          className={`subtab-pill ${subTab === "kcc" ? "active" : ""}`}
          onClick={() => setSubTab("kcc")}
        >
          💳 {lang === "mr" ? "केसीसी कर्ज मर्यादा व बँक अर्ज" : "KCC Loan Dossier"}
        </button>
        <button
          className={`subtab-pill ${subTab === "legal" ? "active" : ""}`}
          onClick={() => setSubTab("legal")}
        >
          ⚖️ {lang === "mr" ? "शेतकरी न्याय (शेतरस्ता व वाद निवारण)" : "Kisan Nyay Legal Remedies"}
        </button>
        <button
          className={`subtab-pill ${subTab === "omnichannel" ? "active" : ""}`}
          onClick={() => setSubTab("omnichannel")}
        >
          📱 {lang === "mr" ? "मिस्ड कॉल व व्हॉट्सॲप बॉट" : "Omnichannel Bot Gateway"}
        </button>
      </div>

      {loading && <div className="loading-spinner">⌛ {lang === "mr" ? "माहिती लोड होत आहे..." : "Loading records..."}</div>}

      {/* SUBTAB 1: KCC LOAN */}
      {!loading && subTab === "kcc" && (
        <div className="kcc-grid">
          <div className="glass-card kcc-form-card">
            <h4>🌾 {lang === "mr" ? "केसीसी (KCC) पीक कर्ज पात्रता मोजा" : "Calculate KCC Loan Scale of Finance"}</h4>
            <form onSubmit={handleGenerateKcc} className="kcc-form">
              <div className="form-group">
                <label>{lang === "mr" ? "शेतकऱ्याचे नाव" : "Farmer Full Name"}</label>
                <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>{lang === "mr" ? "पीक निवडा" : "Target Crop"}</label>
                <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                  <option value="Soybean">सोयाबीन (Soybean - ₹58,000/हे.)</option>
                  <option value="Cotton">कापूस (Cotton - ₹65,000/हे.)</option>
                  <option value="Grapes">द्राक्षे (Grapes - ₹2,10,000/हे.)</option>
                  <option value="Onion">कांदा (Onion - ₹62,000/हे.)</option>
                  <option value="Wheat">गहू (Wheat - ₹48,000/हे.)</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === "mr" ? "क्षेत्रफळ (हेक्टर)" : "Cultivated Area (Hectares)"}</label>
                <input type="number" step="0.1" value={cropArea} onChange={(e) => setCropArea(Number(e.target.value))} required />
              </div>
              <button type="submit" className="btn-calc-kcc" disabled={calculatingKcc}>
                {calculatingKcc ? "हिशोब होत आहे..." : (lang === "mr" ? "📊 अधिकृत कर्ज मर्यादा मोजा" : "Calculate KCC Limit")}
              </button>
            </form>
          </div>

          {dossier ? (
            <div className="glass-card kcc-result-card">
              <div className="card-top-header">
                <span className="source-chip">🏛️ {dossier.provenance}</span>
                <span className="rate-chip">⚡ निव्वळ व्याजदर: {dossier.effective_interest_rate_pct}% p.a.</span>
              </div>

              <div className="limit-hero-box">
                <div className="limit-lbl">{lang === "mr" ? "पात्र एकूण केसीसी मर्यादा (KCC Limit)" : "Approved KCC Credit Limit"}</div>
                <div className="limit-amt">₹{dossier.total_kcc_limit_recommended_inr.toLocaleString()}</div>
                <div className="subvention-note">
                  {lang === "mr"
                    ? `(७% मूळ व्याज - ३% वेळेवर परतफेड सबव्हेन्शन = फक्त ${dossier.effective_interest_rate_pct}% व्याज!)`
                    : `7% base minus 3% timely repayment subvention = ${dossier.effective_interest_rate_pct}% net interest`}
                </div>
              </div>

              <div className="breakdown-table">
                <div className="b-row">
                  <span>{lang === "mr" ? "मूळ पीक कर्ज घटक" : "Base Crop Scale of Finance"}:</span>
                  <strong>₹{dossier.base_crop_loan_inr.toLocaleString()}</strong>
                </div>
                <div className="b-row">
                  <span>{lang === "mr" ? "+१०% काढणीपश्चात व घरगुती खर्च" : "+10% Post-harvest & Household"}:</span>
                  <strong>₹{dossier.post_harvest_household_10pct_inr.toLocaleString()}</strong>
                </div>
                <div className="b-row">
                  <span>{lang === "mr" ? "+२०% शेती औजारे व दुरुस्ती खर्च" : "+20% Farm Maintenance"}:</span>
                  <strong>₹{dossier.maintenance_farm_assets_20pct_inr.toLocaleString()}</strong>
                </div>
              </div>

              <div className="checklist-box">
                <h5>📁 {lang === "mr" ? "बँकेत जोडायची कागदपत्रे" : "Required Application Documents"}:</h5>
                <ul className="doc-list">
                  {dossier.required_documents_checklist.map((doc, idx) => (
                    <li key={idx}>✅ {doc}</li>
                  ))}
                </ul>
              </div>

              <div className="dossier-actions">
                <button
                  className="btn-download-dossier"
                  onClick={() => alert(lang === "mr" ? "बँक कर्ज अर्ज डॉसियर तयार झाला! तुमच्या बँकेच्या शाखेत जमा करा." : "KCC Dossier generated successfully!")}
                >
                  📥 {lang === "mr" ? "बँक अर्ज डॉसियर डाउनलोड करा" : "Download Bank Application Dossier"}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card kcc-info-box">
              <h4>ℹ️ {lang === "mr" ? "केसीसी योजनेचे फायदे" : "Key KCC Advantages"}</h4>
              <ul>
                <li>{lang === "mr" ? "वेळेवर परतफेड करणाऱ्या शेतकऱ्यांना फक्त ४% दराने पीक कर्ज मिळते." : "Net effective 4% interest rate with Govt subvention."}</li>
                <li>{lang === "mr" ? "३ लाखांपर्यंतच्या कर्जावर कोणतेही प्रक्रिया शुल्क किंवा तारण लागत नाही." : "No collateral required for loans up to ₹1.60 Lakhs (extendable to ₹3 Lakhs)."}</li>
                <li>{lang === "mr" ? "रुपे (RuPay) किसान डेबिट कार्डद्वारे थेट एटीएममधून पैसे काढता येतात." : "RuPay Kisan card provides direct ATM cash withdrawals."}</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: LEGAL REMEDIES */}
      {!loading && subTab === "legal" && (
        <div className="legal-remedies-grid">
          {remedies.map((rem, idx) => (
            <div key={idx} className="glass-card legal-card">
              <div className="card-top-header">
                <span className="source-chip">🏛️ {rem.provenance}</span>
                <span className="law-chip">⚖️ {rem.applicable_act_section}</span>
              </div>

              <h3 className="dispute-title">{lang === "mr" ? rem.dispute_title_mr : rem.dispute_title}</h3>
              <div className="dispute-authority">
                <span>🏛️ {lang === "mr" ? "सक्षम अधिकारी" : "Authority"}: <strong>{rem.competent_authority}</strong></span>
                <span>⏱️ {lang === "mr" ? "निकालाची मुदत" : "Timeframe"}: <strong>{rem.timeframe_days} दिवस</strong></span>
              </div>

              <div className="legal-steps-box">
                <h4>📋 {lang === "mr" ? "न्याय मिळवण्याचे टप्पे (Process)" : "Step-by-Step Remedy Process"}:</h4>
                <ol className="remedy-steps">
                  {rem.steps_to_resolve_mr.map((st, sidx) => (
                    <li key={sidx}>{st}</li>
                  ))}
                </ol>
              </div>

              <div className="legal-rights-box">
                <h4>🛡️ {lang === "mr" ? "शेतकऱ्याला कायद्याचे संरक्षण" : "Key Legal Protections"}:</h4>
                <ul className="rights-list">
                  {rem.key_legal_protections_mr.map((prot, pidx) => (
                    <li key={pidx}>✔️ {prot}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: OMNICHANNEL GATEWAY */}
      {!loading && subTab === "omnichannel" && (
        <div className="omnichannel-grid">
          {/* IVR Simulator */}
          <div className="glass-card ivr-box">
            <h4>📞 {lang === "mr" ? "मिस्ड कॉल व व्हॉईस IVR सेवा (Missed-Call Advisory)" : "Missed Call IVR Gateway"}</h4>
            <p className="omni-desc">
              {lang === "mr"
                ? "स्मार्टफोन किंवा इंटरनेट नसलेल्या शेतकऱ्यांसाठी: फक्त 1800-180-1551 वर मिस्ड कॉल द्या, संगणक आपोआप फोन करून मराठीत हवामान व बाजारभाव सांगतो."
                : "Zero-data access: Farmers give a missed call and receive an automated voice call back in their local language."}
            </p>
            <div className="sim-form">
              <label>{lang === "mr" ? "मोबाईल नंबर" : "Farmer Mobile Number"}</label>
              <input type="text" value={ivrPhone} onChange={(e) => setIvrPhone(e.target.value)} />
              <button onClick={handleSimulateIvr} className="btn-sim-call">
                📞 {lang === "mr" ? "मिस्ड कॉल सिम्युलेट करा" : "Simulate Missed Call"}
              </button>
            </div>

            {ivrResponse && (
              <div className="ivr-result-card">
                <div className="call-status">🔔 {ivrResponse.status}</div>
                <div className="voice-script">
                  <strong>🎙️ {lang === "mr" ? "शेतकऱ्याला ऐकू येणारा आवाज" : "IVR Voice Output"}:</strong>
                  <p>"{ivrResponse.ivr_script}"</p>
                </div>
                <div className="sms-script">
                  <strong>📩 {lang === "mr" ? "पाठवलेला SMS" : "SMS Confirmation"}:</strong>
                  <p>"{ivrResponse.sms_sent}"</p>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Bot Simulator */}
          <div className="glass-card wa-box">
            <h4>💬 {lang === "mr" ? "व्हॉट्सॲप कृषी बॉट सिम्युलेटर (WhatsApp Krishi Bot)" : "WhatsApp Agri Bot Simulator"}</h4>
            <p className="omni-desc">
              {lang === "mr"
                ? "व्हॉट्सॲपवर फक्त 'bhav soybean' किंवा 'weather' पाठवून सेकंदात अधिकृत उत्तर मिळवा."
                : "Type instant keywords like 'bhav soybean', 'crop disease', or 'kcc' to receive structured university responses."}
            </p>
            <div className="sim-form">
              <label>{lang === "mr" ? "व्हॉट्सॲप मेसेज लिहा" : "Message Text"}</label>
              <input type="text" value={waMessage} onChange={(e) => setWaMessage(e.target.value)} placeholder="उदा. bhav soybean किंवा weather" />
              <button onClick={handleSimulateWa} className="btn-sim-wa">
                💬 {lang === "mr" ? "व्हॉट्सॲप मेसेज पाठवा" : "Send WhatsApp Query"}
              </button>
            </div>

            {waResponse && (
              <div className="wa-chat-bubble">
                <div className="chat-sender">🤖 AgriNexus AI Krishi Bot</div>
                <pre className="chat-text">{waResponse}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
