import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Eye, Edit, ChevronLeft, ChevronRight } from "lucide-react";

interface Record {
  id: number;
  name: string;
  email: string;
  primaryBU: string;
  confidence: number;
  experience: number;
  status: "Processed" | "Pending";
}

export function BrowsePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBU, setSelectedBU] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const mockRecords: Record[] = [
    { id: 1, name: "Sarah Johnson", email: "sarah.johnson@email.com", primaryBU: "Engineering & Technology", confidence: 94, experience: 8, status: "Processed" },
    { id: 2, name: "Michael Chen", email: "michael.chen@email.com", primaryBU: "Product Development", confidence: 88, experience: 6, status: "Processed" },
    { id: 3, name: "Emma Williams", email: "emma.williams@email.com", primaryBU: "Marketing & Sales", confidence: 91, experience: 7, status: "Processed" },
    { id: 4, name: "James Anderson", email: "james.anderson@email.com", primaryBU: "Finance & Operations", confidence: 85, experience: 10, status: "Processed" },
    { id: 5, name: "Olivia Martinez", email: "olivia.martinez@email.com", primaryBU: "Human Resources", confidence: 79, experience: 5, status: "Processed" },
    { id: 6, name: "David Brown", email: "david.brown@email.com", primaryBU: "Engineering & Technology", confidence: 92, experience: 9, status: "Processed" },
    { id: 7, name: "Sophia Garcia", email: "sophia.garcia@email.com", primaryBU: "Product Development", confidence: 86, experience: 4, status: "Pending" },
    { id: 8, name: "Daniel Lee", email: "daniel.lee@email.com", primaryBU: "Marketing & Sales", confidence: 83, experience: 6, status: "Processed" },
  ];

  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          record.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBU = selectedBU === "all" || record.primaryBU === selectedBU;
    return matchesSearch && matchesBU;
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const businessUnits = ["all", "Engineering & Technology", "Product Development", "Marketing & Sales", "Finance & Operations", "Human Resources"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-card rounded-xl shadow-md border border-border p-8">
        <h2 className="mb-6">Browse CV Records</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={selectedBU}
            onChange={(e) => setSelectedBU(e.target.value)}
            className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {businessUnits.map(bu => (
              <option key={bu} value={bu}>
                {bu === "all" ? "All Business Units" : bu}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-foreground">Name</th>
                <th className="text-left py-4 px-4 text-foreground">Email</th>
                <th className="text-left py-4 px-4 text-foreground">Primary BU</th>
                <th className="text-left py-4 px-4 text-foreground">Confidence</th>
                <th className="text-left py-4 px-4 text-foreground">Experience</th>
                <th className="text-left py-4 px-4 text-foreground">Status</th>
                <th className="text-left py-4 px-4 text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/validate/${record.id}`)}
                >
                  <td className="py-4 px-4 text-foreground">{record.name}</td>
                  <td className="py-4 px-4 text-muted-foreground">{record.email}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex px-3 py-1 rounded-full bg-accent text-accent-foreground">
                      {record.primaryBU}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${record.confidence}%` }}
                        />
                      </div>
                      <span className="text-primary">{record.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{record.experience} years</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full ${
                        record.status === "Processed"
                          ? "bg-chart-2/20 text-chart-2"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/validate/${record.id}`);
                      }}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="View/Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No records found</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <p className="text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
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
  );
}
