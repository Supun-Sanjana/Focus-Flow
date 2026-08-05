import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as projectsQO, s as tasksQO, u as useProjectMutations } from "./queries-CbT8XRDi.mjs";
import { t as PageHeader } from "./PageHeader-BpzNKZ4U.mjs";
import { n as PROJECT_COLORS } from "./store-K6GGHyA2.mjs";
import { u as Plus } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects.index--zcVGkQ0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectsIndex() {
	const { data: projects } = useSuspenseQuery(projectsQO);
	const { data: tasks } = useSuspenseQuery(tasksQO);
	const { create } = useProjectMutations();
	const [name, setName] = (0, import_react.useState)("");
	const [color, setColor] = (0, import_react.useState)(PROJECT_COLORS[0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Projects",
			count: projects.length
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				if (!name.trim()) return;
				create.mutate({
					name: name.trim(),
					color
				});
				setName("");
			},
			className: "bg-card border border-border rounded-lg p-3 mb-6 flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: PROJECT_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setColor(c),
						className: `h-4 w-4 rounded-full ${color === c ? "ring-2 ring-offset-2 ring-foreground" : ""}`,
						style: { backgroundColor: c },
						"aria-label": c
					}, c))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "New project name...",
					className: "flex-1 bg-transparent text-sm outline-none px-2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "bg-accent-violet text-white text-xs px-3 py-1.5 rounded flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: projects.map((p) => {
				const count = tasks.filter((t) => t.project_id === p.id && t.status !== "done").length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/projects/$id",
					params: { id: p.id },
					className: "bg-card border border-border rounded-lg p-4 hover:border-accent-violet transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2.5 w-2.5 rounded-full",
							style: { backgroundColor: p.color }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-sm",
							children: p.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [count, " open"]
					})]
				}, p.id);
			})
		})
	] });
}
//#endregion
export { ProjectsIndex as component };
