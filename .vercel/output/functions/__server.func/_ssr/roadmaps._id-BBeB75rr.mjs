import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as roadmapQO } from "./roadmap-queries-DOINgKpp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmaps._id-BBeB75rr.js
var $$splitComponentImporter = () => import("./roadmaps._id-ClhM4IqR.mjs");
var Route = createFileRoute("/_authenticated/roadmaps/$id")({
	head: () => ({ meta: [
		{ title: "Roadmap canvas — Focus" },
		{
			name: "description",
			content: "Plan a goal on a phase-by-phase roadmap canvas with progress tracking."
		},
		{
			property: "og:title",
			content: "Roadmap canvas — Focus"
		},
		{
			property: "og:description",
			content: "Drag phases on a canvas and track what's done, in progress and upcoming."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	loader: ({ context, params }) => context.queryClient.ensureQueryData(roadmapQO(params.id)),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
