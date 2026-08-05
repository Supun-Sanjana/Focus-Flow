import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/oauth.consent-Blc5Uzsc.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
	className: "min-h-screen grid place-items-center p-6 text-center",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted-foreground",
		children: ["Could not load this authorization request: ", String(error?.message ?? error)]
	})
});
//#endregion
export { SplitErrorComponent as errorComponent };
