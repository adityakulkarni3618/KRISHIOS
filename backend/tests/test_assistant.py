from app.core.provenance import Provenance
from app.modules.assistant.krishi_mitra import (
    AssistantQueryRequest,
    answer_krishi_query,
)


def test_assistant_weather_spray_query():
    req = AssistantQueryRequest(
        query="आज फवारणी करू का?",
        language="mr",
    )
    res = answer_krishi_query(req)
    assert res.suggested_tab == "weather"
    assert "फवारणी" in res.response_mr
    assert res.audio_tts_script != ""
    assert "Open-Meteo" in res.source_citation or "MPKV" in res.source_citation
    assert res.provenance == Provenance.CURATED_REFERENCE


def test_assistant_pest_disease_query():
    req = AssistantQueryRequest(
        query="कपाशीवर पांढरी माशी आणि बोंडअळीचा प्रादुर्भाव आहे",
        language="mr",
    )
    res = answer_krishi_query(req)
    assert res.suggested_tab == "doctor"
    assert "पिवळे चिकट सापळे" in res.response_mr
    assert res.provenance == Provenance.CURATED_REFERENCE


def test_assistant_insurance_query():
    req = AssistantQueryRequest(
        query="What is the process to claim PMFBY insurance for excessive rain?",
        language="en",
    )
    res = answer_krishi_query(req)
    assert res.suggested_tab == "insurance"
    assert "72" in res.response_text
    assert "14447" in res.response_text
    assert res.provenance == Provenance.CURATED_REFERENCE


def test_assistant_unmatched_query_returns_kvk_contact():
    req_en = AssistantQueryRequest(
        query="Can I trade cryptocurrency on Mars?",
        language="en",
    )
    res_en = answer_krishi_query(req_en)
    assert "I don't have an answer" in res_en.response_text
    assert "KVK" in res_en.response_text
    assert "1800-180-1551" in res_en.response_text
    assert res_en.provenance == Provenance.CURATED_REFERENCE

    req_mr = AssistantQueryRequest(
        query="अवकाशातील रॉकेट शेतात कसे उतरवायचे?",
        language="mr",
    )
    res_mr = answer_krishi_query(req_mr)
    assert "माझ्याकडे याचे अधिकृत उत्तर नाही" in res_mr.response_mr
    assert "KVK" in res_mr.response_mr or "कृषी विज्ञान केंद्र" in res_mr.response_mr
    assert "१८००-१८०-१५५१" in res_mr.response_mr
    assert res_mr.provenance == Provenance.CURATED_REFERENCE


def test_assistant_response_has_no_ai_text():
    import json
    import re
    queries = [
        ("आज फवारणी करू का?", "mr"),
        ("कपाशीवर बोंडअळीचा प्रादुर्भाव आहे", "mr"),
        ("What is PMFBY crop insurance?", "en"),
        ("General question about Mars rockets", "en"),
    ]
    for q, lang in queries:
        req = AssistantQueryRequest(query=q, language=lang)
        res = answer_krishi_query(req)
        raw = res.model_dump_json()
        assert not re.search(r"\bAI\b", raw), f"Found 'AI' text in assistant response for query '{q}': {raw}"
