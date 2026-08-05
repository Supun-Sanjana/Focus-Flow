import { a as projectsQO, s as tasksQO } from "./queries-CbT8XRDi.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._id-CoOcrSES.js
var $$splitComponentImporter = () => import("./projects._id-Bs4BLLlq.mjs");
var Route = createFileRoute("/_authenticated/projects/$id")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(projectsQO);
		context.queryClient.ensureQueryData(tasksQO);
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
