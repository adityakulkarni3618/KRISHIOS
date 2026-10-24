import pytest
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
    assert "IMD" in res.source_citation or "MPKV" in res.source_citation


def test_assistant_pest_disease_query():
    req = AssistantQueryRequest(
        query="कपाशीवर पांढरी माशी आणि बोंडअळीचा प्रादुर्भाव आहे",
        language="mr",
    )
    res = answer_krishi_query(req)
    assert res.suggested_tab == "doctor"
    assert "पिवळे चिकट सापळे" in res.response_mr


def test_assistant_insurance_query():
    req = AssistantQueryRequest(
        query="What is the process to claim PMFBY insurance for excessive rain?",
        language="en",
    )
    res = answer_krishi_query(req)
    assert res.suggested_tab == "insurance"
    assert "72" in res.response_text
    assert "14447" in res.response_text
