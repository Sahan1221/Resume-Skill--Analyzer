from pydantic import BaseModel, Field

class AnalysisCreateResponse(BaseModel):
    analysis_id: str
    status: str = "queued"
    message: str

class AnalysisResult(BaseModel):
    analysis_id: str
    status: str
    role: str
    overall_score: int | None = Field(default=None, ge=0, le=100)
    role_requirements: list[dict] = []
    skill_gaps: list[dict] = []
    ats_issues: list[dict] = []
    improvements: list[dict] = []
    learning_resources: list[dict] = []
    project_recommendations: list[dict] = []
    market_insights: list[dict] = []
