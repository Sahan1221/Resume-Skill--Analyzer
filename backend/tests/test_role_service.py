from app.services.role_service import (
    analyze_role_requirements,
    list_supported_roles,
)


def test_software_engineering_intern_requirements():
    result = analyze_role_requirements(
        "Software Engineering Intern"
    )

    assert (
        result["role"]
        == "Software Engineering Intern"
    )

    assert len(result["skills"]) > 0
    assert len(result["requirements"]) > 0

    skill_names = [
        skill["name"]
        for skill in result["skills"]
    ]

    assert "Python" in skill_names
    assert "SQL" in skill_names
    assert "Git" in skill_names


def test_supported_roles():
    roles = list_supported_roles()

    assert (
        "software engineering intern"
        in roles
    )