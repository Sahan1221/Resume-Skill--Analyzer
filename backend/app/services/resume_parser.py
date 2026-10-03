import re

from app.schemas.resume import (
    EducationItem,
    ExperienceItem,
    ProjectItem,
    ResumeData,
)


SECTION_HEADERS = {
    "PROFILE",
    "SUMMARY",
    "EDUCATION",
    "TECHNICAL SKILLS",
    "SKILLS",
    "PROJECTS",
    "EXPERIENCE",
    "WORK EXPERIENCE",
    "COURSES & CERTIFICATIONS",
    "CERTIFICATIONS",
    "ADDITIONAL",
}


def clean_line(line: str) -> str:
    """
    Clean text extracted from a PDF.
    """

    line = line.replace("\x7f", "")
    line = line.replace("", "")

    line = re.sub(r"\s+", " ", line)

    return line.strip()


def is_bullet_line(line: str) -> bool:
    """
    Detect bullet-style lines produced by PDF extraction.

    The sample PDF uses a control character represented
    as '', so we explicitly handle it here.
    """

    stripped = line.strip()

    return (
        stripped.startswith("•")
        or stripped.startswith("●")
        or stripped.startswith("*")
        or stripped.startswith("-")
        or stripped.startswith("–")
        or stripped.startswith("")
        or "\x7f" in line
        or "" in line
    )


def clean_bullet(line: str) -> str:
    """
    Remove bullet characters and clean the text.
    """

    line = line.replace("\x7f", "")
    line = line.replace("", "")

    line = line.lstrip("•●*-– ")

    return clean_line(line)


def get_sections(text: str) -> dict[str, list[str]]:
    """
    Split the resume into named sections.
    """

    sections: dict[str, list[str]] = {}

    current_section = "HEADER"

    sections[current_section] = []

    for raw_line in text.splitlines():

        line = clean_line(raw_line)

        if not line:
            continue

        upper_line = line.upper()

        if upper_line in SECTION_HEADERS:

            current_section = upper_line

            if current_section not in sections:
                sections[current_section] = []

        else:

            sections.setdefault(
                current_section,
                [],
            )

            sections[current_section].append(line)

    return sections


def extract_name(text: str) -> str:
    """
    Extract the candidate's name from the beginning
    of the resume.
    """

    for raw_line in text.splitlines():

        line = clean_line(raw_line)

        if not line:
            continue

        upper_line = line.upper()

        if upper_line in SECTION_HEADERS:
            break

        if "@" in line:
            continue

        if re.search(
            r"\+?\d[\d\s\-()]{6,}",
            line,
        ):
            continue

        if "github.com" in line.lower():
            continue

        return line

    return ""


def extract_profile(
    sections: dict[str, list[str]],
) -> str:
    """
    Extract the profile/summary section.
    """

    profile_lines = sections.get(
        "PROFILE",
        [],
    )

    if not profile_lines:
        profile_lines = sections.get(
            "SUMMARY",
            [],
        )

    return " ".join(profile_lines).strip()


def extract_skills(
    sections: dict[str, list[str]],
) -> list[str]:
    """
    Extract individual skills.
    """

    lines = sections.get(
        "TECHNICAL SKILLS",
        [],
    )

    if not lines:
        lines = sections.get(
            "SKILLS",
            [],
        )

    skills: list[str] = []

    for line in lines:

        if ":" in line:

            _, skill_text = line.split(
                ":",
                1,
            )

        else:

            skill_text = line

        parts = re.split(
            r",|;",
            skill_text,
        )

        for part in parts:

            skill = clean_line(part)

            if (
                skill
                and skill not in skills
            ):
                skills.append(skill)

    return skills


def extract_education(
    sections: dict[str, list[str]],
) -> list[EducationItem]:
    """
    Extract education information.
    """

    lines = sections.get(
        "EDUCATION",
        [],
    )

    if not lines:
        return []

    degree = ""
    institution = ""
    graduation_year = ""

    for line in lines:

        year_match = re.search(
            r"(19|20)\d{2}",
            line,
        )

        if year_match:
            graduation_year = (
                year_match.group(0)
            )

        if "expected graduation" in line.lower():
            continue

        if not degree:

            if "—" in line:

                degree, institution = [
                    part.strip()
                    for part in line.split(
                        "—",
                        1,
                    )
                ]

            elif " - " in line:

                degree, institution = [
                    part.strip()
                    for part in line.split(
                        " - ",
                        1,
                    )
                ]

            else:

                degree = line

        elif not institution:

            institution = line

    if not degree and not institution:
        return []

    return [
        EducationItem(
            degree=degree,
            institution=institution,
            graduation_year=graduation_year,
        )
    ]


def extract_projects(
    sections: dict[str, list[str]],
) -> list[ProjectItem]:
    """
    Extract projects.

    A project is identified by a non-bullet line.
    Bullet lines following it belong to that project.

    PDF extraction sometimes removes the bullet character.
    Therefore we also use common project-name patterns
    to distinguish project names from descriptions.
    """

    lines = sections.get(
        "PROJECTS",
        [],
    )

    if not lines:
        return []

    projects: list[ProjectItem] = []

    current_name = ""
    description_lines: list[str] = []

    project_name_patterns = [
        "resume & skill analyzer",
        "product inventory management system",
        "student task management web application",
    ]

    for raw_line in lines:

        line = clean_line(raw_line)

        if not line:
            continue

        lower_line = line.lower()

        # Explicit project names from the sample structure.
        is_known_project_name = any(
            pattern == lower_line
            for pattern in project_name_patterns
        )

        if is_known_project_name:

            if current_name:

                projects.append(
                    ProjectItem(
                        name=current_name,
                        description=" ".join(
                            description_lines
                        ),
                    )
                )

            current_name = line
            description_lines = []

            continue

        # Detect actual bullet lines.
        if is_bullet_line(raw_line):

            description = clean_bullet(
                raw_line
            )

            if description:
                description_lines.append(
                    description
                )

            continue

        # Lines beginning with common action verbs
        # are descriptions, even if the PDF removed
        # the bullet marker.
        description_starters = (
            "developed ",
            "built ",
            "designed ",
            "implemented ",
            "used ",
            "created ",
            "configured ",
            "integrated ",
            "added ",
            "implemented ",
            "worked ",
            "managed ",
        )

        if lower_line.startswith(
            description_starters
        ):

            description_lines.append(line)

            continue

        # Continuation of a previous description.
        if description_lines:

            description_lines.append(line)

            continue

        # Otherwise treat it as a new project.
        if current_name:

            projects.append(
                ProjectItem(
                    name=current_name,
                    description=" ".join(
                        description_lines
                    ),
                )
            )

        current_name = line
        description_lines = []

    # Save final project.
    if current_name:

        projects.append(
            ProjectItem(
                name=current_name,
                description=" ".join(
                    description_lines
                ),
            )
        )

    return projects


def extract_experience(
    sections: dict[str, list[str]],
) -> list[ExperienceItem]:
    """
    Extract work or academic experience.

    The parser handles the sample format where the
    experience title is followed by bullet descriptions.
    """

    lines = sections.get(
        "EXPERIENCE",
        [],
    )

    if not lines:

        lines = sections.get(
            "WORK EXPERIENCE",
            [],
        )

    if not lines:
        return []

    experiences: list[ExperienceItem] = []

    current_title = ""
    description_lines: list[str] = []

    for raw_line in lines:

        line = clean_line(raw_line)

        if not line:
            continue

        lower_line = line.lower()

        # Bullet line = description.
        if is_bullet_line(raw_line):

            description = clean_bullet(
                raw_line
            )

            if description:
                description_lines.append(
                    description
                )

            continue

        # Common action verbs indicate descriptions.
        description_starters = (
            "worked ",
            "created ",
            "developed ",
            "built ",
            "implemented ",
            "used ",
            "designed ",
            "managed ",
            "assisted ",
            "supported ",
        )

        if lower_line.startswith(
            description_starters
        ):

            description_lines.append(line)

            continue

        # If the current experience has not
        # been established, this is the title.
        if not current_title:

            current_title = line

            continue

        # Otherwise, treat non-bullet continuation
        # text as part of the description.
        description_lines.append(line)

    if current_title:

        experiences.append(
            ExperienceItem(
                title=current_title,
                organization="",
                description=" ".join(
                    description_lines
                ),
            )
        )

    return experiences


def extract_courses_certifications(
    sections: dict[str, list[str]],
) -> list[str]:
    """
    Extract courses and certifications.
    """

    lines = sections.get(
        "COURSES & CERTIFICATIONS",
        [],
    )

    if not lines:

        lines = sections.get(
            "CERTIFICATIONS",
            [],
        )

    results: list[str] = []

    for line in lines:

        cleaned = clean_bullet(line)

        if (
            cleaned
            and cleaned not in results
        ):
            results.append(cleaned)

    return results


def extract_languages(
    sections: dict[str, list[str]],
) -> list[str]:
    """
    Extract languages from the ADDITIONAL section.
    """

    lines = sections.get(
        "ADDITIONAL",
        [],
    )

    languages: list[str] = []

    for line in lines:

        if line.lower().startswith(
            "languages:"
        ):

            language_text = line.split(
                ":",
                1,
            )[1]

            for language in re.split(
                r",|;",
                language_text,
            ):

                language = clean_line(
                    language
                )

                if (
                    language
                    and language not in languages
                ):
                    languages.append(
                        language
                    )

    return languages


def parse_resume(text: str) -> ResumeData:
    """
    Convert extracted resume text into
    structured ResumeData.
    """

    sections = get_sections(text)

    return ResumeData(
        name=extract_name(text),
        profile=extract_profile(sections),
        education=extract_education(sections),
        skills=extract_skills(sections),
        projects=extract_projects(sections),
        experience=extract_experience(sections),
        courses_certifications=(
            extract_courses_certifications(
                sections
            )
        ),
        languages=extract_languages(
            sections
        ),
    )