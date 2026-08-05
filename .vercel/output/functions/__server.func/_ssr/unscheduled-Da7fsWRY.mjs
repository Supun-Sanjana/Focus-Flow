import { r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as projectsQO, s as tasksQO } from "./queries-CbT8XRDi.mjs";
import { t as PageHeader } from "./PageHeader-BpzNKZ4U.mjs";
import { t as TaskList } from "./TaskList-4qq8WshZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unscheduled-Da7fsWRY.js
var import_jsx_runtime = require_jsx_runtime();
function Unscheduled() {
	const { data: tasks } = useSuspenseQuery(tasksQO);
	const { data: projects } = useSuspenseQuery(projectsQO);
	const items = tasks.filter((t) => !t.due_date && t.status !== "done");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Unscheduled",
		count: items.length
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskList, {
		tasks: items,
		projects,
		emptyText: "Nothing to triage — you're all set."
	})] });
}
//#endregion
export { Unscheduled as component };
