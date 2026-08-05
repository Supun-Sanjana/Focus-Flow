import { t as supabase } from "./client-T7L3gOdv.mjs";
import { n as getSessionSafe } from "./auth-recovery-BdaSotQy.mjs";
import { A as redirect, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/oauth.consent-C2Ha0y-3.js
var oauth = () => supabase.auth.oauth;
var $$splitErrorComponentImporter = () => import("./oauth.consent-Blc5Uzsc.mjs");
var $$splitComponentImporter = () => import("./oauth.consent-CqNC2xEG.mjs");
var Route = createFileRoute("/oauth/consent")({
	ssr: false,
	validateSearch: (s) => ({ authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "" }),
	beforeLoad: async ({ search, location }) => {
		if (!search.authorization_id) throw new Error("Missing authorization_id");
		const session = await getSessionSafe();
		const next = location.pathname + location.searchStr;
		if (!session?.user) throw redirect({
			to: "/auth",
			search: { next }
		});
	},
	loader: async ({ location }) => {
		const authorizationId = new URLSearchParams(location.searchStr).get("authorization_id");
		const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
		if (error) throw error;
		const immediate = data?.redirect_url ?? data?.redirect_to;
		if (immediate && !data?.client) throw redirect({ href: immediate });
		return data;
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
export { oauth as n, Route as t };
