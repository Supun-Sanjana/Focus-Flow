import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as projectsQO, s as tasksQO, u as useProjectMutations } from "./queries-CbT8XRDi.mjs";
import { t as PageHeader } from "./PageHeader-BpzNKZ4U.mjs";
import { a as useUI, i as STATUS_LABEL, r as STATUSES } from "./store-K6GGHyA2.mjs";
import { o as Trash2, u as Plus, v as List, x as LayoutGrid } from "../_libs/lucide-react.mjs";
import { n as TaskRow, t as TaskList } from "./TaskList-4qq8WshZ.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./projects._id-CoOcrSES.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._id-Bs4BLLlq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectView() {
	const { id } = Route.useParams();
	const { data: projects } = useSuspenseQuery(projectsQO);
	const { data: tasks } = useSuspenseQuery(tasksQO);
	const project = projects.find((p) => p.id === id);
	const setQuickAdd = useUI((s) => s.setQuickAddOpen);
	const [view, setView] = (0, import_react.useState)("list");
	const nav = useNavigate();
	const { remove } = useProjectMutations();
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-muted-foreground",
		children: "Project not found."
	});
	const projectTasks = tasks.filter((t) => t.project_id === project.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: project.name,
			count: projectTasks.filter((t) => t.status !== "done").length,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex bg-muted rounded p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setView("list"),
							className: `p-1 rounded ${view === "list" ? "bg-background shadow-sm" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setView("kanban"),
							className: `p-1 rounded ${view === "kanban" ? "bg-background shadow-sm" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-3.5 w-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setQuickAdd(true, project.id),
						className: "text-xs bg-accent-violet text-white px-2.5 py-1 rounded flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " Task"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (confirm(`Delete "${project.name}"? Tasks will be moved to Inbox.`)) {
								remove.mutate(project.id);
								nav({ to: "/projects" });
							}
						},
						className: "text-muted-foreground hover:text-destructive p-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-4 -mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-2 w-2 rounded-full",
				style: { backgroundColor: project.color }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground",
				children: "Project"
			})]
		}),
		view === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskList, {
			tasks: projectTasks,
			projects,
			emptyText: "No tasks in this project yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 gap-3",
			children: STATUSES.map((s) => {
				const items = projectTasks.filter((t) => t.status === s);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-2 min-h-[300px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-1 pb-2 border-b border-border mb-2",
						children: [
							STATUS_LABEL[s],
							" · ",
							items.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border",
						children: items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
							task: t,
							projects
						}, t.id))
					})]
				}, s);
			})
		})
	] });
}
//#endregion
export { ProjectView as component };
