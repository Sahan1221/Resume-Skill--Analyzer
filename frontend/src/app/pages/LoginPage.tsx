import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FileText,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import {
  loginUser,
  registerUser,
} from "../services/authApi";

export function LoginPage() {
  const [mode, setMode] =
    useState<"login" | "register">("login");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    confirm: "",
  });

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.email.includes("@")) {
      errs.email =
        "Enter a valid email address.";
    }

    if (form.password.length < 8) {
      errs.password =
        "Password must be at least 8 characters.";
    }

    if (mode === "register") {
      if (!form.name.trim()) {
        errs.name = "Enter your full name.";
      }

      if (form.confirm !== form.password) {
        errs.confirm =
          "Passwords do not match.";
      }
    }

    return errs;
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result =
        mode === "register"
          ? await registerUser(
              form.name.trim(),
              form.email.trim(),
              form.password,
            )
          : await loginUser(
              form.email.trim(),
              form.password,
            );

      /*
       * Store the authentication token so it can be used
       * by protected API requests.
       */
      localStorage.setItem(
        "auth_token",
        result.access_token,
      );

      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          user_id: result.user_id,
          name: result.name,
          email: result.email,
        }),
      );

      navigate("/dashboard");
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Authentication failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (
    nextMode: "login" | "register",
  ) => {
    setMode(nextMode);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-card/20 rounded-md">
            <FileText className="w-4 h-4 text-white" />
          </div>

          <span className="font-semibold text-white">
            Resume & Skill Analyzer
          </span>
        </div>

        <div>
          <blockquote className="text-white/90 text-xl font-medium leading-relaxed mb-6">
            "I found out I was missing Docker and REST API
            experience before my interviews. Fixed it in 3
            weeks."
          </blockquote>

          <p className="text-white/70 text-sm">
            — CS student, landed SWE internship at a tech
            company
          </p>
        </div>

        <p className="text-white/50 text-xs">
          Your CV is processed for analysis. The original
          file is not permanently stored.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 max-w-lg mx-auto w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p className="text-muted-foreground text-sm">
            {mode === "login"
              ? "Sign in to access your analyses and resume feedback."
              : "Start analyzing your resume for free — no credit card needed."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-muted p-1 mb-6">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() =>
              switchMode("register")
            }
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === "register"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Alex Reyes"
                disabled={isSubmitting}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow ${
                  errors.name
                    ? "border-destructive"
                    : "border-border"
                }`}
              />

              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email Address
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="alex@university.edu"
              disabled={isSubmitting}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow ${
                errors.email
                  ? "border-destructive"
                  : "border-border"
              }`}
            />

            {errors.email && (
              <p className="text-xs text-destructive mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">
                Password
              </label>

              {mode === "login" && (
                <button
                  type="button"
                  disabled
                  className="text-xs text-muted-foreground cursor-not-allowed"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="Minimum 8 characters"
                disabled={isSubmitting}
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow ${
                  errors.password
                    ? "border-destructive"
                    : "border-border"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword,
                  )
                }
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirm:
                        e.target.value,
                    })
                  }
                  placeholder="Repeat your password"
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow ${
                    errors.confirm
                      ? "border-destructive"
                      : "border-border"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(
                      !showConfirm,
                    )
                  }
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.confirm && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirm}
                </p>
              )}
            </div>
          )}

          {/* API error */}
          {errors.submit && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
              <p className="text-sm text-destructive">
                {errors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? mode === "login"
                ? "Signing In..."
                : "Creating Account..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        {mode === "login" && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            {"Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                switchMode("register")
              }
              className="text-primary hover:underline font-medium"
            >
              Create one free
            </button>
          </p>
        )}
      </div>
    </div>
  );
}