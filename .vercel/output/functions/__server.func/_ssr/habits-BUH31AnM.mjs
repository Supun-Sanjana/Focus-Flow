import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { r as useSuspenseQuery, s as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { c as toggleHabitLog, i as habitsQO, l as useInvalidate, n as deleteHabit, r as habitLogsQO, t as createHabit } from "./queries-CbT8XRDi.mjs";
import { t as PageHeader } from "./PageHeader-BpzNKZ4U.mjs";
import { D as Flame, I as Check, o as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { r as subDays, s as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/habits-BUH31AnM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Habits() {
	const { data: habits } = useSuspenseQuery(habitsQO);
	const { data: logs } = useSuspenseQuery(habitLogsQO);
	const invalidate = useInvalidate();
	const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const create = useMutation({
		mutationFn: (title) => createHabit(title),
		onSuccess: () => invalidate("habits")
	});
	const remove = useMutation({
		mutationFn: (id) => deleteHabit(id),
		onSuccess: () => {
			invalidate("habits");
			invalidate("habit_logs");
		}
	});
	const toggle = useMutation({
		mutationFn: (v) => toggleHabitLog(v.id, v.date, v.on),
		onSuccess: () => invalidate("habit_logs")
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const streakFor = (habitId) => {
		const set = new Set(logs.filter((l) => l.habit_id === habitId).map((l) => l.logged_date));
		let streak = 0;
		for (let i = 0; i < 365; i++) {
			const d = format(subDays(/* @__PURE__ */ new Date(), i), "yyyy-MM-dd");
			if (set.has(d)) streak++;
			else if (i === 0) continue;
			else break;
		}
		if (!set.has(today) && streak === 0) for (let i = 1; i < 365; i++) {
			const d = format(subDays(/* @__PURE__ */ new Date(), i), "yyyy-MM-dd");
			if (set.has(d)) streak++;
			else break;
		}
		return streak;
	};
	const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(/* @__PURE__ */ new Date(), 6 - i), "yyyy-MM-dd"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Habits",
			count: habits.length,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground",
				children: format(/* @__PURE__ */ new Date(), "EEEE, MMM d")
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				if (!title.trim()) return;
				create.mutate(title.trim());
				setTitle("");
			},
			className: "bg-card border border-border rounded-lg p-3 mb-6 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: title,
				onChange: (e) => setTitle(e.target.value),
				placeholder: "New habit...",
				className: "flex-1 bg-transparent text-sm outline-none px-2"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				className: "bg-accent-violet text-white text-xs px-3 py-1.5 rounded flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add"]
			})]
		}),
		habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center py-16 text-muted-foreground text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-6 w-6 mx-auto mb-2 opacity-40" }), "Start with one small daily habit."]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-card border border-border rounded-lg overflow-hidden",
			children: habits.map((h) => {
				const set = new Set(logs.filter((l) => l.habit_id === h.id).map((l) => l.logged_date));
				const doneToday = set.has(today);
				const streak = streakFor(h.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-4 py-3 border-b border-border group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggle.mutate({
								id: h.id,
								date: today,
								on: !doneToday
							}),
							className: `h-5 w-5 rounded-full border-[1.5px] flex items-center justify-center ${doneToday ? "bg-accent-violet border-accent-violet" : "border-muted-foreground/40"}`,
							children: doneToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "h-3 w-3 text-white",
								strokeWidth: 3
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `flex-1 text-sm ${doneToday ? "text-muted-foreground" : ""}`,
							children: h.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden sm:flex items-center gap-0.5",
							children: last7.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: d,
								className: `h-2 w-2 rounded-sm ${set.has(d) ? "bg-accent-violet" : "bg-muted"}`
							}, d))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs flex items-center gap-1 text-muted-foreground min-w-12 justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5 text-orange-500" }), streak]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => confirm("Delete habit?") && remove.mutate(h.id),
							className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})
					]
				}, h.id);
			})
		})
	] });
}
//#endregion
export { Habits as component };
