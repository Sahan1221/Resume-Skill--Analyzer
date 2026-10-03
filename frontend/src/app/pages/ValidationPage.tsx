import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Save, X, Sparkles } from "lucide-react";

interface CVData {
  name: string;
  email: string;
  contact: string;
  address: string;
  totalExperience: string;
  skills: string;
  workExperience: Array<{
    company: string;
    date: string;
    position: string;
    description: string;
  }>;
  aboutSummary: string;
  primaryBU: string;
  primaryConfidence: number;
  primaryJustification: string;
  secondaryBU: string;
  secondaryConfidence: number;
  secondaryJustification: string;
}

export function ValidationPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<CVData>({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    contact: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA 94102",
    totalExperience: "8",
    skills: "JavaScript, TypeScript, React, Node.js, Python, SQL, AWS, Docker, CI/CD, Agile Methodologies",
    workExperience: [
      {
        company: "Tech Innovations Inc.",
        date: "2020 - Present",
        position: "Senior Software Engineer",
        description: "Led development of cloud-based SaaS platform serving 50K+ users. Architected microservices infrastructure, reduced system latency by 40%, and mentored junior developers."
      },
      {
        company: "Digital Solutions Corp",
        date: "2017 - 2020",
        position: "Software Engineer",
        description: "Developed and maintained customer-facing web applications. Implemented automated testing pipelines and collaborated with cross-functional teams on product features."
      }
    ],
    aboutSummary: "Sarah is an experienced software engineer with 8 years of expertise in full-stack development, cloud architecture, and team leadership. She has a proven track record of building scalable applications and driving technical innovation in fast-paced environments.",
    primaryBU: "Engineering & Technology",
    primaryConfidence: 94,
    primaryJustification: "Strong technical background with extensive software development experience, cloud architecture skills, and leadership in engineering teams. Clear focus on technology products and infrastructure.",
    secondaryBU: "Product Development",
    secondaryConfidence: 72,
    secondaryJustification: "Demonstrated experience in building customer-facing products and collaborating with cross-functional teams. Shows understanding of user needs and product lifecycle management."
  });

  const handleSave = () => {
    navigate("/browse");
  };

  const updateWorkExperience = (index: number, field: string, value: string) => {
    const newWorkExperience = [...data.workExperience];
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    setData({ ...data, workExperience: newWorkExperience });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-card rounded-xl shadow-md border border-border p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Validate & Edit CV Data</h2>
            <p className="text-muted-foreground mt-1">Review AI-extracted data and make corrections if needed</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <X className="w-5 h-5" />
              Close
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-md"
            >
              <Save className="w-5 h-5" />
              Save Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2">Contact Number</label>
              <input
                type="text"
                value={data.contact}
                onChange={(e) => setData({ ...data, contact: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2">Address</label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2">Total Years of Experience</label>
              <input
                type="text"
                value={data.totalExperience}
                onChange={(e) => setData({ ...data, totalExperience: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2">Skills</label>
              <textarea
                value={data.skills}
                onChange={(e) => setData({ ...data, skills: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block mb-4">Work Experience</label>
              <div className="space-y-4">
                {data.workExperience.map((exp, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg border border-border space-y-3">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                      placeholder="Company"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="text"
                      value={exp.date}
                      onChange={(e) => updateWorkExperience(index, "date", e.target.value)}
                      placeholder="Date"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                      placeholder="Position"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                      placeholder="Job Description"
                      rows={3}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-accent/30 rounded-lg p-4 border border-accent-foreground/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
                <h4 className="text-accent-foreground">AI-Generated Insights</h4>
              </div>
              <p className="text-sm text-muted-foreground">The following fields were generated by AI analysis</p>
            </div>

            <div>
              <label className="block mb-2">About Summary</label>
              <textarea
                value={data.aboutSummary}
                onChange={(e) => setData({ ...data, aboutSummary: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-accent/10 border-2 border-accent-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="p-6 bg-muted rounded-lg border border-border space-y-4">
              <h4 className="text-foreground">Primary Business Unit</h4>

              <input
                type="text"
                value={data.primaryBU}
                onChange={(e) => setData({ ...data, primaryBU: e.target.value })}
                className="w-full px-4 py-2 bg-accent/10 border-2 border-accent-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Confidence Score</span>
                  <span className="text-primary">{data.primaryConfidence}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${data.primaryConfidence}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Justification</label>
                <textarea
                  value={data.primaryJustification}
                  onChange={(e) => setData({ ...data, primaryJustification: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-accent/10 border-2 border-accent-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-muted rounded-lg border border-border space-y-4">
              <h4 className="text-foreground">Secondary Business Unit</h4>

              <input
                type="text"
                value={data.secondaryBU}
                onChange={(e) => setData({ ...data, secondaryBU: e.target.value })}
                className="w-full px-4 py-2 bg-accent/10 border-2 border-accent-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Confidence Score</span>
                  <span className="text-primary">{data.secondaryConfidence}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-chart-2 h-full rounded-full transition-all"
                    style={{ width: `${data.secondaryConfidence}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Justification</label>
                <textarea
                  value={data.secondaryJustification}
                  onChange={(e) => setData({ ...data, secondaryJustification: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-accent/10 border-2 border-accent-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
