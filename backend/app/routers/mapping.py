from fastapi import APIRouter

from app.modules.mapping.engine import CAPABILITIES, MappingResult, ProblemStatementIn, classify

router = APIRouter(prefix="/mapping", tags=["problem-statement-mapping"])


@router.post("/classify", response_model=MappingResult)
def classify_statement(body: ProblemStatementIn):
    return classify(body)


@router.get("/capabilities")
def capabilities():
    return CAPABILITIES
