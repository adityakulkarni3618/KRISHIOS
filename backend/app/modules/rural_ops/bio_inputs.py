"""Zero-Cost DIY Desi Bio-Inputs & Kitchen Formulations ("Ghar-cha-Doctor").

Provides exact, hand-calculated chemical-free formulations grounded in Subhash Palekar
Natural Farming (SPNF) and Dr. Panjabrao Deshmukh Krishi Vidyapeeth (PDKV) organic research.
Saves smallholders thousands of rupees on synthetic tonics and toxic sprays.
"""
from typing import Dict, List
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class BioInputRecipe(BaseModel):
    id: str
    name: str
    name_mr: str
    category: str             # "Microbial Soil Inoculant", "Bio-Pesticide", "Bio-Fungicide"
    target_problems: List[str]
    target_problems_mr: List[str]
    preparation_time_days: int
    shelf_life_days: int
    cost_per_acre_inr: float  # Almost ₹0 to ₹100 using farm-available materials
    ingredients: List[str]
    ingredients_mr: List[str]
    step_by_step_instructions: List[str]
    step_by_step_instructions_mr: List[str]
    dosage_and_application: str
    dosage_and_application_mr: str
    key_benefit: str
    key_benefit_mr: str
    provenance: Provenance = Provenance.HISTORICAL
    source_citation: str


RECIPES: List[BioInputRecipe] = [
    BioInputRecipe(
        id="jeevamrut",
        name="Jeevamrut (Liquid Microbial Culture)",
        name_mr="जीवामृत (जिवाणूंचे अमृत - सेंद्रिय टॉनिक)",
        category="Microbial Soil Inoculant & Growth Booster",
        target_problems=["Poor soil biology", "Stunted vegetative growth", "High chemical fertilizer cost"],
        target_problems_mr=["मातीतील जिवाणूंची कमतरता", "पिकाची खुंटलेली वाढ", "खतांचा भरमसाठ खर्च"],
        preparation_time_days=4,
        shelf_life_days=10,
        cost_per_acre_inr=50.0,
        ingredients=[
            "10 kg Fresh Indigenous Cow Dung (देशी गायीचे ताजे शेण)",
            "5 to 10 Litres Cow Urine (गोमूत्र)",
            "2 kg Jaggery / Gur (गूळ)",
            "2 kg Besan / Gram Flour (बेसन / कडधान्य पीठ)",
            "Handful of uncultivated soil from farm bund / banyan tree (बांधावरील जिवंत माती)",
            "200 Litres Clean Water (पाणी)"
        ],
        ingredients_mr=[
            "१० किलो देशी गायीचे ताजे शेण",
            "५ ते १० लिटर गोमूत्र",
            "२ किलो सेंद्रिय काळा गूळ",
            "२ किलो डाळीचे पीठ (बेसन)",
            "मूठभर बांधावरील किंवा वडाच्या झाडाखालची माती",
            "२०० लिटर स्वच्छ पाणी"
        ],
        step_by_step_instructions=[
            "1. Take 200L water in a plastic drum kept under shade.",
            "2. Add 10kg dung and urine, mix well with a wooden stick in clockwise direction.",
            "3. Dissolve jaggery in a bucket of water and add along with gram flour and bund soil.",
            "4. Stir for 2 minutes clockwise twice a day (morning and evening).",
            "5. Cover with a wet gunny bag. Fermentation completes in 48-72 hours in summer, 4-5 days in winter."
        ],
        step_by_step_instructions_mr=[
            "१. २०० लिटर क्षमतेच्या प्लास्टिक ड्रममध्ये सावलीत पाणी घ्या.",
            "२. त्यामध्ये १० किलो शेण आणि गोमूत्र टाकून लाकडी काठीने घड्याळाच्या काट्याच्या दिशेने ढवळा.",
            "३. वेगळ्या बादलीत गूळ विरघळवून टाका, सोबत बेसन व मूठभर बांधाची माती मिसळा.",
            "४. दिवसातून दोन वेळा (सकाळी व संध्याकाळी) २ मिनिटे काठीने एकाच दिशेने ढवळा.",
            "५. ड्रमवर गोणपाट झाकून ठेवा. उन्हाळ्यात ४८ तास व हिवाळ्यात ४ दिवसांत जीवामृत तयार होते."
        ],
        dosage_and_application="Apply 200 Litres per acre with irrigation water (flood/drip) every 15-20 days. Or filter and spray @ 10% solution (1.5L per 15L pump).",
        dosage_and_application_mr="प्रति एकर २०० लिटर जीवामृत पाण्यासोबत (पाटपाणी अथवा ठिबक द्वारे) दर १५-२० दिवसांनी द्यावे. अथवा कापडाने गाळून १.५ लिटर प्रति १५ लिटर पंपातून फवारावे.",
        key_benefit="Multiplies beneficial soil bacteria by millions, unlocks bonded phosphorus, and triggers earthworm activity.",
        key_benefit_mr="जमिनीतील उपयुक्त जिवाणू अब्जावधींनी वाढवतो, पिकांना अन्नद्रव्ये सहज मिळवून देतो व गांडुळांची संख्या वाढवतो.",
        provenance=Provenance.HISTORICAL,
        source_citation="Subhash Palekar Natural Farming (SPNF) & PDKV Akola Organic Protocol"
    ),
    BioInputRecipe(
        id="dashparni_ark",
        name="Dashparni Ark (10-Leaf Botanical Insecticide)",
        name_mr="दशपर्णी अर्क (१० वनस्पतींचा कीडनाशक अर्क)",
        category="Broad-Spectrum Botanical Bio-Pesticide",
        target_problems=["Sucking pests", "Bollworms", "Caterpillars", "Aphids / Jassids / Thrips"],
        target_problems_mr=["पांढरी माशी", "बोंडअळी", "तुडतुडे", "मावा", "नागअळी"],
        preparation_time_days=35,
        shelf_life_days=180,
        cost_per_acre_inr=80.0,
        ingredients=[
            "Neem leaves 5kg, Karanj 2kg, Custard Apple (Sitaphal) 2kg, Castor (Erandi) 2kg, Calotropis (Rui) 2kg, Lantana (Ghaneri) 2kg, Papaya leaves 2kg, Guava 2kg, Bael leaves 2kg, Datura 2kg",
            "Cow urine 10 Litres & Fresh cow dung 2kg",
            "200 Litres Water"
        ],
        ingredients_mr=[
            "कडुनिंब ५ किलो, करंज २ किलो, सीताफळ २ किलो, एरंडी २ किलो, रुई २ किलो, घाणेरी २ किलो, पपई २ किलो, पेरू २ किलो, बेल २ किलो, धोत्रा २ किलो (सर्व पाने बारीक चिरून)",
            "१० लिटर गोमूत्र व २ किलो ताजे शेण",
            "२०० लिटर पाणी"
        ],
        step_by_step_instructions=[
            "1. Chop all 10 types of leaves and place in a 200L drum.",
            "2. Add cow urine and cow dung with 200L water.",
            "3. Stir clockwise daily for 2 minutes and cover with gunny bag under dense shade.",
            "4. Allow anaerobic fermentation for 30 to 40 days.",
            "5. Filter the dark aromatic extract through a clean cotton cloth."
        ],
        step_by_step_instructions_mr=[
            "१. दहाही प्रकारची पाने बारीक तुकडे करून ड्रममध्ये टाका.",
            "२. त्यामध्ये गोमूत्र, शेण व पाणी घालून नीट ढवळा.",
            "३. दररोज एकदा काठीने ढवळून गोणपाटाने सावलीत झाकून ठेवा.",
            "४. ३० ते ४० दिवस सडल्यानंतर अर्क तयार होतो.",
            "५. सुती कापडाने स्वच्छ गाळून बाटल्यांत भरून ठेवा. हा अर्क ६ महिने टिकतो."
        ],
        dosage_and_application="Use 200 ml to 250 ml extract per 15-litre knapsack pump (1.5% to 2% dilution). Spray during early morning.",
        dosage_and_application_mr="१५ लिटरच्या पंपासाठी २०० ते २५० मिली अर्क मिसळून सकाळी फवारणी करावी. रासायनिक औषधांसारखाच तात्काळ प्रभाव पडतो.",
        key_benefit="Strong alkaloids and bitter glycosides repel and kill chewing & sucking caterpillars without harming honeybees.",
        key_benefit_mr="अल्कलॉइड्समुळे अळ्या खाणे बंद करतात व रसशोषक किडींचे नियंत्रण होते. मधमाशांना कोणताही अपाय होत नाही.",
        provenance=Provenance.HISTORICAL,
        source_citation="MPKV Rahuri Organic Farming Research Directorate & ICAR-NCIPM"
    ),
    BioInputRecipe(
        id="sour_buttermilk",
        name="Sour Buttermilk / Khatte Taak (Fungicide)",
        name_mr="आंबट ताक व तांब्याची पट्टी (नैसर्गिक बुरशीनाशक)",
        category="Bio-Fungicide & Mildew Eradicator",
        target_problems=["Downy Mildew", "Powdery Mildew", "Leaf Blight", "Rust in vegetables & grapes"],
        target_problems_mr=["डाऊनी मिल्ड्यू (केवडा)", "पावडरी मिल्ड्यू (भुरी)", "करपा रोग", "फळकुज"],
        preparation_time_days=7,
        shelf_life_days=30,
        cost_per_acre_inr=40.0,
        ingredients=[
            "5 Litres Sour Indigenous Cow Buttermilk / Curd (आंबट ताक)",
            "1 Copper plate / wire (तांब्याचा तुकडा किंवा जुनी तांब्याची तार)",
            "150 Litres Water"
        ],
        ingredients_mr=[
            "५ लिटर देशी गाईचे आंबट ताक",
            "१ तांब्याची पट्टी किंवा तांब्याची स्वच्छ तार",
            "१५० लिटर पाणी"
        ],
        step_by_step_instructions=[
            "1. Take 5 Litres sour buttermilk in an earthen pot or plastic container.",
            "2. Immerse a clean copper plate/wire inside.",
            "3. Keep undisturbed in shade for 7 to 10 days until a greenish-blue copper-lactate film develops.",
            "4. Remove the copper plate and stir thoroughly."
        ],
        step_by_step_instructions_mr=[
            "१. मातीच्या मडक्यात अथवा प्लास्टिक बादलीत ५ लिटर आंबट ताक घ्या.",
            "२. त्यामध्ये तांब्याची पट्टी किंवा तार बुडवून ठेवा.",
            "३. ७ ते १० दिवस तसेच ठेवा. ताकावर हिरवट-निळसर तांब्याचे क्षार (Copper Lactate) तयार होतात.",
            "४. तांब्याची पट्टी काढून ताक गाळून घ्या."
        ],
        dosage_and_application="500 ml fermented copper-buttermilk per 15L knapsack pump. Spray at first sign of fungal white/yellow spots.",
        dosage_and_application_mr="१५ लिटरच्या पंपात ५०० मिली गाळलेले ताक मिसळून फवारावे. कांदा, टोमॅटो, द्राक्षे व सोयाबीनवरील बुरशी नष्ट होते.",
        key_benefit="Naturally generates organic copper lactate which penetrates fungal cell walls better than chemical Copper Oxychloride.",
        key_benefit_mr="नैसर्गिक कॉपर लॅक्टेट तयार होते, जे रासायनिक बुरशीनाशकांपेक्षा स्वस्त व पानांसाठी सुरक्षित असते.",
        provenance=Provenance.HISTORICAL,
        source_citation="Vasantrao Naik Marathwada Krishi Vidyapeeth (VNMKV) Department of Plant Pathology"
    )
]


def list_bio_input_recipes() -> List[BioInputRecipe]:
    return RECIPES


def get_recipe_by_id(recipe_id: str) -> BioInputRecipe:
    match = next((r for r in RECIPES if r.id == recipe_id), None)
    return match if match else RECIPES[0]
