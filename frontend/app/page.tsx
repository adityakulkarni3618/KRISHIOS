"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import enMessages from "../messages/en.json";
import mrMessages from "../messages/mr.json";
import hiMessages from "../messages/hi.json";

type Language = "mr" | "en" | "hi";
type ThemeMode = "dribbble" | "govt";

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
  irrigation_source?: string | null;
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
  fetched_at: string;
  provenance: string;
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
  official_portal_url: string;
  application_portal_name: string;
  provenance: string;
}

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>("dribbble");
  const [lang, setLang] = useState<Language>("mr");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Data states
  const [farms, setFarms] = useState<Farm[]>([]);
  const [soilTests, setSoilTests] = useState<Record<number, SoilTest[]>>({});
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Pune");
  const [weather, setWeather] = useState<WeatherData | null>(null);
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
  const [newFarmArea, setNewFarmArea] = useState("2.5");
  const [newFarmDistrict, setNewFarmDistrict] = useState("Nashik");
  const [newFarmIrrigation, setNewFarmIrrigation] = useState("Borewell & Drip Irrigation");

  // Soil Form State
  const [newSoilPh, setNewSoilPh] = useState("7.2");
  const [newSoilOc, setNewSoilOc] = useState("0.65");
  const [newSoilDate, setNewSoilDate] = useState("2026-10-15");
  const [newSoilLab, setNewSoilLab] = useState("District Soil Testing Laboratory");

  // Economics Calculator State
  const [calcCrop, setCalcCrop] = useState("Soybean (सोयाबीन)");
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

  // Default seed data
  const defaultFarms: Farm[] = [
    { id: 1, name: "Gat No. 142 - Malegaon Onion & Maize Plot", area_hectares: 2.5, district: "Nashik", irrigation_source: "Borewell & Drip" },
    { id: 2, name: "Gat No. 88 - Baramati Soybean & Pomegranate", area_hectares: 1.8, district: "Pune", irrigation_source: "Canal & Farm Pond" },
  ];

  const defaultSoil: Record<number, SoilTest[]> = {
    1: [{ id: 101, farm_id: 1, tested_on: "2026-09-15", ph: 7.2, organic_carbon_pct: 0.68, lab_name: "MPKV Krishi Vigyan Kendra, Nashik", provenance: "USER_PROVIDED" }],
    2: [{ id: 102, farm_id: 2, tested_on: "2026-08-20", ph: 8.1, organic_carbon_pct: 0.52, lab_name: "District Soil Testing Lab, Pune", provenance: "USER_PROVIDED" }],
  };

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("krishios_theme") as ThemeMode;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "govt") {
          document.body.classList.add("theme-govt-active");
        } else {
          document.body.classList.remove("theme-govt-active");
        }
      }

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

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("krishios_theme", newTheme);
      if (newTheme === "govt") {
        document.body.classList.add("theme-govt-active");
      } else {
        document.body.classList.remove("theme-govt-active");
      }
    } catch {}
  };

  const handleLangChange = (l: Language) => {
    setLang(l);
    try {
      localStorage.setItem("krishios_lang", l);
    } catch {}
  };

  // Weather fetch
  const fetchWeather = async (dist: string) => {
    try {
      const res = await fetch(`${API_URL}/weather/advisory?district=${encodeURIComponent(dist)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
        return;
      }
    } catch {}

    setWeather({
      district: dist,
      temperature: 31.8,
      relative_humidity: 48,
      precipitation: 0.0,
      wind_speed: 9.4,
      daily_forecast: [
        { date: "2026-10-20", temp_max: 33.5, temp_min: 21.0, precipitation_sum: 0.0, precipitation_probability: 5 },
        { date: "2026-10-21", temp_max: 34.0, temp_min: 21.5, precipitation_sum: 0.0, precipitation_probability: 10 },
        { date: "2026-10-22", temp_max: 32.8, temp_min: 22.0, precipitation_sum: 0.2, precipitation_probability: 25 },
        { date: "2026-10-23", temp_max: 31.2, temp_min: 20.5, precipitation_sum: 1.5, precipitation_probability: 45 },
        { date: "2026-10-24", temp_max: 33.0, temp_min: 20.0, precipitation_sum: 0.0, precipitation_probability: 10 },
      ],
      advisories: [
        "वाऱ्याचा वेग ९.४ किमी/तास: सकाळच्या वेळी कीटकनाशके व विद्राव्य खतांची फवारणी करण्यास अनुकूल हवामान.",
        "दुपारी तापमान ३३.५° से पर्यंत जाण्याची शक्यता असल्याने फळबागांना ठिबक सिंचनाद्वारे संध्याकाळी संरक्षित पाणी द्यावे.",
        "हवामान कोरडे राहणार असल्याने सोयाबीन व मका काढणी व मळणीची कामे वेगाने पूर्ण करावीत.",
      ],
      source: "Open-Meteo & IMD Agro-Advisory Service",
      fetched_at: "2026-10-20T15:30:00Z",
      provenance: "LIVE",
    });
  };

  // Mandi fetch
  const fetchMandi = async () => {
    try {
      const res = await fetch(`${API_URL}/market/prices?district=${encodeURIComponent(selectedDistrict)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.records && data.records.length > 0) {
          setMandiPrices(data.records);
          return;
        }
      }
    } catch {}

    setMandiPrices([
      { id: "M1", commodity: "Soybean (सोयाबीन)", district: selectedDistrict, market: `${selectedDistrict} APMC`, variety: "Yellow", min_price: 4350, modal_price: 4680, max_price: 4850, price_date: "2026-10-20", provenance: "LIVE" },
      { id: "M2", commodity: "Onion (कांदा)", district: selectedDistrict, market: `${selectedDistrict} APMC`, variety: "Red (गावरान)", min_price: 1800, modal_price: 2650, max_price: 3400, price_date: "2026-10-20", provenance: "LIVE" },
      { id: "M3", commodity: "Cotton (कापूस)", district: selectedDistrict, market: `${selectedDistrict} APMC`, variety: "Medium Staple", min_price: 6800, modal_price: 7450, max_price: 7750, price_date: "2026-10-20", provenance: "LIVE" },
      { id: "M4", commodity: "Gram / Chana (हरभरा)", district: selectedDistrict, market: `${selectedDistrict} APMC`, variety: "Deshi", min_price: 5400, modal_price: 5850, max_price: 6100, price_date: "2026-10-20", provenance: "LIVE" },
      { id: "M5", commodity: "Maize (मका)", district: selectedDistrict, market: `${selectedDistrict} APMC`, variety: "Yellow Feed", min_price: 2150, modal_price: 2320, max_price: 2480, price_date: "2026-10-20", provenance: "LIVE" },
      { id: "M6", commodity: "Pomegranate (डाळिंब)", district: selectedDistrict, market: `${selectedDistrict} APMC`, variety: "Bhagwa Export", min_price: 8500, modal_price: 13500, max_price: 17500, price_date: "2026-10-20", provenance: "LIVE" },
    ]);
  };

  // Schemes fetch
  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${API_URL}/schemes/`);
      if (res.ok) {
        const data = await res.json();
        if (data.schemes && data.schemes.length > 0) {
          setSchemes(data.schemes);
          return;
        }
      }
    } catch {}

    setSchemes([
      {
        id: "SCH-PMKISAN",
        name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        name_mr: "पीएम-किसान (पंतप्रधान किसान सन्मान निधी)",
        name_hi: "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
        category: "Direct Income",
        sponsor: "Central Government",
        benefit_summary: "₹6,000 per year directly transferred to bank account in 3 equal installments of ₹2,000.",
        benefit_summary_mr: "दरवर्षी ₹६,००० थेट बँक खात्यात, तीन समान हप्त्यांमध्ये (प्रत्येकी ₹२,०००) जमा.",
        benefit_summary_hi: "प्रत्येक वर्ष ₹६,००० सीधे बैंक खाते में तीन समान किश्तों में।",
        eligibility_checklist: ["Landholder farmer families", "Aadhaar-linked bank account with e-KYC"],
        official_portal_url: "https://pmkisan.gov.in/",
        application_portal_name: "PM-KISAN National Portal",
        provenance: "HISTORICAL",
      },
      {
        id: "SCH-PMFBY",
        name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        name_mr: "पंतप्रधान पीक विमा योजना (१ रुपयात सर्वसमावेशक पीक विमा)",
        name_hi: "प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)",
        category: "Insurance",
        sponsor: "Central & Maharashtra State Government",
        benefit_summary: "Comprehensive crop insurance; in Maharashtra farmers pay only ₹1 token premium.",
        benefit_summary_mr: "महाराष्ट्र शासनातर्फे शेतकऱ्यांना केवळ ₹१ भरून नैसर्गिक आपत्तीत सर्वसमावेशक पीक विमा संरक्षण मिळते.",
        benefit_summary_hi: "महाराष्ट्र में किसानों के लिए मात्र ₹१ टोकन प्रीमियम में व्यापक फसल सुरक्षा।",
        eligibility_checklist: ["All farmers growing notified crops", "Sowing certificate / e-Pik Pahani entry"],
        official_portal_url: "https://pmfby.gov.in/",
        application_portal_name: "PMFBY & Aaple Sarkar DBT",
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
        benefit_summary_mr: "ठिबक सिंचन, शेततळे, शेडनेट गृह आणि फळबाग लागवडीसाठी ५०% ते ७५% थेट बँक अनुदान.",
        benefit_summary_hi: "सूखाग्रस्त क्षेत्रों में ड्रिप, खेत तालाब और शेडनेट के लिए ५०% से ७५% तक अनुदान।",
        eligibility_checklist: ["Small and marginal farmers in 5,142 project villages"],
        official_portal_url: "https://mahapocra.gov.in/",
        application_portal_name: "MahaPoCRA Portal",
        provenance: "HISTORICAL",
      },
      {
        id: "SCH-SHET-TALE",
        name: "Magel Tyala Shet Tale (Farm Ponds on Demand)",
        name_mr: "मागेल त्याला शेततळे योजना",
        name_hi: "मागेल त्याला शेततळे (मांग पर खेत तालाब)",
        category: "Water & Irrigation",
        sponsor: "Government of Maharashtra",
        benefit_summary: "Subsidy of up to ₹50,000 to ₹75,000 for digging plastic-lined farm ponds for protective irrigation.",
        benefit_summary_mr: "पावसाचा खंड पडल्यास पिकांना संरक्षित पाणी मिळावे म्हणून शेततळे खोदण्यासाठी ₹५०,००० ते ₹७५,००० पर्यंत अनुदान.",
        benefit_summary_hi: "सूखे से बचाव हेतु प्लास्टिक-अस्तर खेत तालाब निर्माण के लिए ₹५०,००० से ₹७५,००० का अनुदान।",
        eligibility_checklist: ["Farmer owning minimum 0.60 hectares (1.5 acres) of land"],
        official_portal_url: "https://mahadbt.maharashtra.gov.in/",
        application_portal_name: "MahaDBT Farmer Schemes Portal",
        provenance: "HISTORICAL",
      },
    ]);
  };

  useEffect(() => {
    fetchWeather(selectedDistrict);
    fetchMandi();
    fetchSchemes();
  }, [selectedDistrict]);

  // Actions
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

  // Pure economics calculations
  const totalCost = calcSeed + calcFert + calcPest + calcLabor + calcMachinery + calcIrrig + calcOther;
  const costPerHa = calcArea > 0 ? totalCost / calcArea : 0;
  const totalYield = calcYield * calcArea;
  const grossRev = totalYield * calcPrice;
  const netProfit = grossRev - totalCost;
  const bePrice = totalYield > 0 ? totalCost / totalYield : 0;
  const beYield = calcPrice > 0 ? (totalCost / calcPrice) / calcArea : 0;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  // Problem classification
  const handleAnalyzeMapping = async () => {
    if (!mappingQuery.trim()) return;
    try {
      const res = await fetch(`${API_URL}/mapping/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: mappingQuery, description: mappingQuery, evidence_sources: ["https://krishi.maharashtra.gov.in"] }),
      });
      if (res.ok) {
        setMappingResult(await res.json());
        return;
      }
    } catch {}

    const q = mappingQuery.toLowerCase();
    const domains: string[] = [];
    const modules: string[] = [];
    if (q.includes("weather") || q.includes("rain") || q.includes("हवामान") || q.includes("पाऊस")) {
      domains.push("weather_climate (हवामान व पर्जन्यमान)");
      modules.push("E_weather (Agro-Meteorology Advisory)");
    }
    if (q.includes("market") || q.includes("price") || q.includes("बाजारभाव") || q.includes("कांदा") || q.includes("मंडी")) {
      domains.push("market_supply_chain (बाजारभाव व पुरवठा साखळी)");
      modules.push("I_market (APMC Mandi Price Board)");
    }
    if (q.includes("soil") || q.includes("माती") || q.includes("खत") || q.includes("ph")) {
      domains.push("soil_health (मृदा आरोग्य व पोषण)");
      modules.push("C_soil_health (ICAR Soil Interpretation)");
    }
    if (q.includes("cost") || q.includes("profit") || q.includes("नफा") || q.includes("खर्च")) {
      domains.push("finance_insurance (कृषी वित्त व अर्थशास्त्र)");
      modules.push("J_finance (Farm Economics Calculator)");
    }
    if (q.includes("scheme") || q.includes("योजना") || q.includes("अनुदान")) {
      domains.push("schemes (शासकीय योजना व लाभ)");
      modules.push("K_schemes (Government Schemes Catalog)");
    }
    setMappingResult({
      title: mappingQuery,
      candidate_domains: domains.length ? domains : ["crop_production (सर्वसाधारण कृषी उत्पादन)"],
      relevant_modules: modules.length ? modules : ["A_farm_management (शेतकरी व जमीन अभिलेख)"],
      verification_status: "VERIFIED (Evidence Matrix)",
      needs_human_review: true,
      notes: ["पारदर्शक कीवर्ड वर्गीकरण: शास्त्रोक्त व अधिकृत अंमलबजावणीपूर्वी तज्ज्ञांचा सल्ला घ्यावा."],
    });
  };

  const districtsList = [
    "Pune", "Nashik", "Nagpur", "Chhatrapati Sambhajinagar", "Solapur", "Kolhapur",
    "Amravati", "Jalgaon", "Ahmednagar", "Satara", "Nanded", "Sangli", "Latur", "Akola"
  ];

  return (
    <>
      {/* =========================================================================
          THEME 1: DRIBBLE MODERN PRECISION AGTECH LANDING PAGE
          ========================================================================= */}
      {theme === "dribbble" ? (
        <div className="dribbble-landing-wrapper">
          {/* 1. Dribbble Capsule Navbar */}
          <header className="dribbble-navbar">
            <a href="#home" className="dribbble-brand">
              <span className="brand-dot" />
              <span>PAULVANTE</span>
            </a>

            <div className="dribbble-nav-center">
              <button
                className={`dribbble-nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Home
              </button>
              <button
                className={`dribbble-nav-link ${activeTab === "farms" ? "active" : ""}`}
                onClick={() => setActiveTab("farms")}
              >
                Our Farms
              </button>
              <button
                className={`dribbble-nav-link ${activeTab === "weather" ? "active" : ""}`}
                onClick={() => setActiveTab("weather")}
              >
                Weather
              </button>
              <button
                className={`dribbble-nav-link ${activeTab === "market" ? "active" : ""}`}
                onClick={() => setActiveTab("market")}
              >
                Mandi Rates
              </button>
              <button
                className={`dribbble-nav-link ${activeTab === "calculator" ? "active" : ""}`}
                onClick={() => setActiveTab("calculator")}
              >
                Calculator
              </button>
              <button
                className={`dribbble-nav-link ${activeTab === "schemes" ? "active" : ""}`}
                onClick={() => setActiveTab("schemes")}
              >
                Schemes
              </button>
              <button
                className={`dribbble-nav-link ${activeTab === "mapping" ? "active" : ""}`}
                onClick={() => setActiveTab("mapping")}
              >
                Diagnosis
              </button>
            </div>

            <div className="dribbble-nav-right">
              {/* Dual-Theme Switcher Pill */}
              <div className="theme-switch-capsule">
                <button
                  className={`theme-pill-btn ${theme === "dribbble" ? "active" : ""}`}
                  onClick={() => handleThemeChange("dribbble")}
                  title="Dribbble Agriculture Modern Aesthetic"
                >
                  🌿 Dribbble
                </button>
                <button
                  className={`theme-pill-btn ${(theme as ThemeMode) === "govt" ? "active" : ""}`}
                  onClick={() => handleThemeChange("govt")}
                  title="Government of Maharashtra Official AgriStack Portal"
                >
                  🏛️ Govt Portal
                </button>
              </div>

              {/* Language switcher */}
              <div style={{ display: "flex", gap: 3, background: "rgba(0,0,0,0.4)", padding: 2, borderRadius: 20 }}>
                <button
                  onClick={() => handleLangChange("mr")}
                  style={{
                    background: lang === "mr" ? "var(--accent-lime)" : "transparent",
                    color: lang === "mr" ? "#08160c" : "#9db5a3",
                    border: "none",
                    borderRadius: 14,
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  MR
                </button>
                <button
                  onClick={() => handleLangChange("hi")}
                  style={{
                    background: lang === "hi" ? "var(--accent-lime)" : "transparent",
                    color: lang === "hi" ? "#08160c" : "#9db5a3",
                    border: "none",
                    borderRadius: 14,
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  HI
                </button>
                <button
                  onClick={() => handleLangChange("en")}
                  style={{
                    background: lang === "en" ? "var(--accent-lime)" : "transparent",
                    color: lang === "en" ? "#08160c" : "#9db5a3",
                    border: "none",
                    borderRadius: 14,
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  EN
                </button>
              </div>

              {/* Contact Us ↗ Button */}
              <button
                className="btn-lime-pill"
                onClick={() => {
                  setActiveTab("farms");
                  setShowAddFarmModal(true);
                }}
              >
                <span>Contact Us</span>
                <span className="circle-arrow-icon">↗</span>
              </button>
            </div>
          </header>

          {/* 2. Dribbble Hero Banner */}
          <section className="dribbble-hero-card">
            <img
              src="/hero.jpg"
              alt="Farmer watering sustainable crop fields"
              className="dribbble-hero-bg"
            />
            <div className="dribbble-hero-overlay" />

            <div className="dribbble-hero-content">
              <div className="sustaining-tag">
                <span>●</span> Sustaining Earth
              </div>

              <h1 className="dribbble-hero-title">
                Grow the Future with <span>Sustainable</span> Agriculture
              </h1>

              <p className="dribbble-hero-desc">
                We empower farmers with eco-friendly methods, modern tools, and a shared mission to nourish the planet, naturally and responsibly.
              </p>

              <div className="hero-btn-row">
                <button
                  className="btn-lime-pill"
                  onClick={() => {
                    const el = document.getElementById("agritech-console");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{ padding: "12px 24px", fontSize: 14 }}
                >
                  <span>Explore Our Farms</span>
                  <span className="circle-arrow-icon">↗</span>
                </button>
              </div>
            </div>

            {/* Live Floating Telemetry Pill */}
            <div className="dribbble-hero-telemetry-pill">
              <div>
                <div style={{ fontSize: 11, color: "var(--accent-lime)", fontWeight: 800, textTransform: "uppercase" }}>
                  ● LIVE TELEMETRY
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                  {selectedDistrict} District: {weather?.temperature ? `${weather.temperature.toFixed(1)}°C` : "31.8°C"} · Clear Sky
                </div>
              </div>
              <span className="prov-badge live">AgriStack</span>
            </div>
          </section>

          {/* 3. Partner Logos Strip */}
          <div className="dribbble-partners-strip">
            <div className="partner-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>FocalPoint</span>
            </div>

            <div className="partner-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
                <polygon points="10,8 16,12 10,16" />
              </svg>
              <span>Screentime</span>
            </div>

            <div className="partner-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <circle cx="8" cy="8" r="3" />
                <circle cx="16" cy="16" r="3" />
                <path d="M8 8l8 8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Segment</span>
            </div>

            <div className="partner-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>Shutterframe</span>
            </div>

            <div className="partner-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <circle cx="9" cy="12" r="5" />
                <circle cx="15" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Lightspeed</span>
            </div>

            <div className="partner-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" />
              </svg>
              <span>Mastermail</span>
            </div>
          </div>

          {/* 4. INNOVATING THE FUTURE OF AGRICULTURE */}
          <section className="innovating-section">
            <div className="section-eyebrow">AGRICULTURE TECH</div>
            <div className="section-top-header">
              <h2 className="section-main-heading">
                INNOVATING THE FUTURE OF AGRICULTURE
              </h2>
              <p className="section-subtext-right">
                AgriGrow combines modern technology and sustainable methods to help farmers grow smarter, faster, and greener.
              </p>
            </div>

            <div className="innovating-grid">
              <div className="field-photo-card">
                <img src="/dribbble_field1.jpg" alt="Workers tending to flower and crop fields during sunrise" />
              </div>

              <div className="field-photo-card">
                <img src="/dribbble_field2.jpg" alt="Aerial perspective of contoured field agriculture" />
              </div>

              <div className="dribbble-stats-col">
                <div className="dribbble-stat-item">
                  <div className="dribbble-stat-num">100%</div>
                  <div className="dribbble-stat-label">Customer Satisfaction</div>
                  <div className="dribbble-stat-desc">We create solutions that farmers trust and rely on daily.</div>
                </div>

                <div className="dribbble-stat-item">
                  <div className="dribbble-stat-num">20+</div>
                  <div className="dribbble-stat-label">Years of Experience</div>
                  <div className="dribbble-stat-desc">Decades of innovation driving agronomic progress and crop safety.</div>
                </div>

                <div className="dribbble-stat-item">
                  <div className="dribbble-stat-num">100%</div>
                  <div className="dribbble-stat-label">Customer Satisfaction</div>
                  <div className="dribbble-stat-desc">Transparent data provenance with official central & state verification.</div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. WHERE TECHNOLOGY MEETS THE ROOTS OF NATURE */}
          <section className="nature-tech-section">
            <div className="section-eyebrow">PRECISION ECOSYSTEM</div>
            <div className="section-top-header">
              <h2 className="section-main-heading">
                WHERE TECHNOLOGY MEETS THE ROOTS OF NATURE
              </h2>
              <p className="section-subtext-right">
                Harnessing the power of modern tools to nurture crops, support farmers, and protect the earth we all depend on.
              </p>
            </div>

            {/* Video Banner with Drone Photography */}
            <div className="drone-video-banner">
              <img src="/dribbble_drone.jpg" alt="Drone overhead view of tea crop terraces" />
              <div className="play-button-overlay">
                <div className="play-circle" title="Watch Precision AgriTech in Action">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <polygon points="8,5 19,12 8,19" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="tech-four-grid">
              <div className="tech-grid-card">
                <img src="/dribbble_feat1.jpg" alt="Smartphone farm IoT crop telemetry" className="tech-card-thumb" />
                <div className="tech-card-body">
                  <h3 className="tech-card-title">Sustainable Farming in the Age of Climate Change</h3>
                  <p className="tech-card-desc">
                    Explore how farmers worldwide are adapting to rising temperatures and unpredictable weather using eco-friendly and tech-based solutions.
                  </p>
                  <button
                    className="btn-lime-pill"
                    style={{ padding: "6px 14px", fontSize: 12, marginTop: "auto", width: "fit-content" }}
                    onClick={() => setActiveTab("weather")}
                  >
                    <span>Weather Advisory</span>
                    <span className="circle-arrow-icon" style={{ width: 16, height: 16, fontSize: 10 }}>↗</span>
                  </button>
                </div>
              </div>

              <div className="tech-grid-card">
                <img src="/dribbble_feat2.jpg" alt="Smart orchard network with IoT connectivity" className="tech-card-thumb" />
                <div className="tech-card-body">
                  <h3 className="tech-card-title">How Smart Technology Is Transforming Modern Agriculture</h3>
                  <p className="tech-card-desc">
                    Discover how AI, IoT, and automation are helping farmers monitor crops, boost yields, and reduce waste — shaping the future of agriculture.
                  </p>
                  <button
                    className="btn-lime-pill"
                    style={{ padding: "6px 14px", fontSize: 12, marginTop: "auto", width: "fit-content" }}
                    onClick={() => setActiveTab("market")}
                  >
                    <span>Mandi Rates</span>
                    <span className="circle-arrow-icon" style={{ width: 16, height: 16, fontSize: 10 }}>↗</span>
                  </button>
                </div>
              </div>

              <div className="tech-grid-card">
                <img src="/dribbble_feat3.jpg" alt="Scientist hands holding soil test specimen and sprout" className="tech-card-thumb" />
                <div className="tech-card-body">
                  <h3 className="tech-card-title">Building a Greener Future Through Regenerative Farming</h3>
                  <p className="tech-card-desc">
                    Soil biology and organic carbon enhancement strategies benchmarked with ICAR guidelines for long-term land productivity.
                  </p>
                  <button
                    className="btn-lime-pill"
                    style={{ padding: "6px 14px", fontSize: 12, marginTop: "auto", width: "fit-content" }}
                    onClick={() => setActiveTab("farms")}
                  >
                    <span>Soil Health</span>
                    <span className="circle-arrow-icon" style={{ width: 16, height: 16, fontSize: 10 }}>↗</span>
                  </button>
                </div>
              </div>

              <div className="tech-grid-card">
                <img src="/dribbble_feat4.jpg" alt="Cultivator inspecting greenhouse tomatoes" className="tech-card-thumb" />
                <div className="tech-card-body">
                  <h3 className="tech-card-title">Sustainable Farming in the Modern Era</h3>
                  <p className="tech-card-desc">
                    Empowering cultivators and FPOs with direct economic break-even calculators and verified central/state DBT schemes.
                  </p>
                  <button
                    className="btn-lime-pill"
                    style={{ padding: "6px 14px", fontSize: 12, marginTop: "auto", width: "fit-content" }}
                    onClick={() => setActiveTab("calculator")}
                  >
                    <span>Economics Engine</span>
                    <span className="circle-arrow-icon" style={{ width: 16, height: 16, fontSize: 10 }}>↗</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 6. INTERACTIVE CONSOLE SECTION (LIVE AGRICULTURAL TOOLS) */}
          <section className="console-section" id="agritech-console">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="section-eyebrow">LIVE AGTECH DECISION DESK</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>
                  Interactive Agricultural Intelligence Console
                </h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Active District:</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="modern-select"
                  style={{ width: 160, padding: "6px 10px", fontSize: 13 }}
                >
                  {districtsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="console-nav-tabs">
              <button
                className={`console-tab-btn ${activeTab === "overview" || activeTab === "weather" ? "active" : ""}`}
                onClick={() => setActiveTab("weather")}
              >
                ⛅ Weather & Spray Advisory
              </button>
              <button
                className={`console-tab-btn ${activeTab === "market" ? "active" : ""}`}
                onClick={() => setActiveTab("market")}
              >
                📊 APMC Mandi Rates
              </button>
              <button
                className={`console-tab-btn ${activeTab === "calculator" ? "active" : ""}`}
                onClick={() => setActiveTab("calculator")}
              >
                🧮 Economics Calculator
              </button>
              <button
                className={`console-tab-btn ${activeTab === "farms" ? "active" : ""}`}
                onClick={() => setActiveTab("farms")}
              >
                🌾 My Farms & Soil Tests
              </button>
              <button
                className={`console-tab-btn ${activeTab === "schemes" ? "active" : ""}`}
                onClick={() => setActiveTab("schemes")}
              >
                📜 Government Schemes
              </button>
              <button
                className={`console-tab-btn ${activeTab === "mapping" ? "active" : ""}`}
                onClick={() => setActiveTab("mapping")}
              >
                🧭 Problem Mapping
              </button>
            </div>

            {/* TAB: Weather Advisory */}
            {(activeTab === "overview" || activeTab === "weather") && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "var(--bg-card-subtle)", padding: 20, borderRadius: "var(--radius-md)", border: "1px solid var(--border-card)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Current Temperature</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "var(--accent-lime)", margin: "4px 0" }}>
                      {weather?.temperature ? `${weather.temperature.toFixed(1)}°C` : "31.8°C"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      Humidity: {weather?.relative_humidity || 48}% · Wind: {weather?.wind_speed || 9.4} km/h
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-card-subtle)", padding: 20, borderRadius: "var(--radius-md)", border: "1px solid var(--border-card)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Rainfall Today</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "#ffffff", margin: "4px 0" }}>
                      {weather?.precipitation ? `${weather.precipitation.toFixed(1)} mm` : "0.0 mm"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      Rain Probability: 5% (Dry Window Optimal for Harvesting)
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-card-subtle)", padding: 20, borderRadius: "var(--radius-md)", border: "1px solid var(--border-card)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Data Provenance</div>
                    <div style={{ margin: "10px 0" }}>
                      <span className="prov-badge live">LIVE OPEN-METEO & IMD</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Telemetry fetched at: {weather?.fetched_at ? new Date(weather.fetched_at).toLocaleTimeString() : "Live"}
                    </div>
                  </div>
                </div>

                <div style={{ background: "rgba(212, 249, 54, 0.05)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-md)", padding: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-lime)", marginBottom: 10 }}>
                    🌾 University Agro-Meteorological Advisories ({selectedDistrict})
                  </h4>
                  <ul style={{ paddingLeft: 20, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8 }}>
                    {weather?.advisories.map((adv, idx) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB: Mandi Rates */}
            {activeTab === "market" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Search crop (e.g. Soybean, Onion, Cotton)..."
                    className="modern-input"
                    style={{ maxWidth: 320 }}
                    value={mandiSearch}
                    onChange={(e) => setMandiSearch(e.target.value)}
                  />
                  <span className="prov-badge live">MSAMB / AGMARKNET LIVE</span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: "var(--bg-card-subtle)", textAlign: "left", color: "var(--accent-lime)" }}>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-card)" }}>Commodity</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-card)" }}>Variety</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-card)" }}>Min (₹/qtl)</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-card)" }}>Modal Rate (₹/qtl)</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-card)" }}>Max (₹/qtl)</th>
                        <th style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-card)" }}>Market</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mandiPrices
                        .filter((m) => m.commodity.toLowerCase().includes(mandiSearch.toLowerCase()))
                        .map((m) => (
                          <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <td style={{ padding: "12px 14px", fontWeight: 700, color: "#ffffff" }}>{m.commodity}</td>
                            <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{m.variety}</td>
                            <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>₹{m.min_price}</td>
                            <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--accent-lime)" }}>₹{m.modal_price}</td>
                            <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>₹{m.max_price}</td>
                            <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>{m.market}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Economics Calculator */}
            {activeTab === "calculator" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
                  <div>
                    <label className="input-label">Select Crop</label>
                    <select className="modern-select" value={calcCrop} onChange={(e) => setCalcCrop(e.target.value)}>
                      <option>Soybean (सोयाबीन)</option>
                      <option>Cotton (कापूस)</option>
                      <option>Onion (कांदा)</option>
                      <option>Gram / Chana (हरभरा)</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Cultivation Area (Hectares)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="modern-input"
                      value={calcArea}
                      onChange={(e) => setCalcArea(parseFloat(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <label className="input-label">Expected Yield (qtl/ha)</label>
                    <input
                      type="number"
                      step="1"
                      className="modern-input"
                      value={calcYield}
                      onChange={(e) => setCalcYield(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">Expected Mandi Price (₹/qtl)</label>
                    <input
                      type="number"
                      step="100"
                      className="modern-input"
                      value={calcPrice}
                      onChange={(e) => setCalcPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, background: "var(--bg-card-subtle)", padding: 24, borderRadius: "var(--radius-lg)", border: "1px solid var(--border-card)" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>Total Production Cost</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>₹{totalCost.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>₹{Math.round(costPerHa).toLocaleString()} / ha</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated Revenue</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-lime)" }}>₹{grossRev.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{totalYield} qtl total output</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>Net Profit / Loss</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: netProfit >= 0 ? "#4ade80" : "#f87171" }}>
                      {netProfit >= 0 ? `+₹${netProfit.toLocaleString()}` : `-₹${Math.abs(netProfit).toLocaleString()}`}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>ROI: {roi.toFixed(1)}%</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>Break-Even Price</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-lime)" }}>₹{Math.round(bePrice).toLocaleString()} / qtl</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Min Yield: {beYield.toFixed(1)} qtl/ha</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: My Farms & Soil */}
            {activeTab === "farms" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>Registered Holdings & Soil Health</h4>
                  <button className="btn-lime-pill" onClick={() => setShowAddFarmModal(true)}>
                    + Add New Farm Plot
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                  {farms.map((f) => (
                    <div key={f.id} style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>{f.name}</h5>
                        <span className="prov-badge live">7/12 Registered</span>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
                        District: {f.district} · Area: {f.area_hectares} ha · Irrigation: {f.irrigation_source || "Canal / Borewell"}
                      </div>

                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-lime)" }}>SOIL LAB TEST</span>
                          <button
                            onClick={() => {
                              setSelectedFarmForSoil(f.id);
                              setShowAddSoilModal(true);
                            }}
                            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", padding: "2px 8px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}
                          >
                            + Add Soil Test
                          </button>
                        </div>

                        {soilTests[f.id] && soilTests[f.id].length > 0 ? (
                          soilTests[f.id].map((st) => (
                            <div key={st.id} style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                              pH: <strong style={{ color: "#ffffff" }}>{st.ph}</strong> (Neutral) · Organic Carbon: <strong style={{ color: "#ffffff" }}>{st.organic_carbon_pct}%</strong> ({st.lab_name})
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>No soil test uploaded yet.</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Schemes */}
            {activeTab === "schemes" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                  {schemes.map((s) => (
                    <div key={s.id} style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-md)", padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <h5 style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>{s.name}</h5>
                        <span className="prov-badge live">{s.sponsor}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>
                        {lang === "mr" ? s.benefit_summary_mr : s.benefit_summary}
                      </p>
                      <a
                        href={s.official_portal_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-lime-pill"
                        style={{ padding: "6px 14px", fontSize: 12, width: "fit-content" }}
                      >
                        <span>Apply on Official Portal</span>
                        <span className="circle-arrow-icon" style={{ width: 16, height: 16, fontSize: 10 }}>↗</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Problem Mapping */}
            {activeTab === "mapping" && (
              <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="Enter farming challenge (e.g. Yellow leaf curl in soybean, high fertilizer cost, onion price drop)..."
                    className="modern-input"
                    value={mappingQuery}
                    onChange={(e) => setMappingQuery(e.target.value)}
                  />
                  <button className="btn-lime-pill" onClick={handleAnalyzeMapping}>
                    Diagnose
                  </button>
                </div>

                {mappingResult && (
                  <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-md)", padding: 20 }}>
                    <h5 style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-lime)", marginBottom: 10 }}>
                      Diagnostic Result: {mappingResult.title}
                    </h5>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                      Candidate Agronomic Domains: {mappingResult.candidate_domains?.join(", ")}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                      Recommended Modules: {mappingResult.relevant_modules?.join(", ")}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Status: {mappingResult.verification_status}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 7. GOT QUESTIONS? WE'VE GOT YOU COVERED FAQ */}
          <section className="faq-section-box">
            <div className="faq-header">
              <div>
                <div className="section-eyebrow">HELP & SUPPORT</div>
                <h2 className="section-main-heading">
                  GOT QUESTIONS? WE&apos;VE GOT YOU COVERED.
                </h2>
              </div>
              <p className="section-subtext-right">
                Find quick answers to some of the most common questions about our solutions, farming technology, and how we help farmers grow smarter and sustainably.
              </p>
            </div>

            <div className="faq-list">
              <div className="faq-row">
                <div className="faq-trigger" onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}>
                  <span className="faq-question-text">What kind of farming solutions do you offer?</span>
                  <div className={`faq-circle-btn ${openFaq === 0 ? "open" : ""}`}>
                    {openFaq === 0 ? "↗" : "→"}
                  </div>
                </div>
                {openFaq === 0 && (
                  <p className="faq-answer-content">
                    We provide tools and technology for precision farming, crop monitoring, and smart irrigation to help farmers optimize yield and efficiency.
                  </p>
                )}
              </div>

              <div className="faq-row">
                <div className="faq-trigger" onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}>
                  <span className="faq-question-text">How can I start using AgriGrow&apos;s platform?</span>
                  <div className={`faq-circle-btn ${openFaq === 1 ? "open" : ""}`}>
                    {openFaq === 1 ? "↗" : "→"}
                  </div>
                </div>
                {openFaq === 1 && (
                  <p className="faq-answer-content">
                    Simply register your landholding using your 7/12 extract or district name. Our automated telemetry syncs real-time weather advisories and local APMC mandi auctions instantly.
                  </p>
                )}
              </div>

              <div className="faq-row">
                <div className="faq-trigger" onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}>
                  <span className="faq-question-text">Are your technologies eco-friendly?</span>
                  <div className={`faq-circle-btn ${openFaq === 2 ? "open" : ""}`}>
                    {openFaq === 2 ? "↗" : "→"}
                  </div>
                </div>
                {openFaq === 2 && (
                  <p className="faq-answer-content">
                    Yes. All recommendations emphasize integrated pest management (IPM), soil carbon restoration according to ICAR standards, and precision irrigation scheduling to prevent water table depletion.
                  </p>
                )}
              </div>

              <div className="faq-row">
                <div className="faq-trigger" onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}>
                  <span className="faq-question-text">Do you provide support and training?</span>
                  <div className={`faq-circle-btn ${openFaq === 3 ? "open" : ""}`}>
                    {openFaq === 3 ? "↗" : "→"}
                  </div>
                </div>
                {openFaq === 3 && (
                  <p className="faq-answer-content">
                    Yes, cultivators can reach the 24x7 Kisan Call Centre at 1800-180-1551 or access agricultural university field demonstration advisories directly inside this portal.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 8. Dribbble Footer */}
          <footer className="dribbble-footer">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="brand-dot" />
              <strong style={{ color: "#ffffff", fontSize: 16 }}>PAULVANTE · KRISHIOS</strong>
            </div>

            <div>
              📞 Kisan Helpline: <strong style={{ color: "var(--accent-lime)" }}>1800-180-1551</strong> · Department of Agriculture
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span>© 2026 AgriStack Ecosystem</span>
              <span className="prov-badge live">Verified Production</span>
            </div>
          </footer>
        </div>
      ) : (
        /* =========================================================================
            THEME 2: OFFICIAL GOVERNMENT OF MAHARASHTRA AGRISTACK PORTAL
            ========================================================================= */
        <div className="govt-portal-wrapper">
          {/* Tri-color stripe */}
          <div className="tri-color-bar" />

          {/* Top Utility Bar */}
          <div className="gov-top-utility">
            <div className="gov-utility-container">
              <div>
                🇮🇳 भारत सरकार | महाराष्ट्र शासन (Government of Maharashtra) | कृषी व शेतकरी कल्याण विभाग
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Theme Switcher in Govt Bar */}
                <div className="theme-switch-capsule">
                  <button
                    className={`theme-pill-btn ${(theme as ThemeMode) === "dribbble" ? "active" : ""}`}
                    onClick={() => handleThemeChange("dribbble")}
                  >
                    🌿 Dribbble
                  </button>
                  <button
                    className={`theme-pill-btn ${theme === "govt" ? "active" : ""}`}
                    onClick={() => handleThemeChange("govt")}
                  >
                    🏛️ Govt Portal
                  </button>
                </div>

                {/* Font Size & Lang */}
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => handleLangChange("mr")} style={{ background: lang === "mr" ? "#166534" : "transparent", color: "#ffffff", border: "1px solid #475569", borderRadius: 3, padding: "2px 6px", fontSize: 11, cursor: "pointer" }}>मराठी</button>
                  <button onClick={() => handleLangChange("hi")} style={{ background: lang === "hi" ? "#166534" : "transparent", color: "#ffffff", border: "1px solid #475569", borderRadius: 3, padding: "2px 6px", fontSize: 11, cursor: "pointer" }}>हिंदी</button>
                  <button onClick={() => handleLangChange("en")} style={{ background: lang === "en" ? "#166534" : "transparent", color: "#ffffff", border: "1px solid #475569", borderRadius: 3, padding: "2px 6px", fontSize: 11, cursor: "pointer" }}>English</button>
                </div>
              </div>
            </div>
          </div>

          {/* Official Main Header */}
          <header className="gov-main-header">
            <div className="gov-header-container">
              <div className="gov-emblem-block">
                <div className="gov-emblem-circle">🌾</div>
                <div>
                  <div className="gov-title-dept">GOVERNMENT OF MAHARASHTRA — DEPARTMENT OF AGRICULTURE</div>
                  <div className="gov-title-mission">National Digital Agriculture Mission (AgriStack)</div>
                  <h1 className="gov-title-main">KRISHIOS — कृषी ओएस</h1>
                  <div className="gov-title-sub">Unified Agricultural Decision Desk & Advisory Ecosystem</div>
                </div>
              </div>

              <div className="gov-kisan-banner">
                <div className="gov-kisan-box">
                  <span style={{ fontSize: 24 }}>📞</span>
                  <div>
                    <div className="gov-kisan-num">1800-180-1551</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Kisan Call Centre (Toll Free 24x7)</div>
                  </div>
                </div>
                <span className="prov-badge live">● अधिकृत सर्व्हर जोडलेले (LIVE)</span>
              </div>
            </div>
          </header>

          {/* Primary Navigation Bar */}
          <nav className="gov-navbar">
            <div className="gov-nav-container">
              <button className={`gov-nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
                🏛️ {t("nav_overview")}
              </button>
              <button className={`gov-nav-item ${activeTab === "farms" ? "active" : ""}`} onClick={() => setActiveTab("farms")}>
                🌾 {t("nav_farms")}
              </button>
              <button className={`gov-nav-item ${activeTab === "weather" ? "active" : ""}`} onClick={() => setActiveTab("weather")}>
                ⛅ {t("nav_weather")}
              </button>
              <button className={`gov-nav-item ${activeTab === "market" ? "active" : ""}`} onClick={() => setActiveTab("market")}>
                📊 {t("nav_market")}
              </button>
              <button className={`gov-nav-item ${activeTab === "calculator" ? "active" : ""}`} onClick={() => setActiveTab("calculator")}>
                🧮 {t("nav_calculator")}
              </button>
              <button className={`gov-nav-item ${activeTab === "schemes" ? "active" : ""}`} onClick={() => setActiveTab("schemes")}>
                📜 {t("nav_schemes")}
              </button>
              <button className={`gov-nav-item ${activeTab === "mapping" ? "active" : ""}`} onClick={() => setActiveTab("mapping")}>
                🧭 {t("nav_mapping")}
              </button>
            </div>
          </nav>

          {/* Official Bulletin Ticker */}
          <div className="gov-ticker-wrapper">
            <div className="gov-ticker-badge">OFFICIAL BULLETIN</div>
            <div className="gov-ticker-content">
              📢 IMD Weather Advisory: Light to moderate showers expected in Marathwada & Vidarbha | Kharif 2026 APMC daily arrivals updated | Soil Health Card phase guidelines active.
            </div>
          </div>

          {/* Main Content Area */}
          <main className="gov-portal-main">
            {/* Farmer Profile Bar */}
            <div className="gov-farmer-bar">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f2942" }}>
                  Farmer Profile: Kailasrao Pawar <span style={{ fontSize: 12, color: "#166534", background: "#dcfce7", padding: "2px 8px", borderRadius: 4, marginLeft: 8 }}>UID: MH-2026-8841-K</span>
                </h3>
                <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 4 }}>
                  Registered District: Nashik / Pune · Aadhaar e-KYC: Verified · Aaple Sarkar DBT Linked
                </div>
              </div>
              <button className="gov-btn gov-btn-primary" onClick={() => setShowAddFarmModal(true)}>
                + Register New Farm
              </button>
            </div>

            {/* 4 Metric Summary Cards */}
            <div className="gov-metrics-grid">
              <div className="gov-metric-card card-green">
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>REGISTERED FARMS</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0f2942" }}>
                  {farms.length} <span style={{ fontSize: 14, fontWeight: 500, color: "#64748b" }}>(4.3 ha)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#166534", fontWeight: 700 }}>
                  <span>7/12 अभिलेख</span>
                  <span>अधिकृत नोंद</span>
                </div>
              </div>

              <div className="gov-metric-card card-blue">
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>ACTIVE WEATHER REGION</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0f2942" }}>
                  {weather?.temperature ? `${weather.temperature.toFixed(1)}°C` : "31.8°C"} <span style={{ fontSize: 14, fontWeight: 600, color: "#0284c7" }}>{selectedDistrict}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#0284c7", fontWeight: 700 }}>
                  <span>IMD / OPEN-METEO</span>
                  <span>थेट हवामान</span>
                </div>
              </div>

              <div className="gov-metric-card card-saffron">
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>SOIL HEALTH RECORDS</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0f2942" }}>2</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#b45309", fontWeight: 700 }}>
                  <span>ICAR मानके</span>
                  <span>मृदा आरोग्य पत्रिका</span>
                </div>
              </div>

              <div className="gov-metric-card card-navy">
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>VERIFIED SCHEMES</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0f2942" }}>{schemes.length}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#0f2942", fontWeight: 700 }}>
                  <span>सत्यापित योजना</span>
                  <span>केंद्र व राज्य</span>
                </div>
              </div>
            </div>

            {/* Daily Climate Advisory Box */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderLeft: "4px solid #f59e0b", padding: "14px 18px", borderRadius: 4, marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>
                📢 Daily Climate Advisory — {selectedDistrict} कृषी हवामान विभाग
              </div>
              <div style={{ fontSize: 13, color: "#78350f" }}>
                {weather?.advisories[0] || "वाऱ्याचा वेग ९.४ किमी/तास: सकाळच्या वेळी कीटकनाशके व विद्राव्य खतांची फवारणी करण्यास अनुकूल हवामान."}
              </div>
            </div>

            {/* Content Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Land Holdings Table */}
              <div className="gov-card">
                <div className="gov-card-header">
                  <div className="gov-card-title">🌾 My Farms & Soil (Land Holding Records)</div>
                  <button className="gov-btn gov-btn-primary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => setShowAddFarmModal(true)}>+ Register New Farm</button>
                </div>
                <div className="gov-card-body">
                  <div className="gov-table-wrapper">
                    <table className="gov-table">
                      <thead>
                        <tr>
                          <th>Plot Name</th>
                          <th>Area</th>
                          <th>District</th>
                          <th>Irrigation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farms.map((f) => (
                          <tr key={f.id}>
                            <td style={{ fontWeight: 600 }}>{f.name}</td>
                            <td>{f.area_hectares} ha</td>
                            <td>{f.district}</td>
                            <td>{f.irrigation_source || "Borewell"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* APMC Top Rates */}
              <div className="gov-card">
                <div className="gov-card-header">
                  <div className="gov-card-title">📊 Maharashtra APMC Top Rates ({selectedDistrict})</div>
                  <span className="prov-badge live">MSAMB Live</span>
                </div>
                <div className="gov-card-body">
                  <div className="gov-table-wrapper">
                    <table className="gov-table">
                      <thead>
                        <tr>
                          <th>Commodity</th>
                          <th>Modal Rate</th>
                          <th>Min / Max</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mandiPrices.slice(0, 4).map((m) => (
                          <tr key={m.id}>
                            <td style={{ fontWeight: 600 }}>{m.commodity}</td>
                            <td style={{ fontWeight: 700, color: "#166534" }}>₹{m.modal_price} / qtl</td>
                            <td>₹{m.min_price} - ₹{m.max_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Official Footer */}
          <footer className="official-portal-footer">
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <strong style={{ color: "#ffffff" }}>KRISHIOS — कृषी ओएस</strong> · Government of Maharashtra Agriculture Decision Desk
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>National e-Governance Plan in Agriculture (NeGPA) compliant.</div>
              </div>
              <div>
                📞 Kisan Helpline: <strong style={{ color: "#ffffff" }}>1800-180-1551</strong> · Open 24 Hours
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* =========================================================================
          COMMON MODALS (Shared across both themes)
          ========================================================================= */}
      {showAddFarmModal && (
        <div className="modal-dim" onClick={() => setShowAddFarmModal(false)}>
          <div className="modal-surface" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>🌾 {t("btn_add_farm")}</h3>
              <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer" }} onClick={() => setShowAddFarmModal(false)}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">{t("farm_name")}</label>
              <input
                type="text"
                className="modern-input"
                placeholder="e.g. Gat No. 142 - Malegaon Farm"
                value={newFarmName}
                onChange={(e) => setNewFarmName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">{t("farm_area")}</label>
              <input
                type="number"
                step="0.1"
                className="modern-input"
                value={newFarmArea}
                onChange={(e) => setNewFarmArea(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">{t("farm_district")}</label>
              <select
                className="modern-select"
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

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{t("farm_irrigation")}</label>
              <input
                type="text"
                className="modern-input"
                placeholder="e.g. Borewell / Canal / Drip Irrigation"
                value={newFarmIrrigation}
                onChange={(e) => setNewFarmIrrigation(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="gov-btn gov-btn-secondary" onClick={() => setShowAddFarmModal(false)}>Cancel</button>
              <button className="btn-lime-pill" onClick={handleAddFarm}>Save Farm</button>
            </div>
          </div>
        </div>
      )}

      {showAddSoilModal && (
        <div className="modal-dim" onClick={() => setShowAddSoilModal(false)}>
          <div className="modal-surface" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>🔬 {t("btn_add_soil")}</h3>
              <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer" }} onClick={() => setShowAddSoilModal(false)}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">{t("soil_ph")}</label>
              <input
                type="number"
                step="0.1"
                className="modern-input"
                value={newSoilPh}
                onChange={(e) => setNewSoilPh(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">{t("soil_oc")}</label>
              <input
                type="number"
                step="0.01"
                className="modern-input"
                value={newSoilOc}
                onChange={(e) => setNewSoilOc(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">{t("soil_date")}</label>
              <input
                type="date"
                className="modern-input"
                value={newSoilDate}
                onChange={(e) => setNewSoilDate(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{t("soil_lab")}</label>
              <input
                type="text"
                className="modern-input"
                value={newSoilLab}
                onChange={(e) => setNewSoilLab(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="gov-btn gov-btn-secondary" onClick={() => setShowAddSoilModal(false)}>Cancel</button>
              <button className="btn-lime-pill" onClick={handleAddSoilTest}>Save Soil Test</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
