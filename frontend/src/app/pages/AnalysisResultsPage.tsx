 import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useParams,
  
} from "react-router";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  FolderGit2,
  Github,
  Lightbulb,
  Link as LinkIcon,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

import type { AnalysisResult } from "../types/analysis";

import { getAnalysis } from "../services/analysisApi";

// ...the rest of your existing imports...
// ─── Types ─────────────────────────────────────────────────────────────────────

type TabId =
  | "overview"
  | "requirements"
  | "gaps"
  | "ats"
  | "improvements"
  | "learning"
  | "projects"
  | "market";

type RequirementStatus = "matched" | "partial" | "missing";

type BadgeVariant =
  | "high"
  | "medium"
  | "low"
  | "critical"
  | "significant"
  | "moderate"
  | "minor"
  | "matched"
  | "partial"
  | "missing"
  | "free"
  | "paid"
  | "beginner"
  | "intermediate";

// ─── Helper Functions ───────────────────────────────────────────────────────────

function formatDate(dateValue: string): string {
  if (!dateValue) {
    return "Unknown date";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLabel(value: string): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getImportanceVariant(
  importance: string,
): "high" | "medium" | "low" {
  const normalized = importance.toLowerCase();

  if (normalized === "high") {
    return "high";
  }

  if (normalized === "medium") {
    return "medium";
  }

  return "low";
}

function getGapVariant(
  level: string,
): "critical" | "significant" | "moderate" | "minor" {
  const normalized = level.toLowerCase();

  if (normalized === "high" || normalized === "critical") {
    return "critical";
  }

  if (normalized === "significant") {
    return "significant";
  }

  if (normalized === "medium" || normalized === "moderate") {
    return "moderate";
  }

  return "minor";
}

function getPriorityVariant(
  priority: string,
): "high" | "medium" | "low" {
  const normalized = priority.toLowerCase();

  if (normalized === "high") {
    return "high";
  }

  if (normalized === "medium") {
    return "medium";
  }

  return "low";
}

function getStatusFromEvidence(
  status: string,
): RequirementStatus {
  const normalized = status.toLowerCase();

  if (
    normalized === "supported" ||
    normalized === "matched" ||
    normalized === "complete"
  ) {
    return "matched";
  }

  if (
    normalized === "partial" ||
    normalized === "partially_supported"
  ) {
    return "partial";
  }

  return "missing";
}

function getStatusLabel(status: RequirementStatus): string {
  if (status === "matched") {
    return "matched";
  }

  if (status === "partial") {
    return "partial";
  }

  return "missing";
}

function getScoreColor(score: number): string {
  if (score >= 80) {
    return "text-emerald-600";
  }

  if (score >= 60) {
    return "text-amber-600";
  }

  return "text-red-500";
}

function getScoreBorderColor(score: number): string {
  if (score >= 80) {
    return "border-emerald-400";
  }

  if (score >= 60) {
    return "border-amber-400";
  }

  return "border-red-400";
}

function getScoreBackground(score: number): string {
  if (score >= 80) {
    return "bg-emerald-400/10 text-emerald-300";
  }

  if (score >= 60) {
    return "bg-amber-400/10 text-amber-300";
  }

  return "bg-red-400/10 text-red-300";
}

function getRecordString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

function getRecordNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number | null {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function getRecordStringArray(
  record: Record<string, unknown>,
  ...keys: string[]
): string[] {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string => typeof item === "string",
      );
    }
  }

  return [];
}

function getEvidenceText(
  evidence: unknown,
): string {
  if (typeof evidence === "string") {
    return evidence;
  }

  if (Array.isArray(evidence)) {
    return evidence
      .filter((item): item is string => typeof item === "string")
      .join(", ");
  }

  return "";
}

// ─── Badge ──────────────────────────────────────────────────────────────────────

function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    high: "bg-red-400/10 text-red-700",
    critical: "bg-red-400/10 text-red-700",
    significant: "bg-orange-50 text-orange-700",
    medium: "bg-amber-400/10 text-amber-300",
    moderate: "bg-amber-400/10 text-amber-300",
    low: "bg-slate-100 text-slate-600",
    minor: "bg-blue-400/10 text-blue-600",
    matched: "bg-emerald-400/10 text-emerald-300",
    partial: "bg-amber-400/10 text-amber-300",
    missing: "bg-red-400/10 text-red-300",
    free: "bg-emerald-400/10 text-emerald-300",
    paid: "bg-slate-100 text-slate-600",
    beginner: "bg-blue-400/10 text-blue-600",
    intermediate: "bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        styles[variant] || "bg-muted text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

// ─── Status Icon ────────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: RequirementStatus }) {
  if (status === "matched") {
    return (
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    );
  }

  if (status === "partial") {
    return (
      <AlertCircle className="w-4 h-4 text-amber-500" />
    );
  }

  return (
    <XCircle className="w-4 h-4 text-red-400" />
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "requirements", label: "Requirements" },
  { id: "gaps", label: "Skill Gaps" },
  { id: "ats", label: "ATS Issues" },
  { id: "improvements", label: "Improvements" },
  { id: "learning", label: "Learning" },
  { id: "projects", label: "Projects" },
  { id: "market", label: "Market" },
];

// ─── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({
  analysis,
  onTabChange,
}: {
  analysis: AnalysisResult;
  onTabChange: (tab: TabId) => void;
}) {
  const skillComparison = analysis.skill_comparison;

  const matchedSkills = skillComparison.matched_skills ?? [];
  const skillGaps = skillComparison.skill_gaps ?? [];

  const matchedCount = skillComparison.matched_count ?? matchedSkills.length;
  const gapCount = skillComparison.gap_count ?? skillGaps.length;
  const totalSkills =
    skillComparison.total_role_skills ??
    matchedCount + gapCount;

  const matchPercentage = skillComparison.match_percentage ?? 0;

  const partialRequirements = Object.values(
    analysis.requirement_evidence ?? {},
  ).filter(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      getStatusFromEvidence(
        getRecordString(
          item as Record<string, unknown>,
          "status",
        ),
      ) === "partial",
  ).length;

  const requirementEvidence =
    analysis.requirement_evidence as Record<string, unknown>;

  const supportedRequirements =
    getRecordNumber(
      requirementEvidence,
      "supported_count",
      "supported",
    ) ?? 0;

  const limitedRequirements =
    getRecordNumber(
      requirementEvidence,
      "limited_count",
      "limited",
      "missing_count",
    ) ?? 0;

  const totalRequirementCount =
    getRecordNumber(
      requirementEvidence,
      "total_requirements",
      "total_count",
    ) ??
    supportedRequirements +
      partialRequirements +
      limitedRequirements;

  const topGaps = [...skillGaps]
    .sort((a, b) => {
      const importanceA =
        getRecordString(a, "importance").toLowerCase();
      const importanceB =
        getRecordString(b, "importance").toLowerCase();

      const weight: Record<string, number> = {
        high: 3,
        critical: 3,
        medium: 2,
        significant: 2,
        low: 1,
        minor: 1,
      };

      return (
        (weight[importanceB] ?? 0) -
        (weight[importanceA] ?? 0)
      );
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Score + summary */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 text-center">
            <div
              className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${getScoreBorderColor(
                matchPercentage,
              )}`}
            >
              <div>
                <p
                  className={`text-2xl font-bold ${getScoreColor(
                    matchPercentage,
                  )}`}
                >
                  {Math.round(matchPercentage)}%
                </p>

                <p className="text-xs text-muted-foreground">
                  match
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-foreground mb-1">
              Match Summary
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Your resume was compared against the requirements
              identified for the selected role. Review the gaps and
              recommendations below to improve your evidence and
              alignment.
            </p>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />

                <span className="text-sm text-foreground">
                  <strong>{matchedCount}</strong> matched
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />

                <span className="text-sm text-foreground">
                  <strong>{gapCount}</strong> gaps
                </span>
              </div>

              {partialRequirements > 0 && (
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />

                  <span className="text-sm text-foreground">
                    <strong>{partialRequirements}</strong>{" "}
                    partial requirements
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coverage bar */}
        {totalSkills > 0 && (
          <div className="mt-5">
            <div className="flex gap-0.5 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 transition-all"
                style={{
                  width: `${(matchedCount / totalSkills) * 100}%`,
                }}
              />

              <div
                className="bg-red-300 transition-all"
                style={{
                  width: `${(gapCount / totalSkills) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Matched
              </span>

              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-300 inline-block" />
                Gap
              </span>

              <span className="text-xs text-muted-foreground ml-auto">
                {totalSkills} role skills analyzed
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Requirement summary */}
      {totalRequirementCount > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              Requirement Evidence
            </h3>

            <button
              onClick={() => onTabChange("requirements")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View requirements
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-emerald-400/10 rounded-lg">
              <p className="text-xs text-emerald-300 mb-1">
                Supported
              </p>

              <p className="text-2xl font-bold text-emerald-300">
                {supportedRequirements}
              </p>
            </div>

            <div className="p-4 bg-amber-400/10 rounded-lg">
              <p className="text-xs text-amber-300 mb-1">
                Partial
              </p>

              <p className="text-2xl font-bold text-amber-300">
                {partialRequirements}
              </p>
            </div>

            <div className="p-4 bg-red-400/10 rounded-lg">
              <p className="text-xs text-red-700 mb-1">
                Limited
              </p>

              <p className="text-2xl font-bold text-red-700">
                {limitedRequirements}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top gaps */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            Top Priority Gaps
          </h3>

          <button
            onClick={() => onTabChange("gaps")}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            All gaps
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {topGaps.length === 0 ? (
          <div className="p-4 bg-emerald-400/10 rounded-lg">
            <p className="text-sm text-emerald-300">
              No skill gaps were identified for the selected role.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topGaps.map((gap) => {
              const name = getRecordString(gap, "name");
              const importance = getRecordString(
                gap,
                "importance",
              );
              const gapLevel =
                getRecordString(gap, "gap_level") ||
                importance ||
                "medium";

              return (
                <div
                  key={name}
                  className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg"
                >
                  <Badge
                    variant={getGapVariant(gapLevel)}
                  >
                    {formatLabel(gapLevel)}
                  </Badge>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {name}
                    </p>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      This skill or requirement was not sufficiently
                      evidenced in the uploaded resume.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: BookOpen,
            label: "View Learning Resources",
            tab: "learning" as TabId,
          },
          {
            icon: FolderGit2,
            label: "View Project Ideas",
            tab: "projects" as TabId,
          },
          {
            icon: TrendingUp,
            label: "View Market Insights",
            tab: "market" as TabId,
          },
        ].map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.tab}
              onClick={() => onTabChange(action.tab)}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:bg-accent/40 transition-colors text-left"
            >
              <Icon className="w-5 h-5 text-primary flex-shrink-0" />

              <span className="text-sm font-medium text-foreground">
                {action.label}
              </span>

              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Requirements Tab ──────────────────────────────────────────────────────────

function RequirementsTab({
  analysis,
}: {
  analysis: AnalysisResult;
}) {
  const roleSkills = analysis.role_requirements.skills ?? [];
  const requirements =
    analysis.role_requirements.requirements ?? [];

  const matchedSkills = analysis.skill_comparison.matched_skills ?? [];
  const skillGaps = analysis.skill_comparison.skill_gaps ?? [];

  const matchedMap = new Map<string, Record<string, unknown>>();

  for (const item of matchedSkills) {
    const name = getRecordString(item, "name");

    if (name) {
      matchedMap.set(name.toLowerCase(), item);
    }
  }

  const gapMap = new Map<string, Record<string, unknown>>();

  for (const item of skillGaps) {
    const name = getRecordString(item, "name");

    if (name) {
      gapMap.set(name.toLowerCase(), item);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Requirements identified for{" "}
        <strong className="text-foreground">
          {analysis.role}
        </strong>
        . Match status is based on evidence found in your uploaded
        resume.
      </p>

      {/* Skills */}
      {roleSkills.length > 0 && (
        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">
              Required Skills
            </h3>
          </div>

          <div className="divide-y divide-border">
            {roleSkills.map((skill) => {
              const name = getRecordString(skill, "name");
              const category =
                getRecordString(skill, "category") ||
                "Skills";
              const importance =
                getRecordString(skill, "importance") ||
                "medium";

              const matched =
                matchedMap.get(name.toLowerCase());

              const gap =
                gapMap.get(name.toLowerCase());

              const status: RequirementStatus = matched
                ? "matched"
                : gap
                  ? "missing"
                  : "missing";

              return (
                <div
                  key={name}
                  className="flex items-center justify-between px-5 py-3 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusIcon status={status} />

                    <div className="min-w-0">
                      <span className="text-sm text-foreground">
                        {name}
                      </span>

                      <p className="text-xs text-muted-foreground">
                        {category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant={getImportanceVariant(importance)}
                    >
                      {importance}
                    </Badge>

                    <Badge variant={status}>
                      {getStatusLabel(status)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Role requirements */}
      {requirements.length > 0 && (
        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">
              Role Requirements
            </h3>
          </div>

          <div className="divide-y divide-border">
            {requirements.map((requirement, index) => {
              const evidenceResults = Object.values(
                analysis.requirement_evidence ?? {},
              );

              const matchingEvidence = evidenceResults.find(
                (item) => {
                  if (
                    typeof item !== "object" ||
                    item === null
                  ) {
                    return false;
                  }

                  const record =
                    item as Record<string, unknown>;

                  return (
                    getRecordString(
                      record,
                      "requirement",
                      "text",
                      "description",
                    ) === requirement
                  );
                },
              );

              const status = matchingEvidence
                ? getStatusFromEvidence(
                    getRecordString(
                      matchingEvidence as Record<
                        string,
                        unknown
                      >,
                      "status",
                    ),
                  )
                : "missing";

              return (
                <div
                  key={`${requirement}-${index}`}
                  className="px-5 py-4"
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon status={status} />

                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {requirement}
                      </p>

                      {matchingEvidence &&
                        typeof matchingEvidence ===
                          "object" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {getEvidenceText(
                              (
                                matchingEvidence as Record<
                                  string,
                                  unknown
                                >
                              ).evidence,
                            )}
                          </p>
                        )}
                    </div>

                    <Badge variant={status}>
                      {getStatusLabel(status)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Gaps Tab ──────────────────────────────────────────────────────────────────

function GapsTab({
  analysis,
}: {
  analysis: AnalysisResult;
}) {
  const gaps = analysis.skill_comparison.skill_gaps ?? [];

  const sortedGaps = [...gaps].sort((a, b) => {
    const weight: Record<string, number> = {
      high: 3,
      critical: 3,
      medium: 2,
      significant: 2,
      low: 1,
      minor: 1,
    };

    const importanceA =
      getRecordString(a, "importance").toLowerCase();

    const importanceB =
      getRecordString(b, "importance").toLowerCase();

    return (
      (weight[importanceB] ?? 0) -
      (weight[importanceA] ?? 0)
    );
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Gaps are based on the selected role's required skills and
        the evidence detected in your resume.
      </p>

      {sortedGaps.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-emerald-300">
            No skill gaps were identified for this role.
          </p>
        </div>
      ) : (
        sortedGaps.map((gap) => {
          const skill = getRecordString(gap, "name");
          const importance =
            getRecordString(gap, "importance") || "medium";
          const gapLevel =
            getRecordString(gap, "gap_level") ||
            importance;

          return (
            <div
              key={skill}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-foreground">
                  {skill}
                </h3>

                <Badge variant={getGapVariant(gapLevel)}>
                  {formatLabel(gapLevel)} gap
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                The analysis did not find sufficient evidence of{" "}
                <strong className="text-foreground">
                  {skill}
                </strong>{" "}
                in the resume.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-amber-400/10 border border-amber-100 rounded-lg">
                  <p className="text-xs font-medium text-amber-300 mb-1">
                    Importance
                  </p>

                  <p className="text-xs text-amber-800">
                    This skill has{" "}
                    <strong>{importance}</strong> importance for
                    the selected role.
                  </p>
                </div>

                <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                  <p className="text-xs font-medium text-primary mb-1">
                    Suggested action
                  </p>

                  <p className="text-xs text-foreground">
                    Build evidence for this skill through a
                    project, course, or relevant experience and
                    include the evidence accurately in your resume.
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── ATS Tab ───────────────────────────────────────────────────────────────────

function ATSTab({
  analysis,
}: {
  analysis: AnalysisResult;
}) {
  const ats = analysis.ats_analysis ?? {};

  const keywordAnalysis =
    typeof ats.keyword_analysis === "object" &&
    ats.keyword_analysis !== null
      ? (ats.keyword_analysis as Record<string, unknown>)
      : {};

  const structureAnalysis =
    typeof ats.structure_analysis === "object" &&
    ats.structure_analysis !== null
      ? (ats.structure_analysis as Record<string, unknown>)
      : {};

  const textQuality =
    typeof ats.text_quality === "object" &&
    ats.text_quality !== null
      ? (ats.text_quality as Record<string, unknown>)
      : {};

  const findings = Array.isArray(ats.findings)
    ? ats.findings
    : [];

  const keywordCoverage =
    getRecordNumber(
      keywordAnalysis,
      "coverage_percentage",
      "keyword_coverage_percentage",
      "match_percentage",
    ) ??
    getRecordNumber(
      ats,
      "keyword_coverage_percentage",
      "coverage_percentage",
    );

  const matchedKeywords =
    getRecordNumber(
      keywordAnalysis,
      "matched_count",
      "matched_keywords",
    ) ?? 0;

  const totalKeywords =
    getRecordNumber(
      keywordAnalysis,
      "total_count",
      "total_keywords",
    ) ?? 0;

  const findingsAsRecords = findings.filter(
    (item): item is Record<string, unknown> =>
      typeof item === "object" &&
      item !== null,
  );

  return (
    <div className="space-y-5">
      <div className="p-4 bg-amber-400/10 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />

          <p className="text-xs text-amber-800">
            This analysis highlights resume issues that may affect
            readability and keyword matching. It does not guarantee
            ATS outcomes — results vary by employer system.
          </p>
        </div>
      </div>

      {/* Keyword summary */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4">
          Keyword Analysis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-accent/40 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Coverage
            </p>

            <p className="text-2xl font-bold text-foreground">
              {keywordCoverage !== null
                ? `${Math.round(keywordCoverage)}%`
                : "—"}
            </p>
          </div>

          <div className="p-4 bg-accent/40 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Matched
            </p>

            <p className="text-2xl font-bold text-foreground">
              {matchedKeywords}
            </p>
          </div>

          <div className="p-4 bg-accent/40 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Role Keywords
            </p>

            <p className="text-2xl font-bold text-foreground">
              {totalKeywords}
            </p>
          </div>
        </div>
      </div>

      {/* Text quality */}
      {Object.keys(textQuality).length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Resume Text Quality
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Words",
                value: getRecordNumber(
                  textQuality,
                  "word_count",
                  "words",
                ),
              },
              {
                label: "Lines",
                value: getRecordNumber(
                  textQuality,
                  "line_count",
                  "lines",
                ),
              },
              {
                label: "Characters",
                value: getRecordNumber(
                  textQuality,
                  "character_count",
                  "characters",
                ),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 bg-accent/40 rounded-lg"
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {item.label}
                </p>

                <p className="text-lg font-semibold text-foreground">
                  {item.value ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Findings */}
      {findingsAsRecords.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />

            <p className="text-sm text-foreground">
              No ATS-oriented issues were identified by the current
              rule-based analysis.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {findingsAsRecords.map((finding, index) => {
            const category =
              getRecordString(
                finding,
                "category",
                "type",
              ) || "Analysis";

            const severity =
              getRecordString(
                finding,
                "severity",
                "level",
              ) || "medium";

            const issue =
              getRecordString(
                finding,
                "issue",
                "title",
                "message",
              ) || "Resume issue identified";

            const explanation =
              getRecordString(
                finding,
                "explanation",
                "description",
              );

            const recommendation =
              getRecordString(
                finding,
                "fix",
                "recommendation",
                "action",
              );

            return (
              <div
                key={`${category}-${issue}-${index}`}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {formatLabel(category)}
                    </p>

                    <p className="text-sm font-medium text-foreground">
                      {issue}
                    </p>
                  </div>

                  <Badge
                    variant={
                      severity.toLowerCase() === "high"
                        ? "high"
                        : severity.toLowerCase() === "low"
                          ? "low"
                          : "medium"
                    }
                  >
                    {severity}
                  </Badge>
                </div>

                {explanation && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {explanation}
                  </p>
                )}

                {recommendation && (
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                    <p className="text-xs font-medium text-primary mb-1">
                      Recommended fix
                    </p>

                    <p className="text-xs text-foreground">
                      {recommendation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Structure summary */}
      {Object.keys(structureAnalysis).length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Resume Structure
          </h3>

          <div className="space-y-2">
            {Object.entries(structureAnalysis).map(
              ([key, value]) => {
                if (
                  typeof value !== "boolean" &&
                  typeof value !== "string"
                ) {
                  return null;
                }

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                  >
                    <span className="text-sm text-foreground">
                      {formatLabel(key)}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {typeof value === "boolean"
                        ? value
                          ? "Present"
                          : "Missing"
                        : value}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Improvements Tab ──────────────────────────────────────────────────────────

function ImprovementsTab({
  analysis,
}: {
  analysis: AnalysisResult;
}) {
  const recommendations =
  analysis.improvement_recommendations?.recommendations ?? [];

  const priorities = ["high", "medium", "low"] as const;

  return (
    <div className="space-y-5">
      {recommendations.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">
            No improvement recommendations were generated for
            this analysis.
          </p>
        </div>
      ) : (
        priorities.map((priority) => {
          const items = recommendations.filter((item) => {
            const itemPriority =
              getRecordString(
                item,
                "priority",
              ).toLowerCase();

            return itemPriority === priority;
          });

          if (items.length === 0) {
            return null;
          }

          return (
            <div key={priority}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={getPriorityVariant(priority)}>
                  {priority === "high"
                    ? "High Priority"
                    : priority === "medium"
                      ? "Medium Priority"
                      : "Low Priority"}
                </Badge>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => {
                  const title =
                    getRecordString(
                      item,
                      "title",
                      "problem",
                      "name",
                    ) || "Improvement";

                  const description =
                    getRecordString(
                      item,
                      "description",
                      "why",
                      "explanation",
                    );

                  const action =
                    getRecordString(
                      item,
                      "action",
                      "recommendation",
                      "recommended_action",
                    );

                  return (
                    <div
                      key={`${title}-${index}`}
                      className="bg-card border border-border rounded-xl p-5"
                    >
                      <p className="font-medium text-foreground text-sm mb-3">
                        {title}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {description && (
                          <div className="p-3 bg-muted/60 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Why it matters
                            </p>

                            <p className="text-xs text-foreground">
                              {description}
                            </p>
                          </div>
                        )}

                        {action && (
                          <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                            <p className="text-xs font-medium text-primary mb-1">
                              Recommended action
                            </p>

                            <p className="text-xs text-foreground">
                              {action}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Learning Tab ──────────────────────────────────────────────────────────────

function LearningTab({
  analysis,
}: {
  analysis: AnalysisResult;
}) {
  const [filterSkill, setFilterSkill] = useState("All");
  const [filterCost, setFilterCost] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");

  const resources =
  analysis.learning_recommendations?.recommendations ?? [];

  const skills = [
    "All",
    ...Array.from(
      new Set(
        resources
          .map((resource) =>
            getRecordString(
              resource,
              "skill",
              "related_skill",
            ),
          )
          .filter(Boolean),
      ),
    ),
  ];

  const costs = [
    "All",
    ...Array.from(
      new Set(
        resources
          .map((resource) =>
            getRecordString(
              resource,
              "cost",
              "cost_type",
            ).toLowerCase(),
          )
          .filter(Boolean),
      ),
    ),
  ];

  const difficulties = [
    "All",
    ...Array.from(
      new Set(
        resources
          .map((resource) =>
            getRecordString(
              resource,
              "difficulty",
              "level",
            ).toLowerCase(),
          )
          .filter(Boolean),
      ),
    ),
  ];

  const filtered = resources.filter((resource) => {
    const skill = getRecordString(
      resource,
      "skill",
      "related_skill",
    );

    const cost = getRecordString(
      resource,
      "cost",
      "cost_type",
    ).toLowerCase();

    const difficulty = getRecordString(
      resource,
      "difficulty",
      "level",
    ).toLowerCase();

    return (
      (filterSkill === "All" || skill === filterSkill) &&
      (filterCost === "All" || cost === filterCost) &&
      (filterDiff === "All" || difficulty === filterDiff)
    );
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />

        <div className="flex gap-2 flex-wrap">
          {[
            {
              label: "Skill",
              values: skills,
              current: filterSkill,
              set: setFilterSkill,
            },
            {
              label: "Cost",
              values: costs,
              current: filterCost,
              set: setFilterCost,
            },
            {
              label: "Level",
              values: difficulties,
              current: filterDiff,
              set: setFilterDiff,
            },
          ].map(
            ({
              label,
              values,
              current,
              set,
            }) => (
              <select
                key={label}
                value={current}
                onChange={(event) =>
                  set(event.target.value)
                }
                className="text-xs border border-border rounded-lg px-2 py-1.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {values.map((value) => (
                  <option key={value} value={value}>
                    {label}:{" "}
                    {value === "All"
                      ? "All"
                      : formatLabel(value)}
                  </option>
                ))}
              </select>
            ),
          )}
        </div>

        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} resources
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl">
          No learning resources match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((resource, index) => {
            const title =
              getRecordString(
                resource,
                "title",
                "name",
              ) || "Learning Resource";

            const provider =
              getRecordString(
                resource,
                "provider",
                "source",
              );

            const skill =
              getRecordString(
                resource,
                "skill",
                "related_skill",
              );

            const difficulty =
              getRecordString(
                resource,
                "difficulty",
                "level",
              ).toLowerCase() || "beginner";

            const cost =
              getRecordString(
                resource,
                "cost",
                "cost_type",
              ).toLowerCase() || "free";

            const effort =
              getRecordString(
                resource,
                "effort",
                "estimated_effort",
              );

            const description =
              getRecordString(
                resource,
                "description",
              );

            const url =
              getRecordString(
                resource,
                "url",
                "link",
              );

            return (
              <div
                key={`${title}-${index}`}
                className="bg-card border border-border rounded-xl p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm leading-snug">
                    {title}
                  </h3>

                  <Badge
                    variant={
                      cost === "paid"
                        ? "paid"
                        : "free"
                    }
                  >
                    {formatLabel(cost)}
                  </Badge>
                </div>

                {provider && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {provider}
                  </p>
                )}

                <p className="text-xs text-foreground flex-1 mb-3">
                  {description}
                </p>

                <div className="flex items-center gap-2 flex-wrap mt-auto">
                  <Badge
                    variant={
                      difficulty === "intermediate"
                        ? "intermediate"
                        : "beginner"
                    }
                  >
                    {formatLabel(difficulty)}
                  </Badge>

                  {effort && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {effort}
                    </span>
                  )}

                  {skill && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  )}
                </div>

                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-xs text-primary hover:underline flex items-center gap-1 w-fit"
                  >
                    View Resource
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="mt-3 text-xs text-muted-foreground">
                    Resource link unavailable
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Resources are selected based on identified skill gaps.
        External links are provided by the recommendation dataset.
      </p>
    </div>
  );
}

// ─── Projects Tab ──────────────────────────────────────────────────────────────

function ProjectsTab({
  analysis,
}: {
  analysis: AnalysisResult;
}) {
  const projects =
  analysis.project_recommendations?.recommendations ?? [];

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Project ideas tailored to your skill gaps and the{" "}
        <strong className="text-foreground">
          {analysis.role}
        </strong>{" "}
        role.
      </p>

      {projects.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">
            No project recommendations were generated for this
            analysis.
          </p>
        </div>
      ) : (
        projects.map((project, index) => {
          const title =
            getRecordString(
              project,
              "title",
              "name",
            ) || "Project Recommendation";

          const description =
            getRecordString(
              project,
              "description",
            );

          const difficulty =
            getRecordString(
              project,
              "difficulty",
              "level",
            ).toLowerCase() || "beginner";

          const why =
            getRecordString(
              project,
              "why",
              "reason",
              "explanation",
            );

          const skills = getRecordStringArray(
            project,
            "skills",
            "skill_list",
          );

          const technologies = getRecordStringArray(
            project,
            "technologies",
            "tech_stack",
          );

          return (
            <div
              key={`${title}-${index}`}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-foreground">
                  {title}
                </h3>

                <Badge
                  variant={
                    difficulty === "intermediate"
                      ? "intermediate"
                      : "beginner"
                  }
                >
                  {formatLabel(difficulty)}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {description}
              </p>

              {(skills.length > 0 ||
                technologies.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {skills.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Skills demonstrated
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {technologies.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Technologies
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {technologies.map(
                          (technology) => (
                            <span
                              key={technology}
                              className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                            >
                              {technology}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {why && (
                <div className="p-3 bg-accent/40 rounded-lg">
                  <p className="text-xs font-medium text-foreground mb-1">
                    Why this helps
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {why}
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Market Tab ────────────────────────────────────────────────────────────────

function MarketTab({
  analysis,
}: {
  analysis: AnalysisResult;
}) {
  const marketInsights =
  analysis.market_insights?.insights ?? [];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-accent/40 border border-border rounded-xl">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />

          <p className="text-xs text-muted-foreground">
            Market insights are based on the market data available
            to the analysis service. Market information can change
            over time and may not represent every employer.
          </p>
        </div>
      </div>

      {marketInsights.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">
            No market insights were returned for this role.
          </p>
        </div>
      ) : (
        <>
          {/* Skill insights */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">
              Market Insights — {analysis.role}
            </h3>

            <div className="space-y-3">
              {marketInsights.map((insight, index) => {
                const name =
                  getRecordString(
                    insight,
                    "skill",
                    "name",
                    "title",
                  ) || `Insight ${index + 1}`;

                const percentage =
                  getRecordNumber(
                    insight,
                    "percentage",
                    "pct",
                    "frequency",
                    "market_percentage",
                  );

                const category =
                  getRecordString(
                    insight,
                    "category",
                    "type",
                  );

                const description =
                  getRecordString(
                    insight,
                    "description",
                    "explanation",
                  );

                return (
                  <div
                    key={`${name}-${index}`}
                    className="border-b border-border last:border-b-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-foreground flex-1">
                        {name}
                      </span>

                      {category && (
                        <span className="text-xs text-muted-foreground">
                          {formatLabel(category)}
                        </span>
                      )}

                      {percentage !== null && (
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {percentage}%
                        </span>
                      )}
                    </div>

                    {percentage !== null && (
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              Math.max(percentage, 0),
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    )}

                    {description && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categorized insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {marketInsights
              .filter(
                (item) =>
                  getRecordString(
                    item,
                    "category",
                    "type",
                  ),
              )
              .slice(0, 6)
              .map((item, index) => {
                const category =
                  getRecordString(
                    item,
                    "category",
                    "type",
                  );

                const title =
                  getRecordString(
                    item,
                    "title",
                    "name",
                    "skill",
                  );

                const description =
                  getRecordString(
                    item,
                    "description",
                    "explanation",
                  );

                return (
                  <div
                    key={`${category}-${title}-${index}`}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {formatLabel(category)}
                    </p>

                    <h3 className="font-semibold text-foreground text-sm mb-2">
                      {title}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      {description ||
                        "Market information associated with this role."}
                    </p>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function AnalysisResultsPage() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] =
    useState<TabId>("overview");

  const state = location.state as
    | {
        analysis?: AnalysisResult;
      }
    | null;

  const initialAnalysis = state?.analysis;

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(
      initialAnalysis ?? null,
    );

  const [isLoading, setIsLoading] =
    useState(!initialAnalysis);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      /*
       * Normal navigation from ProcessingPage already gives us
       * the complete analysis result.
       *
       * Use it immediately so the results page appears without
       * making another request.
       */
      if (initialAnalysis) {
        setAnalysis(initialAnalysis);
        setIsLoading(false);
        setError(null);
        return;
      }

      /*
       * If the user refreshed the page or opened the analysis
       * URL directly, React Router state is unavailable.
       *
       * In that case retrieve the persisted analysis from:
       *
       * GET /api/analysis/{analysis_id}
       */
      if (!id) {
        setAnalysis(null);
        setError("No analysis ID was provided.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const result = await getAnalysis(id);

        if (cancelled) {
          return;
        }

        setAnalysis(result);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setAnalysis(null);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the analysis result.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [id, initialAnalysis]);

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-6 text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />

          <h1 className="text-lg font-semibold text-foreground mb-2">
            Loading Analysis
          </h1>

          <p className="text-sm text-muted-foreground">
            Retrieving your analysis results...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error / missing analysis state
   */
  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-6 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-4" />

          <h1 className="text-lg font-semibold text-foreground mb-2">
            Analysis Result Not Available
          </h1>

          <p className="text-sm text-muted-foreground mb-5">
            {error ??
              "The requested analysis could not be loaded."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {id && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setAnalysis(null);

                  void getAnalysis(id)
                    .then((result) => {
                      setAnalysis(result);
                    })
                    .catch((err) => {
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Unable to load the analysis result.",
                      );
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-accent transition-colors"
              >
                Try Again
              </button>
            )}

            <Link
              to="/history"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-accent transition-colors"
            >
              Analysis History
            </Link>

            <Link
              to="/analysis/new"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start New Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const matchPercentage =
    analysis.skill_comparison?.match_percentage ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to="/history"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Analysis History
                </Link>

                <ChevronRight className="w-3 h-3 text-muted-foreground" />

                <span className="text-xs text-muted-foreground">
                  {analysis.role}
                </span>
              </div>

              <h1 className="text-xl font-bold text-foreground">
                {analysis.role}
              </h1>

              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />

                  {formatDate(analysis.created_at ?? "")}
                </span>

                <span className="text-xs text-muted-foreground">
                  Analysis ID: {analysis.analysis_id}
                </span>
              </div>
            </div>

            <div
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-lg ${getScoreBackground(
                matchPercentage,
              )}`}
            >
              {Math.round(matchPercentage)}%

              <span className="text-sm font-normal text-muted-foreground">
                match
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <OverviewTab
            analysis={analysis}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === "requirements" && (
          <RequirementsTab analysis={analysis} />
        )}

        {activeTab === "gaps" && (
          <GapsTab analysis={analysis} />
        )}

        {activeTab === "ats" && (
          <ATSTab analysis={analysis} />
        )}

        {activeTab === "improvements" && (
          <ImprovementsTab analysis={analysis} />
        )}

        {activeTab === "learning" && (
          <LearningTab analysis={analysis} />
        )}

        {activeTab === "projects" && (
          <ProjectsTab analysis={analysis} />
        )}

        {activeTab === "market" && (
          <MarketTab analysis={analysis} />
        )}
      </div>
    </div>
  );
}
