"use client";

import React, { useState, useEffect } from "react";

interface FarmProduceListing {
  id: string;
  farmer_or_fpo_name: string;
  commodity: string;
  commodity_mr: string;
  variety: string;
  quantity_available: string;
  expected_price_per_unit: string;
  quality_grade: string;
  harvest_date: string;
  village: string;
  taluka: string;
  district: string;
  contact_phone: string;
  whatsapp_enabled: boolean;
  fpo_verified: boolean;
  provenance?: string;
  warning?: string;
}

interface ProcessingUnitProfile {
  id: string;
  project_title: string;
  project_title_mr: string;
  target_commodities: string[];
  capacity: string;
  capacity_mr: string;
  total_project_cost_inr: number;
  pmfme_govt_subsidy_35_pct_inr: number;
  bank_term_loan_inr: number;
  farmer_own_margin_money_inr: number;
  estimated_annual_net_profit_inr: number;
  payback_period_years: number;
  key_machinery_required: string[];
  key_machinery_required_mr: string[];
  market_demand_summary: string;
  market_demand_summary_mr: string;
  provenance: string;
  source_citation: string;
}

interface KisanBazaarModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function KisanBazaarModule({ district, lang, apiUrl }: KisanBazaarModuleProps) {
  const [subTab, setSubTab] = useState<"bazaar" | "pmfme">("bazaar");
  const [listings, setListings] = useState<FarmProduceListing[]>([]);
  const [profiles, setProfiles] = useState<ProcessingUnitProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Listing Form State
  const [newCommodity, setNewCommodity] = useState("Red Onion (कांदा)");
  const [newVariety, setNewVariety] = useState("Bhima Super");
  const [newQty, setNewQty] = useState("100 Quintals");
  const [newPrice, setNewPrice] = useState("₹2,200 / Quintal");
  const [newFarmer, setNewFarmer] = useState("Aditya Farmer Group");
  const [newPhone, setNewPhone] = useState("9823901234");
  const [newVillage, setNewVillage] = useState("Khed");

  useEffect(() => {
    const fetchBazaarData = async () => {
      setLoading(true);
      try {
        const [listRes, profRes] = await Promise.all([
          fetch(`${apiUrl}/market-linkage/bazaar-listings?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/market-linkage/processing-profiles`),
        ]);

        if (listRes.ok) setListings(await listRes.json());
        if (profRes.ok) setProfiles(await profRes.json());
      } catch (e) {
        console.error("Kisan bazaar fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBazaarData();
  }, [apiUrl, district]);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: FarmProduceListing = {
      id: `listing_${Date.now()}`,
      farmer_or_fpo_name: newFarmer,
      commodity: newCommodity,
      commodity_mr: newCommodity,
      variety: newVariety,
      quantity_available: newQty,
      expected_price_per_unit: newPrice,
      quality_grade: "Grade A Export / सुपर क्वालिटी",
      harvest_date: "Ready for immediate delivery",
      village: newVillage,
      taluka: "Dindori",
      district: district,
      contact_phone: newPhone,
      whatsapp_enabled: true,
      fpo_verified: true,
    };
    setListings([newLot, ...listings]);
    setShowAddForm(false);
  };

  return (
    <div className="kisan-bazaar-container">
      {/* Module Banner */}
      <div className="module-banner-header">
        <div className="banner-text">
          <div className="banner-tag">🤝 {lang === "mr" ? "थेट शेतकरी बाजार व प्रक्रिया उद्योग" : "DIRECT BAZAAR & FOOD VALUE-ADD"}</div>
          <h2 className="banner-title">
            {lang === "mr" ? "दलालांविना थेट विक्री व अन्न प्रक्रिया प्रकल्प" : "Direct Farm-to-Buyer & PMFME Processing"}
          </h2>
          <p className="banner-subtitle">
            {lang === "mr"
              ? "व्यापारी व ग्राहकांशी थेट व्यवहार करा (APMC आडत ०%) आणि ३५% शासकीय अनुदानावर स्वतःची डाळ मिल किंवा लाकडी घाणा सुरू करा."
              : "0% commission direct farm-gate trading and PMFME 35% capital subsidy food processing micro-enterprises."}
          </p>
        </div>
        <div className="banner-metrics">
          <button className="btn-add-produce" onClick={() => setShowAddForm(!showAddForm)}>
            ➕ {lang === "mr" ? "नवीन शेतीमाल नोंदवा" : "List Your Produce Lot"}
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div className="subtab-pills">
        <button
          className={`subtab-pill ${subTab === "bazaar" ? "active" : ""}`}
          onClick={() => setSubTab("bazaar")}
        >
          🤝 {lang === "mr" ? "थेट शेतकरी बाजार (थेट संपर्क)" : "Direct Produce Listings"}
        </button>
        <button
          className={`subtab-pill ${subTab === "pmfme" ? "active" : ""}`}
          onClick={() => setSubTab("pmfme")}
        >
          🏭 {lang === "mr" ? "३५% अनुदान प्रक्रिया उद्योग (PMFME)" : "PMFME 35% Food Processing Units"}
        </button>
      </div>

      {/* ADD PRODUCE MODAL / FORM */}
      {showAddForm && (
        <div className="glass-card add-produce-card">
          <div className="form-head">
            <h4>🌾 {lang === "mr" ? "तुमचा शेतीमाल थेट खरेदीदारांसाठी नोंदवा" : "Post a Farm-Gate Produce Lot"}</h4>
            <button className="close-btn" onClick={() => setShowAddForm(false)} style={{ background: "none", border: "none", fontSize: 18, color: "var(--text-secondary)", cursor: "pointer" }}>✕</button>
          </div>
          <form onSubmit={handleCreateListing} className="produce-form-grid">
            <div className="form-group">
              <label>{lang === "mr" ? "शेतकऱ्याचे किंवा FPO चे नाव" : "Farmer / FPO Name"}</label>
              <input type="text" value={newFarmer} onChange={(e) => setNewFarmer(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "फोन / WhatsApp नंबर" : "Phone / WhatsApp"}</label>
              <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "गाव" : "Village"}</label>
              <input type="text" value={newVillage} onChange={(e) => setNewVillage(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "पीक (Commodity)" : "Commodity"}</label>
              <select value={newCommodity} onChange={(e) => setNewCommodity(e.target.value)}>
                <option value="Red Onion (कांदा)">कांदा (Red Onion)</option>
                <option value="Soybean (सोयाबीन)">सोयाबीन (Soybean)</option>
                <option value="Cotton (कापूस)">कापूस (Cotton)</option>
                <option value="Grapes (द्राक्षे)">द्राक्षे (Grapes)</option>
                <option value="Pigeonpea (तूर)">तूर (Pigeonpea)</option>
              </select>
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "वाण / जात (Variety)" : "Variety"}</label>
              <input type="text" value={newVariety} onChange={(e) => setNewVariety(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "उपलब्ध साठा (Quantity)" : "Quantity"}</label>
              <input type="text" value={newQty} onChange={(e) => setNewQty(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "अपेक्षित दर (₹)" : "Expected Price"}</label>
              <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
            </div>
            <div className="form-actions" style={{ gridColumn: "1 / -1", marginTop: 8 }}>
              <button type="submit" className="btn-submit-lot">
                {lang === "mr" ? "✅ बाजारपेठेत माल दाखवा" : "Publish Lot"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading-spinner">⌛ {lang === "mr" ? "माहिती लोड होत आहे..." : "Loading records..."}</div>}

      {/* SUBTAB 1: PRODUCE LISTINGS */}
      {!loading && subTab === "bazaar" && (
        <div className="bazaar-listings-grid">
          {/* Simulated Disclaimer Banner */}
          <div style={{
            gridColumn: "1 / -1",
            background: "rgba(234, 179, 8, 0.12)",
            border: "1.5px solid #eab308",
            borderRadius: "var(--radius-md, 12px)",
            padding: "10px 14px",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%"
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div style={{ fontSize: 12, color: "#facc15", fontWeight: 600 }}>
              {lang === "mr"
                ? "सिम्युलेटेड शेतकरी बाजार (SIMULATED): ही प्रात्यक्षिक सूची आहे. थेट शेतकरी-खरेदीदार प्रणाली तपासण्यासाठी."
                : "SIMULATED MARKETPLACE: Demonstration listings for platform testing only. Direct farmer contacts shown are mock samples."}
            </div>
            <span style={{ marginLeft: "auto", background: "#eab308", color: "#000", fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 4 }}>
              SIMULATED
            </span>
          </div>

          {listings.map((item) => (
            <div key={item.id} className="glass-card produce-lot-card">
              <div className="lot-card-top">
                <span className="source-chip">📍 {item.village}, {item.taluka}, {item.district}</span>
                <span className="source-chip" style={{ background: "rgba(234, 179, 8, 0.2)", color: "#facc15", fontWeight: 700 }}>
                  🟡 SIMULATED
                </span>
                {item.fpo_verified && <span className="organic-chip" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>✓ FPO Verified</span>}
              </div>

              <div className="lot-main-info" style={{ margin: "10px 0" }}>
                <h3 className="lot-crop-name" style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{lang === "mr" ? item.commodity_mr : item.commodity}</h3>
                <div className="lot-variety" style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.variety} • {item.quality_grade}</div>
              </div>

              <div className="lot-pricing-strip">
                <div className="price-item">
                  <span className="p-lbl">{lang === "mr" ? "शेतकरी थेट भाव" : "Farm Price"}</span>
                  <span className="p-val highlight">{item.expected_price_per_unit}</span>
                </div>
                <div className="price-item">
                  <span className="p-lbl">{lang === "mr" ? "उपलब्ध साठा" : "Quantity"}</span>
                  <span className="p-val">{item.quantity_available}</span>
                </div>
                <div className="price-item">
                  <span className="p-lbl">{lang === "mr" ? "लोडिंग स्थिती" : "Status"}</span>
                  <span className="p-val" style={{ fontSize: 11 }}>{item.harvest_date}</span>
                </div>
              </div>

              <div className="lot-contact-actions">
                <a href={`tel:${item.contact_phone}`} className="btn-call-farmer">
                  📞 {lang === "mr" ? `फोन करा (${item.farmer_or_fpo_name})` : `Call ${item.farmer_or_fpo_name}`}
                </a>
                {item.whatsapp_enabled && (
                  <a
                    href={`https://wa.me/91${item.contact_phone}?text=Namaskar%20${encodeURIComponent(item.farmer_or_fpo_name)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(item.commodity)}%20lot%20on%20KRISHIOS`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-wa-farmer"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: PMFME FOOD PROCESSING */}
      {!loading && subTab === "pmfme" && (
        <div className="pmfme-grid">
          {profiles.map((prof) => (
            <div key={prof.id} className="glass-card pmfme-card">
              <div className="card-top-header">
                <span className="source-chip">🏛️ {prof.provenance} • {prof.source_citation}</span>
                <span className="subsidy-chip" style={{ background: "rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "3px 8px", borderRadius: 4, fontWeight: 800, fontSize: 12 }}>💰 ३५% शासकीय अनुदान</span>
              </div>

              <h3 className="unit-title" style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>{lang === "mr" ? prof.project_title_mr : prof.project_title}</h3>
              <p className="unit-raw" style={{ fontSize: 13, color: "var(--text-secondary)" }}>🌾 {lang === "mr" ? "कच्चा माल" : "Raw Input"}: <strong>{prof.target_commodities.join(", ")}</strong></p>
              <div style={{ fontSize: 12, color: "var(--accent-lime)", marginBottom: 12 }}>⚡ {lang === "mr" ? "प्रकल्प क्षमता" : "Capacity"}: {lang === "mr" ? prof.capacity_mr : prof.capacity}</div>

              <div className="financial-breakdown-box">
                <div className="f-row">
                  <span>{lang === "mr" ? "एकूण प्रकल्प भांडवल" : "Total Project Cost"}:</span>
                  <strong>₹{(prof.total_project_cost_inr / 100000).toFixed(2)} लाख</strong>
                </div>
                <div className="f-row highlight-subsidy">
                  <span>{lang === "mr" ? "शासकीय अनुदान (३५%)" : "PMFME Subsidy (35%)"}:</span>
                  <strong>- ₹{(prof.pmfme_govt_subsidy_35_pct_inr / 100000).toFixed(2)} लाख</strong>
                </div>
                <div className="f-row">
                  <span>{lang === "mr" ? "शेतकरी स्वतःचे भांडवल (१०%)" : "Own Margin (10%)"}:</span>
                  <strong>₹{(prof.farmer_own_margin_money_inr / 100000).toFixed(2)} लाख</strong>
                </div>
                <div className="f-row">
                  <span>{lang === "mr" ? "बँक मुदत कर्ज" : "Bank Term Loan"}:</span>
                  <strong>₹{(prof.bank_term_loan_inr / 100000).toFixed(2)} लाख</strong>
                </div>
              </div>

              <div className="profit-metric-box">
                <div className="profit-lbl">{lang === "mr" ? "अंदाजे निव्वळ वार्षिक नफा" : "Estimated Annual Net Profit"}</div>
                <div className="profit-val">₹{(prof.estimated_annual_net_profit_inr / 100000).toFixed(2)} लाख <small>/वर्ष</small></div>
                <div className="payback-sub">⏳ {lang === "mr" ? `भांडवल परतफेड कालावधी: ${prof.payback_period_years} वर्षे` : `Payback period: ${prof.payback_period_years} years`}</div>
              </div>

              <div className="machinery-section" style={{ margin: "14px 0" }}>
                <div className="mach-head" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>⚙️ {lang === "mr" ? "समाविष्ट प्रमुख यंत्रसामग्री" : "Key Equipment"}:</div>
                <ul className="mach-list" style={{ paddingLeft: 18, fontSize: 12, marginTop: 4, color: "var(--text-primary)" }}>
                  {(lang === "mr" ? prof.key_machinery_required_mr : prof.key_machinery_required).map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="pmfme-action">
                <a href="https://pmfme.mofpi.gov.in" target="_blank" rel="noreferrer" className="btn-pmfme-apply">
                  🌐 {lang === "mr" ? "PMFME अधिकृत पोर्टलवर अर्ज करा" : "Apply on PMFME Portal"}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
