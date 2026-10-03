"""
Skill aliases and related-skill evidence rules.

These rules allow the V1 comparison engine to recognize
that some resume skills provide evidence for a broader
role requirement.

The rules are intentionally explicit and transparent.
"""

SKILL_ALIASES = {
    "sql": [
        "sql",
        "mysql",
        "sql server",
        "sqlite",
        "postgresql",
        "postgres",
    ],

    "databases": [
        "databases",
        "database",
        "mysql",
        "sql server",
        "sqlite",
        "postgresql",
        "postgres",
    ],

    "rest apis": [
        "rest apis",
        "rest api",
        "fastapi",
        "node.js",
        "express",
        ".net",
    ],

    "software testing": [
        "software testing",
        "testing",
        "unit testing",
        "integration testing",
        "pytest",
    ],

    "git": [
        "git",
        "github",
        "gitlab",
        "bitbucket",
    ],

    "web development": [
        "web development",
        "react",
        "javascript",
        "typescript",
        "html",
        "css",
    ],
}


def normalize_skill(skill: str) -> str:
    """
    Normalize a skill name for comparison.
    """

    return " ".join(
        skill.lower().strip().split()
    )


def get_skill_evidence(
    required_skill: str,
) -> list[str]:
    """
    Return resume skills that can provide evidence
    for a required skill.
    """

    normalized_required_skill = normalize_skill(
        required_skill
    )

    aliases = SKILL_ALIASES.get(
        normalized_required_skill
    )

    if aliases is None:
        return [
            normalized_required_skill
        ]

    return [
        normalize_skill(alias)
        for alias in aliases
    ]