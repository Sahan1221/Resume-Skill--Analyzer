import { Link } from "react-router";
import { FileText, CheckCircle, ArrowRight, Shield, Zap, Target, TrendingUp } from "lucide-react";

export function LandingPage() {
  const steps = [
    { step: "01", title: "Upload Your CV", desc: "Upload your resume as a PDF. Processed securely — never permanently stored." },
    { step: "02", title: "Select Your Target Role", desc: "Choose from common internship roles or enter a custom position you're applying for." },
    { step: "03", title: "Analyze & Improve", desc: "Get a detailed match score, skill gaps, ATS feedback, and actionable improvements." },
  ];

  const features = [
    { icon: Target, title: "Match Score", desc: "See exactly how well your resume fits the selected internship role." },
    { icon: Zap, title: "Skill Gap Analysis", desc: "Understand which skills are missing or weakly demonstrated with clear explanations." },
    { icon: CheckCircle, title: "ATS Feedback", desc: "Identify keyword and formatting issues that could hurt your resume's readability." },
    { icon: TrendingUp, title: "Market Insights", desc: "See what skills and technologies are commonly expected for your target role." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary rounded-md">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">Resume & Skill Analyzer</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              to="/login"
              className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-xs font-medium mb-6">
          <Shield className="w-3 h-3" />
          Built for university students preparing for internships
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Know exactly how your resume<br className="hidden md:block" />
          <span className="text-primary"> stacks up for your target role</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Upload your CV, select your target internship, and get a detailed analysis — skill gaps,
          ATS issues, improvement recommendations, and learning resources — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Analyze My Resume
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Sign in
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Free to use · No credit card required · Your CV is never permanently stored
        </p>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-center text-xl font-semibold text-foreground mb-10">
            Everything you need to improve your internship application
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-5">
                  <div className="p-2.5 bg-primary/10 rounded-lg w-fit mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xl font-semibold text-foreground mb-10 text-center">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy callout */}
      <section className="bg-accent/40 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center gap-4">
          <Shield className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">Your privacy is important to us</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your CV is processed temporarily for analysis. The original file is not permanently stored.
              We do not share your data with third parties.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Resume & Skill Analyzer · Built for students, by students · V1 Demo
        </p>
      </footer>
    </div>
  );
}
