import { n as getSessionSafe } from "./auth-recovery-BdaSotQy.mjs";
import { A as redirect, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-C0CNnnpH.js
var $$splitComponentImporter = () => import("./auth-BMtzbWbf.mjs");
var Route = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — Focus" },
		{
			name: "description",
			content: "Sign in to Focus — a minimal task manager for people who ship. Plan your week, track habits, and stay in flow."
		},
		{
			property: "og:title",
			content: "Sign in — Focus"
		},
		{
			property: "og:description",
			content: "The calm, keyboard-first task manager for makers."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	ssr: false,
	validateSearch: (s) => {
		const next = typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : void 0;
		return next ? { next } : {};
	},
	beforeLoad: async ({ search }) => {
		if (typeof window === "undefined") return;
		if ((await getSessionSafe())?.user) throw redirect({ href: search.next ?? "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
