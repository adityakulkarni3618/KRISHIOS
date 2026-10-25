"use client";

import React, { useState, useEffect } from "react";

interface WarehouseFacility {
  id: string;
  name: string;
  name_mr: string;
  district: string;
  taluka: string;
  agency: string;
  total_capacity_mt: number;
  cold_storage_available: boolean;
  wdra_registered: boolean;
  wdra_reg_number: string;
  storage_charge_per_qtl_month_inr: number;
  manager_name: string;
  contact_phone: string;
  distance_km: number;
}

interface PledgeLoanResult {
  commodity: string;
  quantity_quintals: number;
  total_crop_value_inr: number;
  max_pledge_loan_eligible_inr: number;
  interest_rate_pct_annual: number;
  monthly_interest_cost_inr: number;
  warehouse_storage_cost_inr: number;
  total_carrying_cost_inr: number;
  projected_post_harvest_price_inr: number;
  net_economic_gain_by_holding_inr: number;
  advice_summary: string;
  advice_summary_mr: string;
  source_citation: string;
}

interface PostharvestModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function PostharvestModule({ district, lang, apiUrl }: PostharvestModuleProps) {
  const [warehouses, setWarehouses] = useState<WarehouseFacility[]>([]);
  const [commodity, setCommodity] = useState("Soybean");
  const [quantity, setQuantity] = useState(60);
  const [price, setPrice] = useState(4850);
  const [months, setMonths] = useState(3);
  const [loanResult, setLoanResult] = useState<PledgeLoanResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await fetch(`${apiUrl}/postharvest/warehouses?district=${encodeURIComponent(district)}`);
        if (res.ok) {
          setWarehouses(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchWarehouses();
  }, [apiUrl, district]);

  const handlePledgeLoan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/postharvest/pledge-loan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commodity,
          quantity_quintals: quantity,
          current_modal_price_per_qtl: price,
          planned_storage_months: months,
        }),
      });
      if (res.ok) {
        setLoanResult(await res.json());
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
            📦 {lang === "mr" ? "शासकीय वखार गोदामे व e-NWR शेतमाल तारण कर्ज" : "MSWC/CWC Warehouses & e-NWR Pledge Financing"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "महाराष्ट्र राज्य वखार महामंडळ (MSWC) मान्यताप्राप्त गोदामे व अवघ्या ७% व्याजाने तारण कर्ज."
              : "WDRA accredited warehouses and RBI priority sector pledge financing to avoid harvest distress selling."}
          </p>
        </div>
        <span className="prov-badge live" style={{ background: "#10b981", color: "#000" }}>WDRA ACCREDITED</span>
      </div>

      {/* Loan Calculator */}
      <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
        <h5 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
          💰 {lang === "mr" ? "e-NWR तारण कर्ज व साठवणूक नफा कॅल्क्युलेटर" : "e-NWR Pledge Loan & Holding Gain Calculator"}
        </h5>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <div>
            <label className="input-label">{lang === "mr" ? "शेतमाल (Commodity)" : "Commodity"}</label>
            <input
              type="text"
              className="modern-input"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "साठा क्विंटल (Quintals)" : "Quantity (Quintals)"}</label>
            <input
              type="number"
              className="modern-input"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 10)}
            />
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "सध्याचा भाव (₹/Qtl)" : "Current Price (₹/Qtl)"}</label>
            <input
              type="number"
              className="modern-input"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 1000)}
            />
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "साठवणूक महिने (Months)" : "Holding Duration (Months)"}</label>
            <select className="modern-select" value={months} onChange={(e) => setMonths(parseInt(e.target.value) || 3)}>
              <option value="1">1 Month</option>
              <option value="2">2 Months</option>
              <option value="3">3 Months (Optimal)</option>
              <option value="6">6 Months</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-lime-pill" onClick={handlePledgeLoan} disabled={loading} style={{ padding: "10px 24px" }}>
            <span>{loading ? "Calculating..." : lang === "mr" ? "📊 तारण कर्ज मर्यादा व नफा तपासा" : "Calculate Pledge Advance"}</span>
            <span className="circle-arrow-icon">↗</span>
          </button>
        </div>
      </div>

      {loanResult && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 16 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "शेतमालाचे सध्याचे एकूण मूल्य" : "Current Crop Valuation"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>₹{loanResult.total_crop_value_inr.toLocaleString()}</div>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid #10b981", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>{lang === "mr" ? "पात्र तारण कर्ज (७५% मर्यादा)" : "Max Loan Eligibility (75%)"}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>₹{loanResult.max_pledge_loan_eligible_inr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>At 7.0% subvented interest</div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "वखार भाडे + व्याज खर्च" : "Storage + Interest Cost"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>₹{loanResult.total_carrying_cost_inr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>For {months} months</div>
            </div>

            <div style={{ background: "rgba(212, 249, 54, 0.08)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--accent-lime)", fontWeight: 700 }}>{lang === "mr" ? "साठवून विकल्यास अतिरिक्त नफा" : "Net Holding Profit"}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent-lime)" }}>₹{loanResult.net_economic_gain_by_holding_inr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-primary)" }}>Post-harvest price rally</div>
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 14, fontSize: 13, color: "var(--text-primary)" }}>
            💡 {lang === "mr" ? loanResult.advice_summary_mr : loanResult.advice_summary}
          </div>
        </div>
      )}

      {/* Warehouses Directory */}
      <h5 style={{ fontSize: 16, fontWeight: 800, color: "var(--accent-lime)", marginBottom: 12 }}>
        🏛️ {lang === "mr" ? `${district} जिल्ह्यातील नोंदणीकृत शासकीय वखार गोदामे:` : `WDRA Warehouses in ${district} & Surrounds:`}
      </h5>
      <div style={{ display: "grid", gap: 12 }}>
        {warehouses.map((w) => (
          <div key={w.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>
                {lang === "mr" ? w.name_mr : w.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                📍 {w.taluka}, {w.district} · 📏 {w.distance_km} km · 🏢 क्षमता: {w.total_capacity_mt.toLocaleString()} MT
              </div>
              <div style={{ fontSize: 11, color: "var(--accent-lime)", marginTop: 4 }}>
                भाडे: ₹{w.storage_charge_per_qtl_month_inr}/क्विंटल/महिना · WDRA नोंदणी: {w.wdra_reg_number}
              </div>
            </div>

            <a
              href={`tel:${w.contact_phone}`}
              className="btn-lime-pill"
              style={{ padding: "8px 16px", fontSize: 12, textDecoration: "none" }}
            >
              <span>📞 {w.contact_phone}</span>
              <span className="circle-arrow-icon">↗</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
