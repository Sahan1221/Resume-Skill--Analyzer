from typing import Any

from app.data.market_insights import MARKET_INSIGHTS


def normalize_skill(skill: str) -> str:
    """
    Normalize a skill name for consistent matching.

    Example:
        " Python " -> "python"
        "SOFTWARE TESTING" -> "software testing"
    """
    return " ".join(skill.strip().lower().split())


def get_market_insights(role: str) -> list[dict[str, Any]]:
    """
    Return market insights for the selected role.

    Matching is case-insensitive and ignores leading/trailing
    and repeated whitespace.
    """
    if not role:
        return []

    normalized_role = normalize_skill(role)

    for available_role, insights in MARKET_INSIGHTS.items():
        if normalize_skill(available_role) == normalized_role:
            return insights.copy()

    return []


def determine_market_priority(demand: str) -> str:
    """
    Convert market demand into a recommendation priority.

    high   -> high
    medium -> medium
    low    -> low

    Unknown values default to low.
    """
    normalized_demand = normalize_skill(demand)

    if normalized_demand == "high":
        return "high"

    if normalized_demand == "medium":
        return "medium"

    if normalized_demand == "low":
        return "low"

    return "low"


def build_market_insight(insight: dict[str, Any]) -> dict[str, Any]:
    """
    Build a normalized market insight response object.
    """
    skill = insight.get("skill", "")
    demand = insight.get("demand", "low")
    category = insight.get("category", "")
    description = insight.get("description", "")
    role_relevance = insight.get("role_relevance", "")

    return {
        "skill": skill,
        "demand": demand,
        "priority": determine_market_priority(demand),
        "category": category,
        "description": description,
        "role_relevance": role_relevance,
    }


def generate_market_insights(role: str) -> dict[str, Any]:
    """
    Generate market insights for a selected role.

    Returns:
        {
            "insights": [...],
            "insight_counts": {
                "high": ...,
                "medium": ...,
                "low": ...,
                "total": ...
            }
        }
    """
    market_data = get_market_insights(role)

    insights = [
        build_market_insight(insight)
        for insight in market_data
    ]

    insight_counts = {
        "high": 0,
        "medium": 0,
        "low": 0,
        "total": len(insights),
    }

    for insight in insights:
        priority = insight["priority"]

        if priority in insight_counts:
            insight_counts[priority] += 1

    return {
        "insights": insights,
        "insight_counts": insight_counts,
    }