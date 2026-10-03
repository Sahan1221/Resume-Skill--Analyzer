"""
Service for analyzing evidence of role requirements
within a parsed resume.

V1 uses transparent rule-based evidence detection.

Requirement status:

supported
    All important parts of the requirement are evidenced.

partial
    Some, but not all, important parts are evidenced.

limited
    No meaningful evidence was found.
"""

import re
from typing import Any


def normalize_text(value: str) -> str:
    """Normalize text for evidence matching."""

    return " ".join(
        value.lower().strip().split()
    )


def contains_phrase(
    text: str,
    phrase: str,
) -> bool:
    """
    Check whether a phrase exists as a complete
    word/phrase.

    Word boundaries prevent false matches such as:
        "c" matching "css"
        "c" matching "academic"
    """

    normalized_text = normalize_text(text)
    normalized_phrase = normalize_text(phrase)

    if not normalized_phrase:
        return False

    pattern = (
        r"(?<!\w)"
        + re.escape(normalized_phrase)
        + r"(?!\w)"
    )

    return re.search(
        pattern,
        normalized_text,
    ) is not None


def build_resume_evidence(
    resume_data: dict[str, Any],
) -> str:
    """Build searchable evidence from structured resume data."""

    evidence_parts: list[str] = []

    # Profile
    profile = resume_data.get(
        "profile",
        "",
    )

    if profile:
        evidence_parts.append(profile)

    # Skills
    for skill in resume_data.get(
        "skills",
        [],
    ):
        evidence_parts.append(skill)

    # Education
    for education in resume_data.get(
        "education",
        [],
    ):
        evidence_parts.append(
            education.get(
                "degree",
                "",
            )
        )

        evidence_parts.append(
            education.get(
                "institution",
                "",
            )
        )

        evidence_parts.append(
            education.get(
                "graduation_year",
                "",
            )
        )

    # Projects
    for project in resume_data.get(
        "projects",
        [],
    ):
        evidence_parts.append(
            project.get(
                "name",
                "",
            )
        )

        evidence_parts.append(
            project.get(
                "description",
                "",
            )
        )

    # Experience
    for experience in resume_data.get(
        "experience",
        [],
    ):
        evidence_parts.append(
            experience.get(
                "title",
                "",
            )
        )

        evidence_parts.append(
            experience.get(
                "organization",
                "",
            )
        )

        evidence_parts.append(
            experience.get(
                "description",
                "",
            )
        )

    # Courses / certifications
    for course in resume_data.get(
        "courses_certifications",
        [],
    ):
        evidence_parts.append(course)

    return normalize_text(
        " ".join(
            part
            for part in evidence_parts
            if part
        )
    )


def get_requirement_evidence_rules(
    requirement: str,
) -> list[str]:
    """
    Return evidence phrases associated with a role
    requirement.

    Rules are intentionally explicit and transparent
    for V1.
    """

    normalized_requirement = normalize_text(
        requirement
    )

    # ---------------------------------------------------------
    # Education
    # ---------------------------------------------------------

    if (
        "currently studying computer science"
        in normalized_requirement
        and "related degree"
        in normalized_requirement
    ):
        return [
            "computer science",
            "software engineering",
            "information technology",
            "information systems",
            "computer engineering",
        ]

    # ---------------------------------------------------------
    # Programming
    # ---------------------------------------------------------

    if (
        "write programs using at least one programming language"
        in normalized_requirement
    ):
        return [
            "python",
            "java",
            "c#",
            "c++",
            "javascript",
            "typescript",
            "programming",
        ]

    # ---------------------------------------------------------
    # OOP
    # ---------------------------------------------------------

    if (
        "object-oriented programming"
        in normalized_requirement
    ):
        return [
            "oop",
            "object oriented",
            "object-oriented",
        ]

    # ---------------------------------------------------------
    # Data structures + algorithms
    # ---------------------------------------------------------

    if (
        "data structures and algorithms"
        in normalized_requirement
    ):
        return [
            "data structures",
            "algorithms",
        ]

    # ---------------------------------------------------------
    # Databases + SQL
    # ---------------------------------------------------------

    if (
        "relational databases and sql"
        in normalized_requirement
    ):
        return [
            "sql",
            "mysql",
            "sql server",
            "sqlite",
            "postgresql",
            "postgres",
            "database",
            "databases",
        ]

    # ---------------------------------------------------------
    # Software development practices
    # ---------------------------------------------------------

    if (
        "software development practices"
        in normalized_requirement
    ):
        return [
            "software engineering",
            "sdlc",
            "agile",
            "requirements analysis",
            "software development",
        ]

    # ---------------------------------------------------------
    # Git + version control
    # ---------------------------------------------------------

    if (
        "git and version control"
        in normalized_requirement
    ):
        return [
            "git",
            "github",
            "gitlab",
            "bitbucket",
            "version control",
        ]

    # ---------------------------------------------------------
    # Software projects + teamwork
    # ---------------------------------------------------------

    if (
        "software projects individually or in a team"
        in normalized_requirement
    ):
        return [
            "project",
            "projects",
            "project teams",
            "team",
            "teams",
            "academic software projects",
            "university projects",
        ]

    # ---------------------------------------------------------
    # Testing + debugging
    # ---------------------------------------------------------

    if (
        "software testing and debugging"
        in normalized_requirement
    ):
        return [
            "software testing",
            "testing",
            "unit testing",
            "integration testing",
            "pytest",
            "debugging",
        ]

    # ---------------------------------------------------------
    # Technical communication
    # ---------------------------------------------------------

    if (
        "communicate technical information clearly"
        in normalized_requirement
    ):
        return [
            "technical documentation",
            "documentation",
            "requirements",
            "use cases",
            "architecture diagrams",
            "database designs",
        ]

    return []


def find_requirement_evidence(
    requirement: str,
    resume_data: dict[str, Any],
) -> list[str]:
    """Find evidence phrases supporting a requirement."""

    resume_text = build_resume_evidence(
        resume_data
    )

    evidence_rules = (
        get_requirement_evidence_rules(
            requirement
        )
    )

    found_evidence: list[str] = []

    for phrase in evidence_rules:

        if contains_phrase(
            resume_text,
            phrase,
        ):
            found_evidence.append(phrase)

    return found_evidence


def determine_requirement_status(
    evidence: list[str],
    requirement: str,
) -> str:
    """Determine supported, partial, or limited status."""

    normalized_requirement = normalize_text(
        requirement
    )

    # ---------------------------------------------------------
    # Data structures + algorithms
    # ---------------------------------------------------------

    if (
        "data structures and algorithms"
        in normalized_requirement
    ):
        has_data_structures = (
            "data structures"
            in evidence
        )

        has_algorithms = (
            "algorithms"
            in evidence
        )

        if (
            has_data_structures
            and has_algorithms
        ):
            return "supported"

        if (
            has_data_structures
            or has_algorithms
        ):
            return "partial"

        return "limited"

    # ---------------------------------------------------------
    # Testing + debugging
    # ---------------------------------------------------------

    if (
        "software testing and debugging"
        in normalized_requirement
    ):
        has_testing = any(
            evidence_item in {
                "software testing",
                "testing",
                "unit testing",
                "integration testing",
                "pytest",
            }
            for evidence_item in evidence
        )

        has_debugging = (
            "debugging"
            in evidence
        )

        if (
            has_testing
            and has_debugging
        ):
            return "supported"

        if (
            has_testing
            or has_debugging
        ):
            return "partial"

        return "limited"

    # ---------------------------------------------------------
    # Normal requirement
    # ---------------------------------------------------------

    if evidence:
        return "supported"

    return "limited"


def analyze_requirements(
    requirements: list[str],
    resume_data: dict[str, Any],
) -> dict[str, Any]:
    """Analyze resume evidence against role requirements."""

    results = []

    for requirement in requirements:

        evidence = find_requirement_evidence(
            requirement=requirement,
            resume_data=resume_data,
        )

        status = determine_requirement_status(
            evidence=evidence,
            requirement=requirement,
        )

        results.append(
            {
                "requirement": requirement,
                "status": status,
                "evidence": evidence,
            }
        )

    supported_count = sum(
        1
        for result in results
        if result["status"] == "supported"
    )

    partial_count = sum(
        1
        for result in results
        if result["status"] == "partial"
    )

    limited_count = sum(
        1
        for result in results
        if result["status"] == "limited"
    )

    total_requirements = len(results)

    evidence_percentage = (
        round(
            (
                supported_count
                + (partial_count * 0.5)
            )
            / total_requirements
            * 100,
            2,
        )
        if total_requirements > 0
        else 0.0
    )

    return {
        "results": results,
        "supported_count": supported_count,
        "partial_count": partial_count,
        "limited_count": limited_count,
        "total_requirements": total_requirements,
        "evidence_percentage": evidence_percentage,
    }