from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.db.models import Analysis, Role


def save_analysis(
    db: Session,
    analysis_id: str,
    target_role: str,
    result: dict[str, Any],
    user_id: int,
) -> Analysis:
    """
    Persist a completed analysis result for the authenticated user.

    The original uploaded CV and extracted resume_text are intentionally
    not stored in the database.
    """

    role_name = target_role.strip()

    role = db.scalar(
        select(Role).where(Role.role_name == role_name)
    )

    if role is None:
        role = Role(
            role_name=role_name,
            description=result.get("role_requirements", {}).get(
                "description",
                "",
            ),
        )
        db.add(role)
        db.flush()

    skill_comparison = result.get("skill_comparison", {})

    analysis = Analysis(
        analysis_id=analysis_id,
        user_id=user_id,
        role_id=role.role_id,
        overall_score=round(
            float(
                skill_comparison.get(
                    "match_percentage",
                    0,
                )
            )
        ),
        resume_data=result.get("resume_data"),
        role_requirements=result.get("role_requirements"),
        skill_comparison=result.get("skill_comparison"),
        requirement_evidence=result.get("requirement_evidence"),
        ats_analysis=result.get("ats_analysis"),
        resume_quality=result.get("resume_quality"),
        improvement_recommendations=result.get(
            "improvement_recommendations"
        ),
        learning_recommendations=result.get(
            "learning_recommendations"
        ),
        project_recommendations=result.get(
            "project_recommendations"
        ),
        market_insights=result.get("market_insights"),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


def get_analysis(
    db: Session,
    analysis_id: str,
    user_id: int,
) -> Analysis | None:
    """
    Retrieve an analysis belonging to the authenticated user.
    """

    return db.scalar(
        select(Analysis).where(
            Analysis.analysis_id == analysis_id,
            Analysis.user_id == user_id,
        )
    )


def get_analysis_history(
    db: Session,
    user_id: int,
) -> list[Analysis]:
    """
    Retrieve completed analyses belonging only to the authenticated user,
    newest first.
    """

    return list(
        db.scalars(
            select(Analysis)
            .options(joinedload(Analysis.role))
            .where(Analysis.user_id == user_id)
            .order_by(Analysis.created_at.desc())
        ).all()
    )


def build_analysis_response(
    analysis: Analysis,
) -> dict[str, Any]:
    """
    Convert a persisted Analysis database record back into
    the response format expected by the frontend.
    """

    return {
        "analysis_id": analysis.analysis_id,
        "status": "completed",
        "role": analysis.role.role_name,
        "created_at": (
            analysis.created_at.isoformat() + "Z"
            if analysis.created_at
            else None
        ),
        "resume_text": "",
        "resume_data": analysis.resume_data or {},
        "role_requirements": analysis.role_requirements or {},
        "skill_comparison": analysis.skill_comparison or {},
        "requirement_evidence": analysis.requirement_evidence or {},
        "ats_analysis": analysis.ats_analysis or {},
        "resume_quality": analysis.resume_quality or {},
        "improvement_recommendations": (
            analysis.improvement_recommendations or []
        ),
        "learning_recommendations": (
            analysis.learning_recommendations or []
        ),
        "project_recommendations": (
            analysis.project_recommendations or []
        ),
        "market_insights": analysis.market_insights or [],
    }


def build_analysis_history_response(
    analyses: list[Analysis],
) -> list[dict[str, Any]]:
    """
    Convert persisted analyses into the lightweight records required
    by the History page.
    """

    history: list[dict[str, Any]] = []

    for analysis in analyses:
        skill_comparison = analysis.skill_comparison or {}

        history.append(
            {
                "analysis_id": analysis.analysis_id,
                "status": "completed",
                "role": analysis.role.role_name,
                "created_at": (
                    analysis.created_at.isoformat() + "Z"
                    if analysis.created_at
                    else None
                ),
                "overall_score": analysis.overall_score,
                "gap_count": int(
                    skill_comparison.get("gap_count", 0)
                    or 0
                ),
            }
        )

    return history
