"""
Service for generating project recommendations.

V1 maps identified skill gaps to practical project ideas
from the local project recommendation dataset.
"""

from typing import Any

from app.data.project_recommendations import (
    PROJECT_RECOMMENDATIONS,
)


def normalize_skill(skill: str) -> str:
    """Normalize a skill name for matching."""

    return " ".join(
        skill.lower().strip().split()
    )


def get_projects_for_skill(
    skill: str,
) -> list[dict[str, Any]]:
    """
    Return projects associated with a skill.
    """

    normalized_skill = normalize_skill(
        skill
    )

    projects = []

    for project in PROJECT_RECOMMENDATIONS:
        project_skill = normalize_skill(
            project.get("skill", "")
        )

        if project_skill == normalized_skill:
            projects.append(project.copy())

    return projects


def determine_project_priority(
    skill_gap: dict[str, Any],
) -> str:
    """
    Determine recommendation priority from
    the importance of the identified skill gap.
    """

    importance = (
        skill_gap.get(
            "importance",
            "medium",
        )
        .strip()
        .lower()
    )

    if importance == "high":
        return "high"

    if importance == "medium":
        return "medium"

    return "low"


def build_project_recommendation(
    skill_gap: dict[str, Any],
    project: dict[str, Any],
) -> dict[str, Any]:
    """
    Combine a skill gap and project into a
    project recommendation.
    """

    skill = skill_gap.get(
        "name",
        "",
    ).strip()

    return {
        "skill": skill,
        "priority": determine_project_priority(
            skill_gap
        ),
        "title": project.get(
            "title",
            "",
        ),
        "description": project.get(
            "description",
            "",
        ),
        "skills_demonstrated": project.get(
            "skills_demonstrated",
            [],
        ),
        "difficulty": project.get(
            "difficulty",
            "",
        ),
        "role_relevance": project.get(
            "role_relevance",
            "",
        ),
        "reason": (
            f"This project is relevant because "
            f"{skill} was identified as a skill gap "
            "for the selected role."
        ),
    }


def generate_project_recommendations(
    skill_comparison: dict[str, Any],
) -> dict[str, Any]:
    """
    Generate project recommendations from
    identified role skill gaps.
    """

    recommendations: list[
        dict[str, Any]
    ] = []

    skill_gaps = skill_comparison.get(
        "skill_gaps",
        [],
    )

    for skill_gap in skill_gaps:
        skill = skill_gap.get(
            "name",
            "",
        ).strip()

        if not skill:
            continue

        projects = get_projects_for_skill(
            skill
        )

        for project in projects:
            recommendations.append(
                build_project_recommendation(
                    skill_gap=skill_gap,
                    project=project,
                )
            )

    high_count = sum(
        1
        for recommendation in recommendations
        if recommendation["priority"] == "high"
    )

    medium_count = sum(
        1
        for recommendation in recommendations
        if recommendation["priority"] == "medium"
    )

    low_count = sum(
        1
        for recommendation in recommendations
        if recommendation["priority"] == "low"
    )

    return {
        "recommendations": recommendations,
        "recommendation_counts": {
            "high": high_count,
            "medium": medium_count,
            "low": low_count,
            "total": len(recommendations),
        },
    }