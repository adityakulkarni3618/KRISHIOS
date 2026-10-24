"use client";

import React, { useState, useEffect } from "react";

interface ProduceListing {
  id: string;
  farmer_name: string;
  contact_phone: string;
  whatsapp_number: string;
  district: string;
  taluka: string;
  village: string;
  commodity: string;
  commodity_mr: string;
  variety: string;
  quantity_available_quintals: number;
  expected_price_per_quintal_inr: number;
  apmc_current_rate_inr: number;
  premium_over_mandi_pct: number;
  quality_grade: string;
  harvest_date: string;
  is_organic_certified: boolean;
  has_gi_tag: boolean;
  notes_mr: string;
  notes_en: string;
  provenance: string;
}

interface FoodProcessingProfile {
  id: string;
  unit_name: string;
  unit_name_mr: string;
  target_raw_material: string;
  finished_products: string[];
  total_project_cost_inr: number;
  pmfme_capital_subsidy_pct: number;
  max_subsidy_amount_inr: number;
  farmer_own_contribution_pct: number;
  bank_term_loan_inr: number;
  estimated_monthly_profit_inr: number;
  payback_period_years: number;
  key_machinery_list: string[];
  official_portal: string;
  provenance: string;
}

interface KisanBazaarModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function KisanBazaarModule({ district, lang, apiUrl }: KisanBazaarModuleProps) {
  const [subTab, setSubTab] = useState<"bazaar" | "pmfme">("bazaar");
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [profiles, setProfiles] = useState<FoodProcessingProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Listing Form State
  const [newCommodity, setNewCommodity] = useState("Soybean");
  const [newVariety, setNewVariety] = useState("JS-335");
  const [newQty, setNewQty] = useState(40);
  const [newPrice, setNewPrice] = useState(4900);
  const [newFarmer, setNewFarmer] = useState("Aditya Farmer");
  const [newPhone, setNewPhone] = useState("9822012345");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBazaarData = async () => {
      setLoading(true);
      try {
        const [listRes, profRes] = await Promise.all([
          fetch(`${apiUrl}/market-linkage/kisan-bazaar/listings?district=${encodeURIComponent(district)}`),
          fetch(`${apiUrl}/market-linkage/food-processing/profiles`),
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

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/market-linkage/kisan-bazaar/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_name: newFarmer,
          contact_phone: newPhone,
          whatsapp_number: newPhone,
          district: district,
          taluka: "Dindori",
          village: "Khed",
          commodity: newCommodity,
          commodity_mr: newCommodity === "Soybean" ? "सोयाबीन" : newCommodity,
          variety: newVariety,
          quantity_available_quintals: Number(newQty),
          expected_price_per_quintal_inr: Number(newPrice),
          apmc_current_rate_inr: Number(newPrice) - 200,
          quality_grade: "Grade A Export",
          is_organic_certified: false,
          has_gi_tag: false,
          notes_mr: "थेट बांधावरून विक्री, उत्कृष्ट सुकवलेला माल.",
          notes_en: "Farm-gate direct sale lot with high test weight.",
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setListings([created, ...listings]);
        setShowAddForm(false);
      }
    } catch (e) {
      console.error("Listing create error:", e);
    } finally {
      setSubmitting(false);
    }
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
            <button className="close-btn" onClick={() => setShowAddForm(false)}>✕</button>
          </div>
          <form onSubmit={handleCreateListing} className="produce-form-grid">
            <div className="form-group">
              <label>{lang === "mr" ? "शेतकऱ्याचे नाव" : "Farmer Name"}</label>
              <input type="text" value={newFarmer} onChange={(e) => setNewFarmer(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "फोन / WhatsApp नंबर" : "Phone / WhatsApp"}</label>
              <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "पीक (Commodity)" : "Commodity"}</label>
              <select value={newCommodity} onChange={(e) => setNewCommodity(e.target.value)}>
                <option value="Soybean">सोयाबीन (Soybean)</option>
                <option value="Cotton">कापूस (Cotton)</option>
                <option value="Onion">कांदा (Onion)</option>
                <option value="Grapes">द्राक्षे (Grapes)</option>
                <option value="Tur">तूर (Red Gram)</option>
              </select>
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "वाण / जात (Variety)" : "Variety"}</label>
              <input type="text" value={newVariety} onChange={(e) => setNewVariety(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "उपलब्ध प्रमाण (क्विंटल)" : "Quantity (Quintals)"}</label>
              <input type="number" value={newQty} onChange={(e) => setNewQty(Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>{lang === "mr" ? "अपेक्षित भाव (₹/क्विंटल)" : "Expected Price (₹/Qtl)"}</label>
              <input type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit-lot" disabled={submitting}>
                {submitting ? "नोंदणी होत आहे..." : (lang === "mr" ? "✅ बाजारपेठेत माल दाखवा" : "Publish Lot")}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading-spinner">⌛ {lang === "mr" ? "माहिती लोड होत आहे..." : "Loading records..."}</div>}

      {/* SUBTAB 1: PRODUCE LISTINGS */}
      {!loading && subTab === "bazaar" && (
        <div className="bazaar-listings-grid">
          {listings.map((item) => (
            <div key={item.id} className="glass-card produce-lot-card">
              <div className="lot-card-top">
                <span className="source-chip">📍 {item.village}, {item.taluka}</span>
                {item.is_organic_certified && <span className="organic-chip">🌿 Organic Certified</span>}
                {item.has_gi_tag && <span className="gi-chip">🎖️ GI Tagged</span>}
              </div>

              <div className="lot-main-info">
                <h3 className="lot-crop-name">{lang === "mr" ? item.commodity_mr : item.commodity}</h3>
                <div className="lot-variety">{item.variety} • {item.quality_grade}</div>
              </div>

              <div className="lot-pricing-strip">
                <div className="price-item">
                  <span className="p-lbl">{lang === "mr" ? "शेतकरी अपेक्षित दर" : "Farm Price"}</span>
                  <span className="p-val highlight">₹{item.expected_price_per_quintal_inr} <small>/क्विंटल</small></span>
                </div>
                <div className="price-item">
                  <span className="p-lbl">{lang === "mr" ? "बाजार समिती सरासरी" : "Mandi Rate"}</span>
                  <span className="p-val">₹{item.apmc_current_rate_inr}</span>
                </div>
                <div className="price-item">
                  <span className="p-lbl">{lang === "mr" ? "उपलब्ध साठा" : "Quantity"}</span>
                  <span className="p-val">{item.quantity_available_quintals} Qtl</span>
                </div>
              </div>

              <div className="lot-notes">
                <p>💬 {lang === "mr" ? item.notes_mr : item.notes_en}</p>
              </div>

              <div className="lot-contact-actions">
                <a href={`tel:${item.contact_phone}`} className="btn-call-farmer">
                  📞 {lang === "mr" ? `फोन करा (${item.farmer_name})` : `Call ${item.farmer_name}`}
                </a>
                <a
                  href={`https://wa.me/91${item.whatsapp_number}?text=Namaskar%20${encodeURIComponent(item.farmer_name)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(item.commodity)}%20lot%20on%20AgriNexus`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-wa-farmer"
                >
                  💬 WhatsApp
                </a>
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
                <span className="source-chip">🏛️ {prof.provenance}</span>
                <span className="subsidy-chip">💰 {prof.pmfme_capital_subsidy_pct}% Subsidy</span>
              </div>

              <h3 className="unit-title">{lang === "mr" ? prof.unit_name_mr : prof.unit_name}</h3>
              <p className="unit-raw">🌾 {lang === "mr" ? "कच्चा माल" : "Raw Input"}: <strong>{prof.target_raw_material}</strong></p>

              <div className="financial-breakdown-box">
                <div className="f-row">
                  <span>{lang === "mr" ? "एकूण प्रकल्प खर्च" : "Total Project Cost"}:</span>
                  <strong>₹{(prof.total_project_cost_inr / 100000).toFixed(2)} लाख</strong>
                </div>
                <div className="f-row highlight-subsidy">
                  <span>{lang === "mr" ? "शासकीय अनुदान (३५%)" : "PMFME Subsidy (35%)"}:</span>
                  <strong>- ₹{(prof.max_subsidy_amount_inr / 100000).toFixed(2)} लाख</strong>
                </div>
                <div className="f-row">
                  <span>{lang === "mr" ? "शेतकरी स्वतःचे भांडवल (१०%)" : "Own Contribution (10%)"}:</span>
                  <strong>₹{((prof.total_project_cost_inr * (prof.farmer_own_contribution_pct / 100)) / 100000).toFixed(2)} लाख</strong>
                </div>
                <div className="f-row">
                  <span>{lang === "mr" ? "बँक मुदत कर्ज" : "Bank Term Loan"}:</span>
                  <strong>₹{(prof.bank_term_loan_inr / 100000).toFixed(2)} लाख</strong>
                </div>
              </div>

              <div className="profit-metric-box">
                <div className="profit-lbl">{lang === "mr" ? "अंदाजे निव्वळ मासिक नफा" : "Estimated Monthly Net Profit"}</div>
                <div className="profit-val">₹{prof.estimated_monthly_profit_inr.toLocaleString()} <small>/month</small></div>
                <div className="payback-sub">⏳ {lang === "mr" ? `भांडवल परतफेड कालावधी: ${prof.payback_period_years} वर्षे` : `Payback period: ${prof.payback_period_years} years`}</div>
              </div>

              <div className="machinery-section">
                <div className="mach-head">⚙️ {lang === "mr" ? "समाविष्ट प्रमुख यंत्रसामग्री" : "Key Equipment"}:</div>
                <ul className="mach-list">
                  {prof.key_machinery_list.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="pmfme-action">
                <a href={prof.official_portal} target="_blank" rel="noreferrer" className="btn-pmfme-apply">
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
