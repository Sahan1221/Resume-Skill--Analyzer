import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
} from "lucide-react";

import type { AnalysisResult } from "../types/analysis";

interface ProcessingState {
  role?: string;
  fileName?: string;
  analysis?: AnalysisResult;
}

export function ProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [processingError, setProcessingError] = useState(false);

  const state = location.state as ProcessingState | null;

  const role =
    state?.role ||
    state?.analysis?.role ||
    "Software Engineering Intern";

  const fileName =
    state?.fileName ||
    "resume.pdf";

  const analysis = state?.analysis;

  useEffect(() => {
    if (!analysis) {
      return;
    }

    if (!analysis.analysis_id) {
      setProcessingError(true);
      return;
    }

    setProcessingError(false);

    const timer = window.setTimeout(() => {
      try {
        navigate(`/analysis/${analysis.analysis_id}`, {
          state: {
            analysis,
          },
          replace: true,
        });
      } catch {
        setProcessingError(true);
      }
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [analysis, navigate]);

  if (!analysis || processingError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center">
          <div className="p-3 bg-red-400/10 rounded-full w-fit mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>

          <h2 className="font-semibold text-foreground text-lg mb-2">
            {processingError
              ? "Unable to open analysis results"
              : "Analysis information is missing"}
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            {processingError
              ? "The analysis result could not be opened. Please try starting a new analysis."
              : "Please start a new analysis and try again."}
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              to="/analysis/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Start New Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>

            <h1 className="font-bold text-xl text-foreground mb-1">
              Analysis completed
            </h1>

            <p className="text-sm text-muted-foreground">
              Analysis completed for{" "}
              <span className="font-medium text-foreground">
                {fileName}
              </span>{" "}
              against{" "}
              <span className="font-medium text-foreground">
                {role}
              </span>
              .
            </p>
          </div>

          <div className="space-y-2">
            {[
              "Resume text extracted",
              "Resume information analyzed",
              "Target role analyzed",
              "Skills compared",
              "ATS and keyword analysis completed",
              "Recommendations generated",
              "Learning and project recommendations generated",
              "Market insights generated",
            ].map((stage) => (
              <div
                key={stage}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />

                <span className="text-sm text-foreground">
                  {stage}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Opening your analysis results...
          </p>
        </div>
      </div>
    </div>
  );
}