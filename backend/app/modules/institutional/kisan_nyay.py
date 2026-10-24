"""Kisan Nyay: Agricultural Legal & Land Rights Guide for Maharashtra.

Empowers farmers with actionable legal pathways for common agrarian disputes:
1. Farm Road Access Rights (शेतरस्ता वाद) under Section 143 of Maharashtra Land Revenue Code (MLRC) & Mamlatdar Courts Act.
2. Spurious Input Compensation under Consumer Protection Act 2019.
3. Pot-Hissa land measurement & boundary dispute resolution.
"""
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class LegalRemedyGuide(BaseModel):
    id: str
    dispute_title: str
    dispute_title_mr: str
    applicable_law: str
    competent_authority: str
    competent_authority_mr: str
    filing_procedure: List[str]
    filing_procedure_mr: List[str]
    standard_court_fee_inr: float
    expected_resolution_timeline: str
    expected_resolution_timeline_mr: str
    key_legal_protections: str
    key_legal_protections_mr: str
    provenance: Provenance = Provenance.HISTORICAL
    source_citation: str


LEGAL_GUIDES: List[LegalRemedyGuide] = [
    LegalRemedyGuide(
        id="farm_road_access",
        dispute_title="Farm Road & Right of Way Dispute (शेतरस्त्याचा वाद / वहिवाट)",
        dispute_title_mr="शेतात जाण्यासाठी पारंपरिक रस्ता अडवल्यास काय करावे?",
        applicable_law="Section 143, Maharashtra Land Revenue Code (MLRC) 1966 & Mamlatdar Courts Act 1906",
        competent_authority="Tehsildar / Taluka Executive Magistrate (तहसीलदार न्यायालय)",
        competent_authority_mr="संबंधित तालुक्याचे तहसीलदार कार्यालय",
        filing_procedure=[
            "1. Obtain certified 7/12 extracts of your plot and all adjacent neighbor survey numbers.",
            "2. Secure village village map (गाव नकाशा) from Land Records (भूमी अभिलेख) showing customary cart tracks (धुरा/पांदण रस्ता).",
            "3. Submit formal application under Section 143 to Tehsildar with court fee stamp of ₹5.",
            "4. Tehsildar directs Circle Officer (मंडळ अधिकारी) and Talathi to conduct on-site spot panchnama.",
            "5. Tehsildar issues statutory order removing obstruction with police protection if needed."
        ],
        filing_procedure_mr=[
            "१. स्वतःच्या शेताचा आणि शेजारील सर्व गटांचे प्रमाणित ७/१२ उतारे काढा.",
            "२. भूमी अभिलेख कार्यालयातून गाव नकाशा (कच्चा/पक्का पांदण रस्ता दर्शवणारा) मिळवा.",
            "३. तहसीलदारांकडे 'महाराष्ट्र जमीन महसूल संहिता कलम १४३' किंवा 'मामलतदार कोर्ट ॲक्ट कलम ५' नुसार अर्ज दाखल करा.",
            "४. तहसीलदार मंडळ अधिकारी व तलाठ्यांना घटनास्थळी पाठवून प्रत्यक्ष पंचनामा करतील.",
            "५. तहसीलदार रस्ता मोकळा करण्याचा आदेश देतात; अडथळा करणाऱ्याविरुद्ध पोलिसांचे संरक्षण मिळते."
        ],
        standard_court_fee_inr=5.0,
        expected_resolution_timeline="60 to 90 Days",
        expected_resolution_timeline_mr="६० ते ९० दिवस",
        key_legal_protections="Law guarantees that no farmer can be denied reasonable access to their agricultural holding. Customary cart track cannot be blocked.",
        key_legal_protections_mr="कायद्यानुसार कोणत्याही शेतकऱ्याला शेतात जाण्यापासून रोखता येत नाही. वहिवाटीचा जुना रस्ता अडवणे बेकायदेशीर आहे.",
        provenance=Provenance.HISTORICAL,
        source_citation="Maharashtra Land Revenue Code 1966 & High Court of Bombay Precedents on Farm Roads"
    ),
    LegalRemedyGuide(
        id="spurious_input_compensation",
        dispute_title="Spurious Seed / Pesticide Compensation Claim",
        dispute_title_mr="खोटे बियाणे किंवा बोगस औषधामुळे नुकसान झाल्यास भरपाई कशी मिळवावी?",
        applicable_law="Consumer Protection Act 2019 & Seeds Act 1966",
        competent_authority="District Consumer Disputes Redressal Commission (जिल्हा ग्राहक मंच)",
        competent_authority_mr="जिल्हा ग्राहक तक्रार निवारण आयोग",
        filing_procedure=[
            "1. Inform District Agriculture Officer (कृषी विकास अधिकारी - Zilla Parishad) within 7 days of non-germination.",
            "2. Government District Seed Grievance Committee conducts formal field inspection with university scientists.",
            "3. Obtain official joint inspection report quantifying germination failure %.",
            "4. Send legal notice to seed company and dealer claiming crop loss value.",
            "5. File consumer petition with zero court fee for claims up to ₹5 Lakhs."
        ],
        filing_procedure_mr=[
            "१. बियाणे न उगवल्यास ७ दिवसांच्या आत तालुका कृषी अधिकारी व पंचायत समितीकडे लेखी तक्रार करा.",
            "२. शासकीय जिल्हास्तरीय बियाणे तक्रार निवारण समिती प्रत्यक्ष शेतावर येऊन पंचनामा करेल.",
            "३. शास्त्रज्ञांचा अधिकृत पंचनामा अहवाल मिळवा (उगवण न झाल्याचे प्रमाण).",
            "४. बियाणे कंपनी व दुकानदाराला नुकसान भरपाईची नोटीस पाठवा.",
            "५. भरपाई न मिळाल्यास जिल्हा ग्राहक मंचाकडे दावा दाखल करा (₹५ लाखांपर्यंत न्यायालयीन फी शून्य असते)."
        ],
        standard_court_fee_inr=0.0,
        expected_resolution_timeline="90 to 180 Days",
        expected_resolution_timeline_mr="९० ते १८० दिवस",
        key_legal_protections="Seed companies and distributors are strictly liable for defective seeds and must pay compensation for entire projected harvest loss.",
        key_legal_protections_mr="दोषी कंपनी व विक्रेत्याकडून शेतकऱ्याला संपूर्ण पिकाच्या नुकसानीची भरपाई व्याजासह मिळवण्याचा कायदेशीर अधिकार आहे.",
        provenance=Provenance.HISTORICAL,
        source_citation="Consumer Protection Act 2019 & Maharashtra District Seed Redressal Guidelines"
    )
]


def list_legal_guides() -> List[LegalRemedyGuide]:
    return LEGAL_GUIDES
