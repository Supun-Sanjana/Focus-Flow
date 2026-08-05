import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-T7L3gOdv.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { D as Flame, E as Focus, H as ArrowRight, N as CircleCheck, O as Eye, _ as LoaderCircle, k as EyeOff, r as Zap, z as CalendarDays } from "../_libs/lucide-react.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./auth-C0CNnnpH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BMtzbWbf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const { next } = Route.useSearch();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const goNext = () => {
		if (next) window.location.href = next;
		else navigate({ to: "/" });
	};
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
			if (session) goNext();
		});
		return () => sub.subscription.unsubscribe();
	}, [navigate, next]);
	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: next ? window.location.origin + next : window.location.origin }
				});
				if (error) throw error;
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			goNext();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	};
	const isSignin = mode === "signin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen w-full grid lg:grid-cols-2 bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "relative hidden lg:flex flex-col justify-between overflow-hidden bg-sidebar text-sidebar-foreground p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "absolute inset-0 opacity-70",
					style: { background: "radial-gradient(circle at 20% 15%, oklch(0.55 0.24 292 / 0.35), transparent 45%), radial-gradient(circle at 85% 85%, oklch(0.7 0.19 50 / 0.18), transparent 50%)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "absolute inset-0 opacity-[0.06]",
					style: {
						backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
						backgroundSize: "44px 44px"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-lg bg-accent-violet flex items-center justify-center shadow-lg shadow-accent-violet/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Focus, {
							className: "h-4.5 w-4.5 text-white",
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[15px] font-semibold tracking-tight",
						children: "Focus"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative space-y-10 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-sidebar-muted mb-4",
						children: "A task manager for makers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-3xl xl:text-4xl font-semibold tracking-tight leading-[1.15]",
						children: [
							"Plan the week.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sidebar-muted",
								children: "Ship the work."
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-4",
						children: [
							{
								icon: Zap,
								title: "Keyboard-first",
								copy: "Press N to capture anything, anywhere."
							},
							{
								icon: CalendarDays,
								title: "Weekly planner",
								copy: "Drag tasks across the week without ceremony."
							},
							{
								icon: Flame,
								title: "Habits & streaks",
								copy: "Stay consistent on the things that compound."
							}
						].map(({ icon: Icon, title, copy }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 h-8 w-8 shrink-0 rounded-md bg-sidebar-hover border border-sidebar-border flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-sidebar-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-sidebar-muted",
								children: copy
							})] })]
						}, title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-center justify-between text-xs text-sidebar-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Focus"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400" }), "All systems normal"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex flex-col min-h-screen",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between px-6 lg:px-10 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/auth",
						className: "flex items-center gap-2 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-7 w-7 rounded-md bg-accent-violet flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Focus, {
								className: "h-3.5 w-3.5 text-white",
								strokeWidth: 2.5
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold tracking-tight",
							children: "Focus"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto text-xs text-muted-foreground",
						children: [
							isSignin ? "New to Focus?" : "Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setMode(isSignin ? "signup" : "signin");
									setError(null);
								},
								className: "font-medium text-foreground hover:text-accent-violet transition-colors",
								children: isSignin ? "Create account" : "Sign in"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 flex items-center justify-center px-6 lg:px-10 pb-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-semibold tracking-tight",
								children: isSignin ? "Welcome back" : "Create your account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: isSignin ? "Sign in to pick up where you left off." : "Start planning your week in under a minute."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "email",
										className: "text-xs font-medium text-foreground/80",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "email",
										type: "email",
										autoComplete: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "you@company.com",
										className: "w-full h-10 bg-card border border-border rounded-md px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "password",
											className: "text-xs font-medium text-foreground/80",
											children: "Password"
										}), isSignin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Min. 6 characters"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "password",
											type: showPassword ? "text" : "password",
											autoComplete: isSignin ? "current-password" : "new-password",
											required: true,
											minLength: 6,
											value: password,
											onChange: (e) => setPassword(e.target.value),
											placeholder: "••••••••",
											className: "w-full h-10 bg-card border border-border rounded-md px-3 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowPassword((s) => !s),
											className: "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded",
											"aria-label": showPassword ? "Hide password" : "Show password",
											tabIndex: -1,
											children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})]
									})]
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									role: "alert",
									className: "text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: loading,
									className: "group w-full h-10 bg-foreground text-background text-sm font-medium rounded-md inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed",
									children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [isSignin ? "Sign in" : "Create account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })] })
								}),
								!isSignin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-start gap-1.5 text-xs text-muted-foreground pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 mt-0.5 shrink-0 text-accent-violet" }), "By creating an account you agree to our Terms and Privacy Policy."]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "px-6 lg:px-10 py-6 flex items-center justify-between text-xs text-muted-foreground border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Focus"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-foreground transition-colors",
							children: "Privacy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-foreground transition-colors",
							children: "Terms"
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { AuthPage as component };
