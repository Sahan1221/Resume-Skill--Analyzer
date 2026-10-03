import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

export function AnalyticsPage() {
  const matchScoreData = [
    { range: "90-100", count: 45 },
    { range: "80-89", count: 78 },
    { range: "70-79", count: 112 },
    { range: "60-69", count: 89 },
    { range: "50-59", count: 43 },
    { range: "<50", count: 21 },
  ];

  const departmentData = [
    { name: "Engineering", value: 156 },
    { name: "Product", value: 89 },
    { name: "Marketing", value: 67 },
    { name: "Sales", value: 54 },
    { name: "Operations", value: 42 },
  ];

  const trendData = [
    { month: "Jan", cvs: 95, matches: 28 },
    { month: "Feb", cvs: 112, matches: 34 },
    { month: "Mar", cvs: 128, matches: 41 },
    { month: "Apr", cvs: 145, matches: 38 },
    { month: "May", cvs: 167, matches: 52 },
    { month: "Jun", cvs: 189, matches: 61 },
  ];

  const COLORS = ["#0891b2", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-primary">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights and trends from your recruitment data.</p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Match Score Distribution */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <h3 className="text-foreground mb-4">Match Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={matchScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" fill="#0891b2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Breakdown */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <h3 className="text-foreground mb-4">Candidates by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6">
          <h3 className="text-foreground mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cvs" stroke="#0891b2" strokeWidth={2} name="CVs Processed" />
              <Line type="monotone" dataKey="matches" stroke="#14b8a6" strokeWidth={2} name="Matches Created" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
