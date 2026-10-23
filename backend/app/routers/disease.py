from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.modules.disease.doctor import DiseaseDiagnosis, disease_doctor_service

router = APIRouter(prefix="/disease", tags=["crop-disease-doctor"])


class DiagnoseRequest(BaseModel):
    crop: Optional[str] = None
    symptom_description: Optional[str] = None
    image_base64: Optional[str] = None
    leaf_image_url: Optional[str] = None


@router.get("/catalog", response_model=List[DiseaseDiagnosis])
def get_disease_catalog():
    return disease_doctor_service.list_all()


@router.get("/{disease_id}", response_model=DiseaseDiagnosis)
def get_disease_detail(disease_id: str):
    diagnosis = disease_doctor_service.get_by_id(disease_id)
    if not diagnosis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Disease '{disease_id}' not found in catalog",
        )
    return diagnosis


@router.post("/diagnose", response_model=DiseaseDiagnosis)
def diagnose_crop_issue(payload: DiagnoseRequest):
    return disease_doctor_service.diagnose_by_crop_and_query(
        crop=payload.crop,
        query=payload.symptom_description
    )
