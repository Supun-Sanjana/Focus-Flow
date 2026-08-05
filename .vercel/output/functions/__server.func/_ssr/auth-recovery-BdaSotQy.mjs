import { t as supabase } from "./client-T7L3gOdv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-recovery-BdaSotQy.js
/**
* "JWT issued at future" (and jose's `"iat" claim timestamp check failed`) means the
* token was minted by the server but the *validating* clock is behind — i.e. the
* device clock is off. It is not a real auth failure, so we should never blow up the
* whole app with it.
*/
function extractErrorMessage(error) {
	if (!error) return "";
	if (typeof error === "string") return error;
	if (typeof error === "object") {
		const errObj = error;
		if (typeof errObj.message === "string") return errObj.message;
		if (typeof errObj.error_description === "string") return errObj.error_description;
		if (typeof errObj.error === "string") return errObj.error;
	}
	return String(error);
}
function isClockSkewJwtError(error) {
	const message = extractErrorMessage(error);
	return /issued at future|iat.*(claim|timestamp)|clock skew|not yet valid/i.test(message);
}
function isJwtError(error) {
	const message = extractErrorMessage(error);
	return /jwt|jws|token|unauthorized/i.test(message);
}
/**
* Returns a usable session without ever throwing.
* `getSession()` reads (and refreshes) locally persisted state and does not verify
* the JWT signature/claims, so it is immune to clock-skew rejections.
*/
async function getSessionSafe() {
	try {
		const { data } = await supabase.auth.getSession();
		if (data.session?.user) return data.session;
	} catch (error) {
		if (!isJwtError(error)) throw error;
	}
	try {
		const { data, error } = await supabase.auth.refreshSession();
		if (!error && data.session?.user) return data.session;
	} catch (error) {
		if (!isJwtError(error)) throw error;
	}
	return null;
}
//#endregion
export { getSessionSafe as n, isClockSkewJwtError as r, extractErrorMessage as t };
