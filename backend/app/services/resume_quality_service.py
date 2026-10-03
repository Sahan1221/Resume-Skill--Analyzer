"""
Service for rule-based resume quality analysis.

V1 focuses on observable content characteristics rather than
claiming to provide a scientifically validated resume score.
"""

import re
from typing import Any


# -------------------------------------------------------------------
# Text helpers
# -------------------------------------------------------------------

def normalize_text(value: str) -> str:
    """Normalize text for analysis."""

    return " ".join(
        value.lower().strip().split()
    )


def count_words(value: str) -> int:
    """Return the number of words in a text value."""

    if not value.strip():
        return 0

    return len(value.split())


# -------------------------------------------------------------------
# Action language
# -------------------------------------------------------------------

ACTION_VERBS = {
    "built",
    "created",
    "developed",
    "designed",
    "implemented",
    "develop",
    "design",
    "implement",
    "created",
    "managed",
    "analyzed",
    "analysed",
    "tested",
    "configured",
    "integrated",
    "automated",
    "deployed",
    "optimized",
    "optimised",
    "maintained",
    "documented",
    "led",
    "worked",
    "used",
    "implemented",
    "developed",
}


def extract_first_word(
    text: str,
) -> str:
    """
    Extract the first alphabetic word from a description.

    This is intentionally simple because V1 is rule-based.
    """

    match = re.search(
        r"\b[A-Za-z]+\b",
        text.strip(),
    )

    if not match:
        return ""

    return match.group(0).lower()


def contains_action_verb(
    text: str,
) -> bool:
    """Check whether a description contains a known action verb."""

    normalized_text = normalize_text(
        text
    )

    for verb in ACTION_VERBS:
        pattern = (
            r"(?<!\w)"
            + re.escape(verb)
            + r"(?!\w)"
        )

        if re.search(
            pattern,
            normalized_text,
        ):
            return True

    return False


# -------------------------------------------------------------------
# Quantified achievement detection
# -------------------------------------------------------------------

def contains_quantification(
    text: str,
) -> bool:
    """
    Detect basic measurable information.

    Examples:
        20%
        30 users
        5 projects
        reduced by 40%
        2 seconds
        100 records

    This does not determine whether the number is meaningful.
    It only detects whether measurable information is present.
    """

    patterns = [
        # Percentages
        r"\b\d+(?:\.\d+)?\s*%",

        # Numbers followed by a common measurement/unit
        (
            r"\b\d+(?:\.\d+)?\s*"
            r"(?:users?|records?|items?|projects?|"
            r"requests?|seconds?|minutes?|hours?|"
            r"days?|weeks?|months?|years?|"
            r"features?|tests?|cases?|"
            r"students?|customers?)\b"
        ),

        # Common achievement phrases
        (
            r"\b(?:increased|decreased|reduced|improved|"
            r"saved|processed|handled|supported)\b"
            r".{0,30}"
            r"\b\d+(?:\.\d+)?\b"
        ),
    ]

    for pattern in patterns:
        if re.search(
            pattern,
            text,
            re.IGNORECASE,
        ):
            return True

    return False


# -------------------------------------------------------------------
# Profile analysis
# -------------------------------------------------------------------

def analyze_profile(
    profile: str,
) -> dict[str, Any]:
    """Analyze the resume profile/summary."""

    word_count = count_words(
        profile
    )

    findings: list[dict[str, Any]] = []

    if word_count == 0:
        findings.append(
            {
                "type": "missing_section",
                "severity": "medium",
                "code": "missing_profile",
                "message": (
                    "No profile or professional summary was detected."
                ),
            }
        )

    elif word_count < 20:
        findings.append(
            {
                "type": "content",
                "severity": "low",
                "code": "short_profile",
                "message": (
                    "The profile is very short and may provide "
                    "limited context about the candidate."
                ),
            }
        )

    elif word_count > 120:
        findings.append(
            {
                "type": "content",
                "severity": "low",
                "code": "long_profile",
                "message": (
                    "The profile contains a large amount of text "
                    "and could be made more concise."
                ),
            }
        )

    return {
        "present": word_count > 0,
        "word_count": word_count,
        "findings": findings,
    }


# -------------------------------------------------------------------
# Education analysis
# -------------------------------------------------------------------

def analyze_education(
    education: list[dict[str, Any]],
) -> dict[str, Any]:
    """Check completeness of education records."""

    findings: list[dict[str, Any]] = []

    if not education:
        findings.append(
            {
                "type": "missing_section",
                "severity": "high",
                "code": "missing_education",
                "message": (
                    "No education information was detected."
                ),
            }
        )

        return {
            "present": False,
            "item_count": 0,
            "findings": findings,
        }

    incomplete_items = 0

    for item in education:
        missing_fields = []

        if not item.get(
            "degree",
            "",
        ).strip():
            missing_fields.append(
                "degree"
            )

        if not item.get(
            "institution",
            "",
        ).strip():
            missing_fields.append(
                "institution"
            )

        if not item.get(
            "graduation_year",
            "",
        ).strip():
            missing_fields.append(
                "graduation year"
            )

        if missing_fields:
            incomplete_items += 1

            findings.append(
                {
                    "type": "content",
                    "severity": "low",
                    "code": "incomplete_education",
                    "message": (
                        "An education entry is missing: "
                        + ", ".join(missing_fields)
                        + "."
                    ),
                }
            )

    return {
        "present": True,
        "item_count": len(education),
        "incomplete_item_count": incomplete_items,
        "findings": findings,
    }


# -------------------------------------------------------------------
# Skills analysis
# -------------------------------------------------------------------

def analyze_skills(
    skills: list[str],
) -> dict[str, Any]:
    """Analyze the presence of technical skills."""

    findings: list[dict[str, Any]] = []

    valid_skills = [
        skill.strip()
        for skill in skills
        if skill.strip()
    ]

    if not valid_skills:
        findings.append(
            {
                "type": "missing_section",
                "severity": "high",
                "code": "missing_skills",
                "message": (
                    "No skills were detected in the resume."
                ),
            }
        )

    elif len(valid_skills) < 5:
        findings.append(
            {
                "type": "content",
                "severity": "medium",
                "code": "few_skills",
                "message": (
                    "Only a small number of skills were detected."
                ),
            }
        )

    return {
        "present": bool(valid_skills),
        "skill_count": len(valid_skills),
        "findings": findings,
    }


# -------------------------------------------------------------------
# Project analysis
# -------------------------------------------------------------------

def analyze_projects(
    projects: list[dict[str, Any]],
) -> dict[str, Any]:
    """Analyze project descriptions."""

    findings: list[dict[str, Any]] = []

    if not projects:
        findings.append(
            {
                "type": "missing_section",
                "severity": "medium",
                "code": "missing_projects",
                "message": (
                    "No projects were detected in the resume."
                ),
            }
        )

        return {
            "present": False,
            "project_count": 0,
            "projects_with_action_verbs": 0,
            "projects_with_quantification": 0,
            "findings": findings,
        }

    projects_with_action_verbs = 0
    projects_with_quantification = 0

    for project in projects:
        name = project.get(
            "name",
            "",
        ).strip()

        description = project.get(
            "description",
            "",
        ).strip()

        if not name:
            findings.append(
                {
                    "type": "content",
                    "severity": "low",
                    "code": "project_missing_name",
                    "message": (
                        "A project entry does not have a clear name."
                    ),
                }
            )

        if not description:
            findings.append(
                {
                    "type": "content",
                    "severity": "medium",
                    "code": "project_missing_description",
                    "message": (
                        f"Project '{name or 'Unnamed project'}' "
                        "does not have a description."
                    ),
                }
            )

            continue

        if contains_action_verb(
            description
        ):
            projects_with_action_verbs += 1

        else:
            findings.append(
                {
                    "type": "content",
                    "severity": "low",
                    "code": "project_lacks_action_language",
                    "message": (
                        f"Project '{name or 'Unnamed project'}' "
                        "does not appear to use common action-oriented "
                        "language."
                    ),
                }
            )

        if contains_quantification(
            description
        ):
            projects_with_quantification += 1

    if (
        projects_with_quantification == 0
        and projects
    ):
        findings.append(
            {
                "type": "achievement",
                "severity": "low",
                "code": "no_project_quantification",
                "message": (
                    "No measurable results or quantities were "
                    "detected in the project descriptions."
                ),
            }
        )

    return {
        "present": True,
        "project_count": len(projects),
        "projects_with_action_verbs": (
            projects_with_action_verbs
        ),
        "projects_with_quantification": (
            projects_with_quantification
        ),
        "findings": findings,
    }


# -------------------------------------------------------------------
# Experience analysis
# -------------------------------------------------------------------

def analyze_experience(
    experience: list[dict[str, Any]],
) -> dict[str, Any]:
    """Analyze experience descriptions."""

    findings: list[dict[str, Any]] = []

    if not experience:
        findings.append(
            {
                "type": "missing_section",
                "severity": "low",
                "code": "missing_experience",
                "message": (
                    "No formal work experience was detected."
                ),
            }
        )

        return {
            "present": False,
            "experience_count": 0,
            "entries_with_action_verbs": 0,
            "entries_with_quantification": 0,
            "findings": findings,
        }

    entries_with_action_verbs = 0
    entries_with_quantification = 0

    for item in experience:
        title = item.get(
            "title",
            "",
        ).strip()

        organization = item.get(
            "organization",
            "",
        ).strip()

        description = item.get(
            "description",
            "",
        ).strip()

        if not title:
            findings.append(
                {
                    "type": "content",
                    "severity": "low",
                    "code": "experience_missing_title",
                    "message": (
                        "An experience entry is missing a clear title."
                    ),
                }
            )

        if not description:
            findings.append(
                {
                    "type": "content",
                    "severity": "medium",
                    "code": "experience_missing_description",
                    "message": (
                        f"Experience entry "
                        f"'{title or 'Unnamed experience'}' "
                        "does not have a description."
                    ),
                }
            )

            continue

        if contains_action_verb(
            description
        ):
            entries_with_action_verbs += 1

        else:
            findings.append(
                {
                    "type": "content",
                    "severity": "low",
                    "code": "experience_lacks_action_language",
                    "message": (
                        f"Experience entry "
                        f"'{title or 'Unnamed experience'}' "
                        "does not appear to use common "
                        "action-oriented language."
                    ),
                }
            )

        if contains_quantification(
            description
        ):
            entries_with_quantification += 1

    if (
        entries_with_quantification == 0
        and experience
    ):
        findings.append(
            {
                "type": "achievement",
                "severity": "low",
                "code": "no_experience_quantification",
                "message": (
                    "No measurable results or quantities were "
                    "detected in the experience descriptions."
                ),
            }
        )

    return {
        "present": True,
        "experience_count": len(experience),
        "entries_with_action_verbs": (
            entries_with_action_verbs
        ),
        "entries_with_quantification": (
            entries_with_quantification
        ),
        "findings": findings,
    }


# -------------------------------------------------------------------
# Courses and certifications
# -------------------------------------------------------------------

def analyze_courses_certifications(
    courses: list[str],
) -> dict[str, Any]:
    """Analyze courses and certification information."""

    findings: list[dict[str, Any]] = []

    valid_courses = [
        course.strip()
        for course in courses
        if course.strip()
    ]

    if not valid_courses:
        findings.append(
            {
                "type": "content",
                "severity": "low",
                "code": "missing_courses_certifications",
                "message": (
                    "No courses or certifications were detected."
                ),
            }
        )

    return {
        "present": bool(valid_courses),
        "item_count": len(valid_courses),
        "findings": findings,
    }


# -------------------------------------------------------------------
# Main analysis
# -------------------------------------------------------------------

def analyze_resume_quality(
    resume_data: dict[str, Any],
) -> dict[str, Any]:
    """
    Run complete V1 resume quality analysis.
    """

    profile_analysis = analyze_profile(
        resume_data.get(
            "profile",
            "",
        )
    )

    education_analysis = analyze_education(
        resume_data.get(
            "education",
            [],
        )
    )

    skills_analysis = analyze_skills(
        resume_data.get(
            "skills",
            [],
        )
    )

    projects_analysis = analyze_projects(
        resume_data.get(
            "projects",
            [],
        )
    )

    experience_analysis = analyze_experience(
        resume_data.get(
            "experience",
            [],
        )
    )

    courses_analysis = (
        analyze_courses_certifications(
            resume_data.get(
                "courses_certifications",
                [],
            )
        )
    )

    all_findings = []

    all_findings.extend(
        profile_analysis["findings"]
    )

    all_findings.extend(
        education_analysis["findings"]
    )

    all_findings.extend(
        skills_analysis["findings"]
    )

    all_findings.extend(
        projects_analysis["findings"]
    )

    all_findings.extend(
        experience_analysis["findings"]
    )

    all_findings.extend(
        courses_analysis["findings"]
    )

    high_count = sum(
        1
        for finding in all_findings
        if finding["severity"] == "high"
    )

    medium_count = sum(
        1
        for finding in all_findings
        if finding["severity"] == "medium"
    )

    low_count = sum(
        1
        for finding in all_findings
        if finding["severity"] == "low"
    )

    return {
        "profile_analysis": profile_analysis,
        "education_analysis": education_analysis,
        "skills_analysis": skills_analysis,
        "projects_analysis": projects_analysis,
        "experience_analysis": experience_analysis,
        "courses_certifications_analysis": (
            courses_analysis
        ),
        "findings": all_findings,
        "finding_counts": {
            "high": high_count,
            "medium": medium_count,
            "low": low_count,
            "total": len(all_findings),
        },
    }