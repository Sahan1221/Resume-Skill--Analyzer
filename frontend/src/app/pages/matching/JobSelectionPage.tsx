import { useState } from "react";
import { Search, Filter, Eye, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface JobDescription {
  id: number;
  requisitionNumber: string;
  jobTitle: string;
  department: string;
  businessUnit: string;
  hiringManager: string;
  openDate: string;
  status: string;
  requiredExperience: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  requiredTools: string[];
  requiredSoftSkills: string[];
  responsibilities: string[];
}

export function JobSelectionPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);

  const mockJobs: JobDescription[] = [
    {
      id: 1,
      requisitionNumber: "REQ-2026-001",
      jobTitle: "Senior Software Engineer",
      department: "Engineering",
      businessUnit: "Product Development",
      hiringManager: "Sarah Johnson",
      openDate: "2026-05-15",
      status: "Active",
      requiredExperience: "5+ years in software development",
      requiredSkills: ["React", "TypeScript", "Node.js", "AWS", "MongoDB"],
      requiredCertifications: ["AWS Certified Developer"],
      requiredTools: ["Git", "Docker", "Kubernetes", "Jenkins"],
      requiredSoftSkills: ["Team Leadership", "Problem Solving", "Communication"],
      responsibilities: [
        "Lead development of core product features",
        "Mentor junior developers",
        "Conduct code reviews and ensure best practices",
        "Collaborate with product team on technical requirements"
      ]
    },
    {
      id: 2,
      requisitionNumber: "REQ-2026-002",
      jobTitle: "Product Manager",
      department: "Product",
      businessUnit: "Product Management",
      hiringManager: "Michael Chen",
      openDate: "2026-05-18",
      status: "Active",
      requiredExperience: "3+ years in product management",
      requiredSkills: ["Agile", "User Research", "Data Analysis", "Roadmap Planning"],
      requiredCertifications: ["Certified Scrum Product Owner"],
      requiredTools: ["Jira", "Figma", "Analytics Tools", "SQL"],
      requiredSoftSkills: ["Strategic Thinking", "Stakeholder Management", "Communication"],
      responsibilities: [
        "Define product vision and strategy",
        "Manage product roadmap and backlog",
        "Work with engineering and design teams",
        "Analyze metrics and user feedback"
      ]
    },
    {
      id: 3,
      requisitionNumber: "REQ-2026-003",
      jobTitle: "UX Designer",
      department: "Design",
      businessUnit: "Product Development",
      hiringManager: "Emma Williams",
      openDate: "2026-05-20",
      status: "Active",
      requiredExperience: "4+ years in UX/UI design",
      requiredSkills: ["Figma", "User Research", "Prototyping", "Interaction Design"],
      requiredCertifications: ["UX Certification (preferred)"],
      requiredTools: ["Figma", "Adobe XD", "Sketch", "InVision"],
      requiredSoftSkills: ["Creativity", "Empathy", "Collaboration"],
      responsibilities: [
        "Create user-centered design solutions",
        "Conduct user research and usability testing",
        "Develop wireframes and prototypes",
        "Collaborate with product and engineering"
      ]
    },
    {
      id: 4,
      requisitionNumber: "REQ-2026-004",
      jobTitle: "Data Analyst",
      department: "Analytics",
      businessUnit: "Finance & Operations",
      hiringManager: "James Anderson",
      openDate: "2026-05-22",
      status: "Active",
      requiredExperience: "3+ years in data analysis",
      requiredSkills: ["SQL", "Python", "Tableau", "Statistical Analysis"],
      requiredCertifications: ["Google Data Analytics Professional"],
      requiredTools: ["SQL", "Python", "Tableau", "Excel", "Power BI"],
      requiredSoftSkills: ["Analytical Thinking", "Attention to Detail", "Communication"],
      responsibilities: [
        "Analyze business data and create reports",
        "Build dashboards and visualizations",
        "Identify trends and insights",
        "Present findings to stakeholders"
      ]
    },
  ];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "all" || job.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = ["all", "Engineering", "Product", "Design", "Analytics", "Marketing"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-primary">Candidate Matching</h1>
          <p className="text-muted-foreground mt-1">Match candidate profiles against approved job requirements.</p>
        </div>

        {/* Search Section */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Job Title, Requisition Number, Department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6 mb-6">
          <h2 className="text-foreground mb-6">Available Job Descriptions</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-foreground">Requisition</th>
                  <th className="text-left py-4 px-4 text-foreground">Job Title</th>
                  <th className="text-left py-4 px-4 text-foreground">Department</th>
                  <th className="text-left py-4 px-4 text-foreground">Business Unit</th>
                  <th className="text-left py-4 px-4 text-foreground">Hiring Manager</th>
                  <th className="text-left py-4 px-4 text-foreground">Open Date</th>
                  <th className="text-left py-4 px-4 text-foreground">Status</th>
                  <th className="text-left py-4 px-4 text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className={`border-b border-border hover:bg-accent/50 transition-colors ${
                      selectedJob?.id === job.id ? "bg-accent" : ""
                    }`}
                  >
                    <td className="py-4 px-4 text-foreground">{job.requisitionNumber}</td>
                    <td className="py-4 px-4 text-foreground">{job.jobTitle}</td>
                    <td className="py-4 px-4 text-muted-foreground">{job.department}</td>
                    <td className="py-4 px-4 text-muted-foreground">{job.businessUnit}</td>
                    <td className="py-4 px-4 text-muted-foreground">{job.hiringManager}</td>
                    <td className="py-4 px-4 text-muted-foreground">{job.openDate}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-chart-2/20 text-chart-2">
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected JD Summary */}
        {selectedJob && (
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-chart-2" />
                </div>
                <h2 className="text-foreground">Selected Job Description</h2>
              </div>
              <button
                onClick={() => navigate(`/matching/workspace/${selectedJob.id}`)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                Start Candidate Matching
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-foreground mb-2">Job Title</h3>
                <p className="text-muted-foreground mb-4">{selectedJob.jobTitle}</p>

                <h3 className="text-foreground mb-2">Business Unit</h3>
                <p className="text-muted-foreground mb-4">{selectedJob.businessUnit}</p>

                <h3 className="text-foreground mb-2">Required Experience</h3>
                <p className="text-muted-foreground mb-4">{selectedJob.requiredExperience}</p>
              </div>

              <div>
                <h3 className="text-foreground mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedJob.requiredSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                <h3 className="text-foreground mb-2">Required Tools & Technologies</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedJob.requiredTools.map((tool, i) => (
                    <span key={i} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                      {tool}
                    </span>
                  ))}
                </div>

                <h3 className="text-foreground mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSoftSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
