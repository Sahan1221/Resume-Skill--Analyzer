from app.services.resume_quality_service import (
    analyze_resume_quality,
    contains_action_verb,
    contains_quantification,
)


def test_action_verb_detection():
    assert contains_action_verb(
        "Developed a web application using Python."
    )

    assert contains_action_verb(
        "Implemented database operations."
    )

    assert not contains_action_verb(
        "A web application for student tasks."
    )


def test_quantification_detection():
    assert contains_quantification(
        "Improved response time by 30%."
    )

    assert contains_quantification(
        "Processed 500 records."
    )

    assert not contains_quantification(
        "Developed a web application."
    )


def test_resume_quality_detects_complete_resume():
    resume_data = {
        "profile": (
            "Software Engineering undergraduate "
            "interested in backend development."
        ),
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
            "Git",
            "React",
        ],
        "projects": [
            {
                "name": "Resume Analyzer",
                "description": (
                    "Developed a resume analysis system "
                    "that processed 100 resumes."
                ),
            }
        ],
        "experience": [
            {
                "title": "Software Intern",
                "organization": "Example Company",
                "description": (
                    "Implemented backend APIs and "
                    "improved processing time by 20%."
                ),
            }
        ],
        "courses_certifications": [
            "Software Engineering Fundamentals",
        ],
    }

    result = analyze_resume_quality(
        resume_data
    )

    assert result[
        "profile_analysis"
    ]["present"]

    assert result[
        "education_analysis"
    ]["present"]

    assert result[
        "skills_analysis"
    ]["skill_count"] == 5

    assert result[
        "projects_analysis"
    ]["project_count"] == 1

    assert result[
        "projects_analysis"
    ]["projects_with_action_verbs"] == 1

    assert result[
        "projects_analysis"
    ]["projects_with_quantification"] == 1

    assert result[
        "experience_analysis"
    ]["entries_with_action_verbs"] == 1

    assert result[
        "experience_analysis"
    ]["entries_with_quantification"] == 1


def test_resume_quality_detects_missing_sections():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    result = analyze_resume_quality(
        resume_data
    )

    findings = result["findings"]

    codes = {
        finding["code"]
        for finding in findings
    }

    assert "missing_profile" in codes
    assert "missing_education" in codes
    assert "missing_skills" in codes
    assert "missing_projects" in codes


def test_resume_quality_detects_missing_quantification():
    resume_data = {
        "profile": (
            "Software Engineering student "
            "interested in backend development."
        ),
        "education": [
            {
                "degree": "BSc Software Engineering",
                "institution": "University",
                "graduation_year": "2027",
            }
        ],
        "skills": [
            "Python",
            "SQL",
            "Git",
            "React",
            "Java",
        ],
        "projects": [
            {
                "name": "Project One",
                "description": (
                    "Developed a web application."
                ),
            }
        ],
        "experience": [],
        "courses_certifications": [],
    }

    result = analyze_resume_quality(
        resume_data
    )

    codes = {
        finding["code"]
        for finding in result["findings"]
    }

    assert "no_project_quantification" in codes