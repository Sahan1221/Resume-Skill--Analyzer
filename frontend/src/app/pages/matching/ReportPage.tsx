import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Download, Printer, CheckCircle, AlertCircle, TrendingUp, User, Briefcase } from "lucide-react";
import { Progress } from "../../components/ui/progress";

export function ReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // Mock report data
  const report = {
    candidate: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      currentPosition: "Software Engineer",
      totalExperience: 7,
      location: "San Francisco, CA"
    },
    job: {
      requisitionNumber: "REQ-2026-001",
      jobTitle: "Senior Software Engineer",
      department: "Engineering",
      businessUnit: "Product Development",
      hiringManager: "John Smith",
      location: "San Francisco, CA / Remote"
    },
    evaluation: {
      date: "2026-06-01 14:30",
      evaluator: "John Smith",
      overallScore: 88,
      category: "Good Fit",
      recommendation: "Highly Recommended"
    },
    breakdown: {
      skillsMatch: { score: 26, maxScore: 30, weight: 30, percentage: 87 },
      experience: { score: 22, maxScore: 25, weight: 25, percentage: 88 },
      yearsOfExperience: { score: 10, maxScore: 10, weight: 10, percentage: 100 },
      education: { score: 9, maxScore: 10, weight: 10, percentage: 90 },
      tools: { score: 13, maxScore: 15, weight: 15, percentage: 87 },
      softSkills: { score: 8, maxScore: 10, weight: 10, percentage: 80 }
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
    summary: "Sarah Johnson is a strong candidate for this Senior Software Engineer role. She exceeds the experience requirements with 7 years of professional development work and demonstrates expertise in the core technologies (React, TypeScript, AWS). Her AWS certification directly matches the job requirements, and her proven track record of mentoring junior developers aligns perfectly with the leadership aspects of this position. While there are minor gaps in MongoDB and Kubernetes experience, these are secondary skills that can be developed on the job. Her strong foundation in modern software development practices and excellent communication skills make her an excellent fit for this role."
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

  const badge = getCategoryBadge(report.evaluation.category);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/matching/history")}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-primary">Candidate Match Report</h1>
              <p className="text-muted-foreground mt-1">Evaluation ID: {reportId}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Candidate Profile */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-foreground">Candidate Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Name</p>
                <p className="text-foreground mb-4">{report.candidate.name}</p>

                <p className="text-muted-foreground text-sm mb-1">Email</p>
                <p className="text-foreground mb-4">{report.candidate.email}</p>

                <p className="text-muted-foreground text-sm mb-1">Phone</p>
                <p className="text-foreground mb-4">{report.candidate.phone}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-1">Current Position</p>
                <p className="text-foreground mb-4">{report.candidate.currentPosition}</p>

                <p className="text-muted-foreground text-sm mb-1">Total Experience</p>
                <p className="text-foreground mb-4">{report.candidate.totalExperience} years</p>

                <p className="text-muted-foreground text-sm mb-1">Location</p>
                <p className="text-foreground mb-4">{report.candidate.location}</p>
              </div>
            </div>
          </div>

          {/* Job Description Summary */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-foreground">Job Description Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Requisition Number</p>
                <p className="text-foreground mb-4">{report.job.requisitionNumber}</p>

                <p className="text-muted-foreground text-sm mb-1">Job Title</p>
                <p className="text-foreground mb-4">{report.job.jobTitle}</p>

                <p className="text-muted-foreground text-sm mb-1">Department</p>
                <p className="text-foreground mb-4">{report.job.department}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-1">Business Unit</p>
                <p className="text-foreground mb-4">{report.job.businessUnit}</p>

                <p className="text-muted-foreground text-sm mb-1">Hiring Manager</p>
                <p className="text-foreground mb-4">{report.job.hiringManager}</p>

                <p className="text-muted-foreground text-sm mb-1">Location</p>
                <p className="text-foreground mb-4">{report.job.location}</p>
              </div>
            </div>
          </div>

          {/* Match Score */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <h2 className="text-foreground mb-6">Match Score</h2>

            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-2">
                      <span className="text-primary">{report.evaluation.overallScore}%</span>
                    </div>
                  </div>
                  <div>
                    <div className={`inline-flex px-4 py-2 rounded-full ${badge.bg} ${badge.text} mb-2`}>
                      {report.evaluation.category}
                    </div>
                    <p className="text-muted-foreground text-sm">Evaluated on {report.evaluation.date}</p>
                    <p className="text-muted-foreground text-sm">By {report.evaluation.evaluator}</p>
                  </div>
                </div>
              </div>
              <div className={`px-6 py-3 rounded-lg ${badge.bg}`}>
                <p className={`${badge.text} text-sm mb-1`}>Recommendation</p>
                <p className={`${badge.text}`}>{report.evaluation.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Detailed Score Breakdown */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <h2 className="text-foreground mb-6">Detailed Score Breakdown</h2>

            <div className="space-y-6">
              {Object.entries(report.breakdown).map(([key, data]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()} (Weight: {data.weight}%)
                    </span>
                    <span className="text-primary">
                      {data.score}/{data.maxScore} ({data.percentage}%)
                    </span>
                  </div>
                  <Progress value={data.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Findings */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <h2 className="text-foreground mb-6">AI Findings</h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-chart-2" />
                  <h3 className="text-foreground">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {report.strengths.map((strength, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <span className="text-chart-2 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-foreground">Potential Gaps</h3>
                </div>
                <ul className="space-y-3">
                  {report.gaps.map((gap, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <span className="text-orange-500 mt-1">!</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Hiring Manager Summary */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-foreground">Executive Summary</h2>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-muted-foreground leading-relaxed">{report.summary}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6 text-center">
            <p className="text-muted-foreground text-sm">
              This report was generated by HR Assistant AI-Powered HR Platform
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              For HR Review, Hiring Manager Review, and Interview Panel Reference
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
