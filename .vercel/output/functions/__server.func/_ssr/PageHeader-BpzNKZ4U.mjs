import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PageHeader-BpzNKZ4U.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ title, count, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[22px] font-semibold tracking-tight",
				children: title
			}), typeof count === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm text-muted-foreground",
				children: [
					count,
					" ",
					count === 1 ? "task" : "tasks"
				]
			})]
		}), action]
	});
}
//#endregion
export { PageHeader as t };
