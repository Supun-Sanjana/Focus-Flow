import { r as useSuspenseQuery, s as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { a as projectsQO, s as tasksQO } from "./_ssr/queries-CbT8XRDi.mjs";
import { t as PageHeader } from "./_ssr/PageHeader-BpzNKZ4U.mjs";
import { i as isToday, n as parseISO, s as format } from "./_libs/date-fns.mjs";
import { t as TaskList } from "./_ssr/TaskList-4qq8WshZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-CAIX7-Vt.js
var import_jsx_runtime = require_jsx_runtime();
function TodayView() {
	const { data: tasks } = useSuspenseQuery(tasksQO);
	const { data: projects } = useSuspenseQuery(projectsQO);
	const relevant = tasks.filter((t) => t.status === "in_progress" || t.due_date && isToday(parseISO(t.due_date)) || t.status === "done" && t.due_date && isToday(parseISO(t.due_date)));
	const grouped = /* @__PURE__ */ new Map();
	for (const t of relevant) {
		const key = t.project_id ?? null;
		if (!grouped.has(key)) grouped.set(key, []);
		grouped.get(key).push(t);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Today",
		count: relevant.filter((t) => t.status !== "done").length,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: format(/* @__PURE__ */ new Date(), "EEEE, MMM d")
		})
	}), relevant.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center py-20 text-muted-foreground text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-3xl mb-2",
			children: "✦"
		}), "Nothing due today. Enjoy the calm."]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: [...grouped.entries()].map(([projectId, items]) => {
			const project = projects.find((p) => p.id === projectId);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 mb-2 px-1",
				children: project ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2 w-2 rounded-full",
					style: { backgroundColor: project.color }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium",
					children: project.name
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-muted-foreground",
					children: "No project"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskList, {
				tasks: items,
				projects
			})] }, projectId ?? "none");
		})
	})] });
}
//#endregion
export { TodayView as component };
