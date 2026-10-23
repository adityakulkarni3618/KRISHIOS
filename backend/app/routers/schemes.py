from fastapi import APIRouter, HTTPException, Query, status

from app.modules.schemes.catalog import GovernmentScheme, schemes_service

router = APIRouter(prefix="/schemes", tags=["government-schemes"])


@router.get("", response_model=list[GovernmentScheme])
def list_government_schemes(
    category: str | None = Query(default=None, description="Category filter (e.g. Direct Income, Water & Irrigation)"),
    search: str | None = Query(default=None, description="Search term in scheme title or description"),
):
    return schemes_service.list_schemes(category=category, search=search)


@router.get("/categories")
def list_categories():
    return {"categories": schemes_service.get_categories()}


@router.get("/{scheme_id}", response_model=GovernmentScheme)
def get_government_scheme(scheme_id: str):
    scheme = schemes_service.get_scheme(scheme_id)
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme '{scheme_id}' not found in catalog",
        )
    return scheme
