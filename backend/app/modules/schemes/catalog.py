from pydantic import BaseModel

from app.core.provenance import Provenance


class GovernmentScheme(BaseModel):
    id: str
    name: str
    name_mr: str
    name_hi: str
    category: str  # Direct Income, Insurance, Water & Irrigation, Mechanization, Soil Health, Credit
    sponsor: str   # Central Government / Government of Maharashtra
    benefit_summary: str
    benefit_summary_mr: str
    benefit_summary_hi: str
    eligibility_checklist: list[str]
    required_documents: list[str]
    official_portal_url: str
    application_portal_name: str
    last_verified_date: str
    provenance: Provenance
    disclaimer: str


SCHEMES_CATALOG: list[dict] = [
    {
        "id": "SCH-PM-KISAN",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "name_mr": "पीएम-किसान (पंतप्रधान किसान सन्मान निधी)",
        "name_hi": "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
        "category": "Direct Income",
        "sponsor": "Central Government",
        "benefit_summary": "₹6,000 per year directly transferred to bank account in 3 equal installments of ₹2,000.",
        "benefit_summary_mr": "दरवर्षी ₹६,००० थेट बँक खात्यात, तीन समान हप्त्यांमध्ये (प्रत्येकी ₹२,०००) जमा केले जातात.",
        "benefit_summary_hi": "प्रत्येक वर्ष ₹६,००० सीधे बैंक खाते में तीन समान किश्तों (प्रत्येक ₹२,०००) में दिए जाते हैं।",
        "eligibility_checklist": [
            "All landholder farmer families with cultivable land in their names",
            "Aadhaar-linked active bank account with e-KYC completed",
            "Excludes institutional landholders and income tax paying individuals",
        ],
        "required_documents": ["Aadhaar Card", "Land records (7/12 extract / 8-A)", "Active Bank Passbook", "Mobile number"],
        "official_portal_url": "https://pmkisan.gov.in/",
        "application_portal_name": "PM-KISAN Official Portal",
        "last_verified_date": "2026-10-20",
        "provenance": Provenance.HISTORICAL,
        "disclaimer": "Information is from the official portal. Eligibility verification is conducted solely by government revenue authorities.",
    },
    {
        "id": "SCH-PMFBY",
        "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        "name_mr": "पंतप्रधान पीक विमा योजना (१ रुपयात पीक विमा)",
        "name_hi": "प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)",
        "category": "Insurance",
        "sponsor": "Central & Maharashtra State Government",
        "benefit_summary": "Comprehensive yield loss and localized calamity insurance coverage; in Maharashtra farmers pay only ₹1 premium token.",
        "benefit_summary_mr": "महाराष्ट्र शासनाच्या योजनेअंतर्गत शेतकऱ्यांना केवळ ₹१ भरून सर्वसमावेशक पीक विमा संरक्षण मिळते.",
        "benefit_summary_hi": "प्राकृतिक आपदाओं से फसल नुकसान पर व्यापक सुरक्षा; महाराष्ट्र में किसानों के लिए मात्र ₹१ टोकन प्रीमियम।",
        "eligibility_checklist": [
            "All farmers growing notified crops in notified areas (loanee and non-loanee)",
            "Crop sown in current season with sowing certificate / e-Pik Pahani entry",
        ],
        "required_documents": ["7/12 & 8-A land extract", "Aadhaar Card", "Bank Passbook", "e-Pik Pahani (Sowing Certificate)"],
        "official_portal_url": "https://pmfby.gov.in/",
        "application_portal_name": "PMFBY Portal & Aaple Sarkar DBT",
        "last_verified_date": "2026-10-20",
        "provenance": Provenance.HISTORICAL,
        "disclaimer": "Claim settlement depends strictly on crop cutting experiments (CCE) and insurance company assessment.",
    },
    {
        "id": "SCH-POCRA",
        "name": "Nanaji Deshmukh Krishi Sanjivani Yojana (PoCRA)",
        "name_mr": "नानाजी देशमुख कृषी संजीवनी प्रकल्प (पोकरा)",
        "name_hi": "नानाजी देशमुख कृषि संजीवनी योजना (पोकरा)",
        "category": "Water & Irrigation",
        "sponsor": "Government of Maharashtra & World Bank",
        "benefit_summary": "Direct financial subsidy (50% to 75%) for drip/sprinkler irrigation, shade net houses, farm ponds, and horticulture across 5,142 villages in Vidarbha and Marathwada.",
        "benefit_summary_mr": "ठिबक व तुषार सिंचन, शेततळे, शेडनेट गृह आणि फळबाग लागवडीसाठी ५०% ते ७५% थेट अनुदान.",
        "benefit_summary_hi": "सूखाग्रस्त क्षेत्रों में ड्रिप/स्प्रिंकलर, खेत तालाब और संरक्षित खेती के लिए ५०% से ७५% तक का भारी अनुदान।",
        "eligibility_checklist": [
            "Small and marginal farmers residing in the selected 5,142 PoCRA project villages",
            "Special preference to SC/ST and women farmers",
        ],
        "required_documents": ["Aadhaar Card", "7/12 & 8-A land record", "Bank Passbook", "Caste Certificate (if applicable)"],
        "official_portal_url": "https://mahapocra.gov.in/",
        "application_portal_name": "MahaPoCRA Direct Benefit Portal",
        "last_verified_date": "2026-10-20",
        "provenance": Provenance.HISTORICAL,
        "disclaimer": "Scheme applies strictly to notified villages in Maharashtra Vidarbha, Marathwada, and select districts.",
    },
    {
        "id": "SCH-SHET-TALE",
        "name": "Magel Tyala Shet Tale (Farm Ponds on Demand)",
        "name_mr": "मागेल त्याला शेततळे योजना",
        "name_hi": "मागेल त्याला शेततळे (मांग पर खेत तालाब)",
        "category": "Water & Irrigation",
        "sponsor": "Government of Maharashtra",
        "benefit_summary": "Subsidy of up to ₹50,000 to ₹75,000 for digging plastic-lined farm ponds to ensure protective irrigation during dry spells.",
        "benefit_summary_mr": "पावसाचा खंड पडल्यास पिकांना संरक्षित पाणी मिळावे म्हणून शेततळे खोदण्यासाठी ₹५०,००० ते ₹७५,००० पर्यंत अनुदान.",
        "benefit_summary_hi": "सूखे से बचाव और संरक्षित सिंचाई हेतु प्लास्टिक-अस्तर खेत तालाब के निर्माण के लिए ₹५०,००० से ₹७५,००० का अनुदान।",
        "eligibility_checklist": [
            "Farmer owning minimum 0.60 hectares (1.5 acres) of land",
            "Site technically feasible for water harvesting and farm pond construction",
        ],
        "required_documents": ["7/12, 8-A extract", "Aadhaar Card", "Bank details", "Site self-declaration"],
        "official_portal_url": "https://mahadbt.maharashtra.gov.in/",
        "application_portal_name": "MahaDBT Farmer Schemes Portal",
        "last_verified_date": "2026-10-20",
        "provenance": Provenance.HISTORICAL,
        "disclaimer": "Requires geo-tagging and field verification by Agriculture Assistant prior to subsidy release.",
    },
    {
        "id": "SCH-SHC",
        "name": "Soil Health Card Scheme (SHC)",
        "name_mr": "मृदा आरोग्य पत्रिका योजना",
        "name_hi": "मृदा स्वास्थ्य कार्ड योजना",
        "category": "Soil Health",
        "sponsor": "Central & State Government",
        "benefit_summary": "Free soil sample testing across 12 parameters (pH, EC, OC, N, P, K, S, Zn, Fe, Cu, Mn, B) with customized crop-specific fertilizer dosage recommendations.",
        "benefit_summary_mr": "मातीचे मोफत परीक्षण आणि पिकांनुसार रासायनिक व सेंद्रिय खतांच्या समतोल वापराचा अधिकृत सल्ला.",
        "benefit_summary_hi": "१२ प्रमुख पोषक तत्वों की निशुल्क मिट्टी जांच और फसल-वार संतुलित खाद उपयोग की सरकारी सलाह।",
        "eligibility_checklist": [
            "All operational farmers holding agricultural land",
        ],
        "required_documents": ["Land passbook or 7/12 extract", "Soil sample representative of plot"],
        "official_portal_url": "https://soilhealth.dac.gov.in/",
        "application_portal_name": "Soil Health Card National Portal",
        "last_verified_date": "2026-10-20",
        "provenance": Provenance.HISTORICAL,
        "disclaimer": "Soil Health Cards are issued cyclically every 3 years by district soil testing laboratories.",
    },
    {
        "id": "SCH-KCC",
        "name": "Kisan Credit Card (KCC)",
        "name_mr": "किसान क्रेडिट कार्ड (केसीसी योजना)",
        "name_hi": "किसान क्रेडिट कार्ड (केसीसी)",
        "category": "Credit",
        "sponsor": "Reserve Bank of India & NABARD",
        "benefit_summary": "Revolving crop loan credit line up to ₹3,00,000 at concessional 4% interest rate (with 3% timely repayment subvention).",
        "benefit_summary_mr": "वेळेवर परतफेड केल्यास केवळ ४% व्याजदराने ₹३ लाखांपर्यंत सुलभ पीक कर्ज सुविधा.",
        "benefit_summary_hi": "समय पर पुनर्भुगतान पर केवल ४% की रियायती ब्याज दर पर ₹३ लाख तक की आसान फसली ऋण सुविधा।",
        "eligibility_checklist": [
            "All owner cultivators, tenant farmers, oral lessees, and sharecroppers",
            "Self Help Groups (SHGs) and Joint Liability Groups (JLGs) of farmers",
        ],
        "required_documents": ["Land documents / tenancy agreement", "Aadhaar Card", "PAN Card", "Passport photo"],
        "official_portal_url": "https://www.myscheme.gov.in/schemes/kcc",
        "application_portal_name": "Local Lead Bank / National Unified Portal",
        "last_verified_date": "2026-10-20",
        "provenance": Provenance.HISTORICAL,
        "disclaimer": "Sanction limit is evaluated according to District Level Technical Committee (DLTC) scale of finance.",
    },
]


class SchemesService:
    def __init__(self, catalog: list[dict] | None = None):
        self._catalog = catalog if catalog is not None else SCHEMES_CATALOG

    def list_schemes(
        self,
        category: str | None = None,
        search: str | None = None,
    ) -> list[GovernmentScheme]:
        results = self._catalog

        if category:
            cat_low = category.strip().lower()
            results = [s for s in results if cat_low in s["category"].lower()]

        if search:
            q = search.strip().lower()
            results = [
                s
                for s in results
                if q in s["name"].lower()
                or q in s["name_mr"].lower()
                or q in s["name_hi"].lower()
                or q in s["benefit_summary"].lower()
            ]

        return [GovernmentScheme(**s) for s in results]

    def get_categories(self) -> list[str]:
        return sorted(list({s["category"] for s in self._catalog}))

    def get_scheme(self, scheme_id: str) -> GovernmentScheme | None:
        target = scheme_id.strip().lower().replace("-", "").replace("_", "")
        for s in self._catalog:
            sid = s["id"].lower().replace("-", "").replace("_", "")
            if sid == target or target in sid:
                return GovernmentScheme(**s)
        return None


schemes_service = SchemesService()
