from app.services.market_service import (
    build_market_insight,
    determine_market_priority,
    generate_market_insights,
    get_market_insights,
    normalize_skill,
)


def test_get_market_insights_for_software_engineering_intern():
    insights = get_market_insights("Software Engineering Intern")

    assert len(insights) == 10
    assert any(
        insight["skill"] == "Python"
        for insight in insights
    )


def test_role_lookup_is_case_insensitive():
    insights = get_market_insights(
        " software engineering INTERN "
    )

    assert len(insights) == 10


def test_high_demand_priority():
    assert determine_market_priority("high") == "high"


def test_medium_demand_priority():
    assert determine_market_priority("medium") == "medium"


def test_unknown_role_returns_no_insights():
    result = generate_market_insights(
        "Unknown Internship Role"
    )

    assert result["insights"] == []
    assert result["insight_counts"] == {
        "high": 0,
        "medium": 0,
        "low": 0,
        "total": 0,
    }


def test_market_insight_contains_required_details():
    insights = get_market_insights(
        "Software Engineering Intern"
    )

    insight = build_market_insight(insights[0])

    assert "skill" in insight
    assert "demand" in insight
    assert "priority" in insight
    assert "category" in insight
    assert "description" in insight
    assert "role_relevance" in insight


def test_generate_market_insights_counts():
    result = generate_market_insights(
        "Software Engineering Intern"
    )

    assert result["insight_counts"] == {
        "high": 7,
        "medium": 3,
        "low": 0,
        "total": 10,
    }