import { supabase } from "../integrations/supabase/client";

/**
 * "JWT issued at future" (and jose's `"iat" claim timestamp check failed`) means the
 * token was minted by the server but the *validating* clock is behind — i.e. the
 * device clock is off. It is not a real auth failure, so we should never blow up the
 * whole app with it.
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.message === "string") return errObj.message;
    if (typeof errObj.error_description === "string") return errObj.error_description;
    if (typeof errObj.error === "string") return errObj.error;
  }
  return String(error);
}

export function isClockSkewJwtError(error: unknown): boolean {
  const message = extractErrorMessage(error);
  return /issued at future|iat.*(claim|timestamp)|clock skew|not yet valid/i.test(message);
}

export function isJwtError(error: unknown): boolean {
  const message = extractErrorMessage(error);
  return /jwt|jws|token|unauthorized/i.test(message);
}

/**
 * Returns a usable session without ever throwing.
 * `getSession()` reads (and refreshes) locally persisted state and does not verify
 * the JWT signature/claims, so it is immune to clock-skew rejections.
 */
export async function getSessionSafe() {
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
