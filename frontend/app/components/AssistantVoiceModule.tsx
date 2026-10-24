"use client";

import React, { useState } from "react";

interface AssistantQueryResponse {
  query: string;
  detected_domain: string;
  response_text: string;
  response_mr: string;
  response_hi: string;
  audio_tts_script: string;
  suggested_tab: string;
  followup_questions: string[];
  followup_questions_mr: string[];
  source_citation: string;
}

interface AssistantVoiceModuleProps {
  district: string;
  lang: string;
  apiUrl: string;
  onNavigateTab: (tab: string) => void;
  speakText: (text: string) => void;
}

export default function AssistantVoiceModule({
  district,
  lang,
  apiUrl,
  onNavigateTab,
  speakText,
}: AssistantVoiceModuleProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AssistantQueryResponse | null>(null);
  const [isListening, setIsListening] = useState(false);

  const predefinedChips = [
    { text: "आज फवारणी करू का?", label: "🌦️ आज फवारणी करू का?" },
    { text: "कपाशीवरील पांढरी माशी व बोंडअळी नियंत्रण", label: "🐛 बोंडअळी व पांढरी माशी" },
    { text: "सोयाबीनला युरिया व खताचे नियोजन कसे करावे?", label: "🧪 खत नियोजन" },
    { text: "अतिवृष्टी झाली, विम्याचा क्लेम कसा करावा?", label: "🛡️ ₹१ पीक विमा क्लेम" },
    { text: "सोयाबीनचा आजचा बाजारभाव काय?", label: "💰 आजचा बाजारभाव" },
  ];

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/assistant/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          language: lang,
          district,
        }),
      });
      if (res.ok) {
        const data: AssistantQueryResponse = await res.json();
        setResponse(data);
        // Automatically speak response
        speakText(lang === "mr" ? data.audio_tts_script : data.response_text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceListen = () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please type your question.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleAsk(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-lime)", margin: 0 }}>
            🎙️ {lang === "mr" ? "एआय कृषी मित्र - व्हॉइस व चॅट शेती सल्लागार" : "AI Krishi Mitra - Voice & Multilingual Agronomic Advisor"}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {lang === "mr"
              ? "राहुरी, अकोला व परभणी कृषी विद्यापीठांच्या अधिकृत पॅकेज ऑफ प्रॅक्टिसेसवर आधारित थेट संवाद."
              : "Voice-driven dialogue grounded in verified MPKV, PDKV, and VNMKV agricultural university guidelines."}
          </p>
        </div>
        <span className="prov-badge live" style={{ background: "#d4f936", color: "#08160c" }}>VOICE-FIRST AI</span>
      </div>

      {/* Mic Input Container */}
      <div style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <button
            type="button"
            onClick={handleVoiceListen}
            style={{
              background: isListening ? "#ef4444" : "var(--accent-lime)",
              color: isListening ? "#fff" : "#08160c",
              border: "none",
              borderRadius: "50%",
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              cursor: "pointer",
              boxShadow: isListening ? "0 0 20px rgba(239, 68, 68, 0.6)" : "none",
              transition: "all 0.2s ease",
            }}
            title="Click to speak (माईकवर बोला)"
          >
            {isListening ? "⏹️" : "🎙️"}
          </button>

          <input
            type="text"
            className="modern-input"
            style={{ flex: 1, padding: "14px 16px", fontSize: 14 }}
            placeholder={
              isListening
                ? lang === "mr" ? "आता बोला... (ऐकत आहे)" : "Listening now... speak your question"
                : lang === "mr" ? "शेतीविषयी कोणताही प्रश्न विचारा किंवा माईकवर बोला..." : "Ask any farming question or tap mic to speak..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />

          <button
            className="btn-lime-pill"
            onClick={() => handleAsk()}
            disabled={loading}
            style={{ padding: "14px 22px" }}
          >
            <span>{loading ? "Thinking..." : lang === "mr" ? "विचारा" : "Ask"}</span>
            <span className="circle-arrow-icon">↗</span>
          </button>
        </div>

        {/* Quick Question Chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {predefinedChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(chip.text);
                handleAsk(chip.text);
              }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: 20,
                padding: "6px 12px",
                fontSize: 12,
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-lime)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-card)")}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Response Box */}
      {response && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-lg)", padding: 22, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: "var(--accent-lime)", fontWeight: 800, textTransform: "uppercase" }}>
                ● {response.detected_domain}
              </span>
              <h5 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: "4px 0 0 0" }}>
                {response.query}
              </h5>
            </div>

            <button
              className="tts-audio-btn"
              onClick={() => speakText(lang === "mr" ? response.audio_tts_script : response.response_text)}
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              🔊 {lang === "mr" ? "उत्तर ऐका" : "Listen (TTS)"}
            </button>
          </div>

          <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-primary)", marginBottom: 16 }}>
            {lang === "mr" ? response.response_mr : lang === "hi" ? response.response_hi : response.response_text}
          </div>

          {/* Action button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingTop: 14, borderTop: "1px solid var(--border-card)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              🏛️ <strong>{lang === "mr" ? "अधिकृत स्त्रोत:" : "Verified Citation:"}</strong> {response.source_citation}
            </div>

            {response.suggested_tab && (
              <button
                className="btn-lime-pill"
                onClick={() => onNavigateTab(response.suggested_tab)}
                style={{ padding: "6px 14px", fontSize: 12 }}
              >
                <span>
                  {lang === "mr" ? `संबंधित ${response.suggested_tab} विभाग उघडा` : `Open ${response.suggested_tab} Tab`}
                </span>
                <span className="circle-arrow-icon">↗</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
