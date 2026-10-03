from uuid import uuid4

import jwt
from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from app.api.auth_routes import get_current_user
from app.core.config import settings
from app.db.database import get_db
from app.db.models import User
from app.main import app
from app.services.analysis_persistence_service import get_analysis
from app.services.analysis_service import analyze_resume
from app.services.auth_service import (
    JWT_ALGORITHM,
    create_access_token,
    hash_password,
)


def make_test_user() -> User:
    """Create an in-memory user object for API authentication tests."""

    return User(
        user_id=1,
        name="Test User",
        email=f"test-{uuid4()}@example.com",
        password_hash=hash_password("TestPassword123!"),
    )


def make_analysis_result() -> dict:
    """Create a minimal fake analysis result for the API test."""

    return {
        "resume_data": {
            "name": "Test User",
            "profile": "Software engineering student.",
            "education": [],
            "skills": ["Python"],
            "projects": [],
            "experience": [],
            "courses_certifications": [],
            "languages": [],
        },
        "role_requirements": {
            "description": "Software engineering internship.",
            "skills": [],
            "requirements": [],
        },
        "skill_comparison": {
            "matched_skills": [],
            "skill_gaps": [],
            "matched_count": 0,
            "gap_count": 0,
            "total_role_skills": 0,
            "match_percentage": 0.0,
        },
        "requirement_evidence": {
            "results": [],
            "supported_count": 0,
            "partial_count": 0,
            "limited_count": 0,
            "evidence_percentage": 0.0,
        },
        "ats_analysis": {
            "keyword_analysis": {
                "match_percentage": 0.0,
            },
            "findings": [],
        },
        "resume_quality": {
            "findings": [],
        },
        "improvement_recommendations": [],
        "learning_recommendations": [],
        "project_recommendations": [],
        "market_insights": [],
    }


def test_get_analysis_requires_authentication():
    """Verify that analysis retrieval requires authentication."""

    client = TestClient(app)

    response = client.get(
        "/api/analysis/"
        "99999999-9999-9999-9999-999999999999"
    )

    assert response.status_code == 401

    body = response.json()

    assert body["detail"] == "Not authenticated"


def test_get_analysis_rejects_invalid_jwt():
    """Verify that an invalid JWT is rejected."""

    client = TestClient(app)

    response = client.get(
        "/api/analysis/"
        "99999999-9999-9999-9999-999999999999",
        headers={
            "Authorization": "Bearer invalid-token"
        },
    )

    assert response.status_code == 401


def test_get_analysis_rejects_expired_jwt():
    """Verify that an expired JWT is rejected."""

    client = TestClient(app)

    now = datetime.now(timezone.utc)

    expired_payload = {
        "sub": "1",
        "iat": now - timedelta(hours=2),
        "exp": now - timedelta(minutes=1),
    }

    expired_token = jwt.encode(
        expired_payload,
        settings.jwt_secret_key,
        algorithm=JWT_ALGORITHM,
    )

    response = client.get(
        "/api/analysis/"
        "99999999-9999-9999-9999-999999999999",
        headers={
            "Authorization": f"Bearer {expired_token}"
        },
    )

    assert response.status_code == 401


def test_create_analysis_uses_authenticated_user_id(
    monkeypatch,
):
    """
    Verify that analysis creation uses the authenticated
    user's ID when persisting the analysis.
    """

    test_user = make_test_user()
    captured = {}

    def override_get_current_user():
        return test_user

    def fake_analyze_resume(
        file_bytes: bytes,
        target_role: str,
    ) -> dict:
        return make_analysis_result()

    def fake_save_analysis(
        db,
        analysis_id,
        target_role,
        result,
        user_id,
    ):
        captured["analysis_id"] = analysis_id
        captured["user_id"] = user_id

        return type(
            "SavedAnalysis",
            (),
            {
                "analysis_id": analysis_id,
                "user_id": user_id,
            },
        )()

    app.dependency_overrides[
        get_current_user
    ] = override_get_current_user

    monkeypatch.setattr(
        "app.api.routes.analyze_resume",
        fake_analyze_resume,
    )

    monkeypatch.setattr(
        "app.api.routes.save_analysis",
        fake_save_analysis,
    )

    try:
        client = TestClient(app)

        response = client.post(
            "/api/analysis",
            headers={
                "Authorization": "Bearer test-token",
            },
            files={
                "file": (
                    "resume.pdf",
                    b"%PDF-test-content",
                    "application/pdf",
                )
            },
            data={
                "target_role": "Software Engineering Intern",
            },
        )

        assert response.status_code == 200

        assert captured["user_id"] == test_user.user_id

        assert response.json()["analysis_id"] == (
            captured["analysis_id"]
        )

    finally:
        app.dependency_overrides.pop(
            get_current_user,
            None,
        )
def test_get_analysis_rejects_different_authenticated_user(monkeypatch):
    user_a = make_test_user()
    user_b = User(
        user_id=2,
        name="Other User",
        email=f"other-{uuid4()}@example.com",
        password_hash=hash_password("TestPassword123!"),
    )

    analysis_id = str(uuid4())

    def override_get_current_user():
        return user_b

    def fake_get_analysis(db, analysis_id, user_id):
        # Simulate the real ownership-aware persistence lookup.
        if user_id != user_a.user_id:
            return None
        return object()

    app.dependency_overrides[get_current_user] = override_get_current_user

    monkeypatch.setattr(
        "app.api.routes.get_analysis",
        fake_get_analysis,
    )

    try:
        client = TestClient(app)

        response = client.get(
            f"/api/analysis/{analysis_id}",
            headers={"Authorization": "Bearer test-token"},
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Analysis not found."
    finally:
        app.dependency_overrides.pop(get_current_user, None)

def test_create_analysis_rejects_non_pdf_upload():
    """Verify that non-PDF uploads are rejected with 415."""

    test_user = make_test_user()

    def override_get_current_user():
        return test_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    try:
        client = TestClient(app)

        response = client.post(
            "/api/analysis",
            headers={"Authorization": "Bearer test-token"},
            files={
                "file": (
                    "resume.txt",
                    b"plain text resume",
                    "text/plain",
                )
            },
            data={"target_role": "Software Engineering Intern"},
        )

        assert response.status_code == 415
        assert response.json()["detail"] == "Only PDF files are supported."
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_create_analysis_rejects_pdf_over_5_mb():
    """Verify that PDFs larger than 5 MB are rejected with 413."""

    test_user = make_test_user()

    def override_get_current_user():
        return test_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    try:
        client = TestClient(app)
        oversized_pdf = b"%PDF-1.7" + (b"x" * (5 * 1024 * 1024))

        response = client.post(
            "/api/analysis",
            headers={"Authorization": "Bearer test-token"},
            files={
                "file": (
                    "large-resume.pdf",
                    oversized_pdf,
                    "application/pdf",
                )
            },
            data={"target_role": "Software Engineering Intern"},
        )

        assert response.status_code == 413
        assert response.json()["detail"] == "PDF file must be 5 MB or smaller."
    finally:
        app.dependency_overrides.pop(get_current_user, None)
