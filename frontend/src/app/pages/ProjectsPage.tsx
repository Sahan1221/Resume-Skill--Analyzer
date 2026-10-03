import { useState } from "react";
import { FolderGit2, Filter } from "lucide-react";

const PROJECTS = [
  {
    title: "REST API with Authentication",
    description: "Build a backend REST API with user registration, login, and JWT authentication. Include at least two resource endpoints (e.g. tasks or notes) with full CRUD operations.",
    skills: ["Python", "REST APIs", "PostgreSQL", "JWT", "Authentication"],
    technologies: ["Python 3.11+", "FastAPI", "PostgreSQL", "Docker", "pytest"],
    difficulty: "medium",
    role: "Backend",
    why: "Directly addresses the most important gap: backend development and REST API experience. Covers Python, databases, and testing in one project.",
  },
  {
    title: "Containerize an Existing Project",
    description: "Take one of your current projects and add a Dockerfile, docker-compose.yml, and a basic GitHub Actions CI pipeline. Deploy to a free platform.",
    skills: ["Docker", "CI/CD", "GitHub Actions"],
    technologies: ["Docker", "Docker Compose", "GitHub Actions"],
    difficulty: "easy",
    role: "DevOps",
    why: "Closes the Docker gap quickly. Minimal effort with high visibility on a resume.",
  },
  {
    title: "CLI Task Manager with SQLite",
    description: "Build a command-line task manager that stores data in SQLite. Include CRUD operations, filtering by status/date, and at least 30 automated unit tests.",
    skills: ["Python", "SQL", "Automated Testing", "CLI"],
    technologies: ["Python", "SQLite", "Click", "pytest"],
    difficulty: "medium",
    role: "Backend",
    why: "Demonstrates database design, testing discipline, and Python proficiency in a single portable project.",
  },
  {
    title: "Personal Portfolio with CI/CD",
    description: "Build or update your personal portfolio site with a GitHub Actions pipeline that runs lint checks and deploys on merge to main.",
    skills: ["React", "TypeScript", "CI/CD", "GitHub Actions"],
    technologies: ["React", "TypeScript", "GitHub Actions", "Netlify or Vercel"],
    difficulty: "easy",
    role: "Frontend",
    why: "Shows frontend skills, TypeScript awareness, and basic CI/CD while producing a public showcase of your work.",
  },
  {
    title: "URL Shortener Service",
    description: "Build a full-stack URL shortener with a FastAPI backend and React frontend. Include analytics tracking (click counts) and a PostgreSQL database.",
    skills: ["Python", "React", "SQL", "REST APIs", "Full Stack"],
    technologies: ["FastAPI", "React", "PostgreSQL", "Docker"],
    difficulty: "medium",
    role: "Full Stack",
    why: "A classic portfolio project that demonstrates frontend, backend, and database integration in one coherent product.",
  },
  {
    title: "Data Pipeline with Automation",
    description: "Build a Python data pipeline that fetches data from a public API, transforms it, stores it in a database, and generates a simple report. Schedule with cron or GitHub Actions.",
    skills: ["Python", "SQL", "CI/CD", "Data Processing"],
    technologies: ["Python", "SQLite or PostgreSQL", "pandas", "GitHub Actions"],
    difficulty: "medium",
    role: "Data / Backend",
    why: "Relevant for data analyst and backend roles. Demonstrates data engineering awareness and Python skills.",
  },
];

function DiffBadge({ level }: { level: string }) {
  const cls = level === "easy" ? "bg-blue-400/10 text-blue-600" : level === "medium" ? "bg-amber-400/10 text-amber-300" : "bg-orange-50 text-orange-700";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{level}</span>;
}

export function ProjectsPage() {
  const [filterRole, setFilterRole] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");

  const roles = ["All", ...new Set(PROJECTS.map((p) => p.role))];

  const filtered = PROJECTS.filter((p) =>
    (filterRole === "All" || p.role === filterRole) &&
    (filterDiff === "All" || p.difficulty === filterDiff)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Project Recommendations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Projects that will strengthen your profile and demonstrate skills relevant to your target roles.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap mb-6 p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <div className="flex gap-2 flex-wrap flex-1">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {roles.map((r) => <option key={r}>{r === "All" ? "All Roles" : r}</option>)}
            </select>
            <select
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="All">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
            </select>
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} of {PROJECTS.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FolderGit2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No projects match the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filtered.map((p) => (
              <div key={p.title} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{p.role}</span>
                  </div>
                  <DiffBadge level={p.difficulty} />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Skills demonstrated</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.skills.map((s) => (
                        <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.technologies.map((t) => (
                        <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-accent/40 rounded-lg">
                  <p className="text-xs font-medium text-foreground mb-1">Why this helps</p>
                  <p className="text-xs text-muted-foreground">{p.why}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
