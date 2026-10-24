"use client";

import React, { useState, useEffect } from "react";

interface EquipmentItem {
  id: string;
  name: string;
  name_mr: string;
  category: string;
  specifications: string;
  specifications_mr: string;
  rate_per_hour_inr: number;
  rate_per_acre_inr?: number;
  diesel_consumption_litres_per_hour: number;
  work_capacity_acres_per_hour: number;
  key_applications: string[];
  key_applications_mr: string[];
}

interface NearbyCenter {
  name: string;
  taluka: string;
  distance_km: number;
  contact_person: string;
  phone: string;
  operator_assigned: string;
}

interface EquipmentEstimate {
  equipment_name: string;
  equipment_name_mr: string;
  area_acres: number;
  estimated_hours_required: number;
  machinery_rental_cost_inr: number;
  fuel_cost_inr: number;
  operator_charges_inr: number;
  total_estimated_cost_inr: number;
  cost_per_acre_inr: number;
  nearby_centers: NearbyCenter[];
  safety_guidelines: string[];
  safety_guidelines_mr: string[];
}

interface EquipmentModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function EquipmentModule({ district, lang, apiUrl }: EquipmentModuleProps) {
  const [catalog, setCatalog] = useState<EquipmentItem[]>([]);
  const [selectedEqId, setSelectedEqId] = useState("drone_sprayer_16l");
  const [acres, setAcres] = useState(3.0);
  const [includeOperator, setIncludeOperator] = useState(true);
  const [includeFuel, setIncludeFuel] = useState(true);
  const [estimate, setEstimate] = useState<EquipmentEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch(`${apiUrl}/equipment/catalog`);
        if (res.ok) {
          const data = await res.json();
          setCatalog(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCatalog();
  }, [apiUrl]);

  const handleEstimate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/equipment/estimate-cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: selectedEqId,
          district,
          area_acres: acres,
          include_operator: includeOperator,
          include_fuel: includeFuel,
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
            🚜 {lang === "mr" ? "कस्टम हायरिंग सेंटर (CHC) कृषी अवजारे भाडे केंद्र" : "Custom Hiring Center (CHC) Farm Machinery Rental"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "ड्रोन फवारणी, ४WD ट्रॅक्टर, रोटाव्हेटर व कंबाईन हार्वेस्टर - शासन प्रमाणित भाडे दर व संपर्क."
              : "Sub-Mission on Agricultural Mechanization (SMAM) certified rental rates, fuel estimates, and FPO hubs."}
          </p>
        </div>
        <span className="prov-badge live">SMAM / FPO TARIFFS</span>
      </div>

      {/* Selector Card */}
      <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <div>
            <label className="input-label">{lang === "mr" ? "यंत्र / अवजार निवडा" : "Select Machinery"}</label>
            <select className="modern-select" value={selectedEqId} onChange={(e) => setSelectedEqId(e.target.value)}>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {lang === "mr" ? item.name_mr : item.name} (₹{item.rate_per_hour_inr}/hr)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "काम करायचे क्षेत्र (Acres)" : "Field Area (Acres)"}</label>
            <input
              type="number"
              step="0.5"
              className="modern-input"
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value) || 1.0)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <label style={{ fontSize: 13, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 6 }}>
              <input type="checkbox" checked={includeOperator} onChange={(e) => setIncludeOperator(e.target.checked)} />
              {lang === "mr" ? "कुशल ऑपरेटर / चालक हवा" : "Include Certified Operator"}
            </label>
            <label style={{ fontSize: 13, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={includeFuel} onChange={(e) => setIncludeFuel(e.target.checked)} />
              {lang === "mr" ? "डिझेल / बॅटरी इंधन समाविष्ट" : "Include Fuel / Battery Energy"}
            </label>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-lime-pill" onClick={handleEstimate} disabled={loading} style={{ padding: "10px 24px" }}>
            <span>{loading ? "Calculating Tariffs..." : lang === "mr" ? "🚜 भाडे दर व जवळचे केंद्र शोधा" : "Calculate Rental & Centers"}</span>
            <span className="circle-arrow-icon">↗</span>
          </button>
        </div>
      </div>

      {estimate && (
        <div>
          {/* Cost Summary Box */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "अपेक्षित कामाचा वेळ" : "Estimated Time Required"}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>{estimate.estimated_hours_required} Hours</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>For {estimate.area_acres} Acres</div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "यंत्र भाडे दर" : "Machinery Rent"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>₹{estimate.machinery_rental_cost_inr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Base CHC Rate</div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{lang === "mr" ? "डिझेल + ऑपरेटर खर्च" : "Fuel + Operator"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                ₹{(estimate.fuel_cost_inr + estimate.operator_charges_inr).toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Subsidized Consumption</div>
            </div>

            <div style={{ background: "rgba(212, 249, 54, 0.08)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-md)", padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--accent-lime)", fontWeight: 700 }}>{lang === "mr" ? "एकूण अंदाजे भाडे खर्च" : "Total Estimated Rent"}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent-lime)" }}>₹{estimate.total_estimated_cost_inr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-primary)" }}>₹{estimate.cost_per_acre_inr} / Acre</div>
            </div>
          </div>

          {/* Nearby CHC Centers */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 18, marginBottom: 20 }}>
            <h5 style={{ fontSize: 16, fontWeight: 800, color: "var(--accent-lime)", marginBottom: 12 }}>
              📍 {lang === "mr" ? "जवळचे शेतकरी उत्पादक कंपनी (FPO) व शासकीय भाडे केंद्र:" : "Nearby Verified CHC & FPO Machinery Hubs:"}
            </h5>
            <div style={{ display: "grid", gap: 12 }}>
              {estimate.nearby_centers.map((center, idx) => (
                <div key={idx} style={{ background: "var(--bg-card-subtle)", padding: 14, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <strong style={{ fontSize: 14, color: "var(--text-primary)" }}>{center.name}</strong>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                      📍 {center.taluka} · 📏 {center.distance_km} km away · 👤 {center.contact_person}
                    </div>
                  </div>
                  <a
                    href={`tel:${center.phone}`}
                    className="btn-lime-pill"
                    style={{ padding: "8px 16px", fontSize: 12, textDecoration: "none" }}
                  >
                    <span>📞 {center.phone}</span>
                    <span className="circle-arrow-icon">↗</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
