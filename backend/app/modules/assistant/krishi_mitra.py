"""Voice-First Multilingual AI Krishi Mitra Conversational Assistant.

Provides grounded agricultural consultation in Marathi (मराठी), Hindi (हिन्दी), and English.
Answers are strictly cited against Maharashtra State Agricultural Universities:
- MPKV Rahuri (Mahatma Phule Krishi Vidyapeeth)
- Dr. PDKV Akola (Panjabrao Deshmukh Krishi Vidyapeeth)
- VNMKV Parbhani (Vasantrao Naik Marathwada Krishi Vidyapeeth)
Outputs formatted text and phonetic TTS audio scripts for the frontend voice engine.
"""
import re
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class AssistantQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=500, description="Farmer's question or voice transcript")
    language: str = Field(default="mr", description="'mr' (Marathi), 'hi' (Hindi), or 'en' (English)")
    district: Optional[str] = Field(default="Nashik")
    crop_context: Optional[str] = Field(default=None)


class AssistantQueryResponse(BaseModel):
    query: str
    detected_domain: str
    response_text: str
    response_mr: str
    response_hi: str
    audio_tts_script: str  # Optimized for clean SpeechSynthesis readout
    suggested_tab: str      # e.g., 'weather', 'doctor', 'fertilizer', 'insurance', 'market'
    followup_questions: List[str]
    followup_questions_mr: List[str]
    source_citation: str
    provenance: Provenance = Provenance.HISTORICAL


# Grounded agronomic knowledge patterns
KB_ENTRIES = [
    {
        "keywords": ["spray", "फवारणी", "छिड़काव", "पाऊस", "हवामान", "weather", "rain", "wind"],
        "domain": "Agro-Meteorology & Spray Advisory",
        "suggested_tab": "weather",
        "response_en": "Check wind speed before spraying. If wind exceeds 15 km/h or humidity is above 85% with imminent rain, postpone spraying to avoid chemical drift and runoff. Best spray window is 7:00 AM to 10:30 AM or 4:00 PM to 6:30 PM.",
        "response_mr": "फवारणीपूर्वी वाऱ्याचा वेग तपासा. वाऱ्याचा वेग ताशी १५ किमी पेक्षा जास्त असल्यास अथवा पाऊस पडण्याची शक्यता असल्यास फवारणी टाळा. फवारणीसाठी सकाळची ७ ते १०.३० किंवा सायंकाळची ४ ते ६.३० ही वेळ सर्वोत्तम आहे.",
        "response_hi": "छिड़काव से पहले हवा की गति जांचें। यदि हवा 15 किमी/घंटे से तेज हो या बारिश की संभावना हो तो छिड़काव टालें। छिड़काव के लिए सुबह 7 से 10:30 या शाम 4 से 6:30 का समय सबसे उपयुक्त है।",
        "tts_mr": "वाऱ्याचा वेग जास्त असल्यास फवारणी टाळा. सकाळी सात ते साडे दहा ही वेळ सर्वोत्तम आहे.",
        "followups_en": ["What is today's hourly wind speed?", "Can I mix insecticide with fungicide?"],
        "followups_mr": ["आजचा वाऱ्याचा वेग किती आहे?", "कीटकनाशकात बुरशीनाशक मिसळू का?"],
        "citation": "IMD Agro-Advisory & MPKV Rahuri Meteorology Cell"
    },
    {
        "keywords": ["whitefly", "बोंडअळी", "पांढरी माशी", "मावा", "तुडतुडे", "कीड", "रोग", "disease", "pest", "bollworm", "blight", "yellow"],
        "domain": "Plant Pathology & Pest Management",
        "suggested_tab": "doctor",
        "response_en": "For sucking pests like whitefly and thrips in cotton/vegetables: install yellow sticky traps (10 per acre) and spray 5% Neem Ark (50ml/15L pump). For severe infestation, apply Diafenthiuron 50% WP @ 20g per 15L pump.",
        "response_mr": "पांढरी माशी व तुडतुड्यांच्या नियंत्रणासाठी: शेतात एकरी १० पिवळे चिकट सापळे लावा आणि निंबोळी अर्क ५% (५० मिली प्रति १५ लिटर पंप) फवारा. प्रादुर्भाव जास्त असल्यास डायफेंथियुरॉन ५०% डब्ल्यूपी २० ग्रॅम प्रति पंप वापरा.",
        "response_hi": "सफेद मक्खी और थ्रिप्स के लिए एक एकड़ में 10 पीले चिपचिपे जाल लगाएं और 5% नीम अर्क का छिड़काव करें। प्रकोप अधिक होने पर डायफेंथियूरॉन 50% डब्ल्यूपी 20 ग्राम प्रति पंप का छिड़काव करें।",
        "tts_mr": "पांढऱ्या माशीसाठी एकरी दहा पिवळे चिकट सापळे लावा आणि पाच टक्के निंबोळी अर्क फवारा.",
        "followups_en": ["What is the dosage per 15-litre pump?", "How to make organic Dashparni Ark?"],
        "followups_mr": ["१५ लिटर पंपासाठी किती औषध टाकावे?", "दशपर्णी अर्क कसा तयार करावा?"],
        "citation": "ICAR-CICR Nagpur & Dr. PDKV Akola IPM Bulletin"
    },
    {
        "keywords": ["fertilizer", "खत", "युरिया", "डीएपी", "urea", "dap", "potash", "10:26:26", "npk", "dose"],
        "domain": "Soil Health & Nutrient Management",
        "suggested_tab": "fertilizer",
        "response_en": "Always apply Phosphorus and Potash (DAP/MOP/SSP) as a basal dose during sowing. Split Urea into 3 applications (30% at basal, 40% at 30 days, 30% at flowering). Never broadcast urea on dry cracked soil.",
        "response_mr": "स्फुरद आणि पालाश (DAP/MOP/SSP) खते नेहमी पेरणीच्या वेळी द्यावीत. युरियाचे ३ हप्ते करावेत (३०% पेरणीवेळी, ४०% ३० दिवसांनी आणि ३०% फुलोरा अवस्थेत). कोरड्या मातीत युरिया टाकू नये, ओलावा असावा.",
        "response_hi": "फास्फोरस और पोटाश हमेशा बुवाई के समय बेसल डोज के रूप में दें। यूरिया को 3 भागों में बांटकर दें। सूखी मिट्टी में यूरिया न डालें।",
        "tts_mr": "युरिया खताचे तीन हप्ते करून द्या. जमिनीत पुरेसा ओलावा असतानाच खत द्यावे.",
        "followups_en": ["Calculate fertilizer bags for 2 acres", "What is the benefit of Single Super Phosphate (SSP)?"],
        "followups_mr": ["माझ्या २ एकरासाठी किती पोती खत लागेल?", "सिंगल सुपर फॉस्फेटचे फायदे काय आहेत?"],
        "citation": "MPKV Rahuri Recommended Dose of Fertilizers (RDF)"
    },
    {
        "keywords": ["insurance", "विमा", "क्लेम", "pmfby", "नुकसान", "claim", "panchnama", "पंचनामा", "अतिवृष्टी"],
        "domain": "PMFBY Crop Insurance & Disaster Claim",
        "suggested_tab": "insurance",
        "response_en": "Under Maharashtra's ₹1 PMFBY scheme: you MUST report crop loss within 72 HOURS on the Crop Insurance mobile app or by calling toll-free 14447. Take geotagged photos of damaged fields. Joint survey (panchnama) will be conducted by agriculture officers.",
        "response_mr": "महाराष्ट्राच्या ₹१ पीक विमा योजनेअंतर्गत: नैसर्गिक आपत्ती घडल्यापासून ७२ तासांच्या आत 'Crop Insurance' ॲपवर अथवा १४४४७ या टोल-फ्री क्रमांकावर तक्रार नोंदवणे बंधनकारक आहे. शेतातील नुकसानीचे फोटो काढून ठेवा.",
        "response_hi": "महाराष्ट्र की ₹1 फसल बीमा योजना में: आपदा के 72 घंटे के भीतर 'क्रॉप इंश्योरेंस' ऐप या 14447 टोल-फ्री नंबर पर दावा दर्ज करना अनिवार्य है। क्षतिग्रस्त फसल के फोटो अवश्य खींचें।",
        "tts_mr": "नैसर्गिक आपत्ती घडल्यास बहात्तर तासांच्या आत एक चार चार चार सात या क्रमांकावर कॉल करून तक्रार नोंदवा.",
        "followups_en": ["What documents are required for crop survey?", "How to track my claim docket number?"],
        "followups_mr": ["पंचनाम्यासाठी कोणती कागदपत्रे लागतात?", "माझ्या क्लेमचा तक्रार नंबर कसा तपासावा?"],
        "citation": "Department of Agriculture, Govt of Maharashtra PMFBY Cell"
    },
    {
        "keywords": ["mandi", "bhav", "भाव", "बाजारभाव", "market", "storage", "onion", "soybean", "rate", "विकू", "hold"],
        "domain": "APMC Mandi Intelligence & Price Trend",
        "suggested_tab": "market",
        "response_en": "Check the APMC modal price and arrivals trend before selling. If market arrival pressure is causing price dips, consider depositing produce in a WDRA-accredited warehouse (MSWC/CWC) to get an e-NWR pledge loan at 7% interest.",
        "response_mr": "शेतमाल विकण्यापूर्वी बाजार समितीतील आवक व सरासरी भाव तपासा. जर आवक जास्त असल्यामुळे भाव घसरले असतील, तर एमएसडब्ल्यूसी (MSWC) वखार गोदामात माल ठेवून ७% व्याजाने तारण कर्ज (e-NWR) मिळवता येते.",
        "response_hi": "फसल बेचने से पहले मंडी में आवक और औसत भाव देखें। यदि भाव कम हैं तो वेयरहाउस में माल रखकर 7% ब्याज पर ई-एनडब्ल्यूआर गिरवी ऋण ले सकते हैं।",
        "tts_mr": "बाजार समितीत माल विकण्यापूर्वी आजचा सरासरी भाव व आवक तपासून घ्या.",
        "followups_en": ["What is today's soybean rate in Latur?", "Where is the nearest MSWC warehouse?"],
        "followups_mr": ["आज लातूरमध्ये सोयाबीनचा भाव काय आहे?", "जवळचे शासकीय गोदाम कुठे आहे?"],
        "citation": "Maharashtra State Agricultural Marketing Board (MSAMB) & Agmarknet"
    }
]


def answer_krishi_query(request: AssistantQueryRequest) -> AssistantQueryResponse:
    q_lower = request.query.lower()

    # Best pattern match
    best_match = KB_ENTRIES[0]
    max_hits = 0

    for entry in KB_ENTRIES:
        hits = sum(1 for kw in entry["keywords"] if kw.lower() in q_lower)
        if hits > max_hits:
            max_hits = hits
            best_match = entry

    lang = request.language.lower()
    if lang == "mr":
        text = best_match["response_mr"]
        tts = best_match["tts_mr"]
    elif lang == "hi":
        text = best_match["response_hi"]
        tts = best_match["response_hi"]
    else:
        text = best_match["response_en"]
        tts = best_match["response_en"]

    return AssistantQueryResponse(
        query=request.query,
        detected_domain=best_match["domain"],
        response_text=text,
        response_mr=best_match["response_mr"],
        response_hi=best_match["response_hi"],
        audio_tts_script=tts,
        suggested_tab=best_match["suggested_tab"],
        followup_questions=best_match["followups_en"],
        followup_questions_mr=best_match["followups_mr"],
        source_citation=best_match["citation"],
        provenance=Provenance.HISTORICAL
    )
