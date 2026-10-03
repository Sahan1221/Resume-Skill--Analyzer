from app.data.role_requirements import (
    get_role_requirements,
    get_supported_roles,
)


def analyze_role_requirements(
    target_role: str,
) -> dict:
    """
    Retrieve structured requirements for a target role.
    """

    requirements = get_role_requirements(
        target_role
    )

    return {
        "role": target_role,
        "description": requirements["description"],
        "skills": requirements["skills"],
        "requirements": requirements["requirements"],
    }


def list_supported_roles() -> list[str]:
    """
    Return all roles currently supported by V1.
    """

    return get_supported_roles()