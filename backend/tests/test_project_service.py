from app.services.project_service import (
    generate_project_recommendations,
    get_projects_for_skill,
)


def test_get_projects_for_algorithms():
    projects = get_projects_for_skill(
        "Algorithms"
    )

    assert len(projects) > 0

    assert all(
        project["skill"] == "Algorithms"
        for project in projects
    )


def test_get_projects_is_case_insensitive():
    projects = get_projects_for_skill(
        "algorithms"
    )

    assert len(projects) > 0


def test_generates_project_recommendations_for_skill_gap():
    result = generate_project_recommendations(
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


def test_project_priority_comes_from_skill_importance():
    result = generate_project_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Debugging",
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


def test_unknown_skill_produces_no_project():
    result = generate_project_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Unknown Technology",
                    "importance": "medium",
                }
            ]
        }
    )

    assert result["recommendations"] == []

    assert (
        result[
            "recommendation_counts"
        ]["total"]
        == 0
    )


def test_project_recommendation_contains_details():
    result = generate_project_recommendations(
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
    assert recommendation["description"]
    assert recommendation[
        "skills_demonstrated"
    ]
    assert recommendation["difficulty"]
    assert recommendation[
        "role_relevance"
    ]
    assert recommendation["reason"]