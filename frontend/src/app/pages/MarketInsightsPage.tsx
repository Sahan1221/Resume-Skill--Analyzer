import { useState } from "react";
import { TrendingUp, Info } from "lucide-react";

const ROLES = [
  "Software Engineering Intern",
  "Frontend Developer Intern",
  "Backend Developer Intern",
  "Data Analyst Intern",
  "QA Engineer Intern",
  "DevOps / Cloud Intern",
];

const DATA: Record<string, {
  skills: { name: string; pct: number }[];
  trending: string[];
  projectAreas: string[];
  learningAreas: string[];
}> = {
  "Software Engineering Intern": {
    skills: [
      { name: "Python", pct: 87 }, { name: "JavaScript", pct: 82 }, { name: "Git", pct: 80 },
      { name: "REST APIs", pct: 71 }, { name: "SQL", pct: 68 }, { name: "React", pct: 61 },
      { name: "Docker", pct: 52 }, { name: "Automated Testing", pct: 48 }, { name: "TypeScript", pct: 44 }, { name: "CI/CD", pct: 39 },
    ],
    trending: ["TypeScript", "FastAPI", "Containerization", "LLM APIs", "Cloud Basics", "System Design"],
    projectAreas: ["REST API development", "Web applications", "Data pipelines", "CLI tools", "Open source contributions", "Automation scripts"],
    learningAreas: ["Data Structures & Algorithms", "System Design", "Database fundamentals", "Testing & QA", "Cloud deployment", "Code review practices"],
  },
  "Frontend Developer Intern": {
    skills: [
      { name: "React", pct: 91 }, { name: "JavaScript", pct: 89 }, { name: "TypeScript", pct: 72 },
      { name: "CSS / Tailwind", pct: 80 }, { name: "Git", pct: 78 }, { name: "REST API consumption", pct: 65 },
      { name: "Accessibility", pct: 41 }, { name: "Testing (Jest)", pct: 38 }, { name: "Next.js", pct: 48 }, { name: "Performance optimization", pct: 35 },
    ],
    trending: ["TypeScript", "Next.js", "Tailwind CSS", "Storybook", "Web Vitals"],
    projectAreas: ["Component libraries", "Portfolio sites", "E-commerce frontends", "Dashboard UIs", "Responsive web apps"],
    learningAreas: ["TypeScript", "Accessibility standards", "Browser performance", "Component architecture", "CSS/layout systems"],
  },
  "Data Analyst Intern": {
    skills: [
      { name: "SQL", pct: 94 }, { name: "Python", pct: 82 }, { name: "Excel / Sheets", pct: 76 },
      { name: "Data visualization", pct: 69 }, { name: "Pandas", pct: 61 }, { name: "Git", pct: 52 },
      { name: "Statistics", pct: 60 }, { name: "Power BI / Tableau", pct: 45 }, { name: "Communication", pct: 70 }, { name: "Storytelling", pct: 55 },
    ],
    trending: ["Python analytics", "dbt", "BigQuery", "Streamlit", "Data storytelling"],
    projectAreas: ["Data cleaning pipelines", "Exploratory dashboards", "Business reports", "ETL scripts", "Predictive models"],
    learningAreas: ["SQL advanced queries", "Statistical analysis", "Data visualization best practices", "Python (pandas/numpy)", "Business metrics"],
  },
};

export function MarketInsightsPage() {
  const [selectedRole, setSelectedRole] = useState("Software Engineering Intern");
  const roleData = DATA[selectedRole] || DATA["Software Engineering Intern"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Market Insights</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Role-specific skill and technology trends to guide your preparation.
            </p>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-4 bg-amber-400/10 border border-amber-200 rounded-xl mb-6">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            Data is based on aggregated internship posting analysis and is indicative only. Market trends change over time — use this as a guide, not a guarantee.
            Updated: September 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills bar chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Commonly Required Skills</h2>
              <span className="text-xs text-muted-foreground ml-auto">% of postings mentioning this skill</span>
            </div>
            <div className="space-y-3">
              {roleData.skills.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-sm text-foreground w-44 flex-shrink-0">{s.name}</span>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${s.pct >= 70 ? "bg-primary" : s.pct >= 50 ? "bg-chart-2" : "bg-muted-foreground/40"}`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right flex-shrink-0">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-3">Trending / Emerging Skills</h2>
            <div className="flex flex-wrap gap-2">
              {roleData.trending.map((s) => (
                <span key={s} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Increasingly common in recent postings. Not always required but can differentiate your application.
            </p>
          </div>

          {/* Project areas */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-3">Common Project Areas</h2>
            <ul className="space-y-2">
              {roleData.projectAreas.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Learning areas */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-3">Common Learning Areas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {roleData.learningAreas.map((a) => (
                <div key={a} className="text-xs text-foreground bg-accent/40 px-3 py-2.5 rounded-lg">{a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
