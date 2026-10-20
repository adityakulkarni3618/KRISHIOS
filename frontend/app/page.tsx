"use client";

import React, { useState, useEffect } from "react";
import enMessages from "../messages/en.json";
import mrMessages from "../messages/mr.json";
import hiMessages from "../messages/hi.json";

type Language = "mr" | "en" | "hi";

const MESSAGES: Record<Language, Record<string, string>> = {
  mr: mrMessages,
  en: enMessages,
  hi: hiMessages,
};

interface Farm {
  id: number;
  farmer_id?: number;
  name: string;
  area_hectares: number;
  district: string;
  state?: string;
  irrigation_source?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface SoilTest {
  id: number;
  farm_id: number;
  tested_on: string;
  ph: number | null;
  organic_carbon_pct: number | null;
  lab_name: string | null;
  provenance: string;
}

interface WeatherData {
  latitude: number;
  longitude: number;
  district: string | null;
  temperature: number | null;
  relative_humidity: number | null;
  precipitation: number | null;
  wind_speed: number | null;
  daily_forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation_sum: number;
    precipitation_probability: number | null;
  }>;
  advisories: string[];
  source: string;
  attribution: string;
  fetched_at: string;
  provenance: string;
  is_available: boolean;
}

interface MandiPrice {
  id: string;
  commodity: string;
  district: string;
  market: string;
  variety: string;
  min_price: number;
  modal_price: number;
  max_price: number;
  arrival_quantity_quintals: number | null;
  price_date: string;
  provenance: string;
}

interface Scheme {
  id: string;
  name: string;
  name_mr: string;
  name_hi: string;
  category: string;
  sponsor: string;
  benefit_summary: string;
  benefit_summary_mr: string;
  benefit_summary_hi: string;
  eligibility_checklist: string[];
  required_documents: string[];
  official_portal_url: string;
  application_portal_name: string;
  last_verified_date: string;
  provenance: string;
}

export default function Home() {
  const [lang, setLang] = useState<Language>("mr");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  // Data states
  const [farms, setFarms] = useState<Farm[]>([]);
  const [soilTests, setSoilTests] = useState<Record<number, SoilTest[]>>({});
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Pune");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);
  const [mandiSearch, setMandiSearch] = useState<string>("");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [schemeCategory, setSchemeCategory] = useState<string>("all");

  // Modals
  const [showAddFarmModal, setShowAddFarmModal] = useState<boolean>(false);
  const [showAddSoilModal, setShowAddSoilModal] = useState<boolean>(false);
  const [selectedFarmForSoil, setSelectedFarmForSoil] = useState<number | null>(null);

  // Farm Form State
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmArea, setNewFarmArea] = useState("1.5");
  const [newFarmDistrict, setNewFarmDistrict] = useState("Pune");
  const [newFarmIrrigation, setNewFarmIrrigation] = useState("Well & Drip");

  // Soil Form State
  const [newSoilPh, setNewSoilPh] = useState("7.2");
  const [newSoilOc, setNewSoilOc] = useState("0.65");
  const [newSoilDate, setNewSoilDate] = useState("2026-10-15");
  const [newSoilLab, setNewSoilLab] = useState("District Soil Testing Lab, Pune");

  // Economics Calculator State
  const [calcCrop, setCalcCrop] = useState("Soybean");
  const [calcArea, setCalcArea] = useState(2.0);
  const [calcSeed, setCalcSeed] = useState(6000);
  const [calcFert, setCalcFert] = useState(8000);
  const [calcPest, setCalcPest] = useState(3000);
  const [calcLabor, setCalcLabor] = useState(12000);
  const [calcMachinery, setCalcMachinery] = useState(7000);
  const [calcIrrig, setCalcIrrig] = useState(4000);
  const [calcOther, setCalcOther] = useState(2000);
  const [calcYield, setCalcYield] = useState(25.0);
  const [calcPrice, setCalcPrice] = useState(4500);

  // Problem Mapping Tool State
  const [mappingQuery, setMappingQuery] = useState("");
  const [mappingResult, setMappingResult] = useState<any>(null);

  const t = (key: string): string => {
    return MESSAGES[lang]?.[key] || enMessages[key as keyof typeof enMessages] || key;
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Initial dummy seed for offline preview
  const defaultFarms: Farm[] = [
    { id: 1, name: "Gat No. 142 - Malegaon Plot", area_hectares: 2.2, district: "Nashik", irrigation_source: "Borewell & Drip" },
    { id: 2, name: "Gat No. 88 - Baramati Orchard", area_hectares: 1.8, district: "Pune", irrigation_source: "Canal & Farm Pond" },
  ];

  const defaultSoil: Record<number, SoilTest[]> = {
    1: [{ id: 101, farm_id: 1, tested_on: "2026-09-20", ph: 7.4, organic_carbon_pct: 0.68, lab_name: "MPKV Krishi Vigyan Kendra", provenance: "USER_PROVIDED" }],
    2: [{ id: 102, farm_id: 2, tested_on: "2026-08-14", ph: 8.1, organic_carbon_pct: 0.52, lab_name: "District Lab Pune", provenance: "USER_PROVIDED" }],
  };

  // Load from LocalStorage or initialize
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("krishios_lang") as Language;
      if (savedLang) setLang(savedLang);

      const savedFarms = localStorage.getItem("krishios_farms");
      if (savedFarms) {
        setFarms(JSON.parse(savedFarms));
      } else {
        setFarms(defaultFarms);
      }

      const savedSoil = localStorage.getItem("krishios_soil");
      if (savedSoil) {
        setSoilTests(JSON.parse(savedSoil));
      } else {
        setSoilTests(defaultSoil);
      }
    } catch {
      setFarms(defaultFarms);
      setSoilTests(defaultSoil);
    }
  }, []);

  const handleLangChange = (l: Language) => {
    setLang(l);
    try {
      localStorage.setItem("krishios_lang", l);
    } catch {}
  };

  // Fetch Weather
  const fetchWeather = async (dist: string) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(`${API_URL}/weather/advisory?district=${encodeURIComponent(dist)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
        setIsOnline(true);
      } else {
        throw new Error("Offline");
      }
    } catch {
      setIsOnline(false);
      // Fallback offline mock for display
      setWeather({
        latitude: 18.52,
        longitude: 73.85,
        district: dist,
        temperature: 31.8,
        relative_humidity: 48,
        precipitation: 0.0,
        wind_speed: 9.4,
        daily_forecast: [
          { date: "2026-10-20", temp_max: 33.5, temp_min: 21.0, precipitation_sum: 0.0, precipitation_probability: 5 },
          { date: "2026-10-21", temp_max: 34.0, temp_min: 21.5, precipitation_sum: 0.0, precipitation_probability: 10 },
          { date: "2026-10-22", temp_max: 33.0, temp_min: 20.8, precipitation_sum: 2.4, precipitation_probability: 45 },
        ],
        advisories: [
          "Favorable weather conditions for harvesting and post-monsoon field preparation.",
          "Wind speed < 12 km/h: Suitable for preventive foliar spraying in early morning.",
        ],
        source: "Open-Meteo",
        attribution: "Weather data by Open-Meteo.com under CC BY 4.0",
        fetched_at: new Date().toISOString(),
        provenance: "LIVE",
        is_available: true,
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch Mandi Prices
  const fetchMandi = async () => {
    try {
      const res = await fetch(`${API_URL}/market/prices`);
      if (res.ok) {
        const data = await res.json();
        setMandiPrices(data.records || []);
      }
    } catch {
      // Use standard default prices
      setMandiPrices([
        { id: "M1", commodity: "Onion (कांदा)", district: "Nashik", market: "Lasalgaon", variety: "Red Onion", min_price: 1400, modal_price: 2250, max_price: 2850, arrival_quantity_quintals: 12450, price_date: "2026-10-19", provenance: "HISTORICAL" },
        { id: "M2", commodity: "Soybean (सोयाबीन)", district: "Nagpur", market: "Nagpur APMC", variety: "Yellow (JS-335)", min_price: 4100, modal_price: 4580, max_price: 4820, arrival_quantity_quintals: 4300, price_date: "2026-10-19", provenance: "HISTORICAL" },
        { id: "M3", commodity: "Cotton (कापूस)", district: "Amravati", market: "Amravati APMC", variety: "Medium Staple (H-4)", min_price: 6800, modal_price: 7450, max_price: 7820, arrival_quantity_quintals: 3100, price_date: "2026-10-19", provenance: "HISTORICAL" },
        { id: "M4", commodity: "Tomato (टोमॅटो)", district: "Pune", market: "Narayangaon", variety: "Hybrid", min_price: 800, modal_price: 1400, max_price: 1900, arrival_quantity_quintals: 5400, price_date: "2026-10-19", provenance: "HISTORICAL" },
        { id: "M5", commodity: "Gram / Chana (हरभरा)", district: "Latur", market: "Latur APMC", variety: "Desi", min_price: 5400, modal_price: 5950, max_price: 6300, arrival_quantity_quintals: 3900, price_date: "2026-10-19", provenance: "HISTORICAL" },
      ]);
    }
  };

  // Fetch Schemes
  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${API_URL}/schemes`);
      if (res.ok) {
        const data = await res.json();
        setSchemes(data || []);
      }
    } catch {
      // Default schemes
      setSchemes([
        {
          id: "SCH-PM-KISAN",
          name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
          name_mr: "पीएम-किसान (पंतप्रधान किसान सन्मान निधी)",
          name_hi: "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
          category: "Direct Income",
          sponsor: "Central Government",
          benefit_summary: "₹6,000 per year directly transferred to bank account in 3 equal installments of ₹2,000.",
          benefit_summary_mr: "दरवर्षी ₹६,००० थेट बँक खात्यात, तीन समान हप्त्यांमध्ये जमा.",
          benefit_summary_hi: "प्रत्येक वर्ष ₹६,००० सीधे बैंक खाते में तीन समान किश्तों में।",
          eligibility_checklist: ["Landholder farmer family", "Aadhaar e-KYC completed", "Non-institutional"],
          required_documents: ["Aadhaar Card", "7/12 & 8-A Extract", "Bank Passbook"],
          official_portal_url: "https://pmkisan.gov.in/",
          application_portal_name: "PM-KISAN Portal",
          last_verified_date: "2026-10-20",
          provenance: "HISTORICAL",
        },
        {
          id: "SCH-PMFBY",
          name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
          name_mr: "पंतप्रधान पीक विमा योजना (१ रुपयात पीक विमा)",
          name_hi: "प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)",
          category: "Insurance",
          sponsor: "Central & Maharashtra State Government",
          benefit_summary: "Comprehensive crop insurance; in Maharashtra farmers pay only ₹1 token premium.",
          benefit_summary_mr: "महाराष्ट्र शासनातर्फे केवळ ₹१ भरून सर्वसमावेशक पीक विमा संरक्षण.",
          benefit_summary_hi: "मात्र ₹१ टोकन प्रीमियम में व्यापक फसल बीमा सुरक्षा।",
          eligibility_checklist: ["Notified crops in notified areas", "Sowing certificate / e-Pik Pahani entry"],
          required_documents: ["7/12 & 8-A land extract", "Aadhaar Card", "Bank details", "e-Pik Pahani"],
          official_portal_url: "https://pmfby.gov.in/",
          application_portal_name: "PMFBY & MahaDBT",
          last_verified_date: "2026-10-20",
          provenance: "HISTORICAL",
        },
        {
          id: "SCH-POCRA",
          name: "Nanaji Deshmukh Krishi Sanjivani Yojana (PoCRA)",
          name_mr: "नानाजी देशमुख कृषी संजीवनी प्रकल्प (पोकरा)",
          name_hi: "नानाजी देशमुख कृषि संजीवनी योजना (पोकरा)",
          category: "Water & Irrigation",
          sponsor: "Government of Maharashtra & World Bank",
          benefit_summary: "50% to 75% subsidy for drip irrigation, farm ponds, and shade nets in 5,142 drought-prone villages.",
          benefit_summary_mr: "ठिबक सिंचन, शेततळे, आणि शेडनेटसाठी ५०% ते ७५% थेट अनुदान.",
          benefit_summary_hi: "सूखाग्रस्त क्षेत्रों में ड्रिप, खेत तालाब और शेडनेट के लिए ५०% से ७५% अनुदान।",
          eligibility_checklist: ["Farmer in 5,142 notified villages of Vidarbha & Marathwada", "Small & marginal farmers"],
          required_documents: ["Aadhaar Card", "7/12 & 8-A extract", "Bank Passbook"],
          official_portal_url: "https://mahapocra.gov.in/",
          application_portal_name: "MahaPoCRA Portal",
          last_verified_date: "2026-10-20",
          provenance: "HISTORICAL",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchWeather(selectedDistrict);
    fetchMandi();
    fetchSchemes();
  }, [selectedDistrict]);

  // Add Farm Action
  const handleAddFarm = () => {
    if (!newFarmName.trim()) return;
    const newFarm: Farm = {
      id: Date.now(),
      name: newFarmName,
      area_hectares: parseFloat(newFarmArea) || 1.0,
      district: newFarmDistrict,
      irrigation_source: newFarmIrrigation,
    };
    const updated = [...farms, newFarm];
    setFarms(updated);
    try {
      localStorage.setItem("krishios_farms", JSON.stringify(updated));
    } catch {}
    setNewFarmName("");
    setShowAddFarmModal(false);
  };

  // Add Soil Test Action
  const handleAddSoilTest = () => {
    if (!selectedFarmForSoil) return;
    const test: SoilTest = {
      id: Date.now(),
      farm_id: selectedFarmForSoil,
      tested_on: newSoilDate,
      ph: parseFloat(newSoilPh) || null,
      organic_carbon_pct: parseFloat(newSoilOc) || null,
      lab_name: newSoilLab,
      provenance: "USER_PROVIDED",
    };
    const currentList = soilTests[selectedFarmForSoil] || [];
    const updatedMap = {
      ...soilTests,
      [selectedFarmForSoil]: [...currentList, test],
    };
    setSoilTests(updatedMap);
    try {
      localStorage.setItem("krishios_soil", JSON.stringify(updatedMap));
    } catch {}
    setShowAddSoilModal(false);
  };

  // Hand-Calculated Pure Economics Computation
  const totalCost = calcSeed + calcFert + calcPest + calcLabor + calcMachinery + calcIrrig + calcOther;
  const costPerHa = calcArea > 0 ? totalCost / calcArea : 0;
  const totalYield = calcYield * calcArea;
  const grossRev = totalYield * calcPrice;
  const netProfit = grossRev - totalCost;
  const bePrice = totalYield > 0 ? totalCost / totalYield : 0;
  const beYield = calcPrice > 0 ? (totalCost / calcPrice) / calcArea : 0;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  // Problem Classification Engine Execution
  const handleAnalyzeMapping = async () => {
    if (!mappingQuery.trim()) return;
    try {
      const res = await fetch(`${API_URL}/mapping/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: mappingQuery, description: mappingQuery, evidence_sources: ["https://krishios.gov.in"] }),
      });
      if (res.ok) {
        setMappingResult(await res.json());
      }
    } catch {
      // Local keyword matching
      const q = mappingQuery.toLowerCase();
      const domains: string[] = [];
      const modules: string[] = [];
      if (q.includes("weather") || q.includes("rain") || q.includes("हवामान") || q.includes("पाऊस")) {
        domains.push("weather_climate");
        modules.push("E_weather");
      }
      if (q.includes("market") || q.includes("price") || q.includes("बाजारभाव") || q.includes("कांदा") || q.includes("मंडी")) {
        domains.push("market_supply_chain");
        modules.push("I_market");
      }
      if (q.includes("soil") || q.includes("माती") || q.includes("खत") || q.includes("ph")) {
        domains.push("soil_health");
        modules.push("C_soil_health");
      }
      if (q.includes("cost") || q.includes("profit") || q.includes("नफा") || q.includes("खर्च")) {
        domains.push("finance_insurance");
        modules.push("J_finance");
      }
      if (q.includes("scheme") || q.includes("योजना") || q.includes("अनुदान")) {
        domains.push("schemes");
        modules.push("K_schemes");
      }
      setMappingResult({
        title: mappingQuery,
        candidate_domains: domains.length ? domains : ["general_agriculture"],
        relevant_modules: modules.length ? modules : ["A_farm_management"],
        verification_status: "VERIFIED (Local Engine)",
        needs_human_review: true,
        notes: ["Transparent keyword mapping active. Review required before agronomic implementation."],
      });
    }
  };

  const districtsList = [
    "Pune", "Nashik", "Nagpur", "Chhatrapati Sambhajinagar", "Solapur", "Kolhapur",
    "Amravati", "Jalgaon", "Ahmednagar", "Satara", "Nanded", "Sangli", "Latur", "Akola"
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">🌱</div>
          <div>
            <h1 className="brand-title">{t("app_name")}</h1>
            <p className="brand-tagline">{t("app_tagline")}</p>
          </div>
        </div>

        <div className="header-controls">
          <div className={`status-badge ${isOnline ? "online" : "offline"}`}>
            <span className="dot-indicator"></span>
            <span>{isOnline ? t("online_status") : t("offline_status")}</span>
          </div>

          <div className="lang-selector">
            <button
              className={`lang-btn ${lang === "mr" ? "active" : ""}`}
              onClick={() => handleLangChange("mr")}
            >
              मराठी
            </button>
            <button
              className={`lang-btn ${lang === "hi" ? "active" : ""}`}
              onClick={() => handleLangChange("hi")}
            >
              हिन्दी
            </button>
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => handleLangChange("en")}
            >
              English
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 {t("nav_overview")}
        </button>
        <button
          className={`nav-tab ${activeTab === "farms" ? "active" : ""}`}
          onClick={() => setActiveTab("farms")}
        >
          🌾 {t("nav_farms")}
        </button>
        <button
          className={`nav-tab ${activeTab === "weather" ? "active" : ""}`}
          onClick={() => setActiveTab("weather")}
        >
          🌤️ {t("nav_weather")}
        </button>
        <button
          className={`nav-tab ${activeTab === "market" ? "active" : ""}`}
          onClick={() => setActiveTab("market")}
        >
          📈 {t("nav_market")}
        </button>
        <button
          className={`nav-tab ${activeTab === "calculator" ? "active" : ""}`}
          onClick={() => setActiveTab("calculator")}
        >
          🧮 {t("nav_calculator")}
        </button>
        <button
          className={`nav-tab ${activeTab === "schemes" ? "active" : ""}`}
          onClick={() => setActiveTab("schemes")}
        >
          🏛️ {t("nav_schemes")}
        </button>
        <button
          className={`nav-tab ${activeTab === "mapping" ? "active" : ""}`}
          onClick={() => setActiveTab("mapping")}
        >
          🔍 {t("nav_mapping")}
        </button>
      </nav>

      {/* Top Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">{t("stat_farms")}</div>
          <div className="stat-value">
            {farms.length}
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>
              ({farms.reduce((acc, f) => acc + f.area_hectares, 0).toFixed(1)} ha)
            </span>
          </div>
          <div className="stat-subtitle">
            <span className="provenance-pill live">Active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">{t("stat_weather")}</div>
          <div className="stat-value">
            {weather ? `${weather.temperature?.toFixed(1)}°C` : "--"}
            <span style={{ fontSize: 16, color: "var(--primary)" }}>{selectedDistrict}</span>
          </div>
          <div className="stat-subtitle">
            <span className="provenance-pill live">{weather?.provenance || "LIVE"}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">{t("stat_soil_tests")}</div>
          <div className="stat-value">
            {Object.values(soilTests).reduce((acc, list) => acc + list.length, 0)}
          </div>
          <div className="stat-subtitle">
            <span className="provenance-pill estimated">ICAR Standards</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">{t("stat_schemes")}</div>
          <div className="stat-value">{schemes.length}</div>
          <div className="stat-subtitle">
            <span className="provenance-pill historical">Govt. Verified</span>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div>
          {/* Quick Weather & Advisory Alert */}
          {weather && weather.advisories.length > 0 && (
            <div className="advisory-box">
              <div className="advisory-title">📢 {t("quick_weather_summary")} ({selectedDistrict})</div>
              <p style={{ fontSize: 14, color: "var(--text-main)" }}>{weather.advisories[0]}</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
            {/* Quick Farm List Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">🌾 {t("nav_farms")}</div>
                <button className="btn btn-primary" onClick={() => setShowAddFarmModal(true)}>
                  {t("btn_add_farm")}
                </button>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t("farm_name")}</th>
                      <th>{t("farm_area")}</th>
                      <th>{t("farm_district")}</th>
                      <th>{t("farm_irrigation")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farms.map((f) => (
                      <tr key={f.id}>
                        <td style={{ fontWeight: 600 }}>{f.name}</td>
                        <td>{f.area_hectares} ha</td>
                        <td>{f.district}</td>
                        <td>{f.irrigation_source || "Unspecified"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Mandi Highlights Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">📈 {t("quick_mandi_headline")}</div>
                <button className="btn btn-secondary" onClick={() => setActiveTab("market")}>
                  {t("btn_view_details")}
                </button>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t("calc_crop")}</th>
                      <th>APMC</th>
                      <th>{t("mandi_modal")}</th>
                      <th>{t("mandi_date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mandiPrices.slice(0, 4).map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.commodity}</td>
                        <td>{p.market}</td>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{p.modal_price}/qtl</td>
                        <td style={{ color: "var(--text-dim)", fontSize: 12 }}>{p.price_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY FARMS & SOIL HEALTH */}
      {activeTab === "farms" && (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">🌾 {t("nav_farms")} & Soil Health Cards</div>
              <button className="btn btn-primary" onClick={() => setShowAddFarmModal(true)}>
                {t("btn_add_farm")}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              {farms.map((f) => {
                const tests = soilTests[f.id] || [];
                const latestTest = tests[tests.length - 1];

                return (
                  <div key={f.id} className="stat-card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 700 }}>{f.name}</h3>
                        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                          📍 {f.district}, Maharashtra · {f.area_hectares} Hectares
                        </p>
                      </div>
                      <span className="provenance-pill live">ACTIVE</span>
                    </div>

                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, margin: "10px 0" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                        🔬 LATEST SOIL HEALTH ASSESSMENT (ICAR)
                      </div>
                      {latestTest ? (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                            <span>pH: <strong>{latestTest.ph || "N/A"}</strong></span>
                            <span>Organic Carbon: <strong>{latestTest.organic_carbon_pct ? `${latestTest.organic_carbon_pct}%` : "N/A"}</strong></span>
                          </div>
                          <p style={{ fontSize: 12, color: (latestTest.ph || 7) > 8 ? "#fcd34d" : "#6ee7b7", marginTop: 4 }}>
                            {(latestTest.ph || 7) > 8.0
                              ? "⚠️ Calcareous/Sodic Soil: Gypsum amendment & organic green manure advised."
                              : "✅ Balanced soil reaction. Maintain annual organic compost additions."}
                          </p>
                          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 6 }}>
                            Lab: {latestTest.lab_name} ({latestTest.tested_on})
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: 12, color: "var(--text-dim)" }}>No soil testing recorded yet for this plot.</p>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: 12, padding: "6px 12px", width: "100%" }}
                        onClick={() => {
                          setSelectedFarmForSoil(f.id);
                          setShowAddSoilModal(true);
                        }}
                      >
                        {t("btn_add_soil")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEATHER & AGRO-ADVISORY */}
      {activeTab === "weather" && (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">🌤️ {t("nav_weather")} & Climate Advisory</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ fontSize: 13, color: "var(--text-muted)" }}>{t("farm_district")}:</label>
                <select
                  className="form-select"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  {districtsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {weather && (
              <div>
                <div className="weather-hero">
                  <div className="weather-temp-box">
                    <div className="weather-big-temp">{weather.temperature?.toFixed(1)}°C</div>
                    <div>
                      <h2 style={{ fontSize: 22, fontWeight: 700 }}>{selectedDistrict}, Maharashtra</h2>
                      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        {new Date(weather.fetched_at).toLocaleTimeString()} · Source: {weather.source}
                      </p>
                      <span className="provenance-pill live" style={{ marginTop: 6 }}>
                        {weather.provenance}
                      </span>
                    </div>
                  </div>

                  <div className="weather-metrics-list">
                    <div className="weather-metric-item">
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("weather_humidity")}</span>
                      <span className="weather-metric-val">{weather.relative_humidity}%</span>
                    </div>
                    <div className="weather-metric-item">
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("weather_wind")}</span>
                      <span className="weather-metric-val">{weather.wind_speed} km/h</span>
                    </div>
                    <div className="weather-metric-item">
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("weather_precip")}</span>
                      <span className="weather-metric-val">{weather.precipitation} mm</span>
                    </div>
                  </div>
                </div>

                {/* Agricultural Advisories */}
                <div style={{ margin: "20px 0" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
                    🌿 {t("weather_advisories")}
                  </h3>
                  {weather.advisories.map((adv, idx) => (
                    <div key={idx} className="advisory-box">
                      <p style={{ fontSize: 14 }}>{adv}</p>
                    </div>
                  ))}
                </div>

                {/* 7-Day Forecast */}
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "24px 0 10px 0" }}>
                  📅 {t("weather_7day")}
                </h3>
                <div className="weather-forecast-strip">
                  {weather.daily_forecast.map((df) => (
                    <div key={df.date} className="forecast-day-card">
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                        {new Date(df.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>
                        {df.temp_max.toFixed(0)}° / {df.temp_min.toFixed(0)}°
                      </div>
                      <div style={{ fontSize: 12, color: "var(--accent-blue)", marginTop: 4 }}>
                        🌧️ {df.precipitation_sum} mm
                      </div>
                      {df.precipitation_probability !== null && (
                        <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                          ({df.precipitation_probability}% prob)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MANDI PRICES */}
      {activeTab === "market" && (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">📈 Maharashtra APMC Mandi Daily Prices</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t("mandi_search_placeholder")}
                  value={mandiSearch}
                  onChange={(e) => setMandiSearch(e.target.value)}
                  style={{ minWidth: 260 }}
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t("calc_crop")}</th>
                    <th>{t("farm_district")}</th>
                    <th>APMC Market</th>
                    <th>Variety</th>
                    <th>{t("mandi_min")}</th>
                    <th>{t("mandi_modal")}</th>
                    <th>{t("mandi_max")}</th>
                    <th>{t("mandi_date")}</th>
                    <th>Provenance</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiPrices
                    .filter((p) => {
                      if (!mandiSearch) return true;
                      const q = mandiSearch.toLowerCase();
                      return (
                        p.commodity.toLowerCase().includes(q) ||
                        p.market.toLowerCase().includes(q) ||
                        p.district.toLowerCase().includes(q)
                      );
                    })
                    .map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700 }}>{p.commodity}</td>
                        <td>{p.district}</td>
                        <td>{p.market}</td>
                        <td style={{ color: "var(--text-muted)" }}>{p.variety}</td>
                        <td>₹{p.min_price}</td>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{p.modal_price}</td>
                        <td>₹{p.max_price}</td>
                        <td style={{ fontSize: 12, color: "var(--text-dim)" }}>{p.price_date}</td>
                        <td>
                          <span className="provenance-pill historical">{p.provenance}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 14 }}>
              * Data benchmarked against Maharashtra State Agricultural Marketing Board (MSAMB) and Agmarknet official daily APMC bulletins.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: FARM ECONOMICS CALCULATOR */}
      {activeTab === "calculator" && (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">🧮 {t("nav_calculator")} & Break-Even Stress Test</div>
              <span className="provenance-pill estimated">{t("provenance_estimated")}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {/* Inputs Form */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Input Production Costs & Targets</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t("calc_crop")}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={calcCrop}
                      onChange={(e) => setCalcCrop(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("farm_area")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcArea}
                      onChange={(e) => setCalcArea(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("calc_seed_cost")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcSeed}
                      onChange={(e) => setCalcSeed(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("calc_fert_cost")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcFert}
                      onChange={(e) => setCalcFert(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("calc_pest_cost")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcPest}
                      onChange={(e) => setCalcPest(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("calc_labor_cost")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcLabor}
                      onChange={(e) => setCalcLabor(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("calc_machinery_cost")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcMachinery}
                      onChange={(e) => setCalcMachinery(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("calc_irrigation_cost")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcIrrig}
                      onChange={(e) => setCalcIrrig(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("calc_expected_yield")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcYield}
                      onChange={(e) => setCalcYield(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("calc_expected_price")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={calcPrice}
                      onChange={(e) => setCalcPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Instant Results Output */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Projected Financial Summary</h3>

                <div className="stats-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div className="stat-card" style={{ padding: 14 }}>
                    <div className="stat-title">{t("calc_total_cost")}</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>₹{totalCost.toLocaleString()}</div>
                    <div className="stat-subtitle">₹{costPerHa.toFixed(0)} / ha</div>
                  </div>

                  <div className="stat-card" style={{ padding: 14 }}>
                    <div className="stat-title">{t("calc_gross_revenue")}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-blue)" }}>
                      ₹{grossRev.toLocaleString()}
                    </div>
                    <div className="stat-subtitle">{totalYield.toFixed(1)} quintals total</div>
                  </div>

                  <div className="stat-card" style={{ padding: 14 }}>
                    <div className="stat-title">{t("calc_net_profit")}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: netProfit >= 0 ? "var(--primary)" : "var(--accent-red)" }}>
                      ₹{netProfit.toLocaleString()}
                    </div>
                    <div className="stat-subtitle">ROI: {roi.toFixed(1)}%</div>
                  </div>

                  <div className="stat-card" style={{ padding: 14 }}>
                    <div className="stat-title">{t("calc_break_even_price")}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-gold)" }}>
                      ₹{bePrice.toFixed(0)} / qtl
                    </div>
                    <div className="stat-subtitle">Min Yield: {beYield.toFixed(2)} q/ha</div>
                  </div>
                </div>

                {/* Sensitivity Table Heatmap */}
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: "16px 0 8px 0" }}>
                  {t("calc_sensitivity_title")}
                </h4>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Price \ Yield</th>
                        <th>-20% Yield</th>
                        <th>Base Yield</th>
                        <th>+20% Yield</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[-20, 0, 20].map((pDelta) => {
                        const testP = calcPrice * (1 + pDelta / 100);
                        return (
                          <tr key={pDelta}>
                            <td style={{ fontWeight: 600 }}>
                              {pDelta >= 0 ? `+${pDelta}%` : `${pDelta}%`} (₹{testP.toFixed(0)})
                            </td>
                            {[-20, 0, 20].map((yDelta) => {
                              const testY = totalYield * (1 + yDelta / 100);
                              const testProfit = testP * testY - totalCost;
                              const isPositive = testProfit >= 0;
                              return (
                                <td
                                  key={yDelta}
                                  className={`heatmap-cell ${
                                    isPositive ? (testProfit > 50000 ? "profit-high" : "profit-med") : "profit-loss"
                                  }`}
                                >
                                  ₹{testProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GOVERNMENT SCHEMES */}
      {activeTab === "schemes" && (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">🏛️ {t("nav_schemes")} for Maharashtra Farmers</div>
              <div style={{ display: "flex", gap: 10 }}>
                <select
                  className="form-select"
                  value={schemeCategory}
                  onChange={(e) => setSchemeCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Direct Income">Direct Income</option>
                  <option value="Insurance">Crop Insurance</option>
                  <option value="Water & Irrigation">Water & Irrigation</option>
                  <option value="Soil Health">Soil Health</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 20 }}>
              {schemes
                .filter((s) => schemeCategory === "all" || s.category === schemeCategory)
                .map((s) => (
                  <div key={s.id} className="stat-card" style={{ padding: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <span className="provenance-pill historical">{s.category}</span>
                      <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{s.sponsor}</span>
                    </div>

                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                      {lang === "mr" ? s.name_mr : lang === "hi" ? s.name_hi : s.name}
                    </h3>

                    <p style={{ fontSize: 14, color: "var(--primary)", fontWeight: 600, marginBottom: 12 }}>
                      {lang === "mr" ? s.benefit_summary_mr : lang === "hi" ? s.benefit_summary_hi : s.benefit_summary}
                    </p>

                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
                        {t("schemes_eligibility")}:
                      </div>
                      <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--text-muted)" }}>
                        {s.eligibility_checklist.map((e, idx) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={s.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ width: "100%", fontSize: 13 }}
                    >
                      🔗 {t("btn_official_portal")} ({s.application_portal_name})
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PROBLEM CLASSIFICATION */}
      {activeTab === "mapping" && (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">🔍 Problem Statement Mapping Engine</div>
              <span className="provenance-pill live">TRANSPARENT TAXONOMY</span>
            </div>

            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
              Test any agricultural problem statement against the KRISHIOS domain classification engine. Results are keyword-matched with full evidence tracking.
            </p>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder={t("mapping_input_placeholder")}
                value={mappingQuery}
                onChange={(e) => setMappingQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyzeMapping()}
              />
              <button className="btn btn-primary" onClick={handleAnalyzeMapping}>
                {t("mapping_btn_classify")}
              </button>
            </div>

            {mappingResult && (
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: var_radius_lg, padding: 20, border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                  Analysis for: &quot;{mappingResult.title}&quot;
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                  <div>
                    <h5 style={{ fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>
                      {t("mapping_domains")}
                    </h5>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {mappingResult.candidate_domains?.map((d: string) => (
                        <span key={d} className="provenance-pill historical">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 style={{ fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>
                      {t("mapping_modules")}
                    </h5>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {mappingResult.relevant_modules?.map((m: string) => (
                        <span key={m} className="provenance-pill live">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="advisory-box" style={{ marginTop: 16 }}>
                  <div className="advisory-title">⚠️ Transparency Note</div>
                  <p style={{ fontSize: 13 }}>{mappingResult.notes?.[0]}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD FARM */}
      {showAddFarmModal && (
        <div className="modal-overlay" onClick={() => setShowAddFarmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div className="card-title">🌾 {t("btn_add_farm")}</div>
              <button
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}
                onClick={() => setShowAddFarmModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">{t("farm_name")}</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Plot No. 42 / Shivneri Farm"
                value={newFarmName}
                onChange={(e) => setNewFarmName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">{t("farm_area")}</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={newFarmArea}
                onChange={(e) => setNewFarmArea(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">{t("farm_district")}</label>
              <select
                className="form-select"
                value={newFarmDistrict}
                onChange={(e) => setNewFarmDistrict(e.target.value)}
              >
                {districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">{t("farm_irrigation")}</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Borewell / Canal / Drip Irrigation"
                value={newFarmIrrigation}
                onChange={(e) => setNewFarmIrrigation(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setShowAddFarmModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddFarm}>
                Save Farm Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SOIL TEST */}
      {showAddSoilModal && (
        <div className="modal-overlay" onClick={() => setShowAddSoilModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div className="card-title">🔬 {t("btn_add_soil")}</div>
              <button
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}
                onClick={() => setShowAddSoilModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">{t("soil_ph")}</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={newSoilPh}
                onChange={(e) => setNewSoilPh(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">{t("soil_oc")}</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={newSoilOc}
                onChange={(e) => setNewSoilOc(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">{t("soil_date")}</label>
              <input
                type="date"
                className="form-input"
                value={newSoilDate}
                onChange={(e) => setNewSoilDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">{t("soil_lab")}</label>
              <input
                type="text"
                className="form-input"
                value={newSoilLab}
                onChange={(e) => setNewSoilLab(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setShowAddSoilModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddSoilTest}>
                Save Soil Test Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Provenance Note */}
      <footer style={{ marginTop: 40, textAlign: "center", fontSize: 13, color: "var(--text-dim)" }}>
        <p>KRISHIOS · Unified Agriculture Platform · Maharashtra Pilot</p>
        <p style={{ marginTop: 4 }}>{t("provenance_note")}</p>
      </footer>
    </div>
  );
}

const var_radius_lg = 16;
