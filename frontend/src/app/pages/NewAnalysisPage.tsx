import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Search,
  Shield,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import { createAnalysis } from "../services/analysisApi";
import type { AnalysisResult } from "../types/analysis";

const ROLES = [
  "Software Engineering Intern",
  "Frontend Developer Intern",
  "Backend Developer Intern",
  "Full Stack Developer Intern",
  "Data Analyst Intern",
  "Data Science Intern",
  "QA Engineer Intern",
  "DevOps / Cloud Intern",
  "UI/UX Design Intern",
  "Machine Learning Intern",
  "Cybersecurity Intern",
  "Mobile Developer Intern",
];

type UploadState =
  | "idle"
  | "uploading"
  | "uploaded"
  | "error_type"
  | "error_size";

function getUserFriendlyAnalysisError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unable to analyze your resume. Please try again.";
  }

  const message = error.message.trim();

  if (!message) {
    return "Unable to analyze your resume. Please try again.";
  }

  const normalized = message.toLowerCase();

  if (
    normalized.includes("401") ||
    normalized.includes("unauthorized") ||
    normalized.includes("authentication") ||
    normalized.includes("token")
  ) {
    return "Your session has expired. Please sign in again.";
  }

  if (
    normalized.includes("403") ||
    normalized.includes("forbidden")
  ) {
    return "You are not authorized to perform this analysis.";
  }

  if (
    normalized.includes("413") ||
    normalized.includes("too large") ||
    normalized.includes("maximum file size")
  ) {
    return "The CV file is too large. Please select a PDF smaller than 5 MB.";
  }

  if (
    normalized.includes("415") ||
    normalized.includes("pdf") &&
      normalized.includes("file")
  ) {
    return "The selected file could not be processed. Please make sure it is a valid PDF.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("fetch")
  ) {
    return "Unable to connect to the analysis server. Please make sure the backend is running and try again.";
  }

  if (
    normalized.includes("500") ||
    normalized.includes("internal server error")
  ) {
    return "The analysis server encountered an error. Please try again.";
  }

  return message;
}

export function NewAnalysisPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [uploadState, setUploadState] =
    useState<UploadState>("idle");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [file, setFile] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const [selectedRole, setSelectedRole] =
    useState("");

  const [customRole, setCustomRole] =
    useState("");

  const [roleSearch, setRoleSearch] =
    useState("");

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [analysisError, setAnalysisError] =
    useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const processFile = (f: File) => {
    setAnalysisError("");
    setUploadState("uploading");

    // Clear any previous file immediately.
    setSelectedFile(null);
    setFile(null);

    if (
      f.type !== "application/pdf" &&
      !f.name.toLowerCase().endsWith(".pdf")
    ) {
      setTimeout(() => {
        setUploadState("error_type");
      }, 300);

      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      setTimeout(() => {
        setUploadState("error_size");
      }, 300);

      return;
    }

    setTimeout(() => {
      setSelectedFile(f);

      setFile({
        name: f.name,
        size: formatSize(f.size),
      });

      setUploadState("uploaded");
      setAnalysisError("");
    }, 500);
  };

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = e.target.files?.[0];

    if (selected) {
      processFile(selected);
    }

    // Allow selecting the same file again after an error.
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      setIsDragging(false);

      const droppedFile =
        e.dataTransfer.files?.[0];

      if (droppedFile) {
        processFile(droppedFile);
      }
    },
    [],
  );

  const removeFile = () => {
    setSelectedFile(null);
    setFile(null);
    setUploadState("idle");
    setAnalysisError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredRoles = ROLES.filter((role) =>
    role
      .toLowerCase()
      .includes(roleSearch.toLowerCase()),
  );

  const activeRole =
    selectedRole || customRole.trim();

  const canProceed =
    step === 1
      ? uploadState === "uploaded" &&
        selectedFile !== null
      : !!activeRole;

  const handleAnalyze = async () => {
    if (!selectedFile || !activeRole || isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");

    try {
      const result: AnalysisResult =
        await createAnalysis(
          selectedFile,
          activeRole,
        );

      navigate("/analysis/processing", {
        state: {
          role: activeRole,
          fileName: selectedFile.name,
          analysis: result,
        },
      });
    } catch (error) {
      setAnalysisError(
        getUserFriendlyAnalysisError(error),
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetryAnalysis = () => {
    setAnalysisError("");

    if (selectedFile && activeRole) {
      void handleAnalyze();
    }
  };

  const steps = [
    {
      n: 1,
      label: "Upload CV",
    },
    {
      n: 2,
      label: "Target Role",
    },
    {
      n: 3,
      label: "Analyze",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            New Analysis
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Upload your CV and select a target role to get
            your personalized analysis.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="flex items-center flex-1"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step > s.n
                      ? "bg-primary text-primary-foreground"
                      : step === s.n
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.n ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    s.n
                  )}
                </div>

                <span
                  className={`text-sm font-medium ${
                    step === s.n
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 ${
                    step > s.n
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-1">
              Upload Your CV
            </h2>

            <p className="text-sm text-muted-foreground mb-5">
              PDF files only · Maximum 5 MB
            </p>

            {uploadState === "uploaded" &&
            file ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-400/10 border border-emerald-200 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {file.size}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() =>
                  setIsDragging(false)
                }
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-accent/50"
                    : uploadState === "error_type" ||
                        uploadState === "error_size"
                      ? "border-destructive bg-red-400/10"
                      : "border-border hover:border-primary/50 hover:bg-accent/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />

                {uploadState === "uploading" ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />

                    <p className="text-sm text-muted-foreground">
                      Preparing CV...
                    </p>
                  </div>
                ) : uploadState ===
                  "error_type" ? (
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-destructive" />

                    <p className="font-medium text-destructive text-sm">
                      Invalid file type
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Only PDF files are accepted.
                      Click to try again.
                    </p>
                  </div>
                ) : uploadState ===
                  "error_size" ? (
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-destructive" />

                    <p className="font-medium text-destructive text-sm">
                      File too large
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Maximum file size is 5 MB.
                      Click to try again.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Drag & drop your CV here,
                        or{" "}
                        <span className="text-primary">
                          browse files
                        </span>
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        PDF only · Max 5 MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mt-4 p-3 bg-accent/40 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

              <p className="text-xs text-muted-foreground">
                Your CV is processed for analysis only.
                The original file is not permanently stored.
              </p>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-1">
              Select Target Role
            </h2>

            <p className="text-sm text-muted-foreground mb-5">
              Choose the internship or job you are
              applying for.
            </p>

            <div className="relative mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Search roles..."
                  value={roleSearch}
                  onChange={(e) => {
                    setRoleSearch(e.target.value);
                    setShowDropdown(true);
                    setAnalysisError("");
                  }}
                  onFocus={() =>
                    setShowDropdown(true)
                  }
                  className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {showDropdown &&
                filteredRoles.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-52 overflow-y-auto">
                    {filteredRoles.map((role) => (
                      <button
                        type="button"
                        key={role}
                        className={`w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors flex items-center justify-between ${
                          selectedRole === role
                            ? "bg-accent/50 text-primary font-medium"
                            : "text-foreground"
                        }`}
                        onClick={() => {
                          setSelectedRole(role);
                          setCustomRole("");
                          setRoleSearch(role);
                          setShowDropdown(false);
                          setAnalysisError("");
                        }}
                      >
                        {role}

                        {selectedRole ===
                          role && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            {selectedRole && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                <CheckCircle2 className="w-4 h-4 text-primary" />

                <span className="text-sm font-medium text-foreground">
                  {selectedRole}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("");
                    setRoleSearch("");
                    setAnalysisError("");
                  }}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                  title="Clear selected role"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Or enter a custom role
              </p>

              <input
                type="text"
                placeholder="e.g. iOS Developer Intern"
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  setSelectedRole("");
                  setAnalysisError("");
                }}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-1">
              Ready to Analyze
            </h2>

            <p className="text-sm text-muted-foreground mb-6">
              Review your submission, then start the
              analysis.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-lg">
                <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />

                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    CV FILE
                  </p>

                  <p className="text-sm text-foreground mt-0.5">
                    {file?.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {file?.size}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />

                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    TARGET ROLE
                  </p>

                  <p className="text-sm text-foreground mt-0.5">
                    {activeRole}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-accent/40 rounded-lg mb-6">
              <Shield className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

              <p className="text-xs text-muted-foreground">
                Your CV is processed for analysis only.
                The original file is not permanently stored.
              </p>
            </div>

            {analysisError && (
              <div
                role="alert"
                className="flex items-start gap-3 p-4 mb-4 bg-red-400/10 border border-red-400/20 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-destructive">
                    Analysis could not be completed
                  </p>

                  <p className="text-sm text-destructive/90 mt-1">
                    {analysisError}
                  </p>

                  {selectedFile && activeRole && (
                    <button
                      type="button"
                      onClick={handleRetryAnalysis}
                      disabled={isAnalyzing}
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 border border-red-300 rounded-md text-xs font-medium text-destructive hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={
                isAnalyzing ||
                !selectedFile ||
                !activeRole
              }
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze My Resume
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() =>
              setStep((current) =>
                Math.max(1, current - 1),
              )
            }
            disabled={
              step === 1 || isAnalyzing
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < 3 && (
            <button
              type="button"
              onClick={() =>
                setStep((current) =>
                  Math.min(3, current + 1),
                )
              }
              disabled={!canProceed}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}