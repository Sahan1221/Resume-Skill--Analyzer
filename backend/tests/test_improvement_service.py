from app.services.improvement_service import (
    generate_improvement_recommendations,
)


def test_generates_skill_gap_recommendation():
    result = generate_improvement_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Algorithms",
                    "importance": "medium",
                }
            ]
        },
        requirement_evidence={
            "results": []
        },
        ats_analysis={
            "keyword_analysis": {
                "missing_keywords": []
            },
            "structure_analysis": {
                "checks": []
            },
        },
        resume_quality={
            "findings": []
        },
    )

    recommendations = result["recommendations"]

    assert len(recommendations) == 1

    assert (
        recommendations[0]["related_skill"]
        == "Algorithms"
    )

    assert (
        recommendations[0]["type"]
        == "skill_gap"
    )


def test_generates_partial_requirement_recommendation():
    result = generate_improvement_recommendations(
        skill_comparison={
            "skill_gaps": []
        },
        requirement_evidence={
            "results": [
                {
                    "requirement": (
                        "Basic understanding of "
                        "data structures and algorithms."
                    ),
                    "status": "partial",
                    "evidence": [
                        "data structures"
                    ],
                }
            ]
        },
        ats_analysis={
            "keyword_analysis": {
                "missing_keywords": []
            },
            "structure_analysis": {
                "checks": []
            },
        },
        resume_quality={
            "findings": []
        },
    )

    recommendations = result["recommendations"]

    assert len(recommendations) == 1

    assert (
        recommendations[0]["type"]
        == "requirement_evidence"
    )

    assert (
        recommendations[0]["priority"]
        == "medium"
    )


def test_generates_ats_keyword_recommendation():
    result = generate_improvement_recommendations(
        skill_comparison={
            "skill_gaps": []
        },
        requirement_evidence={
            "results": []
        },
        ats_analysis={
            "keyword_analysis": {
                "missing_keywords": [
                    {
                        "keyword": "Algorithms",
                        "importance": "medium",
                    }
                ]
            },
            "structure_analysis": {
                "checks": []
            },
        },
        resume_quality={
            "findings": []
        },
    )

    recommendations = result["recommendations"]

    assert len(recommendations) == 1

    assert (
        recommendations[0]["type"]
        == "ats_keyword"
    )

    assert (
        recommendations[0]["related_skill"]
        == "Algorithms"
    )


def test_generates_project_quantification_recommendation():
    result = generate_improvement_recommendations(
        skill_comparison={
            "skill_gaps": []
        },
        requirement_evidence={
            "results": []
        },
        ats_analysis={
            "keyword_analysis": {
                "missing_keywords": []
            },
            "structure_analysis": {
                "checks": []
            },
        },
        resume_quality={
            "findings": [
                {
                    "code": "no_project_quantification",
                    "severity": "low",
                    "message": (
                        "No measurable results were detected."
                    ),
                }
            ]
        },
    )

    recommendations = result["recommendations"]

    assert len(recommendations) == 1

    assert (
        recommendations[0]["type"]
        == "resume_quality"
    )

    assert (
        recommendations[0]["priority"]
        == "medium"
    )


def test_deduplicates_identical_recommendations():
    result = generate_improvement_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Algorithms",
                    "importance": "medium",
                }
            ]
        },
        requirement_evidence={
            "results": []
        },
        ats_analysis={
            "keyword_analysis": {
                "missing_keywords": []
            },
            "structure_analysis": {
                "checks": []
            },
        },
        resume_quality={
            "findings": []
        },
    )

    recommendations = result["recommendations"]

    assert len(recommendations) == 1


def test_counts_recommendation_priorities():
    result = generate_improvement_recommendations(
        skill_comparison={
            "skill_gaps": [
                {
                    "name": "Algorithms",
                    "importance": "high",
                },
                {
                    "name": "React",
                    "importance": "medium",
                },
            ]
        },
        requirement_evidence={
            "results": []
        },
        ats_analysis={
            "keyword_analysis": {
                "missing_keywords": []
            },
            "structure_analysis": {
                "checks": []
            },
        },
        resume_quality={
            "findings": []
        },
    )

    counts = result["recommendation_counts"]

    assert counts["high"] == 1
    assert counts["medium"] == 1
    assert counts["low"] == 0
    assert counts["total"] == 2