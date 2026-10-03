"""
V1 role requirements dataset.

This dataset provides commonly associated skills and requirements
for supported internship/job roles.

The dataset is intentionally kept local for V1 so the application
does not depend on paid APIs or external services.
"""


ROLE_REQUIREMENTS = {
    "frontend developer intern": {
        "description": (
            "Common requirements for university students applying "
            "for frontend development internships."
        ),
        "skills": [
            {
                "name": "HTML",
                "category": "Web Development",
                "importance": "high",
            },
            {
                "name": "CSS",
                "category": "Web Development",
                "importance": "high",
            },
            {
                "name": "JavaScript",
                "category": "Programming Language",
                "importance": "high",
            },
            {
                "name": "TypeScript",
                "category": "Programming Language",
                "importance": "medium",
            },
            {
                "name": "React",
                "category": "Web Development",
                "importance": "high",
            },
            {
                "name": "Git",
                "category": "Development Tool",
                "importance": "high",
            },
            {
                "name": "GitHub",
                "category": "Development Tool",
                "importance": "medium",
            },
            {
                "name": "REST APIs",
                "category": "Web Development",
                "importance": "medium",
            },
            {
                "name": "Responsive Design",
                "category": "Web Development",
                "importance": "high",
            },
            {
                "name": "Web Accessibility",
                "category": "Web Development",
                "importance": "medium",
            },
            {
                "name": "UI/UX",
                "category": "Design",
                "importance": "medium",
            },
            {
                "name": "Debugging",
                "category": "Software Engineering",
                "importance": "medium",
            },
            {
                "name": "Software Testing",
                "category": "Software Engineering",
                "importance": "medium",
            },
        ],
        "requirements": [
            "Currently studying Computer Science, Software Engineering, or a related degree.",
            "Ability to build web interfaces using HTML, CSS, and JavaScript.",
            "Understanding of responsive web design principles.",
            "Experience with a modern frontend framework such as React.",
            "Basic understanding of TypeScript or strongly typed JavaScript.",
            "Ability to consume REST APIs from frontend applications.",
            "Ability to use Git and GitHub for version control.",
            "Basic understanding of web accessibility.",
            "Ability to debug frontend applications.",
            "Ability to communicate technical information clearly.",
        ],
    },
    "software engineering intern": {
        "description": (
            "Common requirements for university students applying "
            "for software engineering internships."
        ),
        "skills": [
            {
                "name": "Python",
                "category": "Programming Language",
                "importance": "high",
            },
            {
                "name": "Java",
                "category": "Programming Language",
                "importance": "high",
            },
            {
                "name": "C#",
                "category": "Programming Language",
                "importance": "high",
            },
            {
                "name": "JavaScript",
                "category": "Programming Language",
                "importance": "high",
            },
            {
                "name": "TypeScript",
                "category": "Programming Language",
                "importance": "medium",
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
            {
                "name": "GitHub",
                "category": "Development Tool",
                "importance": "medium",
            },
            {
                "name": "REST APIs",
                "category": "Web Development",
                "importance": "high",
            },
            {
                "name": "OOP",
                "category": "Software Engineering",
                "importance": "high",
            },
            {
                "name": "Data Structures",
                "category": "Computer Science",
                "importance": "high",
            },
            {
                "name": "Algorithms",
                "category": "Computer Science",
                "importance": "medium",
            },
            {
                "name": "Software Testing",
                "category": "Software Engineering",
                "importance": "high",
            },
            {
                "name": "Debugging",
                "category": "Software Engineering",
                "importance": "medium",
            },
            {
                "name": "Agile",
                "category": "Software Engineering",
                "importance": "medium",
            },
            {
                "name": "SDLC",
                "category": "Software Engineering",
                "importance": "medium",
            },
            {
                "name": "React",
                "category": "Web Development",
                "importance": "medium",
            },
            {
                "name": "HTML",
                "category": "Web Development",
                "importance": "medium",
            },
            {
                "name": "CSS",
                "category": "Web Development",
                "importance": "medium",
            },
            {
                "name": "Databases",
                "category": "Database",
                "importance": "high",
            },
        ],
        "requirements": [
            "Currently studying Computer Science, Software Engineering, or a related degree.",
            "Ability to write programs using at least one programming language.",
            "Understanding of object-oriented programming concepts.",
            "Basic understanding of data structures and algorithms.",
            "Understanding of relational databases and SQL.",
            "Basic knowledge of software development practices.",
            "Ability to use Git and version control.",
            "Ability to work on software projects individually or in a team.",
            "Basic understanding of software testing and debugging.",
            "Ability to communicate technical information clearly.",
        ],
    },

    "backend developer intern": {
        "description": "Common requirements for university students applying for backend development internships.",
        "skills": [
            {"name": "Python", "category": "Programming Language", "importance": "high"},
            {"name": "Java", "category": "Programming Language", "importance": "high"},
            {"name": "SQL", "category": "Database", "importance": "high"},
            {"name": "REST APIs", "category": "Web Development", "importance": "high"},
            {"name": "Git", "category": "Development Tool", "importance": "high"},
            {"name": "Databases", "category": "Database", "importance": "high"},
            {"name": "Docker", "category": "DevOps", "importance": "medium"},
            {"name": "Testing", "category": "Software Engineering", "importance": "medium"},
            {"name": "Authentication", "category": "Software Engineering", "importance": "medium"},
        ],
        "requirements": [
            "Currently studying Computer Science, Software Engineering, or a related degree.",
            "Ability to build server-side applications using a modern programming language.",
            "Understanding of REST APIs, databases, and authentication.",
            "Experience with Git and version control.",
            "Basic knowledge of testing, debugging, and deployment.",
        ],
    },
    "full stack developer intern": {
        "description": "Common requirements for university students applying for full stack development internships.",
        "skills": [
            {"name": "HTML", "category": "Web Development", "importance": "high"},
            {"name": "CSS", "category": "Web Development", "importance": "high"},
            {"name": "JavaScript", "category": "Programming Language", "importance": "high"},
            {"name": "React", "category": "Web Development", "importance": "high"},
            {"name": "Python", "category": "Programming Language", "importance": "medium"},
            {"name": "SQL", "category": "Database", "importance": "high"},
            {"name": "REST APIs", "category": "Web Development", "importance": "high"},
            {"name": "Git", "category": "Development Tool", "importance": "high"},
            {"name": "Docker", "category": "DevOps", "importance": "medium"},
        ],
        "requirements": [
            "Understanding of both frontend and backend web development.",
            "Ability to build responsive web interfaces and consume APIs.",
            "Basic understanding of server-side programming and databases.",
            "Experience with Git and collaborative development.",
            "Ability to debug and test full stack applications.",
        ],
    },
    "data analyst intern": {
        "description": "Common requirements for university students applying for data analyst internships.",
        "skills": [
            {"name": "Python", "category": "Programming Language", "importance": "high"},
            {"name": "SQL", "category": "Database", "importance": "high"},
            {"name": "Excel", "category": "Data Analysis", "importance": "high"},
            {"name": "Pandas", "category": "Data Analysis", "importance": "high"},
            {"name": "Data Visualization", "category": "Data Analysis", "importance": "high"},
            {"name": "Statistics", "category": "Mathematics", "importance": "high"},
            {"name": "Power BI", "category": "Data Visualization", "importance": "medium"},
            {"name": "Tableau", "category": "Data Visualization", "importance": "medium"},
        ],
        "requirements": [
            "Understanding of statistics and data analysis concepts.",
            "Ability to query and transform data using SQL.",
            "Ability to analyze datasets using spreadsheets or Python.",
            "Ability to communicate insights through clear visualizations.",
            "Attention to data quality and accuracy.",
        ],
    },
    "data science intern": {
        "description": "Common requirements for university students applying for data science internships.",
        "skills": [
            {"name": "Python", "category": "Programming Language", "importance": "high"},
            {"name": "Pandas", "category": "Data Analysis", "importance": "high"},
            {"name": "NumPy", "category": "Data Analysis", "importance": "high"},
            {"name": "Statistics", "category": "Mathematics", "importance": "high"},
            {"name": "Machine Learning", "category": "AI/ML", "importance": "high"},
            {"name": "SQL", "category": "Database", "importance": "medium"},
            {"name": "Data Visualization", "category": "Data Analysis", "importance": "medium"},
            {"name": "Git", "category": "Development Tool", "importance": "medium"},
        ],
        "requirements": [
            "Understanding of statistics, probability, and data analysis.",
            "Ability to work with datasets using Python.",
            "Basic understanding of supervised and unsupervised machine learning.",
            "Ability to evaluate models and communicate findings.",
            "Experience with notebooks, Git, or reproducible analysis workflows.",
        ],
    },
    "qa engineer intern": {
        "description": "Common requirements for university students applying for QA and software testing internships.",
        "skills": [
            {"name": "Software Testing", "category": "Quality Assurance", "importance": "high"},
            {"name": "Test Cases", "category": "Quality Assurance", "importance": "high"},
            {"name": "Python", "category": "Programming Language", "importance": "medium"},
            {"name": "Java", "category": "Programming Language", "importance": "medium"},
            {"name": "Selenium", "category": "Testing Tool", "importance": "medium"},
            {"name": "API Testing", "category": "Quality Assurance", "importance": "high"},
            {"name": "Git", "category": "Development Tool", "importance": "medium"},
            {"name": "Debugging", "category": "Software Engineering", "importance": "high"},
        ],
        "requirements": [
            "Understanding of software testing principles and test design.",
            "Ability to write clear test cases and report defects.",
            "Basic knowledge of API and UI testing.",
            "Ability to reproduce, investigate, and communicate software defects.",
            "Familiarity with version control and development workflows.",
        ],
    },
    "devops / cloud intern": {
        "description": "Common requirements for university students applying for DevOps and cloud internships.",
        "skills": [
            {"name": "Linux", "category": "Operating Systems", "importance": "high"},
            {"name": "Git", "category": "Development Tool", "importance": "high"},
            {"name": "Docker", "category": "DevOps", "importance": "high"},
            {"name": "CI/CD", "category": "DevOps", "importance": "high"},
            {"name": "AWS", "category": "Cloud", "importance": "medium"},
            {"name": "Azure", "category": "Cloud", "importance": "medium"},
            {"name": "Kubernetes", "category": "DevOps", "importance": "medium"},
            {"name": "Python", "category": "Programming Language", "importance": "medium"},
        ],
        "requirements": [
            "Understanding of Linux systems and command-line workflows.",
            "Understanding of version control and automated build pipelines.",
            "Basic knowledge of containers and cloud computing.",
            "Ability to troubleshoot deployment and environment issues.",
            "Interest in infrastructure automation and reliable software delivery.",
        ],
    },
    "ui/ux design intern": {
        "description": "Common requirements for university students applying for UI/UX design internships.",
        "skills": [
            {"name": "Figma", "category": "Design Tool", "importance": "high"},
            {"name": "UI Design", "category": "Design", "importance": "high"},
            {"name": "UX Research", "category": "Design", "importance": "high"},
            {"name": "Wireframing", "category": "Design", "importance": "high"},
            {"name": "Prototyping", "category": "Design", "importance": "high"},
            {"name": "Usability Testing", "category": "Design", "importance": "medium"},
            {"name": "Design Systems", "category": "Design", "importance": "medium"},
        ],
        "requirements": [
            "Understanding of user-centered design principles.",
            "Ability to create wireframes, prototypes, and polished interfaces.",
            "Experience with a modern design tool such as Figma.",
            "Ability to conduct or interpret basic usability research.",
            "Ability to explain design decisions using evidence and user needs.",
        ],
    },
    "machine learning intern": {
        "description": "Common requirements for university students applying for machine learning internships.",
        "skills": [
            {"name": "Python", "category": "Programming Language", "importance": "high"},
            {"name": "Machine Learning", "category": "AI/ML", "importance": "high"},
            {"name": "NumPy", "category": "Data Analysis", "importance": "high"},
            {"name": "Pandas", "category": "Data Analysis", "importance": "high"},
            {"name": "Scikit-learn", "category": "AI/ML", "importance": "high"},
            {"name": "Statistics", "category": "Mathematics", "importance": "medium"},
            {"name": "SQL", "category": "Database", "importance": "medium"},
            {"name": "Git", "category": "Development Tool", "importance": "medium"},
        ],
        "requirements": [
            "Understanding of machine learning fundamentals.",
            "Ability to prepare datasets and train baseline models using Python.",
            "Understanding of model evaluation and common metrics.",
            "Basic knowledge of statistics and linear algebra.",
            "Ability to document experiments and use version control.",
        ],
    },
    "cybersecurity intern": {
        "description": "Common requirements for university students applying for cybersecurity internships.",
        "skills": [
            {"name": "Networking", "category": "Cybersecurity", "importance": "high"},
            {"name": "Linux", "category": "Operating Systems", "importance": "high"},
            {"name": "Python", "category": "Programming Language", "importance": "medium"},
            {"name": "Cybersecurity", "category": "Security", "importance": "high"},
            {"name": "OWASP", "category": "Security", "importance": "high"},
            {"name": "Authentication", "category": "Security", "importance": "medium"},
            {"name": "Cryptography", "category": "Security", "importance": "medium"},
            {"name": "Git", "category": "Development Tool", "importance": "medium"},
        ],
        "requirements": [
            "Understanding of networking, operating systems, and security fundamentals.",
            "Awareness of common web and application security risks.",
            "Basic scripting ability for security automation or analysis.",
            "Understanding of authentication, authorization, and secure development.",
            "Ability to document findings clearly and responsibly.",
        ],
    },
    "mobile developer intern": {
        "description": "Common requirements for university students applying for mobile development internships.",
        "skills": [
            {"name": "Flutter", "category": "Mobile Development", "importance": "high"},
            {"name": "Dart", "category": "Programming Language", "importance": "high"},
            {"name": "React Native", "category": "Mobile Development", "importance": "medium"},
            {"name": "Java", "category": "Programming Language", "importance": "medium"},
            {"name": "Kotlin", "category": "Programming Language", "importance": "medium"},
            {"name": "REST APIs", "category": "Web Development", "importance": "high"},
            {"name": "Git", "category": "Development Tool", "importance": "high"},
            {"name": "UI/UX", "category": "Design", "importance": "medium"},
        ],
        "requirements": [
            "Ability to build mobile interfaces using a modern mobile framework.",
            "Understanding of application state, navigation, and API integration.",
            "Basic knowledge of mobile UI and responsive interaction patterns.",
            "Experience with Git and debugging mobile applications.",
            "Ability to test applications across common device scenarios.",
        ],
    },

}


def normalize_role_name(role: str) -> str:
    """
    Normalize a role name so it can be matched against the dataset.
    """

    return " ".join(role.lower().strip().split())


def get_role_requirements(role: str) -> dict:
    """
    Return requirements for a supported role.

    Raises:
        ValueError: if the requested role is not supported.
    """

    normalized_role = normalize_role_name(role)

    requirements = ROLE_REQUIREMENTS.get(
        normalized_role
    )

    if requirements is None:
        raise ValueError(
            f"Role '{role}' is not currently supported."
        )

    return requirements


def get_supported_roles() -> list[str]:
    """
    Return the roles currently supported by the dataset.
    """

    return list(ROLE_REQUIREMENTS.keys())