import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  PlusCircle, FileText, ChevronRight, CheckCircle2, AlertCircle,
  Clock, TrendingUp, BookOpen, FolderGit2, Sparkles, BarChart3,
} from "lucide-react";
import { getAnalysisHistory } from "../services/analysisApi";
import { getStoredUser } from "../lib/auth";
import type { AnalysisHistoryItem } from "../types/analysis";

function formatDate(value: string | null) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">No score</span>;
  const cls = score >= 80 ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20" : score >= 65 ? "bg-amber-400/10 text-amber-300 border-amber-400/20" : "bg-red-400/10 text-red-300 border-red-400/20";
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>{score}% match</span>;
}

export function DashboardPage() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useMemo(() => {
    try { return JSON.parse(getStoredUser() ?? "null") as { name?: string } | null; } catch { return null; }
  }, []);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setHistory(await getAnalysisHistory()); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load dashboard data."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const bestScore = history.reduce<number | null>((best, a) => a.overall_score === null ? best : best === null ? a.overall_score : Math.max(best, a.overall_score), null);
  const totalGaps = history.reduce((sum, a) => sum + (a.gap_count || 0), 0);
  const latest = history[0];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-card to-violet-500/[0.07] p-7 sm:p-9 mb-7 shadow-2xl shadow-black/10">
          <div className="absolute -right-20 -top-24 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-24 -bottom-28 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-300/10 text-cyan-200 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Resume intelligence workspace
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                Track your resume fit, discover skill gaps, and turn analysis into your next career move.
              </p>
              {latest && <p className="text-xs text-slate-500 mt-3">Latest analysis: <span className="text-slate-300">{latest.role}</span> · {formatDate(latest.created_at)}</p>}
            </div>
            <Link to="/analysis/new" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 rounded-xl text-sm font-bold shadow-xl shadow-cyan-500/10 hover:brightness-105 transition-all">
              <PlusCircle className="w-4 h-4" /> New Analysis
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200 flex items-center gap-3">
            <AlertCircle className="w-4 h-4" /> {error}
            <button onClick={() => void load()} className="ml-auto text-xs font-semibold underline">Retry</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
          {[
            { label: "Analyses Run", value: loading ? "—" : String(history.length), hint: "Total completed analyses", icon: BarChart3 },
            { label: "Best Match Score", value: loading ? "—" : bestScore === null ? "—" : `${bestScore}%`, hint: "Highest resume-to-role match", icon: TrendingUp },
            { label: "Skill Gaps Found", value: loading ? "—" : String(totalGaps), hint: "Across your saved analyses", icon: AlertCircle },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="group bg-card/80 border border-border/80 rounded-2xl p-5 hover:border-cyan-400/20 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground mt-2">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.hint}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-400/10 text-cyan-300"><Icon className="w-4 h-4" /></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-card/80 border border-border/80 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/70">
              <div><h2 className="font-semibold text-foreground">Recent analyses</h2><p className="text-xs text-muted-foreground mt-1">Your latest saved resume assessments</p></div>
              <Link to="/history" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>
            </div>
            {loading ? (
              <div className="p-10 text-center text-sm text-muted-foreground">Loading your analysis history...</div>
            ) : history.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center"><FileText className="w-5 h-5 text-cyan-300" /></div>
                <h3 className="font-semibold text-foreground">Your dashboard is ready</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-5">Run your first resume analysis to start building your career profile.</p>
                <Link to="/analysis/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold"><PlusCircle className="w-4 h-4" /> Analyze Resume</Link>
              </div>
            ) : (
              <div className="divide-y divide-border/70">
                {history.slice(0, 5).map((a) => (
                  <div key={a.analysis_id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-card/[0.025] transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-300/10"><FileText className="w-4 h-4 text-cyan-300" /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{a.role}</p>
                        <div className="flex items-center gap-2 mt-1"><Clock className="w-3 h-3 text-slate-500" /><span className="text-xs text-muted-foreground">{formatDate(a.created_at)}</span><span className="text-xs text-slate-600">·</span><span className="text-xs text-muted-foreground">{a.gap_count} gaps</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0"><ScoreBadge score={a.overall_score} /><Link to={`/analysis/${a.analysis_id}`} className="hidden sm:flex text-xs text-cyan-300 hover:text-cyan-200 items-center gap-1">View <ChevronRight className="w-3 h-3" /></Link></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-card/80 border border-border/80 rounded-2xl p-5">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Keep building</h2>
              <p className="text-xs leading-5 text-muted-foreground mt-2">Use your latest analysis to identify the skills and evidence worth improving next.</p>
              <Link to="/history" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">Review analysis history <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-card/80 border border-border/80 rounded-2xl p-5">
              <h2 className="font-semibold text-foreground mb-3">Quick access</h2>
              <div className="space-y-1">
                {[
                  { href: "/learning", label: "Learning Resources", icon: BookOpen },
                  { href: "/projects", label: "Project Ideas", icon: FolderGit2 },
                  { href: "/market", label: "Market Insights", icon: TrendingUp },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} to={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors">
                      <Icon className="w-4 h-4 text-cyan-300" /><span className="text-sm text-foreground">{item.label}</span><ChevronRight className="w-3 h-3 text-slate-500 ml-auto" />
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl p-5 border border-violet-400/15 bg-violet-400/[0.06]">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Next step</p>
              <p className="text-sm text-foreground mt-2">Run another analysis whenever you want to compare your resume against a different role.</p>
              <Link to="/analysis/new" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-violet-300">Start analysis <ChevronRight className="w-3 h-3" /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
