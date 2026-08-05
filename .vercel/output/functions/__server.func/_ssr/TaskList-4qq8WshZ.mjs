import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as useTaskMutations } from "./queries-CbT8XRDi.mjs";
import { a as useUI, t as PRIORITY_META } from "./store-K6GGHyA2.mjs";
import { I as Check } from "../_libs/lucide-react.mjs";
import { i as isToday, n as parseISO, o as isPast, s as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TaskList-4qq8WshZ.js
var import_jsx_runtime = require_jsx_runtime();
function TaskRow({ task, projects }) {
	const setSelected = useUI((s) => s.setSelectedTask);
	const { update } = useTaskMutations();
	const project = projects.find((p) => p.id === task.project_id);
	const done = task.status === "done";
	const prio = PRIORITY_META[task.priority] ?? PRIORITY_META.p4;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: () => setSelected(task.id),
		className: `group flex items-center gap-3 px-4 py-2.5 border-b border-border hover:bg-muted/40 cursor-pointer transition-colors ${done ? "opacity-50" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: (e) => {
					e.stopPropagation();
					update.mutate({
						id: task.id,
						patch: { status: done ? "todo" : "done" }
					});
				},
				className: `h-4 w-4 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${done ? "bg-accent-violet border-accent-violet" : "border-muted-foreground/40 hover:border-accent-violet"}`,
				"aria-label": "toggle complete",
				children: done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-2.5 w-2.5 text-white",
					strokeWidth: 3
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `h-1.5 w-1.5 rounded-full flex-shrink-0`,
				style: { backgroundColor: prio.color },
				title: prio.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `flex-1 text-[13px] truncate ${done ? "line-through" : ""}`,
				children: task.title
			}),
			task.status === "in_progress" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase tracking-wider text-accent-violet font-medium",
				children: "In progress"
			}),
			project && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-1.5 w-1.5 rounded-full",
					style: { backgroundColor: project.color }
				}), project.name]
			}),
			task.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `text-[11px] ${isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) && !done ? "text-destructive" : "text-muted-foreground"}`,
				children: isToday(parseISO(task.due_date)) ? "Today" : format(parseISO(task.due_date), "MMM d")
			})
		]
	});
}
function TaskList({ tasks, projects, emptyText }) {
	if (tasks.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-16 text-muted-foreground text-sm",
		children: emptyText ?? "Nothing here yet."
	});
	const active = tasks.filter((t) => t.status !== "done");
	const done = tasks.filter((t) => t.status === "done");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card rounded-lg border border-border overflow-hidden",
		children: [active.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
			task: t,
			projects
		}, t.id)), done.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
			task: t,
			projects
		}, t.id))]
	});
}
//#endregion
export { TaskRow as n, TaskList as t };
