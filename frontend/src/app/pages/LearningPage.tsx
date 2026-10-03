import { useState } from "react";
import { BookOpen, ExternalLink, Clock, Filter } from "lucide-react";

const RESOURCES = [
  {
    title: "Docker for Beginners",
    provider: "Docker Official Documentation",
    skill: "Docker",
    difficulty: "beginner",
    cost: "free",
    effort: "~8 hours",
    description: "Official hands-on guide to containers, images, volumes, and Docker Compose. Includes exercises for local development setup.",
  },
  {
    title: "FastAPI — Building REST APIs with Python",
    provider: "FastAPI Official Documentation",
    skill: "REST APIs",
    difficulty: "intermediate",
    cost: "free",
    effort: "~10 hours",
    description: "Comprehensive official tutorial for building production-grade REST APIs. Covers routing, validation, authentication, and async.",
  },
  {
    title: "Testing in Python with pytest",
    provider: "Real Python",
    skill: "Automated Testing",
    difficulty: "beginner",
    cost: "free",
    effort: "~4 hours",
    description: "Practical introduction to writing unit and integration tests. Includes fixtures, mocks, and parametrize.",
  },
  {
    title: "SQL for Developers",
    provider: "Mode Analytics",
    skill: "SQL",
    difficulty: "beginner",
    cost: "free",
    effort: "~6 hours",
    description: "SQL fundamentals with practical query exercises — joins, aggregations, subqueries, and window functions.",
  },
  {
    title: "GitHub Actions CI/CD",
    provider: "GitHub Docs",
    skill: "CI/CD",
    difficulty: "intermediate",
    cost: "free",
    effort: "~5 hours",
    description: "Learn to create automated workflows for testing, linting, and deployment triggered by pull requests and merges.",
  },
  {
    title: "CS50: Introduction to Computer Science",
    provider: "Harvard / edX",
    skill: "Fundamentals",
    difficulty: "beginner",
    cost: "free",
    effort: "~30 hours",
    description: "World-famous foundational course covering algorithms, data structures, C, Python, SQL, and web basics.",
  },
  {
    title: "TypeScript for JavaScript Developers",
    provider: "TypeScript Official Docs",
    skill: "TypeScript",
    difficulty: "intermediate",
    cost: "free",
    effort: "~8 hours",
    description: "Official guide to TypeScript — types, interfaces, generics, and integrating with React and Node.js projects.",
  },
  {
    title: "System Design Primer",
    provider: "GitHub (open source)",
    skill: "System Design",
    difficulty: "intermediate",
    cost: "free",
    effort: "~15 hours",
    description: "Comprehensive study guide covering scalability, databases, caching, load balancing, and common design patterns.",
  },
  {
    title: "PostgreSQL Tutorial",
    provider: "PostgreSQL Tutorial (.org)",
    skill: "SQL",
    difficulty: "beginner",
    cost: "free",
    effort: "~8 hours",
    description: "Covers PostgreSQL installation, CRUD, joins, indexes, transactions, and JSON support with practical examples.",
  },
  {
    title: "AWS Cloud Practitioner Essentials",
    provider: "AWS / Coursera",
    skill: "Cloud",
    difficulty: "beginner",
    cost: "free",
    effort: "~10 hours",
    description: "Introduction to core AWS services — compute, storage, databases, and security. Preparation for entry-level cloud understanding.",
  },
];

export function LearningPage() {
  const [filterSkill, setFilterSkill] = useState("All");
  const [filterCost, setFilterCost] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");

  const skills = ["All", ...new Set(RESOURCES.map((r) => r.skill))];

  const filtered = RESOURCES.filter((r) =>
    (filterSkill === "All" || r.skill === filterSkill) &&
    (filterCost === "All" || r.cost === filterCost) &&
    (filterDiff === "All" || r.difficulty === filterDiff)
  );

  function Badge({ type, value }: { type: "cost" | "diff"; value: string }) {
    const styles: Record<string, string> = {
      free: "bg-emerald-400/10 text-emerald-300",
      paid: "bg-slate-100 text-slate-600",
      beginner: "bg-blue-400/10 text-blue-600",
      intermediate: "bg-purple-50 text-purple-700",
      advanced: "bg-orange-50 text-orange-700",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[value] || "bg-muted text-muted-foreground"}`}>
        {value}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Learning Resources</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated resources to close your skill gaps and strengthen your profile.
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
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {skills.map((s) => <option key={s}>{s === "All" ? "All Skills" : s}</option>)}
            </select>
            <select
              value={filterCost}
              onChange={(e) => setFilterCost(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="All">All Costs</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            <select
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="All">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} of {RESOURCES.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No resources match the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((r) => (
              <div key={r.title} className="bg-card border border-border rounded-xl p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm leading-snug flex-1">{r.title}</h3>
                  <Badge type="cost" value={r.cost} />
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-2">{r.provider}</p>
                <p className="text-xs text-foreground flex-1 mb-4 leading-relaxed">{r.description}</p>
                <div className="flex items-center gap-2 flex-wrap mt-auto mb-3">
                  <Badge type="diff" value={r.difficulty} />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{r.skill}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                    <Clock className="w-3 h-3" />
                    {r.effort}
                  </span>
                </div>
                <button className="text-xs text-primary hover:underline flex items-center gap-1 w-fit font-medium">
                  View Resource <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-8">
          Resources are curated based on quality and relevance. External links are not affiliated with this platform.
        </p>
      </div>
    </div>
  );
}
