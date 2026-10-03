"""
Service for generating learning recommendations.

V1 uses the local learning-resource dataset.

The service maps identified skill gaps to relevant
learning resources.
"""

from typing import Any

from app.data.learning_resources import (
    LEARNING_RESOURCES,
)


def normalize_skill(skill: str) -> str:
    """Normalize a skill name for matching."""

    return " ".join(
        skill.lower().strip().split()
    )


def get_resources_for_skill(
    skill: str,
) -> list[dict[str, Any]]:
    """
    Return learning resources associated with a skill.
    """

    normalized_skill = normalize_skill(
        skill
    )

    resources = []

    for resource in LEARNING_RESOURCES:
        resource_skill = normalize_skill(
            resource.get("skill", "")
        )

        if resource_skill == normalized_skill:
            resources.append(resource.copy())

    return resources


def determine_learning_priority(
    skill_gap: dict[str, Any],
) -> str:
    """
    Determine the learning recommendation priority
    from the role skill importance.
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


def build_learning_recommendation(
    skill_gap: dict[str, Any],
    resource: dict[str, Any],
) -> dict[str, Any]:
    """
    Combine a skill gap and learning resource
    into a recommendation object.
    """

    skill = skill_gap.get(
        "name",
        "",
    ).strip()

    priority = determine_learning_priority(
        skill_gap
    )

    return {
        "skill": skill,
        "priority": priority,
        "title": resource.get(
            "title",
            "",
        ),
        "provider": resource.get(
            "provider",
            "",
        ),
        "url": resource.get(
            "url",
            "",
        ),
        "type": resource.get(
            "type",
            "",
        ),
        "cost_type": resource.get(
            "cost_type",
            "",
        ),
        "description": resource.get(
            "description",
            "",
        ),
        "reason": (
            f"This resource is relevant because "
            f"{skill} was identified as a skill gap "
            "for the selected role."
        ),
    }


def generate_learning_recommendations(
    skill_comparison: dict[str, Any],
) -> dict[str, Any]:
    """
    Generate learning recommendations from identified
    role skill gaps.
    """

    recommendations: list[dict[str, Any]] = []

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

        resources = get_resources_for_skill(
            skill
        )

        for resource in resources:
            recommendations.append(
                build_learning_recommendation(
                    skill_gap=skill_gap,
                    resource=resource,
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