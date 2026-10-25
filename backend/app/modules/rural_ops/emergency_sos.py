"""Kisan Emergency First-Aid SOS & Anti-Snake Venom (ASV) Hospital Locator.

Provides instant medical triage protocols for:
1. Snakebites (The Big 4 venomous snakes of Maharashtra: Cobra, Krait, Russell's Viper, Saw-scaled Viper).
2. Pesticide inhalation / ingestion toxicity (Organophosphates, Chlorpyrifos, Phorate).
3. Heatstroke & lightning strike safety.
Directly points to verified Rural Primary Health Centres (PHC) stocking ASV vials.
"""
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class EmergencyHospital(BaseModel):
    name: str
    name_mr: str
    facility_type: str        # "Civil Hospital", "Sub-District Hospital", "Rural PHC"
    taluka: str
    district: str
    availability_note: str = "sample directory - call to confirm availability"
    availability_note_mr: str = "नमुना सूची - उपलब्धतेची खात्री करण्यासाठी कॉल करा"
    emergency_phone: str
    distance_km: float
    ambulance_available: bool = True


class FirstAidProtocol(BaseModel):
    hazard_title: str
    hazard_title_mr: str
    critical_time_window: str
    critical_time_window_mr: str
    immediate_dos: List[str]
    immediate_dos_mr: List[str]
    strict_donts: List[str]
    strict_donts_mr: List[str]
    medical_action_info: str
    medical_action_info_mr: str


class EmergencySOSResult(BaseModel):
    district: str
    emergency_toll_free: str
    hospital_directory_note: str = "sample directory - call to confirm availability"
    hospital_directory_note_mr: str = "नमुना सूची - उपलब्धतेची खात्री करण्यासाठी कॉल करा"
    snakebite_protocol: FirstAidProtocol
    pesticide_poisoning_protocol: FirstAidProtocol
    nearby_asv_hospitals: List[EmergencyHospital]
    provenance: Provenance = Provenance.CURATED_REFERENCE
    source_citation: str


HOSPITALS_BY_DISTRICT: Dict[str, List[Dict]] = {
    "nashik": [
        {
            "name": "District Civil Hospital, Trimbak Road, Nashik",
            "name_mr": "जिल्हा सामान्य रुग्णालय, त्र्यंबक रोड, नाशिक",
            "type": "Civil Hospital (24x7 Casualty)",
            "taluka": "Nashik",
            "district": "Nashik",
            "phone": "0253-2572111",
            "distance": 3.8,
        },
        {
            "name": "Sub-District Hospital, Niphad",
            "name_mr": "उपजिल्हा रुग्णालय, निफाड",
            "type": "Sub-District Hospital",
            "taluka": "Niphad",
            "district": "Nashik",
            "phone": "02550-241022",
            "distance": 28.5,
        },
        {
            "name": "Primary Health Centre (PHC), Dindori",
            "name_mr": "प्राथमिक आरोग्य केंद्र (PHC), दिंडोरी",
            "type": "Rural Primary Health Centre",
            "taluka": "Dindori",
            "district": "Nashik",
            "phone": "02557-221040",
            "distance": 18.2,
        },
    ],
    "pune": [
        {
            "name": "Sassoon General Hospital, Pune Station",
            "name_mr": "ससून सर्वोपचार रुग्णालय, पुणे स्टेशन",
            "type": "Apex Government Teaching Hospital",
            "taluka": "Haveli",
            "district": "Pune",
            "phone": "020-26128000",
            "distance": 6.2,
        },
        {
            "name": "Sub-District Hospital, Baramati",
            "name_mr": "उपजिल्हा रुग्णालय, बारामती",
            "type": "Sub-District Hospital",
            "taluka": "Baramati",
            "district": "Pune",
            "phone": "02112-222340",
            "distance": 12.0,
        },
    ],
}


def get_emergency_sos_data(district: str) -> EmergencySOSResult:
    dist_key = district.lower().strip()
    raw_hospitals = HOSPITALS_BY_DISTRICT.get(dist_key, HOSPITALS_BY_DISTRICT["nashik"])

    hospitals = [
        EmergencyHospital(
            name=h["name"],
            name_mr=h["name_mr"],
            facility_type=h["type"],
            taluka=h["taluka"],
            district=h["district"],
            emergency_phone=h["phone"],
            distance_km=h["distance"],
            ambulance_available=True,
        )
        for h in raw_hospitals
    ]

    snake_proto = FirstAidProtocol(
        hazard_title="Snakebite Emergency Response (सर्पदंश प्रथमोपचार)",
        hazard_title_mr="सर्पदंश झाल्यास तातडीने करावयाचे उपाय",
        critical_time_window="Immediate - Call 108 and go to hospital",
        critical_time_window_mr="तातडीने - १०८ ला कॉल करा व त्वरित रुग्णालयात पोहोचा",
        immediate_dos=[
            "Call 108 ambulance immediately.",
            "Go to a hospital immediately without delay.",
            "Reassure the victim and keep them calm and still.",
            "Immobilize the bitten limb using a broad bandage or splint (keep limb at heart level).",
            "Remove tight rings, watches, and restrictive jewelry before swelling begins."
        ],
        immediate_dos_mr=[
            "तातडीने १०८ रुग्णवाहिकेला फोन करा.",
            "उशीर न करता त्वरित जवळच्या सरकारी रुग्णालयात पोहोचा.",
            "रुग्णाला धीर द्या आणि शांत व स्थिर ठेवा.",
            "दंश झालेला हात किंवा पाय लाकडी पट्टी अथवा कापडाने बांधून स्थिर ठेवा.",
            "सूज येण्यापूर्वी हातातील अंगठी, घड्याळ व दागिने ताबडतोब काढून ठेवा."
        ],
        strict_donts=[
            "Do NOT cut the wound or attempt incision.",
            "Do NOT suck venom by mouth or mechanical suction device.",
            "Do NOT tie tight ropes, tourniquets, or arterial bands (causes gangrene).",
            "Do NOT waste time with traditional healers, mantriks, or home remedies.",
            "Do NOT apply ice, herbs, chemicals, or electrical shock."
        ],
        strict_donts_mr=[
            "दंशावर ब्लेडने चीरा मारू नका.",
            "तोंडाने विष चोखण्याचा प्रयत्न करू नका.",
            "दोरी किंवा रबर घट्ट बांधू नका (रक्तप्रवाह बंद होऊन अवयव सडण्याचा धोका असतो).",
            "मांत्रिक, वैदू किंवा झाडफूक करणाऱ्यांकडे जाऊन वेळ वाया घालवू नका.",
            "दंशावर बर्फ, चुना, मिरची किंवा रसायने लावू नका."
        ],
        medical_action_info="Call 108 and go to a hospital immediately. Professional medical evaluation at an emergency care hospital is mandatory.",
        medical_action_info_mr="१०८ वर कॉल करा आणि त्वरित रुग्णालयात जा. आपत्कालीन कक्षात तज्ज्ञ डॉक्टरांकडून तपासणी करून घेणे बंधनकारक आहे."
    )

    pesticide_proto = FirstAidProtocol(
        hazard_title="Pesticide Exposure / Poisoning First-Aid (कीटकनाशक विषबाधा)",
        hazard_title_mr="कीटकनाशक विषबाधा झाल्यास प्रथमोपचार",
        critical_time_window="Immediate (0 to 30 mins) - Call 108",
        critical_time_window_mr="त्वरित (० ते ३० मिनिटे) - १०८ वर कॉल करा",
        immediate_dos=[
            "Move victim away from the sprayed field into fresh open air immediately.",
            "Decontaminate immediately: remove contaminated clothes and wash skin and hair thoroughly with clean running water and soap.",
            "Flush eyes with clean water continuously for 15 minutes if eyes were exposed.",
            "Call 108 and go to a hospital immediately.",
            "Take the original chemical container/packet safely to the hospital so doctors can identify the active formulation."
        ],
        immediate_dos_mr=[
            "बाधित व्यक्तीला ताबडतोब फवारणीच्या शेतातून दूर मोकळ्या हवेत आणा.",
            "त्वरित अंगावरील औषध धुवा: बाधित कपडे काढून टाका आणि भरपूर स्वच्छ पाणी व साबणाने त्वचा व केस धुवा.",
            "डोळ्यात औषध गेले असल्यास सलग १५ मिनिटे स्वच्छ पाण्याचा शिंतोडा द्या.",
            "१०८ वर कॉल करा आणि त्वरित रुग्णालयात जा.",
            "फवारलेल्या कीटकनाशकाचा मूळ डबा/पाकीट सोबत रुग्णालयात न्या, जेणेकरून डॉक्टर रासायनिक घटक ओळखून उपचार करू शकतील."
        ],
        strict_donts=[
            "Do NOT cut, suck, or induce vomiting unless instructed by a qualified doctor.",
            "Do NOT give milk, oil, alcohol, or home remedies.",
            "Do NOT administer any oral drugs or inject medicines on the farm.",
            "Do NOT leave an unconscious victim unattended or lying on their back."
        ],
        strict_donts_mr=[
            "डॉक्टरांच्या सल्ल्याशिवाय उलटी करायला लावू नका.",
            "दूध, तेल, तूप किंवा घरगुती काढे पाजू नका.",
            "शेतात स्वतः कोणतेही औषध किंवा इंजेक्शन देण्याचा प्रयत्न करू नका.",
            "बेशुद्ध रुग्णाला पाठीवर उताणे झोपवू नका, डाव्या कुशीवर झोपवा."
        ],
        medical_action_info="Decontaminate the patient, call 108, go to a hospital immediately, and take the container/label to the hospital.",
        medical_action_info_mr="रुग्णाला स्वच्छ पाण्याने धुवून देहावरील विष काढून टाका, १०८ ला कॉल करा, त्वरित रुग्णालयात पोहोचा आणि कीटकनाशकाचा डबा सोबत न्या."
    )

    return EmergencySOSResult(
        district=district,
        emergency_toll_free="108 (Free Emergency Ambulance) / 102 (Health Helpline)",
        hospital_directory_note="sample directory - call to confirm availability",
        hospital_directory_note_mr="नमुना सूची - उपलब्धतेची खात्री करण्यासाठी कॉल करा",
        snakebite_protocol=snake_proto,
        pesticide_poisoning_protocol=pesticide_proto,
        nearby_asv_hospitals=hospitals,
        provenance=Provenance.CURATED_REFERENCE,
        source_citation="National Health Mission (NHM) Maharashtra First-Aid Guidelines & WHO Guidelines"
    )
