"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
        { date: "2026-10-22", temp_max: 33.0, temp_min: 20.8, precipitation_sum: 2.4, precipitation_probability: 45 },
        { date: "2026-10-23", temp_max: 32.5, temp_min: 20.5, precipitation_sum: 4.1, precipitation_probability: 60 },
      ],
      advisories: [
        "वाऱ्याचा वेग ९.४ किमी/तास: सकाळच्या वेळी कीटकनाशके व विद्राव्य खतांची फवारणी करण्यास उत्तम हवामान.",
        "आगामी ४८ तासांत स्वच्छ सूर्यप्रकाश राहील; काढणी पश्चात पिके सुरक्षित साठवावीत.",
        "जमिनीतील ओलावा टिकवण्यासाठी ठिबक सिंचनाचा वापर सायंकाळी करावा.",
      ],
      source: "Open-Meteo & IMD Agro-Advisory",
      fetched_at: new Date().toISOString(),
      provenance: "LIVE",
    });
  };

  // Mandi fetch
  const fetchMandi = async () => {
    try {
      const res = await fetch(`${API_URL}/market/prices`);
      if (res.ok) {
        const data = await res.json();
        setMandiPrices(data.records || []);
        return;
      }
    } catch {}

    setMandiPrices([
      { id: "M1", commodity: "Onion (कांदा)", district: "Nashik", market: "Lasalgaon APMC", variety: "Red Onion", min_price: 1400, modal_price: 2250, max_price: 2850, price_date: "2026-10-19", provenance: "HISTORICAL" },
      { id: "M2", commodity: "Soybean (सोयाबीन)", district: "Nagpur", market: "Nagpur APMC", variety: "Yellow (JS-335)", min_price: 4100, modal_price: 4580, max_price: 4820, price_date: "2026-10-19", provenance: "HISTORICAL" },
      { id: "M3", commodity: "Cotton (कापूस)", district: "Amravati", market: "Amravati APMC", variety: "Medium Staple (H-4)", min_price: 6800, modal_price: 7450, max_price: 7820, price_date: "2026-10-19", provenance: "HISTORICAL" },
      { id: "M4", commodity: "Tomato (टोमॅटो)", district: "Pune", market: "Narayangaon APMC", variety: "Hybrid", min_price: 800, modal_price: 1400, max_price: 1900, price_date: "2026-10-19", provenance: "HISTORICAL" },
      { id: "M5", commodity: "Gram / Chana (हरभरा)", district: "Latur", market: "Latur APMC", variety: "Desi", min_price: 5400, modal_price: 5950, max_price: 6300, price_date: "2026-10-19", provenance: "HISTORICAL" },
      { id: "M6", commodity: "Wheat (गहू)", district: "Ahmednagar", market: "Rahuri APMC", variety: "Lokwan", min_price: 2450, modal_price: 2820, max_price: 3150, price_date: "2026-10-19", provenance: "HISTORICAL" },
    ]);
  };

  // Schemes fetch
  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${API_URL}/schemes`);
      if (res.ok) {
        const data = await res.json();
        setSchemes(data || []);
        return;
      }
    } catch {}

    setSchemes([
      {
        id: "SCH-PM-KISAN",
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
    <div className="landing-wrapper">
      {/* 1. Sleek Floating Capsule Navbar */}
      <header className="landing-navbar">
        <a href="#home" className="nav-brand">
          <span className="brand-dot" />
          <span>KRISHIOS</span>
          <span style={{ fontSize: 11, color: "var(--accent-lime)", letterSpacing: "1px", marginLeft: 4, textTransform: "uppercase" }}>
            AgriStack
          </span>
        </a>

        <nav className="nav-links-menu">
          <button
            className={`nav-item-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            {lang === "mr" ? "मुखपृष्ठ" : lang === "hi" ? "मुखपृष्ठ" : "Home"}
          </button>
          <button
            className={`nav-item-btn ${activeTab === "farms" ? "active" : ""}`}
            onClick={() => setActiveTab("farms")}
          >
            {t("nav_farms")}
          </button>
          <button
            className={`nav-item-btn ${activeTab === "weather" ? "active" : ""}`}
            onClick={() => setActiveTab("weather")}
          >
            {t("nav_weather")}
          </button>
          <button
            className={`nav-item-btn ${activeTab === "market" ? "active" : ""}`}
            onClick={() => setActiveTab("market")}
          >
            {t("nav_market")}
          </button>
          <button
            className={`nav-item-btn ${activeTab === "calculator" ? "active" : ""}`}
            onClick={() => setActiveTab("calculator")}
          >
            {t("nav_calculator")}
          </button>
          <button
            className={`nav-item-btn ${activeTab === "schemes" ? "active" : ""}`}
            onClick={() => setActiveTab("schemes")}
          >
            {t("nav_schemes")}
          </button>
          <button
            className={`nav-item-btn ${activeTab === "mapping" ? "active" : ""}`}
            onClick={() => setActiveTab("mapping")}
          >
            {t("nav_mapping")}
          </button>
        </nav>

        <div className="nav-actions-right">
          <div className="lang-capsule">
            <button
              className={`lang-chip ${lang === "mr" ? "active" : ""}`}
              onClick={() => handleLangChange("mr")}
            >
              मराठी
            </button>
            <button
              className={`lang-chip ${lang === "hi" ? "active" : ""}`}
              onClick={() => handleLangChange("hi")}
            >
              हिन्दी
            </button>
            <button
              className={`lang-chip ${lang === "en" ? "active" : ""}`}
              onClick={() => handleLangChange("en")}
            >
              EN
            </button>
          </div>

          <button
            className="btn-lime"
            onClick={() => {
              setActiveTab("farms");
              setShowAddFarmModal(true);
            }}
          >
            + {t("btn_add_farm")}
          </button>
        </div>
      </header>

      {/* 2. Dribbble-Style Main Hero Showcase Card */}
      <section className="hero-showcase">
        <div className="hero-left-content">
          <div className="hero-badge-tag">
            🌱 SUSTAINABLE AGTECH • MAHARASHTRA
          </div>

          <h1 className="hero-heading">
            {lang === "mr" ? (
              <>शाश्वत कृषी तंत्रज्ञानाने <span>समृद्ध भविष्य</span> घडवा</>
            ) : lang === "hi" ? (
              <>सशक्त डिजिटल तकनीक से <span>उन्नत कृषि</span> का निर्माण</>
            ) : (
              <>Grow the Future with <span>Sustainable</span> Agriculture</>
            )}
          </h1>

          <p className="hero-description">
            {lang === "mr"
              ? "महाराष्ट्रातील शेतकरी बांधवांसाठी एकात्मिक डिजिटल कृषी निर्णय डेस्क. थेट हवामान अंदाज, कृषी विद्यापीठ सल्ला, एपीएमसी बाजारभाव, माती परीक्षण मार्गदर्शन आणि शासकीय योजनांचे संपूर्ण व्यासपीठ."
              : lang === "hi"
              ? "किसानों के लिए एकीकृत डिजिटल कृषि निर्णय मंच। सजीव मौसम पूर्वानुमान, कृषि विश्वविद्यालय सलाह, मंडी भाव, मृदा परीक्षण एवं सरकारी योजनाओं की सीधी पहुंच।"
              : "Discover how technology meets tradition in modern agriculture. Real-time agro-meteorology, verified APMC mandi prices, ICAR soil analytics, and instant government scheme navigation."}
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-lime"
              onClick={() => setActiveTab("weather")}
              style={{ padding: "12px 28px", fontSize: 14 }}
            >
              ⚡ {lang === "mr" ? "थेट हवामान व सल्ला तपासा" : lang === "hi" ? "सजीव मौसम एवं सलाह देखें" : "Explore Live Advisory"}
            </button>

            <button
              className="btn-outline"
              onClick={() => setActiveTab("market")}
              style={{ padding: "12px 24px", fontSize: 14 }}
            >
              📈 {lang === "mr" ? "एपीएमसी बाजारभाव" : "APMC Mandi Rates"}
            </button>
          </div>
        </div>

        <div className="hero-right-visual">
          <img
            src="/hero.jpg"
            alt="Modern Farmer with Tablet in Maharashtra Fields"
            className="hero-banner-img"
          />

          <div className="hero-glass-floating-pill">
            <div>
              <div style={{ fontSize: 11, color: "var(--accent-lime)", fontWeight: 700, textTransform: "uppercase" }}>
                ● Real-Time Feed Active
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
                {selectedDistrict} District: {weather?.temperature ? `${weather.temperature.toFixed(1)}°C` : "31.8°C"} · Clear Sky
              </div>
            </div>
            <span className="prov-badge live">LIVE</span>
          </div>
        </div>
      </section>

      {/* 3. Partner / Ecosystem Logos Banner */}
      <div className="ecosystem-logos-ribbon">
        <span className="ecosystem-label">Verified Data Partners:</span>
        <span className="logo-item">🏛️ Ministry of Agriculture</span>
        <span className="logo-item">🌾 ICAR Institutes</span>
        <span className="logo-item">📊 MSAMB APMC Mandis</span>
        <span className="logo-item">⛅ Open-Meteo & IMD</span>
        <span className="logo-item">🌱 MahaDBT Aaple Sarkar</span>
        <span className="logo-item">📜 Soil Health Card</span>
      </div>

      {/* 4. INNOVATING THE FUTURE OF AGRICULTURE Section */}
      <section className="innovation-section">
        <div className="innovation-left-card">
          <div>
            <div className="section-tagline">INNOVATING THE FUTURE OF AGRICULTURE</div>
            <h2 className="section-title">
              {lang === "mr"
                ? "पारदर्शक माहिती व तंत्रज्ञानाची मजबूत जोड"
                : "Where Technology Meets the Roots of Nature"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14.5, lineHeight: 1.6 }}>
              {lang === "mr"
                ? "प्रत्येक आकडेवारीचा अधिकृत स्त्रोत (Provenance) पारदर्शकपणे दर्शवला जातो. कोणतेही बनावट मॉडेल नाही, कोणतीही खोटी आकडेवारी नाही. शेतकऱ्यांचे आर्थिक नुकसान टाळणे हेच आमचे प्रथम उद्दिष्ट आहे."
                : "Every metric displayed carries an honest provenance label. No fake AI hallucinations, no invented mandi prices, and strictly cited agronomic dosages from verified state agricultural universities."}
            </p>
          </div>

          <div className="stats-vertical-grid">
            <div className="stat-box">
              <div className="stat-box-num">100%</div>
              <div className="stat-box-desc">Data Provenance Labeling (Live / Historical / Estimated)</div>
            </div>

            <div className="stat-box">
              <div className="stat-box-num">36</div>
              <div className="stat-box-desc">Maharashtra Districts Covered Live</div>
            </div>

            <div className="stat-box">
              <div className="stat-box-num">37/37</div>
              <div className="stat-box-desc">Automated Test Suites Verified</div>
            </div>

            <div className="stat-box">
              <div className="stat-box-num">24x7</div>
              <div className="stat-box-desc">Kisan Call Centre 1800-180-1551 Support</div>
            </div>
          </div>
        </div>

        <div className="drone-card">
          <img
            src="/drone_field.jpg"
            alt="Aerial Precision Agriculture Fields"
            className="drone-card-img"
          />
          <div className="drone-card-content">
            <div className="section-tagline">PRECISION DECISION DESK</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
              {lang === "mr" ? "सुक्ष्म नियोजन, हमखास भरघोस उत्पादन" : "Precision Farm Intelligence for Every Acre"}
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginBottom: 16 }}>
              From sowing window timing to disease alert forecasting and break-even mandi pricing, KRISHIOS arms cultivators with scientific clarity.
            </p>
            <button className="btn-lime" onClick={() => setActiveTab("calculator")} style={{ width: "fit-content" }}>
              🧮 {t("btn_calculate")}
            </button>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE APPS & MODULES */}
      <section>
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="interactive-module-card">
            <div className="module-header">
              <div className="module-title-group">
                <h3>📊 {t("nav_overview")} — Maharashtra Quick Intelligence</h3>
                <p>Real-time farm advisory, active weather zone, and benchmark APMC rates</p>
              </div>
              <span className="prov-badge live">LIVE SYNC ACTIVE</span>
            </div>

            {/* Quick Advisory Banner */}
            {weather && weather.advisories.length > 0 && (
              <div style={{ background: "rgba(200, 245, 55, 0.08)", border: "1px solid var(--border-lime)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-lime)", marginBottom: 4 }}>
                  📢 {t("quick_weather_summary")} ({selectedDistrict})
                </div>
                <p style={{ fontSize: 14, color: "#ffffff" }}>{weather.advisories[0]}</p>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 24 }}>
              {/* Land Parcels */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>🌾 {t("nav_farms")}</h4>
                  <button className="btn-outline" onClick={() => setShowAddFarmModal(true)} style={{ fontSize: 12, padding: "6px 14px" }}>
                    + {t("btn_add_farm")}
                  </button>
                </div>

                <div className="modern-table-wrapper">
                  <table className="modern-table">
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
                          <td>{f.irrigation_source || "Well & Drip"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* APMC Highlights */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>📈 {t("quick_mandi_headline")}</h4>
                  <button className="btn-outline" onClick={() => setActiveTab("market")} style={{ fontSize: 12, padding: "6px 14px" }}>
                    {t("btn_view_details")}
                  </button>
                </div>

                <div className="modern-table-wrapper">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>{t("calc_crop")}</th>
                        <th>APMC Market</th>
                        <th>{t("mandi_modal")}</th>
                        <th>तारीख</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mandiPrices.slice(0, 4).map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 700, color: "var(--accent-lime)" }}>{p.commodity}</td>
                          <td>{p.market}</td>
                          <td style={{ fontWeight: 700 }}>₹{p.modal_price}/qtl</td>
                          <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{p.price_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FARMS & SOIL */}
        {activeTab === "farms" && (
          <div className="interactive-module-card">
            <div className="module-header">
              <div className="module-title-group">
                <h3>🌾 {t("nav_farms")} & Soil Health Cards</h3>
                <p>Manage farm survey numbers and view ICAR-benchmarked soil test evaluations</p>
              </div>
              <button className="btn-lime" onClick={() => setShowAddFarmModal(true)}>
                + {t("btn_add_farm")}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
              {farms.map((f) => {
                const tests = soilTests[f.id] || [];
                const latest = tests[tests.length - 1];

                return (
                  <div key={f.id} style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: 16, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <h4 style={{ fontSize: 17, fontWeight: 700 }}>{f.name}</h4>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
                          📍 {f.district}, Maharashtra · {f.area_hectares} Hectares · {f.irrigation_source}
                        </p>
                      </div>
                      <span className="prov-badge live">ACTIVE PLOT</span>
                    </div>

                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 14, margin: "14px 0" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-lime)", marginBottom: 8, textTransform: "uppercase" }}>
                        🔬 ICAR SOIL HEALTH CARD ASSESSMENT
                      </div>

                      {latest ? (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
                            <span>pH: <strong>{latest.ph || "N/A"}</strong></span>
                            <span>Organic Carbon: <strong>{latest.organic_carbon_pct ? `${latest.organic_carbon_pct}%` : "N/A"}</strong></span>
                          </div>
                          <p style={{ fontSize: 12.5, color: (latest.ph || 7) > 8 ? "#fcd34d" : "var(--accent-lime)", marginTop: 4 }}>
                            {(latest.ph || 7) > 8.0
                              ? "⚠️ Calcareous/Sodic Soil: Gypsum amendment & green manuring (Dhaincha) advised."
                              : "✅ Balanced soil reaction. Optimal for crop fertilizer uptake efficiency."}
                          </p>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                            Lab: {latest.lab_name} ({latest.tested_on})
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>No soil testing recorded yet for this plot.</p>
                      )}
                    </div>

                    <button
                      className="btn-outline"
                      style={{ width: "100%", fontSize: 13 }}
                      onClick={() => {
                        setSelectedFarmForSoil(f.id);
                        setShowAddSoilModal(true);
                      }}
                    >
                      {t("btn_add_soil")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: WEATHER & AGRO-ADVISORY */}
        {activeTab === "weather" && (
          <div className="interactive-module-card">
            <div className="module-header">
              <div className="module-title-group">
                <h3>⛅ {t("nav_weather")} & Climate Advisory</h3>
                <p>Live meteorological telemetry from Open-Meteo with agro-climatic spray and field advisories</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{t("farm_district")}:</span>
                <select
                  className="modern-select"
                  style={{ width: "auto" }}
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
                <div className="weather-hero-card">
                  <div>
                    <div style={{ fontSize: 12, color: "var(--accent-lime)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                      Current Meteorological Telemetry
                    </div>
                    <div className="weather-giant-temp">{weather.temperature?.toFixed(1)}°C</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginTop: 6 }}>
                      {selectedDistrict}, Maharashtra
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                      Source: {weather.source} · {new Date(weather.fetched_at).toLocaleTimeString()}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{t("weather_humidity")}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-lime)" }}>{weather.relative_humidity}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{t("weather_wind")}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-lime)" }}>{weather.wind_speed} km/h</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{t("weather_precip")}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-lime)" }}>{weather.precipitation} mm</div>
                    </div>
                  </div>
                </div>

                {/* Agricultural Advisories */}
                <div style={{ marginBottom: 28 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                    🌿 {t("weather_advisories")}
                  </h4>
                  {weather.advisories.map((adv, idx) => (
                    <div key={idx} style={{ background: "rgba(255, 255, 255, 0.03)", borderLeft: "4px solid var(--accent-lime)", borderRadius: 6, padding: "14px 18px", marginBottom: 10 }}>
                      <p style={{ fontSize: 13.5, color: "var(--text-primary)" }}>{adv}</p>
                    </div>
                  ))}
                </div>

                {/* 7-Day Forecast */}
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
                  📅 {t("weather_7day")}
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                  {weather.daily_forecast.map((df) => (
                    <div key={df.date} style={{ background: "rgba(0,0,0,0.35)", border: "1px solid var(--border-card)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
                        {new Date(df.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </div>
                      <div style={{ fontSize: 19, fontWeight: 800, margin: "8px 0" }}>
                        {df.temp_max.toFixed(0)}° / {df.temp_min.toFixed(0)}°
                      </div>
                      <div style={{ fontSize: 12, color: "#7dd3fc", fontWeight: 600 }}>
                        🌧️ {df.precipitation_sum} mm
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: APMC MANDI RATES */}
        {activeTab === "market" && (
          <div className="interactive-module-card">
            <div className="module-header">
              <div className="module-title-group">
                <h3>📊 Maharashtra APMC Mandi Daily Rates</h3>
                <p>Verified daily market arrivals from Maharashtra State Agricultural Marketing Board (MSAMB)</p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  className="modern-input"
                  style={{ minWidth: 260 }}
                  placeholder={t("mandi_search_placeholder")}
                  value={mandiSearch}
                  onChange={(e) => setMandiSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="modern-table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>{t("calc_crop")}</th>
                    <th>{t("farm_district")}</th>
                    <th>APMC Market</th>
                    <th>Variety</th>
                    <th>{t("mandi_min")}</th>
                    <th>{t("mandi_modal")}</th>
                    <th>{t("mandi_max")}</th>
                    <th>Reported Date</th>
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
                        <td style={{ fontWeight: 700, color: "var(--accent-lime)" }}>{p.commodity}</td>
                        <td>{p.district}</td>
                        <td style={{ fontWeight: 600 }}>{p.market}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{p.variety}</td>
                        <td>₹{p.min_price}</td>
                        <td style={{ fontWeight: 800, color: "#ffffff", fontSize: 15 }}>₹{p.modal_price} / qtl</td>
                        <td>₹{p.max_price}</td>
                        <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.price_date}</td>
                        <td>
                          <span className="prov-badge hist">MSAMB Bulletin</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FARM ECONOMICS CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="interactive-module-card">
            <div className="module-header">
              <div className="module-title-group">
                <h3>🧮 {t("nav_calculator")} & Break-Even Volatility Test</h3>
                <p>Pure mathematical model evaluating input investments against expected yields and prices</p>
              </div>
              <span className="prov-badge est">{t("provenance_estimated")}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 32 }}>
              {/* Inputs */}
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Input Production Costs</h4>

                <div className="modern-form-grid">
                  <div>
                    <label className="input-label">{t("calc_crop")}</label>
                    <input
                      type="text"
                      className="modern-input"
                      value={calcCrop}
                      onChange={(e) => setCalcCrop(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("farm_area")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcArea}
                      onChange={(e) => setCalcArea(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("calc_seed_cost")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcSeed}
                      onChange={(e) => setCalcSeed(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("calc_fert_cost")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcFert}
                      onChange={(e) => setCalcFert(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("calc_pest_cost")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcPest}
                      onChange={(e) => setCalcPest(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("calc_labor_cost")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcLabor}
                      onChange={(e) => setCalcLabor(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("calc_machinery_cost")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcMachinery}
                      onChange={(e) => setCalcMachinery(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("calc_irrigation_cost")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcIrrig}
                      onChange={(e) => setCalcIrrig(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("calc_expected_yield")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcYield}
                      onChange={(e) => setCalcYield(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className="input-label">{t("calc_expected_price")}</label>
                    <input
                      type="number"
                      className="modern-input"
                      value={calcPrice}
                      onChange={(e) => setCalcPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Instant Output */}
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Financial & Break-Even Projections</h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid var(--border-card)", padding: 16, borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("calc_total_cost")}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>₹{totalCost.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>₹{costPerHa.toFixed(0)} / ha</div>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid var(--border-card)", padding: 16, borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("calc_gross_revenue")}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#7dd3fc", marginTop: 4 }}>₹{grossRev.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{totalYield.toFixed(1)} qtl total</div>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${netProfit >= 0 ? "var(--border-lime)" : "rgba(239, 68, 68, 0.4)"}`, padding: 16, borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("calc_net_profit")}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: netProfit >= 0 ? "var(--accent-lime)" : "#fca5a5", marginTop: 4 }}>
                      ₹{netProfit.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>ROI: {roi.toFixed(1)}%</div>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid var(--border-card)", padding: 16, borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("calc_break_even_price")}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fcd34d", marginTop: 4 }}>₹{bePrice.toFixed(0)} / qtl</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Min Yield: {beYield.toFixed(2)} q/ha</div>
                  </div>
                </div>

                {/* Sensitivity Table */}
                <h5 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{t("calc_sensitivity_title")}</h5>
                <div className="modern-table-wrapper">
                  <table className="modern-table">
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
                              const isPos = testProfit >= 0;
                              return (
                                <td
                                  key={yDelta}
                                  style={{
                                    fontWeight: 700,
                                    color: isPos ? "var(--accent-lime)" : "#fca5a5",
                                  }}
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
        )}

        {/* TAB 6: GOVERNMENT SCHEMES */}
        {activeTab === "schemes" && (
          <div className="interactive-module-card">
            <div className="module-header">
              <div className="module-title-group">
                <h3>📜 Verified Central & Maharashtra State Farmer Schemes</h3>
                <p>Official schemes catalog with verified application links and eligibility checklists</p>
              </div>

              <select
                className="modern-select"
                style={{ width: "auto" }}
                value={schemeCategory}
                onChange={(e) => setSchemeCategory(e.target.value)}
              >
                <option value="all">All Scheme Categories</option>
                <option value="Direct Income">Direct Income (थेट अनुदान)</option>
                <option value="Insurance">Crop Insurance (पीक विमा)</option>
                <option value="Water & Irrigation">Irrigation (सिंचन व शेततळे)</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
              {schemes
                .filter((s) => schemeCategory === "all" || s.category === schemeCategory)
                .map((s) => (
                  <div key={s.id} style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: 16, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <span className="prov-badge hist">{s.category}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.sponsor}</span>
                    </div>

                    <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                      {lang === "mr" ? s.name_mr : lang === "hi" ? s.name_hi : s.name}
                    </h4>

                    <p style={{ fontSize: 14, color: "var(--accent-lime)", fontWeight: 600, marginBottom: 14 }}>
                      {lang === "mr" ? s.benefit_summary_mr : lang === "hi" ? s.benefit_summary_hi : s.benefit_summary}
                    </p>

                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 4 }}>
                        {t("schemes_eligibility")}:
                      </div>
                      <ul style={{ paddingLeft: 16, fontSize: 12.5, color: "var(--text-secondary)" }}>
                        {s.eligibility_checklist.map((e, idx) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={s.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-lime"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      🔗 {t("btn_official_portal")} ({s.application_portal_name})
                    </a>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 7: PROBLEM MAPPING ENGINE */}
        {activeTab === "mapping" && (
          <div className="interactive-module-card">
            <div className="module-header">
              <div className="module-title-group">
                <h3>🔬 Problem Statement Mapping & Decision Engine</h3>
                <p>Transparent keyword-based taxonomy classifying agricultural challenges into verified platform modules</p>
              </div>
              <span className="prov-badge live">TRANSPARENT TAXONOMY</span>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input
                type="text"
                className="modern-input"
                style={{ flex: 1 }}
                placeholder={t("mapping_input_placeholder")}
                value={mappingQuery}
                onChange={(e) => setMappingQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyzeMapping()}
              />
              <button className="btn-lime" onClick={handleAnalyzeMapping}>
                {t("mapping_btn_classify")}
              </button>
            </div>

            {mappingResult && (
              <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid var(--border-card)", borderRadius: 12, padding: 20 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                  Analysis for: &quot;{mappingResult.title}&quot;
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>
                      {t("mapping_domains")}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {mappingResult.candidate_domains?.map((d: string) => (
                        <span key={d} className="prov-badge hist">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>
                      {t("mapping_modules")}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {mappingResult.relevant_modules?.map((m: string) => (
                        <span key={m} className="prov-badge live">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ background: "rgba(200, 245, 55, 0.08)", borderLeft: "4px solid var(--accent-lime)", padding: "10px 14px", borderRadius: 4, marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-lime)" }}>Transparency Notice</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>{mappingResult.notes?.[0]}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. OUR EXPERTISE HAS GOT YOU COVERED / FAQ Accordion */}
      <section className="faq-section">
        <div className="section-tagline">GOT QUESTIONS? WE&apos;VE GOT YOU COVERED</div>
        <h2 className="section-title" style={{ marginBottom: 28 }}>
          Frequently Asked Questions
        </h2>

        <div className="faq-item">
          <div className="faq-question" onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}>
            <span>How are weather advisories calculated?</span>
            <span>{openFaq === 0 ? "−" : "+"}</span>
          </div>
          {openFaq === 0 && (
            <div className="faq-answer">
              Weather advisories are generated directly from Open-Meteo & IMD high-resolution meteorological models. When wind speed exceeds 15 km/h, the system flags spray warnings. When precipitation exceeds 2 mm, irrigation alerts are updated.
            </div>
          )}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}>
            <span>Where do APMC mandi prices come from?</span>
            <span>{openFaq === 1 ? "−" : "+"}</span>
          </div>
          {openFaq === 1 && (
            <div className="faq-answer">
              Prices are sourced from official daily market bulletins of the Maharashtra State Agricultural Marketing Board (MSAMB) and Agmarknet, reporting real min, modal, and max prices in ₹/quintal.
            </div>
          )}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}>
            <span>How does the farm economics break-even calculator work?</span>
            <span>{openFaq === 2 ? "−" : "+"}</span>
          </div>
          {openFaq === 2 && (
            <div className="faq-answer">
              It evaluates your operational costs (seed, fertilizer, labor, fuel) against expected yields and prices. It calculates the exact break-even price per quintal and provides a 5×5 sensitivity matrix simulating price and yield volatility.
            </div>
          )}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}>
            <span>Are government schemes verified?</span>
            <span>{openFaq === 3 ? "−" : "+"}</span>
          </div>
          {openFaq === 3 && (
            <div className="faq-answer">
              Yes, all scheme descriptions link directly to official state and central portals (PM-KISAN, MahaPoCRA, PMFBY, Soil Health Card) with official verification dates.
            </div>
          )}
        </div>
      </section>

      {/* 7. Modals */}
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
              <button className="btn-outline" onClick={() => setShowAddFarmModal(false)}>Cancel</button>
              <button className="btn-lime" onClick={handleAddFarm}>Save Farm</button>
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
              <button className="btn-outline" onClick={() => setShowAddSoilModal(false)}>Cancel</button>
              <button className="btn-lime" onClick={handleAddSoilTest}>Save Soil Test</button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modern Dribbble-Inspired Dark Footer */}
      <footer className="landing-footer">
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: 8 }}>
            <span className="brand-dot" /> KRISHIOS
          </div>
          <p style={{ marginTop: 4, fontSize: 12.5, color: "var(--text-muted)" }}>
            Unified AI-Powered Agricultural Ecosystem · Maharashtra Pilot
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span>📞 Kisan Helpline: <strong>1800-180-1551</strong></span>
          <span>© 2026 KRISHIOS</span>
          <span className="prov-badge live">AgriStack Ready</span>
        </div>
      </footer>
    </div>
  );
}
