from pydantic import BaseModel, Field


class EducationItem(BaseModel):
    degree: str = ""
    institution: str = ""
    graduation_year: str = ""


class ProjectItem(BaseModel):
    name: str = ""
    description: str = ""


class ExperienceItem(BaseModel):
    title: str = ""
    organization: str = ""
    description: str = ""


class ResumeData(BaseModel):
    """
    Structured representation of the information
    extracted from a resume.
    """

    name: str = ""

    profile: str = ""

    education: list[EducationItem] = Field(default_factory=list)

    skills: list[str] = Field(default_factory=list)

    projects: list[ProjectItem] = Field(default_factory=list)

    experience: list[ExperienceItem] = Field(default_factory=list)

    courses_certifications: list[str] = Field(default_factory=list)

    languages: list[str] = Field(default_factory=list)