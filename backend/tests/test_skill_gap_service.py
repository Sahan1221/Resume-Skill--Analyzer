from app.services.skill_gap_service import (
    compare_skills,
)


def test_compare_skills_finds_matches_and_gaps():
    resume_skills = [
        "Python",
        "SQL",
        "Git",
        "React",
    ]

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
        {
            "name": "Debugging",
            "category": "Software Engineering",
            "importance": "medium",
        },
    ]

    result = compare_skills(
        resume_skills=resume_skills,
        role_skills=role_skills,
    )

    matched_names = [
        skill["name"]
        for skill in result["matched_skills"]
    ]

    gap_names = [
        skill["name"]
        for skill in result["skill_gaps"]
    ]

    assert "Python" in matched_names
    assert "SQL" in matched_names

    assert "Algorithms" in gap_names
    assert "Debugging" in gap_names

    assert result["matched_count"] == 2
    assert result["gap_count"] == 2
    assert result["total_role_skills"] == 4
    assert result["match_percentage"] == 50.0


def test_high_importance_missing_skill_is_high_gap():
    resume_skills = [
        "Python",
    ]

    role_skills = [
        {
            "name": "Python",
            "category": "Programming Language",
            "importance": "high",
        },
        {
            "name": "Data Structures",
            "category": "Computer Science",
            "importance": "high",
        },
    ]

    result = compare_skills(
        resume_skills=resume_skills,
        role_skills=role_skills,
    )

    assert len(result["skill_gaps"]) == 1

    gap = result["skill_gaps"][0]

    assert gap["name"] == "Data Structures"
    assert gap["gap_level"] == "high"


def test_skill_comparison_is_case_insensitive():
    resume_skills = [
        "python",
        "SQL",
        "gIt",
    ]

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
            "name": "Git",
            "category": "Development Tool",
            "importance": "high",
        },
    ]

    result = compare_skills(
        resume_skills=resume_skills,
        role_skills=role_skills,
    )

    assert result["matched_count"] == 3
    assert result["gap_count"] == 0
    assert result["match_percentage"] == 100.0


def test_mysql_provides_sql_evidence():
    resume_skills = [
        "MySQL",
    ]

    role_skills = [
        {
            "name": "SQL",
            "category": "Database",
            "importance": "high",
        },
    ]

    result = compare_skills(
        resume_skills=resume_skills,
        role_skills=role_skills,
    )

    assert result["matched_count"] == 1
    assert result["gap_count"] == 0

    matched_skill = result["matched_skills"][0]

    assert matched_skill["name"] == "SQL"
    assert "MySQL" in matched_skill["evidence"]


def test_database_evidence_from_mysql_and_sql_server():
    resume_skills = [
        "MySQL",
        "SQL Server",
    ]

    role_skills = [
        {
            "name": "Databases",
            "category": "Database",
            "importance": "high",
        },
    ]

    result = compare_skills(
        resume_skills=resume_skills,
        role_skills=role_skills,
    )

    assert result["matched_count"] == 1
    assert result["gap_count"] == 0

    matched_skill = result["matched_skills"][0]

    assert matched_skill["name"] == "Databases"
    assert "MySQL" in matched_skill["evidence"]
    assert "SQL Server" in matched_skill["evidence"]