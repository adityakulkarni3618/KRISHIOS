"use client";

import React, { useState, useEffect } from "react";

interface KCCLoanResult {
  crop: string;
  district: string;
  area_acres: number;
  scale_of_finance_per_acre_inr: number;
  maximum_kcc_loan_limit_inr: number;
  post_harvest_consumption_allowance_inr: number;
  farm_maintenance_allowance_inr: number;
  total_sanctioned_credit_limit_inr: number;
  nominal_interest_rate_pct: number;
  govt_interest_subvention_pct: number;
  effective_farmer_interest_rate_pct: number;
  annual_interest_cost_inr: number;
  required_bank_documents: string[];
  required_bank_documents_mr: string[];
  application_steps: string[];
  application_steps_mr: string[];
  provenance: string;
  source_citation: string;
}

interface LegalRemedyGuide {
  id: string;
  dispute_title: string;
  dispute_title_mr: string;
  applicable_law: string;
  competent_authority: string;
  competent_authority_mr: string;
  filing_procedure: string[];
  filing_procedure_mr: string[];
  standard_court_fee_inr: number;
  expected_resolution_timeline: string;
  expected_resolution_timeline_mr: string;
  key_legal_protections: string;
  key_legal_protections_mr: string;
  provenance: string;
  source_citation: string;
}

interface OmnichannelGatewayInfo {
  ivr_missed_call_number: string;
  whatsapp_bot_number: string;
  sms_shortcode: string;
  supported_dialects: string[];
  sample_ivr_menu_tree: string[];
  sample_ivr_menu_tree_mr: string[];
  whatsapp_commands: string[];
  whatsapp_commands_mr: string[];
  provenance: string;
  source_citation: string;
}

interface KCCAndLegalModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function KCCAndLegalModule({ district, lang, apiUrl }: KCCAndLegalModuleProps) {
  const [subTab, setSubTab] = useState<"kcc" | "legal" | "omnichannel">("kcc");
  const [remedies, setRemedies] = useState<LegalRemedyGuide[]>([]);
  const [omniInfo, setOmniInfo] = useState<OmnichannelGatewayInfo | null>(null);
  const [dossier, setDossier] = useState<KCCLoanResult | null>(null);
  const [loading, setLoading] = useState(false);

  // KCC Form inputs
  const [cropArea, setCropArea] = useState(3.0);
  const [selectedCrop, setSelectedCrop] = useState("soybean");
  const [calculatingKcc, setCalculatingKcc] = useState(false);

  // Omnichannel simulator states
  const [ivrPhone, setIvrPhone] = useState("9822012345");
  const [ivrResponse, setIvrResponse] = useState<string | null>(null);
  const [waMessage, setWaMessage] = useState("bhav soybean");
  const [waResponse, setWaResponse] = useState<string | null>(null);

  useEffect(() => {
    const fetchLegalData = async () => {
      setLoading(true);
      try {
        const [remRes, omniRes] = await Promise.all([
          fetch(`${apiUrl}/institutional/legal-guides`),
          fetch(`${apiUrl}/institutional/omnichannel`),
        ]);
        if (remRes.ok) setRemedies(await remRes.json());
        if (omniRes.ok) setOmniInfo(await omniRes.json());
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
      const res = await fetch(`${apiUrl}/institutional/kcc-eligibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: selectedCrop,
          district: district,
          area_acres: Number(cropArea),
          has_prompt_repayment_record: true,
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

  const handleSimulateIvr = () => {
    setIvrResponse(
      lang === "mr"
        ? `[IVR कॉल कनेक्टेड] नमस्कार शेतकरी बंधूंनो! कृषी ओएस मिस्ड-कॉल सेवेमध्ये आपले स्वागत आहे. तुमच्या ${district} जिल्ह्यातील सोयाबीनचा आजचा सरासरी भाव ₹४,८५० आहे. ३-फेज वीज आज रात्री ११ ते सकाळी ७ सुरू राहील.`
        : `[IVR Callback Connected to ${ivrPhone}] Welcome to KRISHIOS Voice Hotline. Today's ${district} Soybean modal price is ₹4,850/Qtl. 3-Phase feeder power active tonight from 23:00 to 07:00.`
    );
  };

  const handleSimulateWa = () => {
    const q = waMessage.toLowerCase();
    if (q.includes("bhav") || q.includes("भाव") || q.includes("mandi")) {
      setWaResponse(
        `🌾 *KRISHIOS अधिकृत बाजारभाव*\n\n📍 जिल्हा: ${district}\n💰 सोयाबीन: ₹४,८५०/क्विंटल\n📈 कल: +₹३८० दरवाढीची शक्यता\n💡 सल्ला: साठवून ठेवणे फायदेशीर (HOLD)`
      );
    } else if (q.includes("bijli") || q.includes("वीज") || q.includes("power")) {
      setWaResponse(
        `⚡ *३-फेज वीज वेळापत्रक*\n\n🔌 फिडर: ${district} रुरल-०४\n🕒 पाळी: रात्री ११:०० ते सकाळी ०७:०० (८ तास)\n✅ व्होल्टेज: ४१५ V स्थिर`
      );
    } else {
      setWaResponse(
        `🤖 *KRISHIOS कृषी मित्र मदत*\n\nखालीलपैकी शब्द पाठवा:\n1. *bhav soybean* (बाजारभाव)\n2. *bijli* (वीज वेळ)\n3. *kcc* (कर्ज मर्यादा)\n4. *sos* (सर्पदंश मदत)`
      );
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
              ? "०% ते ४% सवलतीचे केसीसी पीक कर्ज प्रस्ताव, शेतरस्ता वाद (मामलतदार कोर्ट कलम १४३) आणि २४x७ मिस्ड कॉल/व्हॉट्सॲप सुविधा."
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
                <label>{lang === "mr" ? "पीक निवडा" : "Target Crop"}</label>
                <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                  <option value="soybean">सोयाबीन (Soybean - ₹28,000/एकर)</option>
                  <option value="cotton">कापूस (Cotton - ₹36,000/एकर)</option>
                  <option value="sugarcane">ऊस (Sugarcane - ₹65,000/एकर)</option>
                  <option value="onion">कांदा (Onion - ₹32,000/एकर)</option>
                  <option value="wheat">गहू (Wheat - ₹22,000/एकर)</option>
                  <option value="pomegranate">डाळिंब (Pomegranate - ₹95,000/एकर)</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === "mr" ? "क्षेत्रफळ (एकर)" : "Cultivated Area (Acres)"}</label>
                <input type="number" step="0.5" min="0.5" max="50" value={cropArea} onChange={(e) => setCropArea(Number(e.target.value))} required />
              </div>
              <button type="submit" className="btn-calc-kcc" disabled={calculatingKcc}>
                {calculatingKcc ? "हिशोब होत आहे..." : (lang === "mr" ? "📊 अधिकृत कर्ज मर्यादा मोजा" : "Calculate KCC Limit")}
              </button>
            </form>
          </div>

          {dossier ? (
            <div className="glass-card kcc-result-card">
              <div className="card-top-header">
                <span className="source-chip">🏛️ {dossier.provenance} • {dossier.source_citation}</span>
                <span className="rate-chip" style={{ background: "rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "3px 8px", borderRadius: 4, fontWeight: 800, fontSize: 12 }}>
                  ⚡ निव्वळ व्याजदर: {dossier.effective_farmer_interest_rate_pct}% p.a.
                </span>
              </div>

              <div className="limit-hero-box">
                <div className="limit-lbl">{lang === "mr" ? "मंजूर एकूण केसीसी मर्यादा (KCC Credit Limit)" : "Approved KCC Credit Limit"}</div>
                <div className="limit-amt">₹{dossier.total_sanctioned_credit_limit_inr.toLocaleString()}</div>
                <div className="subvention-note" style={{ fontSize: 12, marginTop: 4, color: "var(--text-secondary)" }}>
                  {lang === "mr"
                    ? `(७% मूळ व्याज - ३% वेळेवर परतफेड सबव्हेन्शन = डॉ. पंजाबराव देशमुख योजनेखाली फक्त ${dossier.effective_farmer_interest_rate_pct}% व्याज!)`
                    : `7% base minus 3% timely repayment subvention = ${dossier.effective_farmer_interest_rate_pct}% net interest`}
                </div>
              </div>

              <div className="breakdown-table">
                <div className="b-row">
                  <span>{lang === "mr" ? "मूळ पीक कर्ज घटक" : "Base Scale of Finance"}:</span>
                  <strong>₹{dossier.maximum_kcc_loan_limit_inr.toLocaleString()}</strong>
                </div>
                <div className="b-row">
                  <span>{lang === "mr" ? "+१०% काढणीपश्चात व घरगुती खर्च" : "+10% Post-harvest & Household"}:</span>
                  <strong>₹{dossier.post_harvest_consumption_allowance_inr.toLocaleString()}</strong>
                </div>
                <div className="b-row">
                  <span>{lang === "mr" ? "+२०% शेती औजारे व दुरुस्ती खर्च" : "+20% Farm Maintenance"}:</span>
                  <strong>₹{dossier.farm_maintenance_allowance_inr.toLocaleString()}</strong>
                </div>
              </div>

              <div className="checklist-box" style={{ marginTop: 14 }}>
                <h5>📁 {lang === "mr" ? "बँकेत जोडायची कागदपत्रे" : "Required Application Documents"}:</h5>
                <ul className="doc-list" style={{ paddingLeft: 18, fontSize: 12, marginTop: 4, color: "var(--text-primary)" }}>
                  {(lang === "mr" ? dossier.required_bank_documents_mr : dossier.required_bank_documents).map((doc, idx) => (
                    <li key={idx}>✅ {doc}</li>
                  ))}
                </ul>
              </div>

              <div className="dossier-actions">
                <button
                  type="button"
                  className="btn-download-dossier"
                  onClick={() => alert(lang === "mr" ? "बँक कर्ज अर्ज डॉसियर तयार झाला! ७/१२ व आधार कार्डासह शाखेत जमा करा." : "KCC Dossier generated successfully!")}
                >
                  📥 {lang === "mr" ? "बँक अर्ज डॉसियर डाउनलोड करा" : "Download Bank Application Dossier"}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card kcc-info-box">
              <h4>ℹ️ {lang === "mr" ? "केसीसी योजनेचे फायदे" : "Key KCC Advantages"}</h4>
              <ul style={{ paddingLeft: 18, marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                <li>{lang === "mr" ? "वेळेवर परतफेड करणाऱ्या शेतकऱ्यांना ३ लाखांपर्यंत ०% ते ४% दराने पीक कर्ज मिळते." : "Net effective 0% to 4% interest rate with Govt subvention."}</li>
                <li>{lang === "mr" ? "१.६० लाखांपर्यंतच्या कर्जावर कोणतेही तारण (Collateral) लागत नाही." : "No collateral required for loans up to ₹1.60 Lakhs."}</li>
                <li>{lang === "mr" ? "रुपे (RuPay) किसान डेबिट कार्डद्वारे थेट एटीएममधून गरजेनुसार पैसे काढता येतात." : "RuPay Kisan card provides direct ATM cash withdrawals."}</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: LEGAL REMEDIES */}
      {!loading && subTab === "legal" && (
        <div className="legal-remedies-grid">
          {remedies.map((rem) => (
            <div key={rem.id} className="glass-card legal-card">
              <div className="card-top-header">
                <span className="source-chip">🏛️ {rem.provenance} • {rem.source_citation}</span>
                <span className="law-chip">⚖️ {rem.applicable_law}</span>
              </div>

              <h3 className="dispute-title" style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>
                {lang === "mr" ? rem.dispute_title_mr : rem.dispute_title}
              </h3>
              <div className="dispute-authority" style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-secondary)", margin: "8px 0" }}>
                <span>🏛️ {lang === "mr" ? rem.competent_authority_mr : rem.competent_authority}</span>
                <span>⏱️ {lang === "mr" ? rem.expected_resolution_timeline_mr : rem.expected_resolution_timeline}</span>
                <span>💰 कोर्ट फी: ₹{rem.standard_court_fee_inr}</span>
              </div>

              <div className="legal-steps-box" style={{ margin: "12px 0" }}>
                <h5 style={{ fontSize: 13, color: "var(--accent-lime)" }}>📋 {lang === "mr" ? "न्याय मिळवण्याचे टप्पे (Process)" : "Step-by-Step Remedy Process"}:</h5>
                <ol className="remedy-steps" style={{ paddingLeft: 18, fontSize: 12, marginTop: 4, lineHeight: 1.6, color: "var(--text-primary)" }}>
                  {(lang === "mr" ? rem.filing_procedure_mr : rem.filing_procedure).map((st, sidx) => (
                    <li key={sidx}>{st}</li>
                  ))}
                </ol>
              </div>

              <div className="legal-rights-box" style={{ background: "rgba(56, 189, 248, 0.1)", borderLeft: "3px solid #38bdf8", padding: 10, borderRadius: 6 }}>
                <strong style={{ fontSize: 12, color: "#38bdf8" }}>🛡️ {lang === "mr" ? "शेतकऱ्याला कायद्याचे संरक्षण" : "Key Legal Protections"}:</strong>
                <p style={{ fontSize: 12, marginTop: 4, color: "var(--text-primary)" }}>{lang === "mr" ? rem.key_legal_protections_mr : rem.key_legal_protections}</p>
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
            <h4>📞 {lang === "mr" ? "मिस्ड कॉल व व्हॉईस IVR सेवा" : "Missed Call IVR Gateway"}</h4>
            <p className="omni-desc" style={{ fontSize: 13, color: "var(--text-secondary)", margin: "6px 0 14px" }}>
              {lang === "mr"
                ? `स्मार्टफोन किंवा डेटा नसलेल्या शेतकऱ्यांसाठी: ${omniInfo?.ivr_missed_call_number || "1800-180-1551"} वर मिस्ड कॉल दिल्यास मराठीत कॉल बॅक मिळतो.`
                : `Zero-data access: Farmers give a missed call to ${omniInfo?.ivr_missed_call_number || "1800-180-1551"} and receive an automated voice advisory.`}
            </p>
            <div className="sim-form">
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>{lang === "mr" ? "मोबाईल नंबर" : "Farmer Mobile Number"}</label>
              <input type="text" value={ivrPhone} onChange={(e) => setIvrPhone(e.target.value)} />
              <button type="button" onClick={handleSimulateIvr} className="btn-sim-call">
                📞 {lang === "mr" ? "मिस्ड कॉल सिम्युलेट करा" : "Simulate Missed Call"}
              </button>
            </div>

            {ivrResponse && (
              <div className="ivr-result-card" style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "rgba(2, 132, 199, 0.15)", border: "1px solid #0284c7" }}>
                <div style={{ fontWeight: 800, color: "#38bdf8", fontSize: 13 }}>🎙️ {lang === "mr" ? "शेतकऱ्याला ऐकू येणारा आवाज" : "Incoming Voice Callback"}:</div>
                <p style={{ marginTop: 4, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>{ivrResponse}</p>
              </div>
            )}
          </div>

          {/* WhatsApp Bot Simulator */}
          <div className="glass-card wa-box">
            <h4>💬 {lang === "mr" ? "व्हॉट्सॲप कृषी बॉट सिम्युलेटर" : "WhatsApp Agri Bot Simulator"}</h4>
            <p className="omni-desc" style={{ fontSize: 13, color: "var(--text-secondary)", margin: "6px 0 14px" }}>
              {lang === "mr"
                ? "व्हॉट्सॲपवर फक्त 'bhav' किंवा 'bijli' पाठवून सेकंदात अधिकृत उत्तर मिळवा."
                : "Type instant keywords like 'bhav', 'bijli', or 'kcc' to receive structured university responses."}
            </p>
            <div className="sim-form">
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>{lang === "mr" ? "व्हॉट्सॲप मेसेज लिहा" : "Message Text"}</label>
              <input type="text" value={waMessage} onChange={(e) => setWaMessage(e.target.value)} placeholder="उदा. bhav किंवा bijli" />
              <button type="button" onClick={handleSimulateWa} className="btn-sim-wa">
                💬 {lang === "mr" ? "व्हॉट्सॲप मेसेज पाठवा" : "Send WhatsApp Query"}
              </button>
            </div>

            {waResponse && (
              <div className="wa-chat-bubble" style={{ marginTop: 14 }}>
                <div className="chat-sender" style={{ fontWeight: 800, color: "#86efac", fontSize: 12 }}>🤖 KRISHIOS WhatsApp Bot</div>
                <pre className="chat-text" style={{ fontSize: 13, color: "#ffffff", marginTop: 4 }}>{waResponse}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
