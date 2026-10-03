from app.services.ats_analysis_service import (
    analyze_ats,
    analyze_keywords,
    contains_keyword,
)


def test_contains_keyword_uses_complete_word_matching():
    assert contains_keyword(
        "Python JavaScript SQL",
        "Python",
    )

    assert contains_keyword(
        "Python JavaScript SQL",
        "SQL",
    )

    assert not contains_keyword(
        "CSS HTML",
        "C",
    )


def test_keyword_analysis_detects_present_and_missing_keywords():
    resume_text = """
    Software Engineering student.
    Python, JavaScript, SQL and Git.
    """

    role_skills = [
        {
            "name": "Python",
            "category": "Programming Language",
            "importance": "high",
        },
        {
            "name": "SQL",
            "category": "Database",
            "importance": "high",
        },
        {
            "name": "Algorithms",
            "category": "Computer Science",
            "importance": "medium",
        },
    ]

    result = analyze_keywords(
        resume_text=resume_text,
        role_skills=role_skills,
    )

    assert result["present_count"] == 2
    assert result["missing_count"] == 1
    assert result["total_keywords"] == 3
    assert result["keyword_coverage_percentage"] == 66.67

    present = [
        item["keyword"]
        for item in result["present_keywords"]
    ]

    missing = [
        item["keyword"]
        for item in result["missing_keywords"]
    ]

    assert "Python" in present
    assert "SQL" in present
    assert "Algorithms" in missing


def test_keyword_analysis_identifies_high_importance_missing_keyword():
    resume_text = """
    Software Engineering student.
    Python and Git.
    """

    role_skills = [
        {
            "name": "Python",
            "category": "Programming Language",
            "importance": "high",
        },
        {
            "name": "Debugging",
            "category": "Software Engineering",
            "importance": "high",
        },
    ]

    result = analyze_keywords(
        resume_text=resume_text,
        role_skills=role_skills,
    )

    assert len(
        result["high_importance_missing"]
    ) == 1

    assert (
        result["high_importance_missing"][0]["keyword"]
        == "Debugging"
    )


def test_ats_detects_standard_resume_sections():
    resume_text = """
    Alex Perera
    alex@example.com
    +94 77 123 4567
    github.com/alexperera

    PROFILE
    Software Engineering undergraduate.

    EDUCATION
    BSc Software Engineering

    TECHNICAL SKILLS
    Python, Java, SQL

    PROJECTS
    Resume Analyzer

    EXPERIENCE
    Academic Software Projects

    COURSES & CERTIFICATIONS
    Software Engineering Fundamentals
    """

    resume_data = {
        "profile": "Software Engineering undergraduate.",
        "education": [
            {
                "degree": "BSc Software Engineering",
                "institution": "University",
                "graduation_year": "2027",
            }
        ],
        "skills": [
            "Python",
            "Java",
            "SQL",
        ],
        "projects": [
            {
                "name": "Resume Analyzer",
                "description": "Software project.",
            }
        ],
        "experience": [
            {
                "title": "Academic Software Projects",
                "organization": "University",
                "description": "Software development.",
            }
        ],
        "courses_certifications": [
            "Software Engineering Fundamentals",
        ],
    }

    role_skills = []

    result = analyze_ats(
        resume_text=resume_text,
        resume_data=resume_data,
        role_skills=role_skills,
    )

    checks = result[
        "structure_analysis"
    ]["checks"]

    assert all(
        check["status"] == "present"
        for check in checks
        if check["name"] != "GitHub profile"
    )


def test_ats_detects_missing_contact_information():
    resume_text = """
    PROFILE
    Software Engineering student.

    EDUCATION
    BSc Software Engineering

    TECHNICAL SKILLS
    Python
    """

    resume_data = {
        "profile": "Software Engineering student.",
        "education": [
            {
                "degree": "BSc Software Engineering",
                "institution": "University",
                "graduation_year": "2027",
            }
        ],
        "skills": [
            "Python",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    result = analyze_ats(
        resume_text=resume_text,
        resume_data=resume_data,
        role_skills=[],
    )

    checks = result[
        "structure_analysis"
    ]["checks"]

    email_check = next(
        check
        for check in checks
        if check["name"] == "Email address"
    )

    phone_check = next(
        check
        for check in checks
        if check["name"] == "Phone number"
    )

    assert email_check["status"] == "missing"
    assert phone_check["status"] == "missing"


def test_ats_reports_missing_role_keyword():
    resume_text = """
    Python developer with Git experience.
    """

    resume_data = {
        "profile": "Python developer.",
        "education": [],
        "skills": [
            "Python",
            "Git",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    role_skills = [
        {
            "name": "Python",
            "category": "Programming Language",
            "importance": "high",
        },
        {
            "name": "Algorithms",
            "category": "Computer Science",
            "importance": "medium",
        },
    ]

    result = analyze_ats(
        resume_text=resume_text,
        resume_data=resume_data,
        role_skills=role_skills,
    )

    findings = result["findings"]

    algorithm_findings = [
        finding
        for finding in findings
        if finding.get("keyword") == "Algorithms"
    ]

    assert len(algorithm_findings) == 1