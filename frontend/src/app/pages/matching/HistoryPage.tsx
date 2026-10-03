import { useState } from "react";
import { Search, Filter, Download, Eye, RefreshCw, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

interface MatchHistory {
  id: number;
  evaluationDate: string;
  candidateName: string;
  jobTitle: string;
  businessUnit: string;
  matchScore: number;
  category: string;
  recommendation: string;
  evaluator: string;
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const mockHistory: MatchHistory[] = [
    {
      id: 1,
      evaluationDate: "2026-06-01 14:30",
      candidateName: "Sarah Johnson",
      jobTitle: "Senior Software Engineer",
      businessUnit: "Product Development",
      matchScore: 94,
      category: "Excellent Fit",
      recommendation: "Highly Recommended",
      evaluator: "John Smith"
    },
    {
      id: 2,
      evaluationDate: "2026-06-01 11:15",
      candidateName: "Michael Chen",
      jobTitle: "Product Manager",
      businessUnit: "Product Management",
      matchScore: 78,
      category: "Good Fit",
      recommendation: "Recommended",
      evaluator: "Sarah Williams"
    },
    {
      id: 3,
      evaluationDate: "2026-05-31 16:45",
      candidateName: "Emma Williams",
      jobTitle: "UX Designer",
      businessUnit: "Product Development",
      matchScore: 65,
      category: "Moderate Fit",
      recommendation: "Consider with Reservations",
      evaluator: "John Smith"
    },
    {
      id: 4,
      evaluationDate: "2026-05-31 10:20",
      candidateName: "James Anderson",
      jobTitle: "Data Analyst",
      businessUnit: "Finance & Operations",
      matchScore: 88,
      category: "Good Fit",
      recommendation: "Recommended",
      evaluator: "Emily Davis"
    },
    {
      id: 5,
      evaluationDate: "2026-05-30 15:30",
      candidateName: "Olivia Martinez",
      jobTitle: "Marketing Manager",
      businessUnit: "Marketing & Sales",
      matchScore: 72,
      category: "Good Fit",
      recommendation: "Recommended",
      evaluator: "Sarah Williams"
    },
    {
      id: 6,
      evaluationDate: "2026-05-30 09:10",
      candidateName: "David Brown",
      jobTitle: "Senior Software Engineer",
      businessUnit: "Product Development",
      matchScore: 91,
      category: "Excellent Fit",
      recommendation: "Highly Recommended",
      evaluator: "John Smith"
    },
    {
      id: 7,
      evaluationDate: "2026-05-29 14:55",
      candidateName: "Sophia Garcia",
      jobTitle: "UI Developer",
      businessUnit: "Product Development",
      matchScore: 58,
      category: "Moderate Fit",
      recommendation: "Consider with Reservations",
      evaluator: "Emily Davis"
    },
    {
      id: 8,
      evaluationDate: "2026-05-29 11:40",
      candidateName: "Daniel Lee",
      jobTitle: "Backend Engineer",
      businessUnit: "Product Development",
      matchScore: 83,
      category: "Good Fit",
      recommendation: "Recommended",
      evaluator: "John Smith"
    },
  ];

  const getCategoryBadge = (category: string) => {
    const configs: any = {
      "Excellent Fit": { bg: "bg-chart-2/10", text: "text-chart-2" },
      "Good Fit": { bg: "bg-primary/10", text: "text-primary" },
      "Moderate Fit": { bg: "bg-orange-500/10", text: "text-orange-500" },
      "Poor Fit": { bg: "bg-destructive/10", text: "text-destructive" }
    };
    return configs[category] || configs["Moderate Fit"];
  };

  const filteredHistory = mockHistory.filter(record => {
    const matchesSearch =
      record.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.businessUnit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || record.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + recordsPerPage);

  const categories = ["all", "Excellent Fit", "Good Fit", "Moderate Fit", "Poor Fit"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-primary">Matching History</h1>
          <p className="text-muted-foreground mt-1">Track all candidate evaluations and match results.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search candidate, job title, or business unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
              <FileDown className="w-4 h-4" />
              Export to Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-foreground">Evaluation Date</th>
                  <th className="text-left py-4 px-4 text-foreground">Candidate Name</th>
                  <th className="text-left py-4 px-4 text-foreground">Job Title</th>
                  <th className="text-left py-4 px-4 text-foreground">Business Unit</th>
                  <th className="text-left py-4 px-4 text-foreground">Match Score</th>
                  <th className="text-left py-4 px-4 text-foreground">Category</th>
                  <th className="text-left py-4 px-4 text-foreground">Recommendation</th>
                  <th className="text-left py-4 px-4 text-foreground">Evaluator</th>
                  <th className="text-left py-4 px-4 text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((record) => {
                  const badge = getCategoryBadge(record.category);
                  return (
                    <tr
                      key={record.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-muted-foreground text-sm">{record.evaluationDate}</td>
                      <td className="py-4 px-4 text-foreground">{record.candidateName}</td>
                      <td className="py-4 px-4 text-foreground">{record.jobTitle}</td>
                      <td className="py-4 px-4 text-muted-foreground">{record.businessUnit}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${record.matchScore}%` }}
                            />
                          </div>
                          <span className="text-primary">{record.matchScore}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full ${badge.bg} ${badge.text} text-sm`}>
                          {record.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{record.recommendation}</td>
                      <td className="py-4 px-4 text-muted-foreground">{record.evaluator}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/matching/report/${record.id}`)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View Report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Re-run Matching"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Download Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No matching history found</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <p className="text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredHistory.length)} of {filteredHistory.length} records
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
