"use client";

import React, { useState } from "react";

interface ZoneMetric {
  zone_name: string;
  zone_name_mr: string;
  area_pct: number;
  avg_ndvi: number;
  vigor_status: string;
  vigor_status_mr: string;
  action_item: string;
  action_item_mr: string;
}

interface SatelliteAnalysisResult {
  district: string;
  crop: string;
  satellite_source: string;
  pass_date: string;
  cloud_cover_pct: number;
  mean_ndvi: number;
  mean_ndre: number;
  mean_ndwi: number;
  canopy_status: string;
  canopy_status_mr: string;
  zonal_distribution: ZoneMetric[];
  overall_recommendation: string;
  overall_recommendation_mr: string;
  source_citation: string;
}

interface RemoteSensingModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
}

export default function RemoteSensingModule({ district, lang, apiUrl }: RemoteSensingModuleProps) {
  const [crop, setCrop] = useState("Soybean");
  const [acres, setAcres] = useState(2.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SatelliteAnalysisResult | null>(null);

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/remote-sensing/field-ndvi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district,
          crop,
          farm_area_acres: acres,
        }),
      });
      if (res.ok) {
        setResult(await res.json());
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
            🛰️ {lang === "mr" ? "सेंटिनेल-२ उपग्रह पीक आरोग्य व हरित निर्देशांक (NDVI)" : "Sentinel-2 Satellite Crop Health & NDVI Canopy Explorer"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "युरोपियन स्पेस एजन्सी (ESA) व इस्रो भुवन मल्टिस्पेक्ट्रल डेटा - १० मीटर अचूकतेने पाण्याचा व नत्राचा ताण ओळखा."
              : "ESA Copernicus Sentinel-2 MSI 10m multispectral resolution: detects crop vigor and water stress before visible symptoms."}
          </p>
        </div>
        <span className="prov-badge live" style={{ background: "#38bdf8", color: "#000" }}>SENTINEL-2 MSI</span>
      </div>

      {/* Control Box */}
      <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <div>
            <label className="input-label">{lang === "mr" ? "पीक (Crop)" : "Crop"}</label>
            <select className="modern-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Cotton">Cotton (कापूस)</option>
              <option value="Sugarcane">Sugarcane (ऊस)</option>
              <option value="Onion">Onion (कांदा)</option>
              <option value="Pomegranate">Pomegranate / Orchard (डाळिंब/फळबाग)</option>
            </select>
          </div>

          <div>
            <label className="input-label">{lang === "mr" ? "शेताचे क्षेत्र (Acres)" : "Field Acreage"}</label>
            <input
              type="number"
              step="0.5"
              className="modern-input"
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value) || 1.0)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn-lime-pill" onClick={handleScan} disabled={loading} style={{ padding: "10px 24px", width: "100%" }}>
              <span>{loading ? "Downloading Spectral Band..." : lang === "mr" ? "🛰️ उपग्रह स्कॅन करा" : "Analyze Satellite Pass"}</span>
              <span className="circle-arrow-icon">↗</span>
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div>
          {/* Telemetry Header */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 18, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--accent-lime)", fontWeight: 800 }}>● SATELLITE PASS ACQUIRED</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>{result.satellite_source}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Pass Date: {result.pass_date} · Cloud Cover: {result.cloud_cover_pct}%</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ background: "var(--bg-card-subtle)", padding: "8px 12px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Mean NDVI</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent-lime)" }}>{result.mean_ndvi}</div>
                </div>
                <div style={{ background: "var(--bg-card-subtle)", padding: "8px 12px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Red-Edge (NDRE)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#38bdf8" }}>{result.mean_ndre}</div>
                </div>
                <div style={{ background: "var(--bg-card-subtle)", padding: "8px 12px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Moisture (NDWI)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{result.mean_ndwi}</div>
                </div>
              </div>
            </div>

            {/* Simulated Satellite Multispectral Field Polygon */}
            <div
              style={{
                height: 180,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #064e3b 0%, #10b981 40%, #047857 70%, #b45309 100%)",
                position: "relative",
                overflow: "hidden",
                border: "1px solid var(--border-lime)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                <span>GPS: 19.9975° N, 73.7898° E ({district})</span>
                <span>FALSE COLOR COMPOSITE (B8 / B4 / B3)</span>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", background: "rgba(0,0,0,0.6)", padding: "8px 12px", borderRadius: 8, width: "fit-content" }}>
                <span style={{ fontSize: 11, color: "#a7f3d0" }}>🟢 Healthy Canopy (NDVI &gt; 0.70)</span>
                <span style={{ fontSize: 11, color: "#fef08a" }}>🟡 Moderate (0.50-0.70)</span>
                <span style={{ fontSize: 11, color: "#fca5a5" }}>🔴 Moisture/Nutrient Stress (&lt; 0.50)</span>
              </div>
            </div>
          </div>

          {/* Zonal Breakdown */}
          <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
            {result.zonal_distribution.map((z, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-md)",
                  padding: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>
                    {lang === "mr" ? z.zone_name_mr : z.zone_name} ({z.area_pct}% of Farm)
                  </div>
                  <div style={{ fontSize: 12, color: "var(--accent-lime)", marginTop: 2 }}>
                    Status: {lang === "mr" ? z.vigor_status_mr : z.vigor_status} · NDVI: {z.avg_ndvi}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                    🎯 <strong>{lang === "mr" ? "कृषी सल्ला:" : "Actionable Remedy:"}</strong> {lang === "mr" ? z.action_item_mr : z.action_item}
                  </div>
                </div>

                <span
                  style={{
                    background: z.avg_ndvi >= 0.7 ? "rgba(16, 185, 129, 0.2)" : z.avg_ndvi >= 0.5 ? "rgba(56, 189, 248, 0.2)" : "rgba(239, 68, 68, 0.2)",
                    color: z.avg_ndvi >= 0.7 ? "#10b981" : z.avg_ndvi >= 0.5 ? "#38bdf8" : "#f87171",
                    padding: "6px 12px",
                    borderRadius: 14,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {z.avg_ndvi >= 0.7 ? "HEALTHY" : z.avg_ndvi >= 0.5 ? "OPTIMAL" : "NEEDS IRRIGATION"}
                </span>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div style={{ background: "rgba(212, 249, 54, 0.05)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-md)", padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--accent-lime)", marginBottom: 4 }}>
              💡 {lang === "mr" ? "उपग्रह विश्लेषणाचे मुख्य निष्कर्ष:" : "Satellite Agronomic Assessment Summary:"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
              {lang === "mr" ? result.overall_recommendation_mr : result.overall_recommendation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
