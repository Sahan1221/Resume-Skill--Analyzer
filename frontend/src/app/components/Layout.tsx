import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard, PlusCircle, BookOpen, FolderGit2,
  TrendingUp, Settings, FileText, History, Sparkles,
} from "lucide-react";
import { getStoredUser } from "../lib/auth";

export function Layout() {
  const location = useLocation();
  const user = (() => {
    try { return JSON.parse(getStoredUser() ?? "null") as { name?: string; email?: string } | null; }
    catch { return null; }
  })();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/analysis/new", label: "New Analysis", icon: PlusCircle },
    { path: "/history", label: "Analysis History", icon: History },
    { path: "/learning", label: "Learning", icon: BookOpen },
    { path: "/projects", label: "Projects", icon: FolderGit2 },
    { path: "/market", label: "Market Insights", icon: TrendingUp },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);
  const initials = (user?.name ?? "U").split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-72 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex-shrink-0 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/10">
              <FileText className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground tracking-tight">Resume & Skill</p>
              <p className="text-xs text-muted-foreground">Analyzer</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}
                className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-cyan-400/15 to-violet-400/10 text-cyan-200 border border-cyan-400/15 shadow-lg shadow-cyan-950/20"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                }`}>
                {active && <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-cyan-300" />}
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--sidebar-border)]">
          <Link to="/analysis/new"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 hover:brightness-105 transition-all">
            <Sparkles className="w-4 h-4" /> Start New Analysis
          </Link>
          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-xs font-bold text-cyan-200">
              {initials || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name ?? "Account"}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto"><Outlet /></main>
    </div>
  );
}
