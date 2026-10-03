
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Shield,
  Bell,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import { logout } from "../lib/auth";

export function SettingsPage() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "Alex Reyes",
    email: "alex.reyes@university.edu",
    university: "University of Technology",
    graduationYear: "2027",
    degree: "Computer Science",
  });

  const [prefs, setPrefs] = useState({
    emailOnComplete: true,
    weeklyTips: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Settings
        </h1>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="w-44 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map((s) => {
                const Icon = s.icon;

                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeSection === s.id
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {s.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-red-400/10 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {saved && (
              <div className="flex items-center gap-2 p-3 bg-emerald-400/10 border border-emerald-200 rounded-lg mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-300">
                  Changes saved successfully.
                </span>
              </div>
            )}

            {activeSection === "profile" && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-5">
                  Student Profile
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      label: "Full Name",
                      key: "name",
                      placeholder: "Alex Reyes",
                    },
                    {
                      label: "Email Address",
                      key: "email",
                      placeholder: "alex@university.edu",
                    },
                    {
                      label: "University",
                      key: "university",
                      placeholder: "University of Technology",
                    },
                    {
                      label: "Degree",
                      key: "degree",
                      placeholder: "Computer Science",
                    },
                    {
                      label: "Expected Graduation Year",
                      key: "graduationYear",
                      placeholder: "2027",
                    },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {label}
                      </label>

                      <input
                        type="text"
                        value={profile[key as keyof typeof profile]}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            [key]: e.target.value,
                          })
                        }
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  className="mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}

            {activeSection === "security" && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-5">
                  Security
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Current Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      placeholder="Repeat new password"
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Update Password
                </button>
              </div>
            )}

            {activeSection === "preferences" && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-5">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailOnComplete",
                      label: "Email me when an analysis completes",
                      desc: "Receive an email notification when your CV analysis is ready.",
                    },
                    {
                      key: "weeklyTips",
                      label: "Weekly skill improvement tips",
                      desc: "Receive weekly tips based on your identified skill gaps.",
                    },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-4 p-4 bg-accent/30 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {label}
                        </p>

                        <p className="text-xs text-muted-foreground mt-0.5">
                          {desc}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setPrefs({
                            ...prefs,
                            [key]:
                              !prefs[key as keyof typeof prefs],
                          })
                        }
                        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${
                          prefs[key as keyof typeof prefs]
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-card rounded-full shadow-sm transition-all ${
                            prefs[key as keyof typeof prefs]
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  className="mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Privacy & Data
                  </h2>

                  <div className="space-y-3">
                    {[
                      {
                        title: "CV File Storage",
                        desc: "Your uploaded CV is processed temporarily for analysis. The original file is not permanently stored on our servers.",
                      },
                      {
                        title: "Analysis Results",
                        desc: "Your analysis results (match scores, gaps, recommendations) are stored in your account so you can review them at any time.",
                      },
                      {
                        title: "Data Sharing",
                        desc: "We do not share your personal information or resume content with third parties for marketing purposes.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-3 p-4 bg-accent/30 rounded-lg"
                      >
                        <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />

                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            {item.title}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-semibold text-foreground mb-4">
                    Account Actions
                  </h2>

                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
                      Download my data
                    </button>

                    <button className="w-full text-left px-4 py-3 border border-destructive/30 rounded-lg text-sm text-destructive hover:bg-red-400/10 transition-colors">
                      Delete my account and all data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

