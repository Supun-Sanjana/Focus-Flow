import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fail, ok, supabaseForUser } from "../supabase";

export const listHabits = defineTool({
  name: "list_habits",
  title: "List habits",
  description: "List the signed-in user's habits together with their logged completion dates.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data: habits, error } = await supabase.from("habits").select("*").order("created_at");
    if (error) return fail(error.message);
    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .order("logged_date", { ascending: false });
    if (logsError) return fail(logsError.message);
    return ok({ habits: habits ?? [], logs: logs ?? [] });
  },
});

export const createHabit = defineTool({
  name: "create_habit",
  title: "Create habit",
  description: "Create a habit to track daily.",
  inputSchema: { title: z.string().min(1) },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ title }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("habits").insert({ title }).select().single();
    return error ? fail(error.message) : ok({ habit: data });
  },
});

export const updateHabit = defineTool({
  name: "update_habit",
  title: "Update habit",
  description: "Rename a habit.",
  inputSchema: { id: z.string(), title: z.string().min(1) },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ id, title }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("habits").update({ title }).eq("id", id).select().single();
    return error ? fail(error.message) : ok({ habit: data });
  },
});

export const deleteHabit = defineTool({
  name: "delete_habit",
  title: "Delete habit",
  description: "Delete a habit and its logs.",
  inputSchema: { id: z.string() },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("habits").delete().eq("id", id);
    return error ? fail(error.message) : ok({ deleted: id });
  },
});

export const setHabitLog = defineTool({
  name: "set_habit_log",
  title: "Log or unlog a habit",
  description: "Mark a habit as done or not done for a given date.",
  inputSchema: {
    habit_id: z.string(),
    logged_date: z.string().describe("YYYY-MM-DD."),
    done: z.boolean().describe("true to log the habit, false to remove the log."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ habit_id, logged_date, done }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    if (done) {
      const { error } = await supabase.from("habit_logs").insert({ habit_id, logged_date });
      if (error && error.code !== "23505") return fail(error.message);
    } else {
      const { error } = await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habit_id)
        .eq("logged_date", logged_date);
      if (error) return fail(error.message);
    }
    return ok({ habit_id, logged_date, done });
  },
});
