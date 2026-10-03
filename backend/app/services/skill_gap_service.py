"""
Service for comparing resume skills with role requirements.

V1 uses transparent evidence-aware matching.

A role requirement can be satisfied by:
1. An exact skill match.
2. An explicitly configured alias/related skill.
"""

from typing import Any

from app.data.skill_aliases import (
    get_skill_evidence,
    normalize_skill,
)


def find_skill_evidence(
    required_skill: str,
    resume_skills: list[str],
) -> list[str]:
    """
    Find resume skills that provide evidence for
    a required role skill.
    """

    normalized_resume_skills = {
        normalize_skill(skill): skill
        for skill in resume_skills
        if skill.strip()
    }

    accepted_evidence = get_skill_evidence(
        required_skill
    )

    evidence = []

    for normalized_skill, original_skill in (
        normalized_resume_skills.items()
    ):
        if normalized_skill in accepted_evidence:
            evidence.append(original_skill)

    return evidence


def determine_gap_level(
    importance: str,
) -> str:
    """
    Convert role-skill importance into a gap level.
    """

    normalized_importance = (
        importance.lower().strip()
    )

    if normalized_importance == "high":
        return "high"

    if normalized_importance == "medium":
        return "medium"

    return "low"


def compare_skills(
    resume_skills: list[str],
    role_skills: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Compare resume skills against role requirements
    using evidence-aware matching.
    """

    matched_skills = []
    skill_gaps = []

    for role_skill in role_skills:

        skill_name = role_skill["name"]

        evidence = find_skill_evidence(
            required_skill=skill_name,
            resume_skills=resume_skills,
        )

        if evidence:

            matched_skills.append(
                {
                    "name": skill_name,
                    "category": role_skill.get(
                        "category",
                        "",
                    ),
                    "importance": role_skill.get(
                        "importance",
                        "medium",
                    ),
                    "evidence": evidence,
                }
            )

        else:

            importance = role_skill.get(
                "importance",
                "medium",
            )

            skill_gaps.append(
                {
                    "name": skill_name,
                    "category": role_skill.get(
                        "category",
                        "",
                    ),
                    "importance": importance,
                    "gap_level": determine_gap_level(
                        importance
                    ),
                    "evidence": [],
                }
            )

    total_skills = len(role_skills)
    matched_count = len(matched_skills)

    match_percentage = (
        round(
            (matched_count / total_skills) * 100,
            2,
        )
        if total_skills > 0
        else 0.0
    )

    return {
        "matched_skills": matched_skills,
        "skill_gaps": skill_gaps,
        "matched_count": matched_count,
        "gap_count": len(skill_gaps),
        "total_role_skills": total_skills,
        "match_percentage": match_percentage,
    }