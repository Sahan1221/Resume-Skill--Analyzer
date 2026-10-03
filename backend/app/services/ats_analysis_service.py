"""
Service for ATS-oriented resume and keyword analysis.

V1 uses transparent rule-based checks.

The analyzer does not claim to predict whether a resume
will pass a specific ATS. Instead, it reports observable
keyword and resume-structure findings.
"""

import re
from typing import Any


# -------------------------------------------------------------------
# Text normalization
# -------------------------------------------------------------------

def normalize_text(value: str) -> str:
    """Normalize text for keyword matching."""

    return " ".join(
        value.lower().strip().split()
    )


def contains_keyword(
    text: str,
    keyword: str,
) -> bool:
    """
    Check whether a keyword exists as a complete word or phrase.

    Word boundaries are used to reduce false matches.

    Examples:
        C#        -> matches C#
        Java      -> matches Java
        SQL       -> matches SQL

    The keyword is escaped so symbols such as # and + are handled
    safely.
    """

    normalized_text = normalize_text(text)
    normalized_keyword = normalize_text(keyword)

    if not normalized_keyword:
        return False

    pattern = (
        r"(?<!\w)"
        + re.escape(normalized_keyword)
        + r"(?!\w)"
    )

    return re.search(
        pattern,
        normalized_text,
    ) is not None


# -------------------------------------------------------------------
# Keyword analysis
# -------------------------------------------------------------------

def analyze_keywords(
    resume_text: str,
    role_skills: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Analyze the presence of target-role skill keywords
    in the resume text.

    This is literal keyword analysis.

    It is intentionally separate from skill-gap analysis:
        Skill gap analysis:
            understands configured skill evidence/aliases.

        ATS keyword analysis:
            checks whether the actual role keyword appears
            explicitly in the resume text.
    """

    present_keywords: list[dict[str, Any]] = []
    missing_keywords: list[dict[str, Any]] = []

    seen_keywords: set[str] = set()

    for role_skill in role_skills:

        keyword = role_skill.get(
            "name",
            "",
        ).strip()

        if not keyword:
            continue

        normalized_keyword = normalize_text(
            keyword
        )

        if normalized_keyword in seen_keywords:
            continue

        seen_keywords.add(
            normalized_keyword
        )

        importance = role_skill.get(
            "importance",
            "medium",
        )

        category = role_skill.get(
            "category",
            "",
        )

        if contains_keyword(
            resume_text,
            keyword,
        ):
            present_keywords.append(
                {
                    "keyword": keyword,
                    "category": category,
                    "importance": importance,
                }
            )

        else:
            missing_keywords.append(
                {
                    "keyword": keyword,
                    "category": category,
                    "importance": importance,
                }
            )

    total_keywords = (
        len(present_keywords)
        + len(missing_keywords)
    )

    keyword_coverage_percentage = (
        round(
            (
                len(present_keywords)
                / total_keywords
            )
            * 100,
            2,
        )
        if total_keywords > 0
        else 0.0
    )

    high_importance_missing = [
        item
        for item in missing_keywords
        if item["importance"] == "high"
    ]

    medium_importance_missing = [
        item
        for item in missing_keywords
        if item["importance"] == "medium"
    ]

    low_importance_missing = [
        item
        for item in missing_keywords
        if item["importance"] == "low"
    ]

    return {
        "present_keywords": present_keywords,
        "missing_keywords": missing_keywords,
        "present_count": len(
            present_keywords
        ),
        "missing_count": len(
            missing_keywords
        ),
        "total_keywords": total_keywords,
        "keyword_coverage_percentage": (
            keyword_coverage_percentage
        ),
        "high_importance_missing": (
            high_importance_missing
        ),
        "medium_importance_missing": (
            medium_importance_missing
        ),
        "low_importance_missing": (
            low_importance_missing
        ),
    }


# -------------------------------------------------------------------
# Resume structure analysis
# -------------------------------------------------------------------

def analyze_resume_structure(
    resume_text: str,
    resume_data: dict[str, Any],
) -> dict[str, Any]:
    """
    Check for common resume information and standard sections.

    These checks are descriptive. They do not claim that a particular
    ATS will accept or reject the resume.
    """

    normalized_text = normalize_text(
        resume_text
    )

    checks: list[dict[str, Any]] = []

    # ---------------------------------------------------------------
    # Contact information
    # ---------------------------------------------------------------

    email_found = (
        re.search(
            r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
            resume_text,
            re.IGNORECASE,
        )
        is not None
    )

    phone_found = (
        re.search(
            r"(?:\+?\d[\d\s().-]{7,}\d)",
            resume_text,
        )
        is not None
    )

    github_found = (
        "github.com"
        in normalized_text
    )

    checks.append(
        {
            "name": "Email address",
            "status": (
                "present"
                if email_found
                else "missing"
            ),
            "description": (
                "An email address was detected."
                if email_found
                else "No email address was detected."
            ),
        }
    )

    checks.append(
        {
            "name": "Phone number",
            "status": (
                "present"
                if phone_found
                else "missing"
            ),
            "description": (
                "A phone number was detected."
                if phone_found
                else "No phone number was detected."
            ),
        }
    )

    checks.append(
        {
            "name": "GitHub profile",
            "status": (
                "present"
                if github_found
                else "not_detected"
            ),
            "description": (
                "A GitHub profile link was detected."
                if github_found
                else "No GitHub profile link was detected."
            ),
        }
    )

    # ---------------------------------------------------------------
    # Standard resume sections
    # ---------------------------------------------------------------

    section_definitions = [
        (
            "Profile / Summary",
            [
                "profile",
                "summary",
                "professional summary",
            ],
            bool(
                resume_data.get(
                    "profile",
                    "",
                ).strip()
            ),
        ),
        (
            "Education",
            [
                "education",
            ],
            bool(
                resume_data.get(
                    "education",
                    [],
                )
            ),
        ),
        (
            "Skills",
            [
                "technical skills",
                "skills",
                "technical skill",
            ],
            bool(
                resume_data.get(
                    "skills",
                    [],
                )
            ),
        ),
        (
            "Projects",
            [
                "projects",
                "project",
            ],
            bool(
                resume_data.get(
                    "projects",
                    [],
                )
            ),
        ),
        (
            "Experience",
            [
                "experience",
                "work experience",
                "professional experience",
            ],
            bool(
                resume_data.get(
                    "experience",
                    [],
                )
            ),
        ),
        (
            "Courses / Certifications",
            [
                "courses & certifications",
                "certifications",
                "courses",
                "certificates",
            ],
            bool(
                resume_data.get(
                    "courses_certifications",
                    [],
                )
            ),
        ),
    ]

    for section_name, headings, structured_data_exists in (
        section_definitions
    ):
        heading_found = any(
            heading in normalized_text
            for heading in headings
        )

        if heading_found or structured_data_exists:
            status = "present"
        else:
            status = "missing"

        checks.append(
            {
                "name": section_name,
                "status": status,
                "description": (
                    f"{section_name} section detected."
                    if status == "present"
                    else f"{section_name} section was not detected."
                ),
            }
        )

    present_count = sum(
        1
        for check in checks
        if check["status"] == "present"
    )

    missing_count = sum(
        1
        for check in checks
        if check["status"] == "missing"
    )

    return {
        "checks": checks,
        "present_count": present_count,
        "missing_count": missing_count,
        "total_checks": len(checks),
    }


# -------------------------------------------------------------------
# Basic text quality checks
# -------------------------------------------------------------------

def analyze_text_quality(
    resume_text: str,
) -> dict[str, Any]:
    """
    Perform basic text-level checks.

    These checks are deliberately conservative because PDF
    extraction cannot reliably determine visual formatting.
    """

    stripped_text = resume_text.strip()

    word_count = len(
        stripped_text.split()
    )

    line_count = len(
        [
            line
            for line in stripped_text.splitlines()
            if line.strip()
        ]
    )

    findings: list[dict[str, Any]] = []

    # ---------------------------------------------------------------
    # Empty / unreadable document
    # ---------------------------------------------------------------

    if not stripped_text:
        findings.append(
            {
                "type": "error",
                "code": "empty_text",
                "message": (
                    "No readable resume text was extracted."
                ),
            }
        )

    # ---------------------------------------------------------------
    # Very short resume
    # ---------------------------------------------------------------

    elif word_count < 100:
        findings.append(
            {
                "type": "warning",
                "code": "very_short_resume",
                "message": (
                    "The extracted resume contains very little text."
                ),
            }
        )

    # ---------------------------------------------------------------
    # Extremely long resume
    # ---------------------------------------------------------------

    elif word_count > 2500:
        findings.append(
            {
                "type": "warning",
                "code": "very_long_resume",
                "message": (
                    "The extracted resume contains a large amount "
                    "of text."
                ),
            }
        )

    # ---------------------------------------------------------------
    # No line structure
    # ---------------------------------------------------------------

    if stripped_text and line_count < 5:
        findings.append(
            {
                "type": "warning",
                "code": "limited_line_structure",
                "message": (
                    "The extracted resume has very little line structure."
                ),
            }
        )

    return {
        "word_count": word_count,
        "line_count": line_count,
        "findings": findings,
    }


# -------------------------------------------------------------------
# ATS findings
# -------------------------------------------------------------------

def build_ats_findings(
    keyword_analysis: dict[str, Any],
    structure_analysis: dict[str, Any],
    text_quality: dict[str, Any],
) -> list[dict[str, Any]]:
    """
    Convert analysis results into concise ATS-oriented findings.
    """

    findings: list[dict[str, Any]] = []

    # ---------------------------------------------------------------
    # Missing high-importance keywords
    # ---------------------------------------------------------------

    for item in keyword_analysis[
        "high_importance_missing"
    ]:
        findings.append(
            {
                "type": "keyword",
                "severity": "high",
                "code": "missing_high_importance_keyword",
                "message": (
                    f"The role keyword '{item['keyword']}' "
                    "was not found explicitly in the resume."
                ),
                "keyword": item["keyword"],
            }
        )

    # ---------------------------------------------------------------
    # Missing medium-importance keywords
    # ---------------------------------------------------------------

    for item in keyword_analysis[
        "medium_importance_missing"
    ]:
        findings.append(
            {
                "type": "keyword",
                "severity": "medium",
                "code": "missing_medium_importance_keyword",
                "message": (
                    f"The role keyword '{item['keyword']}' "
                    "was not found explicitly in the resume."
                ),
                "keyword": item["keyword"],
            }
        )

    # ---------------------------------------------------------------
    # Missing structure checks
    # ---------------------------------------------------------------

    for check in structure_analysis["checks"]:

        if check["status"] != "missing":
            continue

        findings.append(
            {
                "type": "structure",
                "severity": "medium",
                "code": "missing_resume_section",
                "message": check["description"],
                "section": check["name"],
            }
        )

    # ---------------------------------------------------------------
    # Text quality findings
    # ---------------------------------------------------------------

    findings.extend(
        {
            "type": item["type"],
            "severity": (
                "high"
                if item["type"] == "error"
                else "medium"
            ),
            "code": item["code"],
            "message": item["message"],
        }
        for item in text_quality["findings"]
    )

    return findings


# -------------------------------------------------------------------
# Main ATS analysis
# -------------------------------------------------------------------

def analyze_ats(
    resume_text: str,
    resume_data: dict[str, Any],
    role_skills: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Run the complete V1 ATS and keyword analysis.
    """

    keyword_analysis = analyze_keywords(
        resume_text=resume_text,
        role_skills=role_skills,
    )

    structure_analysis = analyze_resume_structure(
        resume_text=resume_text,
        resume_data=resume_data,
    )

    text_quality = analyze_text_quality(
        resume_text=resume_text,
    )

    findings = build_ats_findings(
        keyword_analysis=keyword_analysis,
        structure_analysis=structure_analysis,
        text_quality=text_quality,
    )

    return {
        "keyword_analysis": keyword_analysis,
        "structure_analysis": structure_analysis,
        "text_quality": text_quality,
        "findings": findings,
    }