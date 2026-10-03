"""
Service for generating actionable resume improvement recommendations.

V1 uses transparent rule-based recommendations.

The service consumes findings produced by:
    - Skill Gap Analysis
    - Requirement Evidence Analysis
    - ATS / Keyword Analysis
    - Resume Quality Analysis

It does not re-analyze the original resume.
"""

from typing import Any


def create_recommendation(
    *,
    recommendation_type: str,
    priority: str,
    title: str,
    description: str,
    reason: str,
    related_skill: str = "",
    related_requirement: str = "",
) -> dict[str, Any]:
    """
    Create a standardized recommendation object.
    """

    return {
        "type": recommendation_type,
        "priority": priority,
        "title": title,
        "description": description,
        "reason": reason,
        "related_skill": related_skill,
        "related_requirement": related_requirement,
    }


def recommend_for_skill_gaps(
    skill_gaps: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Generate recommendations from missing role skills.
    """

    recommendations: list[dict[str, Any]] = []

    for gap in skill_gaps:
        skill_name = gap.get("name", "").strip()
        importance = gap.get(
            "importance",
            "medium",
        ).strip().lower()

        if not skill_name:
            continue

        if importance == "high":
            priority = "high"
        elif importance == "medium":
            priority = "medium"
        else:
            priority = "low"

        recommendations.append(
            create_recommendation(
                recommendation_type="skill_gap",
                priority=priority,
                title=(
                    f"Strengthen evidence for {skill_name}"
                ),
                description=(
                    f"If you genuinely have experience with "
                    f"{skill_name}, make that experience more "
                    f"visible in your resume through relevant "
                    f"projects, coursework, experience, or "
                    f"technical descriptions. If you do not "
                    f"yet have this skill, consider learning it "
                    f"before applying to roles where it is important."
                ),
                reason=(
                    f"{skill_name} is listed as a "
                    f"{importance}-importance skill for the "
                    "selected role but was not matched to "
                    "evidence in the resume."
                ),
                related_skill=skill_name,
            )
        )

    return recommendations


def recommend_for_requirement_evidence(
    requirement_results: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Generate recommendations from partially or poorly evidenced
    role requirements.
    """

    recommendations: list[dict[str, Any]] = []

    for result in requirement_results:
        requirement = result.get(
            "requirement",
            "",
        ).strip()

        status = result.get(
            "status",
            "limited",
        ).strip().lower()

        if not requirement:
            continue

        if status == "supported":
            continue

        if (
            "data structures and algorithms"
            in requirement.lower()
        ):
            if status == "partial":
                recommendations.append(
                    create_recommendation(
                        recommendation_type="requirement_evidence",
                        priority="medium",
                        title=(
                            "Strengthen Data Structures and Algorithms evidence"
                        ),
                        description=(
                            "Your resume shows evidence for only part "
                            "of the Data Structures and Algorithms "
                            "requirement. Where applicable, explicitly "
                            "mention both areas in relevant coursework, "
                            "projects, or technical experience."
                        ),
                        reason=(
                            "The requirement was partially supported "
                            "because only part of the expected evidence "
                            "was detected."
                        ),
                        related_requirement=requirement,
                    )
                )
            else:
                recommendations.append(
                    create_recommendation(
                        recommendation_type="requirement_evidence",
                        priority="high",
                        title=(
                            "Add evidence for Data Structures and Algorithms"
                        ),
                        description=(
                            "If you have studied or applied Data "
                            "Structures and Algorithms, make that "
                            "experience explicit in your resume. "
                            "If you have not yet developed this "
                            "knowledge, consider learning and "
                            "practicing it before applying."
                        ),
                        reason=(
                            "No meaningful evidence for this "
                            "requirement was detected."
                        ),
                        related_requirement=requirement,
                    )
                )

            continue

        if (
            "software testing and debugging"
            in requirement.lower()
        ):
            if status == "partial":
                recommendations.append(
                    create_recommendation(
                        recommendation_type="requirement_evidence",
                        priority="medium",
                        title=(
                            "Strengthen Software Testing and Debugging evidence"
                        ),
                        description=(
                            "Your resume shows evidence for only part "
                            "of the testing and debugging requirement. "
                            "Where applicable, describe testing methods, "
                            "test tools, debugging activities, or "
                            "relevant project experience."
                        ),
                        reason=(
                            "The requirement was partially supported "
                            "because only testing or debugging evidence "
                            "was detected."
                        ),
                        related_requirement=requirement,
                    )
                )
            else:
                recommendations.append(
                    create_recommendation(
                        recommendation_type="requirement_evidence",
                        priority="high",
                        title=(
                            "Add Software Testing and Debugging evidence"
                        ),
                        description=(
                            "If you have testing or debugging experience, "
                            "describe it explicitly in your project or "
                            "experience descriptions. If not, consider "
                            "gaining practical experience with testing "
                            "and debugging."
                        ),
                        reason=(
                            "No meaningful evidence for this "
                            "requirement was detected."
                        ),
                        related_requirement=requirement,
                    )
                )

            continue

        if status == "partial":
            recommendations.append(
                create_recommendation(
                    recommendation_type="requirement_evidence",
                    priority="medium",
                    title=(
                        "Strengthen evidence for a role requirement"
                    ),
                    description=(
                        f"The resume provides only partial evidence "
                        f"for this requirement: '{requirement}'. "
                        "Where applicable, make the relevant "
                        "coursework, project, experience, or "
                        "technical activity more explicit."
                    ),
                    reason=(
                        "The requirement was partially supported "
                        "by evidence found in the resume."
                    ),
                    related_requirement=requirement,
                )
            )
        else:
            recommendations.append(
                create_recommendation(
                    recommendation_type="requirement_evidence",
                    priority="high",
                    title=(
                        "Address a missing role requirement"
                    ),
                    description=(
                        f"No meaningful evidence was detected for "
                        f"this requirement: '{requirement}'. "
                        "If you have relevant experience, make it "
                        "explicit in the resume. Otherwise, consider "
                        "developing this area before applying."
                    ),
                    reason=(
                        "No meaningful evidence for this requirement "
                        "was detected."
                    ),
                    related_requirement=requirement,
                )
            )

    return recommendations


def recommend_for_ats(
    ats_analysis: dict[str, Any],
) -> list[dict[str, Any]]:
    """
    Generate recommendations from ATS and keyword findings.
    """

    recommendations: list[dict[str, Any]] = []

    keyword_analysis = ats_analysis.get(
        "keyword_analysis",
        {},
    )

    for item in keyword_analysis.get(
        "missing_keywords",
        [],
    ):
        keyword = item.get(
            "keyword",
            "",
        ).strip()

        importance = item.get(
            "importance",
            "medium",
        ).strip().lower()

        if not keyword:
            continue

        priority = (
            "high"
            if importance == "high"
            else "medium"
            if importance == "medium"
            else "low"
        )

        recommendations.append(
            create_recommendation(
                recommendation_type="ats_keyword",
                priority=priority,
                title=(
                    f"Review the keyword '{keyword}'"
                ),
                description=(
                    f"If {keyword} is genuinely part of your "
                    f"experience, use the term explicitly in an "
                    f"appropriate resume section rather than relying "
                    f"only on related technologies or concepts."
                ),
                reason=(
                    f"The exact role keyword '{keyword}' was not "
                    "detected in the resume text."
                ),
                related_skill=keyword,
            )
        )

    structure_analysis = ats_analysis.get(
        "structure_analysis",
        {},
    )

    for check in structure_analysis.get(
        "checks",
        [],
    ):
        if check.get("status") != "missing":
            continue

        section_name = check.get(
            "name",
            "",
        ).strip()

        if not section_name:
            continue

        recommendations.append(
            create_recommendation(
                recommendation_type="ats_structure",
                priority="medium",
                title=(
                    f"Add a {section_name} section"
                ),
                description=(
                    f"Add a clear {section_name} section if "
                    "it is relevant to your background and "
                    "contains useful information for the role."
                ),
                reason=(
                    f"The {section_name} section was not detected "
                    "in the resume."
                ),
            )
        )

    return recommendations


def recommend_for_resume_quality(
    resume_quality: dict[str, Any],
) -> list[dict[str, Any]]:
    """
    Convert resume quality findings into actionable recommendations.
    """

    recommendations: list[dict[str, Any]] = []

    for finding in resume_quality.get(
        "findings",
        [],
    ):
        code = finding.get(
            "code",
            "",
        )
        severity = finding.get(
            "severity",
            "low",
        )
        message = finding.get(
            "message",
            "",
        )

        priority = (
            "high"
            if severity == "high"
            else "medium"
            if severity == "medium"
            else "low"
        )

        if code == "no_project_quantification":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="medium",
                    title=(
                        "Add measurable project outcomes"
                    ),
                    description=(
                        "Where genuine metrics are available, "
                        "add measurable results to project "
                        "descriptions. Examples include number "
                        "of users, records processed, test cases, "
                        "performance improvements, features "
                        "implemented, or other meaningful measures."
                    ),
                    reason=message,
                )
            )

        elif code == "no_experience_quantification":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="medium",
                    title=(
                        "Add measurable experience outcomes"
                    ),
                    description=(
                        "Where genuine metrics are available, "
                        "describe measurable results from your "
                        "experience instead of only listing duties."
                    ),
                    reason=message,
                )
            )

        elif code == "project_lacks_action_language":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="low",
                    title=(
                        "Use action-oriented project descriptions"
                    ),
                    description=(
                        "Start project descriptions with clear "
                        "action-oriented language that explains "
                        "what you built, implemented, designed, "
                        "tested, or improved."
                    ),
                    reason=message,
                )
            )

        elif code == "experience_lacks_action_language":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="low",
                    title=(
                        "Use action-oriented experience descriptions"
                    ),
                    description=(
                        "Describe what you actually did using "
                        "clear action-oriented language rather "
                        "than only listing responsibilities."
                    ),
                    reason=message,
                )
            )

        elif code == "short_profile":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="low",
                    title=(
                        "Strengthen the profile summary"
                    ),
                    description=(
                        "Consider adding a concise summary that "
                        "connects your current education, relevant "
                        "technical strengths, and internship "
                        "target without making unsupported claims."
                    ),
                    reason=message,
                )
            )

        elif code == "long_profile":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="low",
                    title=(
                        "Make the profile summary more concise"
                    ),
                    description=(
                        "Review the profile and keep the most "
                        "relevant information about your background, "
                        "technical focus, and target role."
                    ),
                    reason=message,
                )
            )

        elif code == "few_skills":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="medium",
                    title=(
                        "Review the technical skills section"
                    ),
                    description=(
                        "Make sure the skills section includes "
                        "relevant technologies and concepts that "
                        "you can genuinely demonstrate through "
                        "your education, projects, or experience."
                    ),
                    reason=message,
                )
            )

        elif code == "missing_projects":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="medium",
                    title=(
                        "Add relevant projects"
                    ),
                    description=(
                        "Consider adding relevant academic or "
                        "personal projects that demonstrate "
                        "skills required by the target role."
                    ),
                    reason=message,
                )
            )

        elif code == "missing_experience":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="low",
                    title=(
                        "Show relevant practical experience"
                    ),
                    description=(
                        "If you do not have formal work experience, "
                        "use relevant academic projects, volunteer "
                        "work, leadership, or other genuine practical "
                        "experience to demonstrate applicable skills."
                    ),
                    reason=message,
                )
            )

        elif code == "missing_courses_certifications":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="low",
                    title=(
                        "Consider relevant learning evidence"
                    ),
                    description=(
                        "If you have completed relevant courses or "
                        "certifications, include them where they "
                        "strengthen your application. Do not add "
                        "credentials you have not completed."
                    ),
                    reason=message,
                )
            )

        elif code == "missing_education":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="high",
                    title=(
                        "Add education information"
                    ),
                    description=(
                        "Include your relevant degree or program, "
                        "institution, and expected or completed "
                        "graduation year."
                    ),
                    reason=message,
                )
            )

        elif code == "missing_skills":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="high",
                    title=(
                        "Add a relevant technical skills section"
                    ),
                    description=(
                        "Add a clear skills section containing "
                        "technical skills that you genuinely have "
                        "and can support through your resume."
                    ),
                    reason=message,
                )
            )

        elif code == "missing_profile":
            recommendations.append(
                create_recommendation(
                    recommendation_type="resume_quality",
                    priority="medium",
                    title=(
                        "Add a concise profile summary"
                    ),
                    description=(
                        "Consider adding a short profile that "
                        "summarizes your education, technical focus, "
                        "and internship direction."
                    ),
                    reason=message,
                )
            )

    return recommendations


def recommendation_key(
    recommendation: dict[str, Any],
) -> tuple[str, str, str]:
    """
    Create a key used to remove duplicate recommendations.
    """

    return (
        recommendation.get("type", ""),
        recommendation.get("title", ""),
        recommendation.get("related_skill", ""),
    )


def sort_recommendations(
    recommendations: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Sort recommendations by priority.

    This is a processing order, not a quality ranking.
    """

    priority_order = {
        "high": 0,
        "medium": 1,
        "low": 2,
    }

    return sorted(
        recommendations,
        key=lambda item: (
            priority_order.get(
                item.get("priority", "low"),
                2,
            ),
            item.get("title", ""),
        ),
    )


def generate_improvement_recommendations(
    *,
    skill_comparison: dict[str, Any],
    requirement_evidence: dict[str, Any],
    ats_analysis: dict[str, Any],
    resume_quality: dict[str, Any],
) -> dict[str, Any]:
    """
    Generate the complete V1 improvement recommendation set.
    """

    recommendations: list[dict[str, Any]] = []

    recommendations.extend(
        recommend_for_skill_gaps(
            skill_gaps=skill_comparison.get(
                "skill_gaps",
                [],
            )
        )
    )

    recommendations.extend(
        recommend_for_requirement_evidence(
            requirement_results=requirement_evidence.get(
                "results",
                [],
            )
        )
    )

    recommendations.extend(
        recommend_for_ats(
            ats_analysis=ats_analysis,
        )
    )

    recommendations.extend(
        recommend_for_resume_quality(
            resume_quality=resume_quality,
        )
    )

    unique_recommendations: list[dict[str, Any]] = []
    seen_keys: set[tuple[str, str, str]] = set()

    for recommendation in recommendations:
        key = recommendation_key(
            recommendation
        )

        if key in seen_keys:
            continue

        seen_keys.add(key)
        unique_recommendations.append(
            recommendation
        )

    sorted_recommendations = sort_recommendations(
        unique_recommendations
    )

    high_count = sum(
        1
        for recommendation in sorted_recommendations
        if recommendation["priority"] == "high"
    )

    medium_count = sum(
        1
        for recommendation in sorted_recommendations
        if recommendation["priority"] == "medium"
    )

    low_count = sum(
        1
        for recommendation in sorted_recommendations
        if recommendation["priority"] == "low"
    )

    return {
        "recommendations": sorted_recommendations,
        "recommendation_counts": {
            "high": high_count,
            "medium": medium_count,
            "low": low_count,
            "total": len(sorted_recommendations),
        },
    }