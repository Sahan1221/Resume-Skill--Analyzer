from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.auth_routes import get_current_user
from app.db.database import get_db
from app.db.models import User
from app.services.analysis_persistence_service import (
    build_analysis_history_response,
    build_analysis_response,
    get_analysis,
    get_analysis_history,
    save_analysis,
)
from app.services.analysis_service import analyze_resume


router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024


@router.post("/analysis")
async def create_analysis_endpoint(
    file: UploadFile = File(...),
    target_role: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a CV, analyze it, and persist the completed analysis
    for the authenticated user.
    """

    if not target_role.strip():
        raise HTTPException(
            status_code=400,
            detail="Target role is required.",
        )

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF files are supported.",
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="PDF file must be 5 MB or smaller.",
        )

    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded PDF is empty.",
        )

    try:
        result = analyze_resume(
            file_bytes=file_bytes,
            target_role=target_role.strip(),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    analysis_id = str(uuid4())

    try:
        save_analysis(
            db=db,
            analysis_id=analysis_id,
            target_role=target_role.strip(),
            result=result,
            user_id=current_user.user_id,
        )
    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save the analysis.",
        ) from exc

    return {
        "analysis_id": analysis_id,
        **result,
    }


@router.get("/analysis/history")
def get_analysis_history_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve the authenticated user's completed analysis history.
    """

    analyses = get_analysis_history(
        db=db,
        user_id=current_user.user_id,
    )

    return build_analysis_history_response(analyses)


@router.get("/analysis/{analysis_id}")
def get_analysis_endpoint(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve a previously completed analysis belonging
    to the authenticated user.
    """

    analysis = get_analysis(
        db=db,
        analysis_id=analysis_id,
        user_id=current_user.user_id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    return build_analysis_response(analysis)
