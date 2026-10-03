from uuid import uuid4

from app.db.database import SessionLocal
from app.services.analysis_persistence_service import (
    build_analysis_response,
    get_analysis,
    save_analysis,
)


def make_analysis_result() -> dict:
    return {
        "resume_text": (
            "This resume text should not be persisted."
        ),
        "resume_data": {
            "name": "Alex Perera",
            "profile": "Software engineering student.",
            "education": [],
            "skills": ["Python", "SQL", "Git"],
            "projects": [],
            "experience": [],
            "courses_certifications": [],
            "languages": [],
        },
        "role_requirements": {
            "description": "Software engineering internship.",
            "skills": [
                {
                    "name": "Python",
                    "category": "Programming",
                    "importance": "high",
                }
            ],
            "requirements": [
                "Understanding of programming."
            ],
        },
        "skill_comparison": {
            "matched_skills": [
                {
                    "name": "Python",
                    "importance": "high",
                    "evidence": ["Python"],
                }
            ],
            "skill_gaps": [],
            "matched_count": 1,
            "gap_count": 0,
            "total_role_skills": 1,
            "match_percentage": 100.0,
        },
        "requirement_evidence": {
            "results": [],
            "supported_count": 1,
            "partial_count": 0,
            "limited_count": 0,
            "evidence_percentage": 100.0,
        },
        "ats_analysis": {
            "keyword_analysis": {
                "match_percentage": 100.0,
            },
            "findings": [],
        },
        "resume_quality": {
            "findings": [],
        },
        "improvement_recommendations": [
            {
                "type": "resume",
                "title": "Keep project descriptions measurable",
                "description": "Use measurable outcomes.",
                "priority": "medium",
            }
        ],
        "learning_recommendations": [
            {
                "skill": "Python",
                "title": "Python Course",
                "provider": "Example Provider",
                "url": "https://example.com/python",
                "type": "course",
                "cost_type": "free",
            }
        ],
        "project_recommendations": [
            {
                "skill": "Python",
                "title": "Python Project",
                "description": "Build a practical Python application.",
                "difficulty": "medium",
            }
        ],
        "market_insights": [
            {
                "title": "Common Python Usage",
                "description": (
                    "Python is commonly used in software roles."
                ),
            }
        ],
    }


def test_analysis_can_be_saved_to_sqlite():
    """Verify that an analysis can be persisted successfully."""

    analysis_id = str(uuid4())
    target_role = "Software Engineering Intern"
    user_id = 1
    result = make_analysis_result()

    db = SessionLocal()

    try:
        saved = save_analysis(
            db=db,
            analysis_id=analysis_id,
            target_role=target_role,
            result=result,
            user_id=user_id,
        )

        assert saved is not None
        assert saved.analysis_id == analysis_id
        assert saved.user_id == user_id

        # Role is normalized as its own database entity.
        assert saved.role is not None
        assert saved.role.role_name == target_role

        assert saved.overall_score == 100

    finally:
        db.close()


def test_saved_analysis_can_be_retrieved_by_analysis_id():
    """Verify that a persisted analysis can be retrieved."""

    analysis_id = str(uuid4())
    target_role = "Software Engineering Intern"
    user_id = 1
    result = make_analysis_result()

    db = SessionLocal()

    try:
        save_analysis(
            db=db,
            analysis_id=analysis_id,
            target_role=target_role,
            result=result,
            user_id=user_id,
        )

        retrieved = get_analysis(
            db=db,
            analysis_id=analysis_id,
            user_id=user_id,
        )

        assert retrieved is not None
        assert retrieved.analysis_id == analysis_id
        assert retrieved.user_id == user_id

        # target_role is represented through the Role relationship.
        assert retrieved.role is not None
        assert retrieved.role.role_name == target_role

    finally:
        db.close()


def test_analysis_cannot_be_retrieved_by_different_user():
    """Verify that analysis ownership is enforced."""

    analysis_id = str(uuid4())
    target_role = "Software Engineering Intern"
    owner_user_id = 1
    different_user_id = 2
    result = make_analysis_result()

    db = SessionLocal()

    try:
        save_analysis(
            db=db,
            analysis_id=analysis_id,
            target_role=target_role,
            result=result,
            user_id=owner_user_id,
        )

        retrieved = get_analysis(
            db=db,
            analysis_id=analysis_id,
            user_id=different_user_id,
        )

        assert retrieved is None

    finally:
        db.close()


def test_original_cv_and_resume_text_are_not_persisted():
    """
    Verify that the original CV and extracted resume text
    are not stored in the Analysis database record.
    """

    analysis_id = str(uuid4())
    target_role = "Software Engineering Intern"
    user_id = 1
    result = make_analysis_result()

    db = SessionLocal()

    try:
        saved = save_analysis(
            db=db,
            analysis_id=analysis_id,
            target_role=target_role,
            result=result,
            user_id=user_id,
        )

        assert saved is not None

        # Analysis intentionally has no resume_text field.
        assert not hasattr(saved, "resume_text")

        # The persisted JSON resume_data is structured resume data,
        # not the original extracted resume text.
        assert saved.resume_data is not None
        assert "resume_text" not in saved.resume_data

    finally:
        db.close()


def test_persisted_result_contains_frontend_required_sections():
    """
    Verify that the persisted analysis response contains all
    major sections required by the frontend.
    """

    analysis_id = str(uuid4())
    target_role = "Software Engineering Intern"
    user_id = 1
    result = make_analysis_result()

    db = SessionLocal()

    try:
        saved = save_analysis(
            db=db,
            analysis_id=analysis_id,
            target_role=target_role,
            result=result,
            user_id=user_id,
        )

        response = build_analysis_response(saved)

        required_sections = [
            "resume_data",
            "role_requirements",
            "skill_comparison",
            "requirement_evidence",
            "ats_analysis",
            "resume_quality",
            "improvement_recommendations",
            "learning_recommendations",
            "project_recommendations",
            "market_insights",
        ]

        for section in required_sections:
            assert section in response, (
                f"Missing required frontend section: {section}"
            )

        assert response["analysis_id"] == analysis_id
        assert response["role"] == target_role
        assert response["status"] == "completed"

    finally:
        db.close()


def test_missing_analysis_returns_none():
    """Verify that an unknown analysis ID returns None."""

    db = SessionLocal()

    try:
        result = get_analysis(
            db=db,
            analysis_id="99999999-9999-9999-9999-999999999999",
            user_id=1,
        )

        assert result is None

    finally:
        db.close()