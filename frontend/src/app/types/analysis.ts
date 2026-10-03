export interface RecommendationCounts {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface RecommendationItem
  extends Record<string, unknown> {
  priority?: string;
  title?: string;
  description?: string;
}

export interface RecommendationCollection {
  recommendations: RecommendationItem[];
  recommendation_counts: RecommendationCounts;
}

export interface MarketInsight
  extends Record<string, unknown> {
  skill?: string;
  demand?: string;
  priority?: string;
  category?: string;
  description?: string;
  role_relevance?: string;
}

export interface MarketInsightCounts {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface MarketInsightCollection {
  insights: MarketInsight[];
  insight_counts: MarketInsightCounts;
}

export interface AnalysisResult {
  analysis_id: string;
  status: string;
  role: string;

  resume_text: string;

  resume_data: {
    name: string;
    profile: string;
    education: Record<string, unknown>[];
    skills: string[];
    projects: Record<string, unknown>[];
    experience: Record<string, unknown>[];
    courses_certifications: string[];
    languages: string[];
  };

  role_requirements: {
    description: string;
    skills: Record<string, unknown>[];
    requirements: string[];
  };

  skill_comparison: {
    matched_skills: Record<string, unknown>[];
    skill_gaps: Record<string, unknown>[];
    matched_count: number;
    gap_count: number;
    total_role_skills: number;
    match_percentage: number;
  };

  requirement_evidence: Record<string, unknown>;

  ats_analysis: Record<string, unknown>;

  resume_quality: Record<string, unknown>;

  improvement_recommendations: RecommendationCollection;

  learning_recommendations: RecommendationCollection;

  project_recommendations: RecommendationCollection;

  market_insights: MarketInsightCollection;
}