from fastapi import APIRouter

from app.modules.assistant.krishi_mitra import (
    AssistantQueryRequest,
    AssistantQueryResponse,
    answer_krishi_query,
)

router = APIRouter(prefix="/assistant", tags=["ai-krishi-mitra-assistant"])


@router.post("/query", response_model=AssistantQueryResponse)
def query_krishi_mitra(payload: AssistantQueryRequest):
    return answer_krishi_query(payload)
