"""Universal Access & Omnichannel Hotline (IVR Missed-Call & WhatsApp Gateway).

Allows non-smartphone / feature phone users and farmers with low digital literacy
to access AgriNexus decision intelligence via:
1. Missed-Call Voice Callback (टोल-फ्री मिस्ड कॉल - यंत्रणा कॉल करून मराठीत माहिती सांगते).
2. WhatsApp Voice Note / Camera Check bot.
"""
from typing import Dict, List
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class OmnichannelGatewayInfo(BaseModel):
    ivr_missed_call_number: str
    whatsapp_bot_number: str
    sms_shortcode: str
    supported_dialects: List[str]
    sample_ivr_menu_tree: List[str]
    sample_ivr_menu_tree_mr: List[str]
    whatsapp_commands: List[str]
    whatsapp_commands_mr: List[str]
    provenance: Provenance = Provenance.HISTORICAL
    source_citation: str


def get_omnichannel_info() -> OmnichannelGatewayInfo:
    return OmnichannelGatewayInfo(
        ivr_missed_call_number="1800-180-1551 (Toll-Free Missed Call Callback)",
        whatsapp_bot_number="+91 94220 18180 (KRISHIOS WhatsApp Krishi Mitra)",
        sms_shortcode="51969",
        supported_dialects=["Marathi (मराठी - पुणे/पश्चिम महाराष्ट्र, मराठवाडी, वऱ्हाडी, खानदेशी)", "Hindi", "English"],
        sample_ivr_menu_tree=[
            "Press 1: Can I spray today? (Hourly wind & rain advisory)",
            "Press 2: Today's APMC mandi rate & Hold/Sell recommendation",
            "Press 3: 3-Phase rural electricity shift schedule",
            "Press 4: Speak with certified district agricultural officer"
        ],
        sample_ivr_menu_tree_mr=[
            "१ दाबा: आज फवारणी करू का? (हवामान व फवारणी सल्ला)",
            "२ दाबा: आजचा बाजारभाव व साठवून ठेवण्याचा सल्ला",
            "३ दाबा: आजची ३-फेज विजेची वेळ (दिवसा की रात्री)",
            "४ दाबा: कृषी तज्ज्ञांशी थेट मोफत फोनवर बोला"
        ],
        whatsapp_commands=[
            "Send photo of diseased leaf -> Instant diagnosis & 15L pump dosage",
            "Send voice note in Marathi: 'सोयाबीनचा भाव काय आहे?' -> Voice audio reply",
            "Send 'वीज' -> Today's 3-phase electricity schedule"
        ],
        whatsapp_commands_mr=[
            "रोग पडलेल्या पानाचा फोटो पाठवा -> तातडीने रोग व १५ लिटर पंपाचे औषध प्रमाण मिळेल",
            "मराठीत व्हॉइस मेसेज पाठवा: 'आज फवारणी करू का?' -> ऑडिओ आवाजात उत्तर येईल",
            "फक्त 'वीज' लिहून पाठवा -> आजची ३-फेज विजेची वेळ कळेल"
        ],
        provenance=Provenance.HISTORICAL,
        source_citation="National e-Governance Plan in Agriculture (NeGPA) & Kisan Call Centre Telephony Architecture"
    )
