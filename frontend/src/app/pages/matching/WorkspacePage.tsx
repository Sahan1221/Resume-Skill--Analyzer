import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Upload, Search, User, TrendingUp, CheckCircle, AlertCircle, XCircle, ArrowLeft, FileText } from "lucide-react";
import { Progress } from "../../components/ui/progress";

interface MatchResult {
  overallScore: number;
  category: string;
  categoryColor: string;
  breakdown: {
    skillsMatch: { score: number; weight: number; explanation: string; maxScore: number };
    experience: { score: number; weight: number; explanation: string; maxScore: number };
    yearsOfExperience: { score: number; weight: number; explanation: string; maxScore: number };
    education: { score: number; weight: number; explanation: string; maxScore: number };
    tools: { score: number; weight: number; explanation: string; maxScore: number };
    softSkills: { score: number; weight: number; explanation: string; maxScore: number };
  };
  strengths: string[];
  gaps: string[];
  recommendation: string;
  summary: string;
}

export function WorkspacePage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock job data
  const jobData = {
    id: jobId,
    jobTitle: "Senior Software Engineer",
    department: "Engineering",
    businessUnit: "Product Development",
    responsibilities: [
      "Lead development of core product features",
      "Mentor junior developers",
      "Conduct code reviews and ensure best practices",
      "Collaborate with product team on technical requirements"
    ],
    requiredSkills: ["React", "TypeScript", "Node.js", "AWS", "MongoDB"],
    requiredExperience: "5+ years in software development",
    requiredCertifications: ["AWS Certified Developer"],
    requiredTools: ["Git", "Docker", "Kubernetes", "Jenkins"],
    requiredSoftSkills: ["Team Leadership", "Problem Solving", "Communication"]
  };

  const mockCandidates = [
    { id: 1, name: "Sarah Johnson", email: "sarah@email.com", currentPosition: "Software Engineer", totalExperience: 7, skills: "React, TypeScript, AWS" },
    { id: 2, name: "Michael Chen", email: "michael@email.com", currentPosition: "Full Stack Developer", totalExperience: 5, skills: "Node.js, React, MongoDB" },
    { id: 3, name: "Emma Williams", email: "emma@email.com", currentPosition: "Frontend Developer", totalExperience: 4, skills: "React, JavaScript, CSS" },
  ];

  const runMatching = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const result: MatchResult = {
        overallScore: 88,
        category: "Good Fit",
        categoryColor: "text-primary",
        breakdown: {
          skillsMatch: {
            score: 26,
            weight: 30,
            maxScore: 30,
            explanation: "Strong match in React, TypeScript, and AWS. Limited MongoDB experience but demonstrates learning capability."
          },
          experience: {
            score: 22,
            weight: 25,
            maxScore: 25,
            explanation: "7 years of relevant software development experience with progressive leadership roles. Direct alignment with position requirements."
          },
          yearsOfExperience: {
            score: 10,
            weight: 10,
            maxScore: 10,
            explanation: "Exceeds minimum requirement of 5 years with 7 years of professional experience."
          },
          education: {
            score: 9,
            weight: 10,
            maxScore: 10,
            explanation: "BS in Computer Science from accredited university. AWS Certified Developer certification obtained."
          },
          tools: {
            score: 13,
            weight: 15,
            maxScore: 15,
            explanation: "Proficient in Git, Docker, and CI/CD pipelines. Some Kubernetes experience, seeking to expand."
          },
          softSkills: {
            score: 8,
            weight: 10,
            maxScore: 10,
            explanation: "Demonstrated team leadership through mentoring initiatives. Strong communication skills evidenced by technical presentations."
          }
        },
        strengths: [
          "Strong technical skills in React and TypeScript with 5+ years hands-on experience",
          "AWS Certified Developer - matches required certification",
          "Proven track record of leading development teams and mentoring junior developers",
          "Experience with Docker and modern DevOps practices",
          "Excellent communication skills demonstrated through conference talks and blog posts"
        ],
        gaps: [
          "Limited production MongoDB experience (only used in side projects)",
          "Kubernetes experience is basic - primarily Docker-focused",
          "No direct experience with Jenkins CI/CD (used CircleCI instead)"
        ],
        recommendation: "Highly Recommended",
        summary: "Sarah Johnson is a strong candidate for this Senior Software Engineer role. She exceeds the experience requirements with 7 years of professional development work and demonstrates expertise in the core technologies (React, TypeScript, AWS). Her AWS certification directly matches the job requirements, and her proven track record of mentoring junior developers aligns perfectly with the leadership aspects of this position. While there are minor gaps in MongoDB and Kubernetes experience, these are secondary skills that can be developed on the job. Her strong foundation in modern software development practices and excellent communication skills make her an excellent fit for this role."
      };

      setMatchResult(result);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getCategoryBadge = (category: string) => {
    const configs: any = {
      "Excellent Fit": { bg: "bg-chart-2/10", text: "text-chart-2" },
      "Good Fit": { bg: "bg-primary/10", text: "text-primary" },
      "Moderate Fit": { bg: "bg-orange-500/10", text: "text-orange-500" },
      "Poor Fit": { bg: "bg-destructive/10", text: "text-destructive" }
    };
    return configs[category] || configs["Moderate Fit"];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/matching")}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-primary">Candidate Matching Workspace</h1>
            <p className="text-muted-foreground mt-1">Evaluate candidates against job requirements using AI analysis.</p>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANEL - Job Description */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-xl shadow-md border border-border p-6 sticky top-6">
              <h2 className="text-foreground mb-4">Selected Job</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground mb-1">{jobData.jobTitle}</h3>
                  <p className="text-muted-foreground text-sm">{jobData.department}</p>
                  <p className="text-muted-foreground text-sm">{jobData.businessUnit}</p>
                </div>

                <div>
                  <h4 className="text-foreground mb-2 text-sm">Responsibilities</h4>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    {jobData.responsibilities.map((resp, i) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-foreground mb-2 text-sm">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobData.requiredSkills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground mb-2 text-sm">Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobData.requiredTools.map((tool, i) => (
                      <span key={i} className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground mb-2 text-sm">Experience</h4>
                  <p className="text-muted-foreground text-sm">{jobData.requiredExperience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER PANEL - Candidate Selection */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-xl shadow-md border border-border p-6 mb-6">
              <h2 className="text-foreground mb-4">Select Candidate</h2>

              {/* Search Candidates */}
              <div className="mb-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search candidate name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {mockCandidates.map(candidate => (
                    <div
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate)}
                      className={`p-4 border border-border rounded-lg cursor-pointer transition-colors ${
                        selectedCandidate?.id === candidate.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground">{candidate.name}</p>
                          <p className="text-muted-foreground text-sm">{candidate.currentPosition}</p>
                          <p className="text-muted-foreground text-xs mt-1">{candidate.totalExperience} years exp</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">OR</span>
                </div>
              </div>

              {/* Upload New CV */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground mb-1">Upload New CV</p>
                <p className="text-muted-foreground text-sm">Drag and drop or click to browse</p>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
              </div>
            </div>

            {/* Candidate Info */}
            {selectedCandidate && (
              <div className="bg-card rounded-xl shadow-md border border-border p-6">
                <h3 className="text-foreground mb-4">Candidate Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-muted-foreground text-sm">Name</p>
                    <p className="text-foreground">{selectedCandidate.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Current Position</p>
                    <p className="text-foreground">{selectedCandidate.currentPosition}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total Experience</p>
                    <p className="text-foreground">{selectedCandidate.totalExperience} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Key Skills</p>
                    <p className="text-foreground">{selectedCandidate.skills}</p>
                  </div>
                </div>

                <button
                  onClick={runMatching}
                  disabled={isAnalyzing}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Running AI Matching...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      Run AI Matching
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Match Results */}
          <div className="lg:col-span-5">
            {matchResult ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-card rounded-xl shadow-md border border-border p-6">
                  <h2 className="text-foreground mb-6">AI Match Results</h2>

                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-4">
                      <div className="text-center">
                        <p className="text-primary">{matchResult.overallScore}%</p>
                        <p className="text-muted-foreground text-xs">Match Score</p>
                      </div>
                    </div>
                    <div className={`inline-flex px-4 py-2 rounded-full ${getCategoryBadge(matchResult.category).bg} ${getCategoryBadge(matchResult.category).text}`}>
                      {matchResult.category}
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-card rounded-xl shadow-md border border-border p-6">
                  <h3 className="text-foreground mb-4">Evaluation Breakdown</h3>

                  <div className="space-y-6">
                    {Object.entries(matchResult.breakdown).map(([key, data]) => {
                      const percentage = (data.score / data.maxScore) * 100;
                      return (
                        <div key={key}>
                          <div className="flex justify-between mb-2">
                            <span className="text-foreground text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()} ({data.weight}%)
                            </span>
                            <span className="text-primary">{data.score}/{data.maxScore}</span>
                          </div>
                          <Progress value={percentage} className="h-2 mb-2" />
                          <p className="text-muted-foreground text-xs">{data.explanation}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-card rounded-xl shadow-md border border-border p-6">
                  <h3 className="text-foreground mb-4">AI Analysis</h3>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-chart-2" />
                        <h4 className="text-foreground">Strengths</h4>
                      </div>
                      <ul className="space-y-2">
                        {matchResult.strengths.map((strength, i) => (
                          <li key={i} className="flex gap-2 text-muted-foreground text-sm">
                            <span className="text-chart-2">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <h4 className="text-foreground">Potential Gaps</h4>
                      </div>
                      <ul className="space-y-2">
                        {matchResult.gaps.map((gap, i) => (
                          <li key={i} className="flex gap-2 text-muted-foreground text-sm">
                            <span className="text-orange-500">!</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h4 className="text-foreground">AI Recommendation</h4>
                      </div>
                      <div className={`p-4 rounded-lg ${getCategoryBadge(matchResult.category).bg}`}>
                        <p className={`mb-2 ${getCategoryBadge(matchResult.category).text}`}>
                          {matchResult.recommendation}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-foreground mb-3">Hiring Manager Summary</h4>
                      <div className="p-4 bg-accent/30 rounded-lg">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {matchResult.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-accent transition-colors">
                      <FileText className="w-5 h-5 mx-auto mb-1 text-foreground" />
                      <span className="text-foreground text-sm">Download Report</span>
                    </button>
                    <button
                      onClick={() => navigate("/matching/history")}
                      className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Save & View History
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl shadow-md border border-border p-12 text-center">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-foreground mb-2">No Match Results Yet</h3>
                <p className="text-muted-foreground">
                  Select a candidate and click "Run AI Matching" to see AI-powered evaluation results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
