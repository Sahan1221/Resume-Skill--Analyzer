from app.services.requirement_evidence_service import (
    analyze_requirements,
)


def test_requirement_evidence_detects_software_engineering_degree():
    resume_data = {
        "profile": "",
        "education": [
            {
                "degree": "BSc (Hons) in Software Engineering",
                "institution": "University of Example",
                "graduation_year": "2027",
            }
        ],
        "skills": [],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Currently studying Computer Science, Software Engineering, or a related degree."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 1
    assert result["partial_count"] == 0
    assert result["limited_count"] == 0

    item = result["results"][0]

    assert item["status"] == "supported"
    assert "software engineering" in item["evidence"]


def test_requirement_evidence_detects_programming_language():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "Python",
            "JavaScript",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Ability to write programs using at least one programming language."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 1
    assert result["partial_count"] == 0
    assert result["limited_count"] == 0

    item = result["results"][0]

    assert item["status"] == "supported"
    assert "python" in item["evidence"]
    assert "java" not in item["evidence"]


def test_programming_requirement_does_not_false_match_c():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "CSS",
            "HTML",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Ability to write programs using at least one programming language."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    item = result["results"][0]

    assert "c" not in item["evidence"]


def test_requirement_evidence_detects_oop():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "OOP",
            "Python",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Understanding of object-oriented programming concepts."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 1

    item = result["results"][0]

    assert item["status"] == "supported"
    assert "oop" in item["evidence"]


def test_data_structures_and_algorithms_is_partial_when_algorithm_missing():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "Data Structures",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Basic understanding of data structures and algorithms."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 0
    assert result["partial_count"] == 1
    assert result["limited_count"] == 0

    item = result["results"][0]

    assert item["status"] == "partial"
    assert "data structures" in item["evidence"]
    assert "algorithms" not in item["evidence"]


def test_data_structures_and_algorithms_is_supported_when_both_exist():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "Data Structures",
            "Algorithms",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Basic understanding of data structures and algorithms."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 1
    assert result["partial_count"] == 0

    item = result["results"][0]

    assert item["status"] == "supported"


def test_requirement_evidence_detects_database_knowledge():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "MySQL",
            "SQL Server",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Understanding of relational databases and SQL."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 1

    item = result["results"][0]

    assert item["status"] == "supported"
    assert "mysql" in item["evidence"]
    assert "sql server" in item["evidence"]


def test_requirement_evidence_detects_team_project():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [],
        "projects": [
            {
                "name": "Student Application",
                "description": (
                    "Worked on the project as part of "
                    "a university team."
                ),
            }
        ],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Ability to work on software projects individually or in a team."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 1

    item = result["results"][0]

    assert item["status"] == "supported"


def test_testing_and_debugging_is_partial_when_debugging_missing():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "Software Testing",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Basic understanding of software testing and debugging."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 0
    assert result["partial_count"] == 1
    assert result["limited_count"] == 0

    item = result["results"][0]

    assert item["status"] == "partial"
    assert "software testing" in item["evidence"]
    assert "debugging" not in item["evidence"]


def test_testing_and_debugging_is_supported_when_both_exist():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "Software Testing",
            "Debugging",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Basic understanding of software testing and debugging."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 1
    assert result["partial_count"] == 0

    item = result["results"][0]

    assert item["status"] == "supported"


def test_requirement_evidence_detects_technical_communication():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [],
        "projects": [],
        "experience": [
            {
                "title": "University Project",
                "organization": "",
                "description": (
                    "Created technical documentation "
                    "including requirements and "
                    "architecture diagrams."
                ),
            }
        ],
        "courses_certifications": [],
    }

    requirements = [
        "Ability to communicate technical information clearly."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 1

    item = result["results"][0]

    assert item["status"] == "supported"


def test_missing_requirement_is_limited():
    resume_data = {
        "profile": "",
        "education": [],
        "skills": [
            "Python",
        ],
        "projects": [],
        "experience": [],
        "courses_certifications": [],
    }

    requirements = [
        "Basic understanding of data structures and algorithms."
    ]

    result = analyze_requirements(
        requirements=requirements,
        resume_data=resume_data,
    )

    assert result["supported_count"] == 0
    assert result["partial_count"] == 0
    assert result["limited_count"] == 1

    item = result["results"][0]

    assert item["status"] == "limited"
    assert item["evidence"] == []