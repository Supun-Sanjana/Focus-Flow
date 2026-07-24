import { createFileRoute, useNavigate, redirect, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Focus as FocusIcon,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  CalendarDays,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Focus" },
      {
        name: "description",
        content:
          "Sign in to Focus — a minimal task manager for people who ship. Plan your week, track habits, and stay in flow.",
      },
      { property: "og:title", content: "Sign in — Focus" },
      {
        property: "og:description",
        content: "The calm, keyboard-first task manager for makers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/" });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isSignin = mode === "signin";

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background text-foreground">
      {/* Left — brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-sidebar text-sidebar-foreground p-10">
        {/* ambient gradient */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 20% 15%, oklch(0.55 0.24 292 / 0.35), transparent 45%), radial-gradient(circle at 85% 85%, oklch(0.7 0.19 50 / 0.18), transparent 50%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-accent-violet flex items-center justify-center shadow-lg shadow-accent-violet/30">
            <FocusIcon className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Focus</span>
        </div>

        <div className="relative space-y-10 max-w-md">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sidebar-muted mb-4">
              A task manager for makers
            </p>
            <h2 className="text-3xl xl:text-4xl font-semibold tracking-tight leading-[1.15]">
              Plan the week.
              <br />
              <span className="text-sidebar-muted">Ship the work.</span>
            </h2>
          </div>

          <ul className="space-y-4">
            {[
              {
                icon: Zap,
                title: "Keyboard-first",
                copy: "Press N to capture anything, anywhere.",
              },
              {
                icon: CalendarDays,
                title: "Weekly planner",
                copy: "Drag tasks across the week without ceremony.",
              },
              {
                icon: Flame,
                title: "Habits & streaks",
                copy: "Stay consistent on the things that compound.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <li key={title} className="flex gap-3">
                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-md bg-sidebar-hover border border-sidebar-border flex items-center justify-center">
                  <Icon className="h-4 w-4 text-sidebar-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-sidebar-muted">{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center justify-between text-xs text-sidebar-muted">
          <span>© {new Date().getFullYear()} Focus</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            All systems normal
          </span>
        </div>
      </aside>

      {/* Right — form panel */}
      <main className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 lg:px-10 py-6">
          <Link to="/auth" className="flex items-center gap-2 lg:hidden">
            <div className="h-7 w-7 rounded-md bg-accent-violet flex items-center justify-center">
              <FocusIcon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight">Focus</span>
          </Link>
          <div className="ml-auto text-xs text-muted-foreground">
            {isSignin ? "New to Focus?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignin ? "signup" : "signin");
                setError(null);
              }}
              className="font-medium text-foreground hover:text-accent-violet transition-colors"
            >
              {isSignin ? "Create account" : "Sign in"}
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-10 pb-16">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">
                {isSignin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {isSignin
                  ? "Sign in to pick up where you left off."
                  : "Start planning your week in under a minute."}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-foreground/80"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full h-10 bg-card border border-border rounded-md px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-foreground/80"
                  >
                    Password
                  </label>
                  {isSignin && (
                    <span className="text-xs text-muted-foreground">
                      Min. 6 characters
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignin ? "current-password" : "new-password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 bg-card border border-border rounded-md px-3 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full h-10 bg-foreground text-background text-sm font-medium rounded-md inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isSignin ? "Sign in" : "Create account"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {!isSignin && (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent-violet" />
                  By creating an account you agree to our Terms and Privacy Policy.
                </p>
              )}
            </form>
          </div>
        </div>

        <footer className="px-6 lg:px-10 py-6 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
          <span>© {new Date().getFullYear()} Focus</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
