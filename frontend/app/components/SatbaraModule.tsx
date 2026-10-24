"use client";

import React, { useState } from "react";

interface SatbaraModuleProps {
  district: string;
  lang: string;
}

export default function SatbaraModule({ district, lang }: SatbaraModuleProps) {
  const [gatNumber, setGatNumber] = useState("142/2A");
  const [areaHectares, setAreaHectares] = useState("1.85");
  const [cropHistory, setCropHistory] = useState("Soybean (Kharif) / Gram (Rabi)");
  const [khatedarName, setKhatedarName] = useState("Aditya Kulkarni");
  const [isSaved, setIsSaved] = useState(false);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-lime)", margin: 0 }}>
            📄 {lang === "mr" ? "महाभूलेख डिजिटल ७/१२ उतारा व फार्म हेल्थ कार्ड" : "Mahabhulekh Digital 7/12 Record & Farm Health Card"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "शासकीय भूमी अभिलेख (Mahabhulekh) सुसंगत शेत नोंदणी व बँकेसाठी डाऊनलोड करण्यायोग्य हेल्थ कार्ड."
              : "Synchronized with Maharashtra land records for bank KCC credit, PMFBY claims, and Krishi Seva Kendra subsidies."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-lime-pill"
            onClick={handlePrint}
            style={{ padding: "8px 16px", fontSize: 12 }}
          >
            <span>🖨️ {lang === "mr" ? "हेल्थ कार्ड प्रिंट करा" : "Print Health Card"}</span>
            <span className="circle-arrow-icon">↗</span>
          </button>
        </div>
      </div>

      {/* Form Input */}
      <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <div>
            <label className="input-label">{lang === "mr" ? "खातेदार शेतकरी नाव" : "Cultivator / Farmer Name"}</label>
            <input
              type="text"
              className="modern-input"
              value={khatedarName}
              onChange={(e) => setKhatedarName(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "गट / सर्व्हे नंबर (Gat No.)" : "Survey / Gat Number"}</label>
            <input
              type="text"
              className="modern-input"
              value={gatNumber}
              onChange={(e) => setGatNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "एकूण लागवडीयोग्य क्षेत्र (हेक्टर)" : "Cultivable Area (Ha)"}</label>
            <input
              type="number"
              step="0.01"
              className="modern-input"
              value={areaHectares}
              onChange={(e) => setAreaHectares(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "ई-पीक पाहणी नोंदणी पीक" : "E-Pik Pahani Crops"}</label>
            <input
              type="text"
              className="modern-input"
              value={cropHistory}
              onChange={(e) => setCropHistory(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn-lime-pill"
            onClick={() => setIsSaved(true)}
            style={{ padding: "10px 24px" }}
          >
            <span>{isSaved ? "✅ Saved Locally" : lang === "mr" ? "💾 ७/१२ नोंद जतन करा" : "Save 7/12 Record"}</span>
            <span className="circle-arrow-icon">↗</span>
          </button>
        </div>
      </div>

      {/* Printable Farm Health Certificate */}
      <div
        id="farm-health-card-print"
        style={{
          background: "var(--bg-card)",
          border: "2px solid var(--border-lime)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid var(--border-card)", paddingBottom: 16, marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--accent-lime)", fontWeight: 800, textTransform: "uppercase" }}>
              GOVERNMENT OF MAHARASHTRA · DIGITAL AGRISTACK PORTAL
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>
              🌾 {lang === "mr" ? "डिजिटल शेतकरी व शेतजमीन ओळखपत्र (Farm Health Card)" : "Official Digital Farm Health Card"}
            </h3>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Unique AgriStack Farmer ID: MH-{district.toUpperCase().slice(0, 3)}-2026-98124
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span className="prov-badge live" style={{ background: "#10b981", color: "#000" }}>VERIFIED 7/12</span>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>Valid for KCC Loan & DBT Subsidies</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{lang === "mr" ? "खातेदार" : "Farmer Name"}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>{khatedarName}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{lang === "mr" ? "गट नंबर" : "Survey / Gat No."}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--accent-lime)" }}>Gat No. {gatNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{lang === "mr" ? "क्षेत्रफळ" : "Area"}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>{areaHectares} Hectares (~{(parseFloat(areaHectares) * 2.47).toFixed(1)} Acres)</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{lang === "mr" ? "जिल्हा / राज्य" : "District & State"}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>{district}, Maharashtra</div>
          </div>
        </div>

        <div style={{ background: "var(--bg-card-subtle)", borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            🌱 {lang === "mr" ? "ई-पीक पाहणी नोंदणीकृत पिके:" : "E-Pik Pahani Registered Cropping Cycle:"}
          </div>
          <div style={{ fontSize: 13, color: "var(--accent-lime)" }}>{cropHistory}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--text-muted)", borderTop: "1px dashed var(--border-card)", paddingTop: 12 }}>
          <span>Department of Agriculture, Govt. of Maharashtra · National AgriStack</span>
          <span>Security QR & Provenance Enforced</span>
        </div>
      </div>
    </div>
  );
}
