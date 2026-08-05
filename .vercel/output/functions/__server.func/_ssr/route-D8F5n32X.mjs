import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-T7L3gOdv.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { i as useQuery, o as useQueryClient, r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as projectsQO, d as useSubtaskMutations, f as useTaskMutations, o as subtasksQO, s as tasksQO } from "./queries-CbT8XRDi.mjs";
import { a as useUI, i as STATUS_LABEL, r as STATUSES, t as PRIORITY_META } from "./store-K6GGHyA2.mjs";
import { B as Bell, D as Flame, E as Focus, I as Check, L as CalendarRange, S as Inbox, V as BellOff, g as LogOut, h as Map, i as X, l as Repeat, o as Trash2, u as Plus, y as ListTodo, z as CalendarDays } from "../_libs/lucide-react.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Loading } from "./route-CWFPdDUJ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-D8F5n32X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "focus.notified.v2";
var READ_KEY = "focus.notif.read.v1";
var PERM_ASKED_KEY = "focus.notif.perm-asked";
function loadReadSet() {
	try {
		const raw = localStorage.getItem(READ_KEY);
		return new Set(raw ? JSON.parse(raw) : []);
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function saveReadSet(set) {
	try {
		localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)));
	} catch {}
}
function markRead(keys) {
	const set = loadReadSet();
	for (const k of keys) set.add(k);
	saveReadSet(set);
	window.dispatchEvent(new Event("focus:notif-read-changed"));
}
function markUnread(keys) {
	const set = loadReadSet();
	for (const k of keys) set.delete(k);
	saveReadSet(set);
	window.dispatchEvent(new Event("focus:notif-read-changed"));
}
function loadFired() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return new Set(raw ? JSON.parse(raw) : []);
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function saveFired(set) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
	} catch {}
}
/** 9am local on the given YYYY-MM-DD date. */
function dueMoment(dueDate) {
	const [y, m, d] = dueDate.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1, 9, 0, 0, 0);
}
/** End of the given day (23:59:59 local). */
function endOfDay(dueDate) {
	const [y, m, d] = dueDate.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999);
}
/** All triggers currently due to fire for a task (respecting `now`). */
function pendingTriggers(task, now) {
	if (!task.due_date || task.status === "done") return [];
	const out = [];
	const due = dueMoment(task.due_date);
	const overdueAt = endOfDay(task.due_date);
	const lead = task.remind_lead_minutes;
	if (typeof lead === "number" && lead > 0) {
		const at = /* @__PURE__ */ new Date(due.getTime() - lead * 6e4);
		if (now >= at && now < due) out.push({
			task,
			trigger: "lead",
			fireAt: at,
			overdue: false,
			key: `${task.id}:lead:${task.due_date}`
		});
	}
	if (now >= due && now < overdueAt) out.push({
		task,
		trigger: "morning",
		fireAt: due,
		overdue: false,
		key: `${task.id}:morning:${task.due_date}`
	});
	if (now > overdueAt) out.push({
		task,
		trigger: "overdue",
		fireAt: overdueAt,
		overdue: true,
		key: `${task.id}:overdue:${task.due_date}`
	});
	return out;
}
/** Upcoming reminders in the next 24h + all overdue tasks — for the bell dropdown. */
function collectUpcoming(tasks, now = /* @__PURE__ */ new Date()) {
	const items = [];
	const in24h = new Date(now.getTime() + 1440 * 60 * 1e3);
	for (const t of tasks) {
		if (!t.due_date || t.status === "done") continue;
		const due = dueMoment(t.due_date);
		const overdueAt = endOfDay(t.due_date);
		const lead = t.remind_lead_minutes;
		if (now > overdueAt) {
			items.push({
				task: t,
				trigger: "overdue",
				fireAt: overdueAt,
				overdue: true,
				key: `${t.id}:overdue`
			});
			continue;
		}
		let next = null;
		let trig = "morning";
		if (typeof lead === "number" && lead > 0) {
			const at = /* @__PURE__ */ new Date(due.getTime() - lead * 6e4);
			if (at > now) {
				next = at;
				trig = "lead";
			}
		}
		if (!next && due > now) {
			next = due;
			trig = "morning";
		}
		if (!next && now >= due && now < overdueAt) {
			next = due;
			trig = "morning";
		}
		if (next && next <= in24h) items.push({
			task: t,
			trigger: trig,
			fireAt: next,
			overdue: false,
			key: `${t.id}:${trig}`
		});
	}
	return items.sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
}
function triggerLabel(t) {
	return t === "lead" ? "Upcoming" : t === "morning" ? "Due today" : "Overdue";
}
/** Ask the browser for Notification permission (idempotent). */
async function ensureNotificationPermission() {
	if (typeof window === "undefined" || !("Notification" in window)) return "denied";
	if (Notification.permission !== "default") return Notification.permission;
	try {
		return await Notification.requestPermission();
	} catch {
		return Notification.permission;
	}
}
function fireNotification(item) {
	const title = item.trigger === "overdue" ? `Overdue: ${item.task.title}` : item.trigger === "morning" ? `Due today: ${item.task.title}` : `Reminder: ${item.task.title}`;
	const body = item.task.due_date ? `Due ${item.task.due_date}` : void 0;
	toast(title, { description: body });
	if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") try {
		new Notification(title, {
			body,
			tag: item.key,
			silent: false
		});
	} catch {}
}
/** Mount once in the authenticated layout. Ticks every 30s, fires due reminders. */
function useReminderEngine() {
	const qc = useQueryClient();
	const [, force] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && "Notification" in window) {
			if (!localStorage.getItem(PERM_ASKED_KEY) && Notification.permission === "default") {
				localStorage.setItem(PERM_ASKED_KEY, "1");
				ensureNotificationPermission();
			}
		}
		const tick = () => {
			const tasks = qc.getQueryData(["tasks"]) ?? [];
			const fired = loadFired();
			const now = /* @__PURE__ */ new Date();
			let changed = false;
			for (const t of tasks) for (const item of pendingTriggers(t, now)) {
				if (fired.has(item.key)) continue;
				fireNotification(item);
				fired.add(item.key);
				changed = true;
			}
			if (changed) saveFired(fired);
			force((n) => n + 1);
		};
		tick();
		const id = window.setInterval(tick, 3e4);
		const onVisible = () => document.visibilityState === "visible" && tick();
		document.addEventListener("visibilitychange", onVisible);
		return () => {
			window.clearInterval(id);
			document.removeEventListener("visibilitychange", onVisible);
		};
	}, [qc]);
}
function useNotifPermission() {
	const [perm, setPerm] = (0, import_react.useState)(typeof window !== "undefined" && "Notification" in window ? Notification.permission : "denied");
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			if ("Notification" in window) setPerm(Notification.permission);
		}, 2e3);
		return () => window.clearInterval(id);
	}, []);
	return [perm, setPerm];
}
function useReadSet() {
	const [set, setSet] = (0, import_react.useState)(() => typeof window === "undefined" ? /* @__PURE__ */ new Set() : loadReadSet());
	(0, import_react.useEffect)(() => {
		const refresh = () => setSet(loadReadSet());
		window.addEventListener("focus:notif-read-changed", refresh);
		window.addEventListener("storage", refresh);
		return () => {
			window.removeEventListener("focus:notif-read-changed", refresh);
			window.removeEventListener("storage", refresh);
		};
	}, []);
	return set;
}
function relTime(d, now = /* @__PURE__ */ new Date()) {
	const diff = d.getTime() - now.getTime();
	const abs = Math.abs(diff);
	const m = Math.round(abs / 6e4);
	const h = Math.round(abs / 36e5);
	const suffix = diff < 0 ? " ago" : "";
	const prefix = diff < 0 ? "" : "in ";
	if (m < 60) return `${prefix}${m}m${suffix}`;
	if (h < 24) return `${prefix}${h}h${suffix}`;
	return `${prefix}${Math.round(abs / 864e5)}d${suffix}`;
}
function NotificationsBell() {
	const { data: tasks } = useSuspenseQuery(tasksQO);
	const setSelected = useUI((s) => s.setSelectedTask);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [perm, setPerm] = useNotifPermission();
	const readSet = useReadSet();
	const ref = (0, import_react.useRef)(null);
	const [, tick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => tick((n) => n + 1), 6e4);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const onClick = (e) => {
			if (!ref.current?.contains(e.target)) setOpen(false);
		};
		if (open) document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, [open]);
	const items = (0, import_react.useMemo)(() => collectUpcoming(tasks), [tasks]);
	const unread = items.filter((i) => !readSet.has(i.key));
	const overdueUnread = unread.filter((i) => i.overdue).length;
	const unreadCount = unread.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((o) => !o),
			className: "relative flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-muted hover:bg-sidebar-hover hover:text-white text-[13px]",
			"aria-label": "Notifications",
			children: [perm === "denied" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-semibold flex items-center justify-center ${overdueUnread > 0 ? "bg-red-500 text-white" : "bg-accent-violet text-white"}`,
				children: unreadCount
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute left-0 md:left-full md:ml-2 bottom-full mb-2 md:bottom-auto md:top-0 w-[320px] bg-card text-foreground rounded-lg border border-border shadow-xl z-[70] overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 py-2.5 border-b border-border flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Reminders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => markRead(items.map((i) => i.key)),
						className: "text-[11px] text-accent-violet hover:underline",
						children: "Mark all read"
					}), perm !== "granted" && "Notification" in window && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: async () => setPerm(await ensureNotificationPermission()),
						className: "text-[11px] text-accent-violet hover:underline",
						children: perm === "denied" ? "Blocked" : "Enable alerts"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[360px] overflow-y-auto",
				children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 py-6 text-center text-xs text-muted-foreground",
					children: "No upcoming reminders"
				}), items.map((it) => {
					const isRead = readSet.has(it.key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `group w-full px-3 py-2.5 hover:bg-muted border-b border-border/60 last:border-0 flex items-start gap-2 ${isRead ? "opacity-60" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: (e) => {
									e.stopPropagation();
									isRead ? markUnread([it.key]) : markRead([it.key]);
								},
								"aria-label": isRead ? "Mark as unread" : "Mark as read",
								className: "mt-1 shrink-0 relative",
								children: isRead ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 block rounded-full border border-muted-foreground/50" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 block rounded-full",
									style: { backgroundColor: PRIORITY_META[it.task.priority]?.color ?? "#9CA3AF" }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									markRead([it.key]);
									setSelected(it.task.id);
									setOpen(false);
								},
								className: "flex-1 min-w-0 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-[13px] truncate ${isRead ? "" : "font-medium"}`,
									children: it.task.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] mt-0.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: it.overdue && !isRead ? "text-red-500 font-medium" : "text-muted-foreground",
										children: triggerLabel(it.trigger)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["· ", relTime(it.fireAt)]
									})]
								})]
							}),
							!isRead && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: (e) => {
									e.stopPropagation();
									markRead([it.key]);
								},
								"aria-label": "Mark as read",
								className: "opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 mt-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
							})
						]
					}, it.key);
				})]
			})]
		})]
	});
}
var NAV = [
	{
		to: "/",
		label: "Today",
		icon: CalendarDays
	},
	{
		to: "/unscheduled",
		label: "Unscheduled",
		icon: Inbox
	},
	{
		to: "/weekly",
		label: "Weekly",
		icon: Repeat
	},
	{
		to: "/monthly",
		label: "Monthly",
		icon: CalendarRange
	},
	{
		to: "/roadmaps",
		label: "Roadmaps",
		icon: Map
	},
	{
		to: "/habits",
		label: "Habits",
		icon: Flame
	}
];
function Sidebar() {
	const { data: projects } = useSuspenseQuery(projectsQO);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const setQuickAdd = useUI((s) => s.setQuickAddOpen);
	const navigate = useNavigate();
	const qc = useQueryClient();
	const signOut = async () => {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden md:flex fixed inset-y-0 left-0 w-[240px] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-5 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-7 w-7 rounded-md bg-accent-violet flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Focus, { className: "h-4 w-4 text-white" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[15px] font-semibold tracking-tight",
						children: "Focus"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsBell, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "px-2 space-y-0.5",
				children: NAV.map((n) => {
					const active = pathname === n.to;
					const Icon = n.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						className: `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors ${active ? "bg-sidebar-hover text-white" : "text-sidebar-foreground hover:bg-sidebar-hover"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), n.label]
					}, n.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium uppercase tracking-wider text-sidebar-muted",
						children: "Projects"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/projects",
						className: "text-sidebar-muted hover:text-white text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListTodo, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5",
					children: [projects.map((p) => {
						const to = `/projects/${p.id}`;
						const active = pathname === to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/projects/$id",
							params: { id: p.id },
							className: `flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${active ? "bg-sidebar-hover text-white" : "text-sidebar-foreground hover:bg-sidebar-hover"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2 w-2 rounded-full",
								style: { backgroundColor: p.color }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: p.name
							})]
						}, p.id);
					}), projects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-sidebar-muted px-2 py-1",
						children: "No projects yet"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto p-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setQuickAdd(true),
					className: "w-full flex items-center gap-2 px-3 py-2 rounded-md bg-accent-violet hover:opacity-90 text-white text-[13px] font-medium transition-opacity",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
						"New Task",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto text-[10px] opacity-70 border border-white/20 rounded px-1",
							children: "N"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: signOut,
					className: "w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sidebar-muted hover:bg-sidebar-hover hover:text-white text-[12px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), "Sign out"]
				})]
			})
		]
	});
}
function MobileNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const setQuickAdd = useUI((s) => s.setQuickAddOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "md:hidden fixed bottom-0 inset-x-0 z-30 bg-sidebar text-sidebar-foreground border-t border-sidebar-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-around px-2 py-2",
			children: [NAV.map((n) => {
				const Icon = n.icon;
				const active = pathname === n.to;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: n.to,
					className: `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] ${active ? "text-white" : "text-sidebar-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), n.label]
				}, n.to);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setQuickAdd(true),
				className: "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] text-accent-violet",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }), "Add"]
			})]
		})
	});
}
function QuickAdd() {
	const open = useUI((s) => s.quickAddOpen);
	const setOpen = useUI((s) => s.setQuickAddOpen);
	const defaultProject = useUI((s) => s.quickAddDefaultProject);
	const { data: projects } = useSuspenseQuery(projectsQO);
	const { create } = useTaskMutations();
	const [title, setTitle] = (0, import_react.useState)("");
	const [projectId, setProjectId] = (0, import_react.useState)("");
	const [dueDate, setDueDate] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("p4");
	(0, import_react.useEffect)(() => {
		if (open) {
			setTitle("");
			setProjectId(defaultProject ?? "");
			setDueDate("");
			setPriority("p4");
		}
	}, [open, defaultProject]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			const editable = tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable;
			if (!open && !editable && (e.key === "n" || e.key === "N")) {
				e.preventDefault();
				setOpen(true);
			}
			if (open && e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, setOpen]);
	if (!open) return null;
	const submit = (e) => {
		e.preventDefault();
		if (!title.trim()) return;
		create.mutate({
			title: title.trim(),
			project_id: projectId || null,
			due_date: dueDate || null,
			priority
		});
		setOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 bg-black/40 z-[60] flex items-start justify-center pt-[15vh] px-4",
		onClick: () => setOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-lg bg-card rounded-xl shadow-2xl border border-border overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				autoFocus: true,
				value: title,
				onChange: (e) => setTitle(e.target.value),
				placeholder: "Task title...",
				className: "w-full px-4 py-3.5 text-[15px] bg-transparent outline-none border-b border-border"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: projectId,
						onChange: (e) => setProjectId(e.target.value),
						className: "text-xs bg-muted rounded px-2 py-1 border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Inbox"
						}), projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: dueDate,
						onChange: (e) => setDueDate(e.target.value),
						className: "text-xs bg-muted rounded px-2 py-1 border border-border"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: priority,
						onChange: (e) => setPriority(e.target.value),
						className: "text-xs bg-muted rounded px-2 py-1 border border-border",
						children: [
							"p1",
							"p2",
							"p3",
							"p4"
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p,
							children: PRIORITY_META[p].label
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2 text-[10px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enter to save" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Esc to close" })
						]
					})
				]
			})]
		})
	});
}
function TaskDetail() {
	const selectedId = useUI((s) => s.selectedTaskId);
	const setSelected = useUI((s) => s.setSelectedTask);
	const { data: tasks } = useSuspenseQuery(tasksQO);
	const { data: projects } = useSuspenseQuery(projectsQO);
	const task = tasks.find((t) => t.id === selectedId);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") setSelected(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [setSelected]);
	const { update, remove } = useTaskMutations();
	const { data: subtasks = [] } = useQuery(subtasksQO(task?.id ?? ""));
	const sub = useSubtaskMutations(task?.id ?? "");
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [tagsInput, setTagsInput] = (0, import_react.useState)("");
	const [newSubtask, setNewSubtask] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description ?? "");
			setTagsInput((task.tags ?? []).join(", "));
		}
	}, [task?.id]);
	if (!task) return null;
	const patch = (p) => update.mutate({
		id: task.id,
		patch: p
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 bg-black/20 z-40",
		onClick: () => setSelected(null)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "fixed right-0 top-0 h-full w-full md:w-[380px] bg-card z-50 border-l border-border shadow-xl flex flex-col animate-in slide-in-from-right duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 h-12 border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Task"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSelected(null),
					className: "p-1 hover:bg-muted rounded",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto p-5 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						onBlur: () => title !== task.title && patch({ title }),
						className: "w-full text-lg font-semibold bg-transparent outline-none focus:border-b focus:border-accent-violet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => patch({ status: s }),
								className: `px-2.5 py-1 rounded text-xs border ${task.status === s ? "bg-accent-violet text-white border-accent-violet" : "border-border hover:bg-muted"}`,
								children: STATUS_LABEL[s]
							}, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Priority",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1.5",
							children: [
								"p1",
								"p2",
								"p3",
								"p4"
							].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => patch({ priority: p }),
								className: `px-2.5 py-1 rounded text-xs flex items-center gap-1.5 border ${task.priority === p ? "border-foreground" : "border-border hover:bg-muted"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 rounded-full",
									style: { backgroundColor: PRIORITY_META[p].color }
								}), PRIORITY_META[p].label]
							}, p))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Project",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: task.project_id ?? "",
							onChange: (e) => patch({ project_id: e.target.value || null }),
							className: "w-full px-2 py-1.5 text-sm bg-background border border-border rounded",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "No project"
							}), projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.name
							}, p.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Due date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: task.due_date ?? "",
							onChange: (e) => patch({ due_date: e.target.value || null }),
							className: "px-2 py-1.5 text-sm bg-background border border-border rounded"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Tags",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tagsInput,
							onChange: (e) => setTagsInput(e.target.value),
							onBlur: () => patch({ tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) }),
							placeholder: "work, urgent, ...",
							className: "w-full px-2 py-1.5 text-sm bg-background border border-border rounded"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1 mt-2",
							children: (task.tags ?? []).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs bg-muted px-2 py-0.5 rounded",
								children: tag
							}, tag))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							onBlur: () => description !== (task.description ?? "") && patch({ description }),
							rows: 4,
							className: "w-full px-2 py-1.5 text-sm bg-background border border-border rounded resize-none",
							placeholder: "Add notes..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Subtasks",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [subtasks.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => sub.update.mutate({
											id: st.id,
											patch: { is_done: !st.is_done }
										}),
										className: `h-4 w-4 rounded border-[1.5px] flex items-center justify-center ${st.is_done ? "bg-accent-violet border-accent-violet" : "border-muted-foreground/40"}`,
										children: st.is_done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "h-2.5 w-2.5 text-white",
											strokeWidth: 3
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm flex-1 ${st.is_done ? "line-through text-muted-foreground" : ""}`,
										children: st.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => sub.remove.mutate(st.id),
										className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									})
								]
							}, st.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									if (!newSubtask.trim()) return;
									sub.create.mutate({
										task_id: task.id,
										title: newSubtask.trim(),
										order_index: subtasks.length
									});
									setNewSubtask("");
								},
								className: "flex items-center gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: newSubtask,
									onChange: (e) => setNewSubtask(e.target.value),
									placeholder: "Add subtask",
									className: "flex-1 text-sm bg-transparent outline-none"
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Recurring",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: task.is_recurring,
									onChange: (e) => patch({
										is_recurring: e.target.checked,
										recur_pattern: e.target.checked ? task.recur_pattern ?? "daily" : null
									})
								}), "Recurring"]
							}), task.is_recurring && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: task.recur_pattern ?? "daily",
								onChange: (e) => patch({ recur_pattern: e.target.value }),
								className: "px-2 py-1 text-sm bg-background border border-border rounded",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "daily",
									children: "Daily"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "weekly",
									children: "Weekly"
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						if (confirm("Delete this task?")) {
							remove.mutate(task.id);
							setSelected(null);
						}
					},
					className: "flex items-center gap-2 text-sm text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Delete task"]
				})
			})
		]
	})] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5",
		children: label
	}), children] });
}
function AuthenticatedLayout() {
	useReminderEngine();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "md:pl-[240px] pb-20 md:pb-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-3xl mx-auto px-6 py-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskDetail, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAdd, {})
			]
		})
	});
}
//#endregion
export { AuthenticatedLayout as component };
