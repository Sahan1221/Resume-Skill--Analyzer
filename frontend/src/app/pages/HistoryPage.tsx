import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  PlusCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { getAnalysisHistory } from "../services/analysisApi";
import type { AnalysisHistoryItem } from "../types/analysis";

function formatDate(dateValue: string | null): string {
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

function ScoreIndicator({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    );
  }

  if (score >= 80) {
    return (
      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
    );
  }

  if (score >= 65) {
    return (
      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
    );
  }

  return (
    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
        No score
      </span>
    );
  }

  const cls =
    score >= 80
      ? "bg-emerald-400/10 text-emerald-300"
      : score >= 65
        ? "bg-amber-400/10 text-amber-300"
        : "bg-red-400/10 text-red-300";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      {score}% match
    </span>
  );
}

export function HistoryPage() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const records = await getAnalysisHistory();
      setHistory(records);
    } catch (err) {
      setHistory([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load analysis history.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Analysis History
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              {isLoading
                ? "Loading your analyses..."
                : `${history.length} analyses completed · Original CVs are not stored.`}
            </p>
          </div>

          <Link
            to="/analysis/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New Analysis
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />

            <p className="text-sm text-muted-foreground">
              Loading analysis history...
            </p>
          </div>
        ) : error ? (
          <div className="bg-card border border-red-400/20 rounded-xl p-10 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />

            <h3 className="font-medium text-foreground mb-1">
              Unable to load history
            </h3>

            <p className="text-sm text-muted-foreground mb-5">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadHistory()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />

            <h3 className="font-medium text-foreground mb-1">
              No analyses yet
            </h3>

            <p className="text-sm text-muted-foreground mb-5">
              Start your first analysis to see your results here.
            </p>

            <Link
              to="/analysis/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Analyze My Resume
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {history.map((analysis) => (
              <div
                key={analysis.analysis_id}
                className="flex items-center justify-between px-5 py-4 hover:bg-accent/30 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <ScoreIndicator score={analysis.overall_score} />

                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {analysis.role}
                    </p>

                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(analysis.created_at)}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        ·
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {analysis.gap_count} gaps found
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <ScoreBadge score={analysis.overall_score} />

                  <Link
                    to={`/analysis/${analysis.analysis_id}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    View Results
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Original CV files are not permanently stored. Only analysis results
          are saved.
        </p>
      </div>
    </div>
  );
}