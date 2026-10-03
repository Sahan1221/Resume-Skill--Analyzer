from app.services.pdf_extractor import (
    PDFExtractionError,
    extract_text_from_pdf,
)
from app.services.resume_parser import parse_resume
from app.services.role_service import (
    analyze_role_requirements,
)
from app.services.skill_gap_service import (
    compare_skills,
)
from app.services.requirement_evidence_service import (
    analyze_requirements,
)
from app.services.ats_analysis_service import (
    analyze_ats,
)
from app.services.resume_quality_service import (
    analyze_resume_quality,
)
from app.services.improvement_service import (
    generate_improvement_recommendations,
)
from app.services.learning_service import (
    generate_learning_recommendations,
)
from app.services.project_service import (
    generate_project_recommendations,
)
from app.services.market_service import (
    generate_market_insights,
)


def analyze_resume(
    file_bytes: bytes,
    target_role: str,
) -> dict:
    """
    Run the V1 resume analysis pipeline.

    PDF
      ↓
    Text Extraction
      ↓
    Resume Parsing
      ↓
    Role Requirements
      ↓
    Skill Comparison
      ↓
    Requirement Evidence Analysis
      ↓
    ATS / Keyword Analysis
      ↓
    Resume Quality Analysis
      ↓
    Improvement Recommendations
      ↓
    Learning Recommendations
      ↓
    Project Recommendations
      ↓
    Market Insights
      ↓
    Analysis Result
    """

    try:
        resume_text = extract_text_from_pdf(
            file_bytes
        )
    except PDFExtractionError as exc:
        raise ValueError(str(exc)) from exc

    resume_data = parse_resume(
        resume_text
    )

    resume_data_dict = (
        resume_data.model_dump()
    )

    try:
        role_requirements = (
            analyze_role_requirements(
                target_role
            )
        )
    except ValueError as exc:
        raise ValueError(str(exc)) from exc

    skill_comparison = compare_skills(
        resume_skills=resume_data.skills,
        role_skills=role_requirements[
            "skills"
        ],
    )

    requirement_evidence = (
        analyze_requirements(
            requirements=role_requirements[
                "requirements"
            ],
            resume_data=resume_data_dict,
        )
    )

    ats_analysis = analyze_ats(
        resume_text=resume_text,
        resume_data=resume_data_dict,
        role_skills=role_requirements[
            "skills"
        ],
    )

    resume_quality = (
        analyze_resume_quality(
            resume_data=resume_data_dict,
        )
    )

    improvement_recommendations = (
        generate_improvement_recommendations(
            skill_comparison=skill_comparison,
            requirement_evidence=(
                requirement_evidence
            ),
            ats_analysis=ats_analysis,
            resume_quality=resume_quality,
        )
    )

    learning_recommendations = (
        generate_learning_recommendations(
            skill_comparison=skill_comparison,
        )
    )

    project_recommendations = (
        generate_project_recommendations(
            skill_comparison=skill_comparison,
        )
    )

    market_insights = (
        generate_market_insights(
            target_role
        )
    )

    return {
        "status": "completed",
        "role": target_role,
        "resume_text": resume_text,
        "resume_data": resume_data_dict,
        "role_requirements": {
            "description": (
                role_requirements[
                    "description"
                ]
            ),
            "skills": (
                role_requirements[
                    "skills"
                ]
            ),
            "requirements": (
                role_requirements[
                    "requirements"
                ]
            ),
        },
        "skill_comparison": (
            skill_comparison
        ),
        "requirement_evidence": (
            requirement_evidence
        ),
        "ats_analysis": ats_analysis,
        "resume_quality": resume_quality,
        "improvement_recommendations": (
            improvement_recommendations
        ),
        "learning_recommendations": (
            learning_recommendations
        ),
        "project_recommendations": (
            project_recommendations
        ),
        "market_insights": market_insights,
    }