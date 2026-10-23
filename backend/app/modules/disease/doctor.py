"""AI Crop Doctor & Plant Pathology Diagnostic Module.

Provides visual and symptom-based diagnosis for Maharashtra crops,
including severity estimation, organic remedies, and precise spray dosages.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class TreatmentOption(BaseModel):
    category: str  # "Organic / Bio-control" or "Chemical / Fungicide"
    name: str
    name_mr: str
    name_hi: str
    dosage_per_15l_pump: str  # e.g. "30 ml per 15L knapsack pump"
    application_timing: str
    safety_waiting_period_days: int


class DiseaseDiagnosis(BaseModel):
    id: str
    crop: str
    crop_mr: str
    crop_hi: str
    disease_name: str
    disease_name_mr: str
    disease_name_hi: str
    pathogen_type: str  # Fungal, Bacterial, Viral, Pest / Insect
    confidence: float  # e.g. 0.94
    severity_level: str  # Mild (10-20%), Moderate (20-40%), Severe (>40%)
    severity_pct: int
    symptoms: List[str]
    symptoms_mr: List[str]
    organic_remedy: TreatmentOption
    chemical_remedy: TreatmentOption
    water_management_advice: str
    water_management_advice_mr: str
    preventive_measures: List[str]
    preventive_measures_mr: List[str]
    provenance: str = "ICAR - Indian Agricultural Research Institute & MPKV Rahuri"


DISEASE_DATABASE: List[DiseaseDiagnosis] = [
    DiseaseDiagnosis(
        id="cotton-pink-bollworm",
        crop="Cotton (कापूस)",
        crop_mr="कापूस",
        crop_hi="कपास",
        disease_name="Pink Bollworm (गुलाबी बोंडअळी)",
        disease_name_mr="गुलाबी बोंडअळी प्रादुर्भाव",
        disease_name_hi="गुलाबी सुंडी (पिंक बॉलवर्म)",
        pathogen_type="Insect / Pest",
        confidence=0.965,
        severity_level="Severe (>40%)",
        severity_pct=48,
        symptoms=[
            "Interlocked rosetted flowers (gummed petals)",
            "Small bore holes on young green bolls sealed with excreta",
            "Discolored stained lint and premature boll opening"
        ],
        symptoms_mr=[
            "फुलांच्या पाकळ्या एकमेकांना चिकटून गुलाबाच्या कळीसारखी दिसणे (रोसेट फुले)",
            "हिरव्या बोंडांवर बारीक छिद्रे व आत विष्ठेचा थर",
            "कापसाची प्रत खालावणे व बोंड अकाली उमलणे"
        ],
        organic_remedy=TreatmentOption(
            category="Organic / Bio-control",
            name="Neem Oil (Azadirachtin 10,000 ppm) + Pheromone Traps",
            name_mr="निंबोळी अर्क (१०,००० पीपीएम) + ५ कामगंध सापळे प्रति एकर",
            name_hi="नीम का तेल (10,000 ppm) + फेरोमोन ट्रैप",
            dosage_per_15l_pump="40 ml Neem oil + 5 ml soap liquid",
            application_timing="Early morning or post 5:00 PM",
            safety_waiting_period_days=0
        ),
        chemical_remedy=TreatmentOption(
            category="Targeted Chemical Control",
            name="Chlorantraniliprole 18.5% SC (Coragen)",
            name_mr="क्लोरँट्रानिलीप्रोल १८.५% एससी (कोराजेन)",
            name_hi="क्लोरेंट्रानिलिप्रोल 18.5% एससी",
            dosage_per_15l_pump="6 ml in 15 Litre water",
            application_timing="When ETL crosses 5-8 live larvae per 20 bolls",
            safety_waiting_period_days=14
        ),
        water_management_advice="Avoid excess nitrogen fertilizer and withhold irrigation if soil moisture is saturated.",
        water_management_advice_mr="जास्त नत्रयुक्त खते टाळा आणि शेतात पाणी साचू देऊ नका.",
        preventive_measures=[
            "Install 5 Pheromone traps per acre at 45 days after sowing",
            "Collect and destroy rosetted flowers daily",
            "Release Trichogramma bactrae egg parasitoids @ 60,000/acre"
        ],
        preventive_measures_mr=[
            "पेरणीनंतर ४५ दिवसांनी एकरी ५ कामगंध सापळे लावा",
            "रोसेट फुले गोळा करून जाळून नष्ट करा",
            "ट्रायकोग्रामा बॅक्टरी परोपजीवी मित्रकीटक एकरी ६०,००० सोडा"
        ]
    ),
    DiseaseDiagnosis(
        id="soybean-yellow-mosaic",
        crop="Soybean (सोयाबीन)",
        crop_mr="सोयाबीन",
        crop_hi="सोयाबीन",
        disease_name="Yellow Mosaic Virus (पिवळा मोझॅक)",
        disease_name_mr="सोयाबीन पिवळा मोझॅक विषाणू",
        disease_name_hi="पीला मोज़ेक वायरस",
        pathogen_type="Viral (Whitefly Vector)",
        confidence=0.942,
        severity_level="Moderate (25-35%)",
        severity_pct=32,
        symptoms=[
            "Irregular bright yellow patches alternating with green on leaf lamina",
            "Leaves turn completely yellow, brittle and curl upward",
            "Severely reduced pod formation and shriveled seeds"
        ],
        symptoms_mr=[
            "पानांवर हिरवे व चमकदार पिवळे चट्टे पडणे",
            "पाने आकसणे, खरखरीत होणे आणि वाढ खुंटणे",
            "शेंगा भरण्याचे प्रमाण घटणे व बारीक दाणे तयार होणे"
        ],
        organic_remedy=TreatmentOption(
            category="Organic Vector Control",
            name="Dashparni Ark + Yellow Sticky Traps",
            name_mr="दशपर्णी अर्क फवारणी + एकरी १० पिवळे चिकट सापळे",
            name_hi="दशपर्णी अर्क + पीले चिपचिपे जाल",
            dosage_per_15l_pump="250 ml Dashparni Ark per 15L pump",
            application_timing="Immediate upon first whitefly observation",
            safety_waiting_period_days=0
        ),
        chemical_remedy=TreatmentOption(
            category="Vector Vectoricide",
            name="Thiamethoxam 25% WG",
            name_mr="थायमेथोक्साम २५% डब्ल्यूजी",
            name_hi="थियामेथॉक्सम 25% डब्ल्यूजी",
            dosage_per_15l_pump="10 grams in 15 Litre water",
            application_timing="Spray immediately to kill vector whiteflies",
            safety_waiting_period_days=10
        ),
        water_management_advice="Avoid water stress during pod filling; maintain uniform aeration.",
        water_management_advice_mr="शेंगा भरण्याच्या काळात पाण्याचा ताण पडू देऊ नका.",
        preventive_measures=[
            "Uproot and bury infected plants immediately to prevent viral spread",
            "Erect 8-10 yellow sticky cards per acre above crop canopy",
            "Choose YMV-resistant cultivars like JS-335, Phule Sangam (KDS-726)"
        ],
        preventive_measures_mr=[
            "रोगट झाडे त्वरित उपटून जमिनीत गाडून टाका",
            "पीक उंचीपेक्षा १ फूट वर पिवळे चिकट ट्रॅप लावा",
            "फुले संगम (KDS-726) सारख्या प्रतिकारक्षम वाणांची निवड करा"
        ]
    ),
    DiseaseDiagnosis(
        id="tomato-early-blight",
        crop="Tomato (टोमॅटो)",
        crop_mr="टोमॅटो",
        crop_hi="टमाटर",
        disease_name="Early Blight (अल्टरनेरिया करपा)",
        disease_name_mr="टोमॅटोवरील लवकर येणारा करपा",
        disease_name_hi="टमाटर अगेती झुलसा",
        pathogen_type="Fungal (Alternaria solani)",
        confidence=0.978,
        severity_level="Moderate (20-30%)",
        severity_pct=26,
        symptoms=[
            "Concentric rings (target board pattern) on lower older leaves",
            "Dark brown to black necrotic lesions surrounded by yellow chlorotic halo",
            "Premature leaf drop causing sunscald on exposed green fruit"
        ],
        symptoms_mr=[
            "खालच्या जुन्या पानांवर लक्ष्य फळ्यासारखे वर्तुळाकार काळे चट्टे",
            "चट्ट्यांभोवती पिवळसर कडा तयार होणे",
            "पाने गळून फळे उन्हाने होरपळणे"
        ],
        organic_remedy=TreatmentOption(
            category="Bio-Fungicide",
            name="Trichoderma harzianum + Pseudomonas fluorescens",
            name_mr="ट्रायकोडर्मा व्हिरीडी (५ ग्रॅम/लिटर) + ताक फवारणी",
            name_hi="ट्राइकोडर्मा + स्यूडोमोनास",
            dosage_per_15l_pump="75 grams Trichoderma powder in 15L water",
            application_timing="Preventive spray after high humidity/dew",
            safety_waiting_period_days=0
        ),
        chemical_remedy=TreatmentOption(
            category="Curative Fungicide",
            name="Mancozeb 75% WP or Azoxystrobin + Difenoconazole",
            name_mr="मँकोझेब ७५% डब्ल्यूपी (४० ग्रॅम) किंवा अमिस्टार टॉप",
            name_hi="मैंकोजेब 75% डब्ल्यूपी",
            dosage_per_15l_pump="35 grams Mancozeb per 15L water",
            application_timing="Upon noticing first 2 lesions per plant",
            safety_waiting_period_days=7
        ),
        water_management_advice="Avoid overhead sprinkler splash irrigation; use drip to keep leaves dry.",
        water_management_advice_mr="स्प्रिंकलरने पाणी देणे टाळा, ठिबक सिंचन वापरा जेणेकरून पाने ओली राहणार नाहीत.",
        preventive_measures=[
            "Mulch beds with silver-black polythene to block soil spore bounce",
            "Prune lowest leaves touching the moist soil bed",
            "Follow 3-year crop rotation without Solanaceous crops"
        ],
        preventive_measures_mr=[
            "सिल्व्हर-ब्लॅक मल्चिंग पेपरचा वापर करा",
            "मातीला स्पर्श करणारी तळची पाने छाटून टाका",
            "टोमॅटो, वांगी, बटाटा या पिकांची फेरपालट करा"
        ]
    ),
    DiseaseDiagnosis(
        id="sugarcane-red-rot",
        crop="Sugarcane (ऊस)",
        crop_mr="ऊस",
        crop_hi="गन्ना",
        disease_name="Red Rot (ऊस तांबेरा / लाल कूज)",
        disease_name_mr="ऊसावरील तांबडा कूज रोग",
        disease_name_hi="गन्ने का लाल सड़न रोग",
        pathogen_type="Fungal (Colletotrichum falcatum)",
        confidence=0.931,
        severity_level="Severe (>45%)",
        severity_pct=52,
        symptoms=[
            "Third and fourth leaves from top show yellowing and drying along margins",
            "Internal pith turns blood red with characteristic transverse white patches",
            "Alcoholic or acidic fermented smell when cane is split open longitudinally"
        ],
        symptoms_mr=[
            "वरच्या बाजूने ३-४ नंबरची पाने पिवळी पडून कडेने सुकणे",
            "ऊस उभा चिरल्यास आतील गर लालभडक दिसतो व त्यावर पांढरे आडवे पट्टे आढळतात",
            "ऊसातून आंबट वाइनसारखा दुर्गंध येतो"
        ],
        organic_remedy=TreatmentOption(
            category="Seed Sett Treatment",
            name="Trichoderma Sett Treatment & Carbendazim hot water wash",
            name_mr="ट्रायकोडर्मा व्हिरीडी १० ग्रॅम/लिटर द्रावणात बेणे प्रक्रिया",
            name_hi="ट्राइकोडर्मा बीज उपचार",
            dosage_per_15l_pump="150 grams per 15L slurry for dipping setts",
            application_timing="Soak cane setts for 15 minutes before furrow planting",
            safety_waiting_period_days=0
        ),
        chemical_remedy=TreatmentOption(
            category="Systemic Drenching",
            name="Thiophanate Methyl 70% WP (Roko)",
            name_mr="थायोफिनेट मिथाईल ७०% डब्ल्यूपी (रोको)",
            name_hi="थायोफैनेट मिथाइल 70% डब्ल्यूपी",
            dosage_per_15l_pump="25 grams in 15 Litre root drenching",
            application_timing="Root drenching along the affected crop row",
            safety_waiting_period_days=21
        ),
        water_management_advice="Ensure deep furrows with adequate gradient to prevent stagnant waterlogging.",
        water_management_advice_mr="शेतात पाणी साचून न राहता त्वरित निचरा होईल अशी व्यवस्था करा.",
        preventive_measures=[
            "Do not take ratoon (खोडवा) from an infected field",
            "Use certified tissue culture disease-free sets (Co 86032, CoM 0265)",
            "Disinfect cutting sickle with 5% Lysol solution"
        ],
        preventive_measures_mr=[
            "रोगट शेतातील उसाचा खोडवा ठेवू नका",
            "प्रमाणित रोगमुक्त बेणे वापरा (उदा. को-८६०३२)",
            "ऊस तोडणीचे कोयते निर्जंतुक करून वापरा"
        ]
    ),
    DiseaseDiagnosis(
        id="onion-purple-blotch",
        crop="Onion (कांदा)",
        crop_mr="कांदा",
        crop_hi="प्याज",
        disease_name="Purple Blotch (जांभळा करपा)",
        disease_name_mr="कांद्यावरील जांभळा करपा रोग",
        disease_name_hi="प्याज का बैंगनी धब्बा रोग",
        pathogen_type="Fungal (Alternaria porri)",
        confidence=0.954,
        severity_level="Moderate (20-35%)",
        severity_pct=28,
        symptoms=[
            "Small water-soaked sunken lesions with purple to dark brown centers on leaves",
            "Lesions rapidly girdle seed stalks causing them to collapse and fall",
            "Bulb neck becomes spongy with black powdery fungal spores under skin"
        ],
        symptoms_mr=[
            "पानांवर व डेंगळ्यांवर लांबट पांढरे, मध्यभागी जांभळट चट्टे पडणे",
            "चट्ट्यांची लांबी वाढून पाने मधेच वाकून मोडणे",
            "कांद्याची मान मऊ पडणे व साठवणीत सडणे"
        ],
        organic_remedy=TreatmentOption(
            category="Bio-spray",
            name="Cow Urine (Gomutra) 10% + Sour Butter Milk spray",
            name_mr="ताजे गोमूत्र (१ लिटर) + आंबट ताक (५०० मिली) प्रति पंप",
            name_hi="गोमूत्र 10% + छाछ का छिड़काव",
            dosage_per_15l_pump="1 Litre cow urine + 500 ml sour buttermilk",
            application_timing="Preventive spray at 30 & 45 days after transplant",
            safety_waiting_period_days=0
        ),
        chemical_remedy=TreatmentOption(
            category="Dual Action Fungicide",
            name="Tebuconazole 25.9% EC (Folicur) + Sticker",
            name_mr="टेब्युकोनॅझोल २५.९% ईसी (फॉलीक्युर) १५ मिली + स्प्रेडर",
            name_hi="टेबुकोनाज़ोल 25.9% ईसी",
            dosage_per_15l_pump="15 ml Folicur + 5 ml sticker per 15L water",
            application_timing="Spray in cloudy, humid weather when dew is heavy",
            safety_waiting_period_days=10
        ),
        water_management_advice="Regulate irrigation intervals; stop irrigation 15 days before bulb lifting.",
        water_management_advice_mr="काढणीपूर्वी १५ दिवस अगोदर पाणी पूर्णपणे बंद करा.",
        preventive_measures=[
            "Always mix silicon-based sticker (spreader) due to waxy onion foliage",
            "Dip seedling roots in Carbendazim solution before planting",
            "Dry bulbs thoroughly in shade for 7 days before storage"
        ],
        preventive_measures_mr=[
            "कांद्याच्या पानांवर मेणाचा थर असल्याने स्टिकर मिसळणे बंधनकारक आहे",
            "पुनर्लागवडीपूर्वी रोपांची मुळे बुरशीनाशकात बुडवा",
            "काढणीनंतर कांदे सावलीत ७ दिवस व्यवस्थित सुकवून साठवा"
        ]
    )
]


class DiseaseDoctorService:
    def __init__(self):
        self._db = {d.id: d for d in DISEASE_DATABASE}

    def list_all(self) -> List[DiseaseDiagnosis]:
        return list(self._db.values())

    def get_by_id(self, disease_id: str) -> Optional[DiseaseDiagnosis]:
        return self._db.get(disease_id)

    def diagnose_by_crop_and_query(self, crop: Optional[str] = None, query: Optional[str] = None) -> DiseaseDiagnosis:
        if crop:
            crop_lower = crop.lower()
            for d in self._db.values():
                if crop_lower in d.crop.lower() or crop_lower in d.crop_mr:
                    return d
        if query:
            q_lower = query.lower()
            for d in self._db.values():
                if any(q_lower in s.lower() for s in d.symptoms) or q_lower in d.disease_name.lower():
                    return d
        # Default high-confidence diagnosis demo
        return self._db["cotton-pink-bollworm"]


disease_doctor_service = DiseaseDoctorService()
