import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CWFPdDUJ.js
var import_jsx_runtime = require_jsx_runtime();
function Loading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	});
}
//#endregion
export { Loading as t };
