from app.services.learning_service import (
    generate_learning_recommendations,
    get_resources_for_skill,
)


def test_get_resources_for_algorithms():
    resources = get_resources_for_skill(
        "Algorithms"
    )

    assert len(resources) > 0

    assert all(
        resource["skill"]
        == "Algorithms"
        for resource in resources
    )


def test_get_resources_is_case_insensitive():
    resources = get_resources_for_skill(
        "algorithms"
    )

    assert len(resources) > 0


def test_generates_learning_recommendations_for_skill_gap():
    result = generate_learning_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Algorithms",
                    "importance": "medium",
                }
            ]
        }
    )

    recommendations = result[
        "recommendations"
    ]

    assert len(recommendations) > 0

    assert all(
        recommendation["skill"]
        == "Algorithms"
        for recommendation in recommendations
    )


def test_learning_priority_comes_from_skill_importance():
    result = generate_learning_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Algorithms",
                    "importance": "high",
                }
            ]
        }
    )

    recommendations = result[
        "recommendations"
    ]

    assert len(recommendations) > 0

    assert all(
        recommendation["priority"]
        == "high"
        for recommendation in recommendations
    )


def test_unknown_skill_produces_no_resource():
    result = generate_learning_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Unknown Technology",
                    "importance": "medium",
                }
            ]
        }
    )

    assert (
        result["recommendations"]
        == []
    )

    assert (
        result["recommendation_counts"]["total"]
        == 0
    )


def test_learning_recommendation_contains_resource_details():
    result = generate_learning_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Debugging",
                    "importance": "medium",
                }
            ]
        }
    )

    recommendation = result[
        "recommendations"
    ][0]

    assert recommendation["title"]
    assert recommendation["provider"]
    assert recommendation["url"]
    assert recommendation["type"]
    assert recommendation["cost_type"]
    assert recommendation["description"]
    assert recommendation["reason"]