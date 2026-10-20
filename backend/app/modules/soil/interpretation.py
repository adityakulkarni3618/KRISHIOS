from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class SoilMetricsIn(BaseModel):
    ph: float | None = Field(default=None, ge=3.0, le=11.0)
    organic_carbon_pct: float | None = Field(default=None, ge=0.0, le=20.0)
    nitrogen_kg_ha: float | None = Field(default=None, ge=0.0, le=1000.0)
    phosphorus_kg_ha: float | None = Field(default=None, ge=0.0, le=200.0)
    potassium_kg_ha: float | None = Field(default=None, ge=0.0, le=1000.0)


class ParameterEvaluation(BaseModel):
    parameter: str
    value: float
    unit: str
    rating: str  # Very Low, Low, Medium, Optimal, High, Alkaline, Acidic
    scientific_status: str
    recommendation: str


class SoilInterpretationResult(BaseModel):
    summary_rating: str
    evaluations: list[ParameterEvaluation]
    overall_agronomic_advice: list[str]
    provenance: Provenance
    citation: str
    official_reference: str


def evaluate_soil_health(metrics: SoilMetricsIn) -> SoilInterpretationResult:
    evaluations: list[ParameterEvaluation] = []
    advice: list[str] = []

    # 1. pH Evaluation
    if metrics.ph is not None:
        ph = metrics.ph
        if ph < 5.5:
            rating = "Strongly Acidic"
            status = "Aluminium and manganese toxicity risk; phosphorus fixation high."
            rec = "Apply agricultural lime (CaCO3) or dolomite based on lime requirement test before monsoon sowing."
            advice.append("Acidic soil: Liming required to neutralize acidity and unlock fixed phosphorus.")
        elif 5.5 <= ph < 6.5:
            rating = "Moderately Acidic"
            status = "Slight acidity; suitable for some crops but may restrict sensitive legumes."
            rec = "Incorporate well-decomposed FYM and rock phosphate; apply light dosage of lime if cultivating pulses."
        elif 6.5 <= ph <= 7.5:
            rating = "Optimal (Neutral)"
            status = "Ideal soil reaction range for maximum availability of essential macro and micronutrients."
            rec = "Maintain current balanced fertilizer and organic matter application practices."
            advice.append("Soil pH is optimal: Maximizes fertilizer use efficiency.")
        elif 7.5 < ph <= 8.5:
            rating = "Moderately Alkaline / Calcareous"
            status = "Common in Maharashtra Vertisols (black soils); potential zinc and iron micronutrient deficiency."
            rec = "Apply elemental sulfur (50-100 kg/ha) or press mud; supplement with chelated zinc (Zn-EDTA) foliar spray."
            advice.append("Calcareous soil: Monitor crops for iron/zinc chlorosis; avoid excess lime-containing inputs.")
        else:
            rating = "Strongly Alkaline / Sodic"
            status = "High exchangeable sodium percentage (ESP); poor soil aeration, water infiltration, and crusting."
            rec = "Apply agricultural gypsum based on gypsum requirement (GR); ensure deep drainage and green manuring with Dhaincha."
            advice.append("Sodic soil alert: Gypsum application and drainage necessary to displace toxic sodium.")

        evaluations.append(
            ParameterEvaluation(
                parameter="Soil Reaction (pH)",
                value=ph,
                unit="pH scale",
                rating=rating,
                scientific_status=status,
                recommendation=rec,
            )
        )

    # 2. Organic Carbon (OC %)
    if metrics.organic_carbon_pct is not None:
        oc = metrics.organic_carbon_pct
        if oc < 0.50:
            rating = "Low (<0.50%)"
            status = "Severe organic matter deficiency; low microbial activity and poor water retention."
            rec = "Incorporate 10-15 tonnes/ha of farmyard manure (FYM), vermicompost, or practice green manuring with Sunn hemp."
            advice.append("Low organic carbon: Build soil organic matter to improve drought resilience and fertilizer uptake.")
        elif 0.50 <= oc <= 0.75:
            rating = "Medium (0.50-0.75%)"
            status = "Moderate organic carbon level typical of tropical Deccan plateau soils."
            rec = "Apply 5-8 tonnes/ha organic manure annually; practice crop residue recycling to sustain levels."
        else:
            rating = "High (>0.75%)"
            status = "Healthy organic carbon reserve supporting robust beneficial microbial biodiversity."
            rec = "Continue organic amendments and minimum tillage practices."
            advice.append("High organic carbon: Excellent biological soil health.")

        evaluations.append(
            ParameterEvaluation(
                parameter="Organic Carbon (OC)",
                value=oc,
                unit="%",
                rating=rating,
                scientific_status=status,
                recommendation=rec,
            )
        )

    # 3. Available Nitrogen (kg/ha)
    if metrics.nitrogen_kg_ha is not None:
        n = metrics.nitrogen_kg_ha
        if n < 280:
            rating = "Low (<280 kg/ha)"
            status = "Nitrogen deficit; stunts vegetative growth and causes yellowing of older leaves."
            rec = "Apply recommended dose of nitrogen (RDN) + 25% extra via split applications of urea or neem-coated urea."
        elif 280 <= n <= 560:
            rating = "Medium (280-560 kg/ha)"
            status = "Adequate nitrogen pool for general field crops."
            rec = "Follow state university package of practices (POP) recommended dosage for the targeted crop."
        else:
            rating = "High (>560 kg/ha)"
            status = "High nitrogen; risk of excessive vegetative growth, lodging, and pest susceptibility."
            rec = "Reduce chemical nitrogen application by 20-25% to avoid pest buildup and leaching losses."

        evaluations.append(
            ParameterEvaluation(
                parameter="Available Nitrogen (N)",
                value=n,
                unit="kg/ha",
                rating=rating,
                scientific_status=status,
                recommendation=rec,
            )
        )

    # 4. Available Phosphorus (kg/ha)
    if metrics.phosphorus_kg_ha is not None:
        p = metrics.phosphorus_kg_ha
        if p < 10:
            rating = "Low (<10 kg/ha)"
            status = "Poor root development and delayed flowering."
            rec = "Apply Single Super Phosphate (SSP) or DAP as basal dose; use PSB (Phosphate Solubilizing Bacteria) seed treatment."
        elif 10 <= p <= 25:
            rating = "Medium (10-25 kg/ha)"
            status = "Sufficient available phosphorus for moderate yielding targets."
            rec = "Apply recommended basal dose of phosphatic fertilizer."
        else:
            rating = "High (>25 kg/ha)"
            status = "High phosphorus reserve."
            rec = "Omit or reduce phosphorus application for current season; focus on micronutrient balance."

        evaluations.append(
            ParameterEvaluation(
                parameter="Available Phosphorus (P2O5)",
                value=p,
                unit="kg/ha",
                rating=rating,
                scientific_status=status,
                recommendation=rec,
            )
        )

    # 5. Available Potassium (kg/ha)
    if metrics.potassium_kg_ha is not None:
        k = metrics.potassium_kg_ha
        if k < 140:
            rating = "Low (<140 kg/ha)"
            status = "Low drought tolerance, weak stems, and poor grain filling."
            rec = "Apply Muriate of Potash (MOP) at basal or split stages."
        elif 140 <= k <= 280:
            rating = "Medium (140-280 kg/ha)"
            status = "Standard potassium fertility level."
            rec = "Apply standard recommended potassium dosage."
        else:
            rating = "High (>280 kg/ha)"
            status = "Rich in potassium; common in Maharashtra black soils (smectite-rich clays)."
            rec = "Maintenance dose only; avoid luxury consumption."

        evaluations.append(
            ParameterEvaluation(
                parameter="Available Potassium (K2O)",
                value=k,
                unit="kg/ha",
                rating=rating,
                scientific_status=status,
                recommendation=rec,
            )
        )

    summary = "Balanced Soil Health" if len(evaluations) > 0 and all("Optimal" in e.rating or "Medium" in e.rating or "High" in e.rating for e in evaluations) else "Soil Amendment / Nutrient Management Advised"

    return SoilInterpretationResult(
        summary_rating=summary,
        evaluations=evaluations,
        overall_agronomic_advice=advice or ["Soil parameters within acceptable agronomic ranges."],
        provenance=Provenance.ESTIMATED,
        citation="ICAR - Indian Institute of Soil Science (IISS) & Soil Health Card Scheme Norms (DAC&FW, Govt. of India)",
        official_reference="https://soilhealth.dac.gov.in/",
    )
