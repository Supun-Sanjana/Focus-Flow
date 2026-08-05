import { defineTool } from "../types";
import { z } from "zod";
import { fail, ok, supabaseForUser } from "../supabase";

export const listScheduleBlocks = defineTool({
  name: "list_schedule_blocks",
  title: "List weekly schedule blocks",
  description: "List the recurring weekly schedule blocks (1 = Monday ... 7 = Sunday).",
  inputSchema: { day_of_week: z.number().int().optional().describe("1 = Monday ... 7 = Sunday.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ day_of_week }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    let q = supabase.from("schedule_blocks").select("*").order("day_of_week").order("start_time");
    if (day_of_week) q = q.eq("day_of_week", day_of_week);
    const { data, error } = await q;
    return error ? fail(error.message) : ok({ blocks: data ?? [] });
  },
});

export const createScheduleBlock = defineTool({
  name: "create_schedule_block",
  title: "Create weekly schedule block",
  description: "Add a recurring weekly time block, e.g. 'AWS study' Monday 08:00-08:30.",
  inputSchema: {
    day_of_week: z.number().int().describe("1 = Monday ... 7 = Sunday."),
    title: z.string().min(1),
    start_time: z.string().optional().describe("HH:MM or HH:MM:SS, default 09:00."),
    end_time: z.string().optional().describe("HH:MM or HH:MM:SS."),
    details: z.string().optional(),
    color: z.string().optional().describe("Hex color."),
    project_id: z.string().optional(),
    order_index: z.number().int().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("schedule_blocks").insert(input).select().single();
    return error ? fail(error.message) : ok({ block: data });
  },
});

export const updateScheduleBlock = defineTool({
  name: "update_schedule_block",
  title: "Update weekly schedule block",
  description: "Change a recurring block's day, time, title, color, project, or active state.",
  inputSchema: {
    id: z.string(),
    day_of_week: z.number().int().optional(),
    title: z.string().optional(),
    start_time: z.string().optional(),
    end_time: z.string().nullable().optional(),
    details: z.string().nullable().optional(),
    color: z.string().optional(),
    project_id: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
    order_index: z.number().int().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ id, ...patch }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    if (Object.keys(clean).length === 0) return fail("Nothing to update.");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("schedule_blocks")
      .update(clean)
      .eq("id", id)
      .select()
      .single();
    return error ? fail(error.message) : ok({ block: data });
  },
});

export const deleteScheduleBlock = defineTool({
  name: "delete_schedule_block",
  title: "Delete weekly schedule block",
  description: "Delete a recurring weekly block.",
  inputSchema: { id: z.string() },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("schedule_blocks").delete().eq("id", id);
    return error ? fail(error.message) : ok({ deleted: id });
  },
});

export const listScheduleRules = defineTool({
  name: "list_schedule_rules",
  title: "List schedule rules",
  description: "List the non-negotiables / working principles attached to the weekly planner.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("schedule_rules").select("*").order("order_index");
    return error ? fail(error.message) : ok({ rules: data ?? [] });
  },
});

export const createScheduleRule = defineTool({
  name: "create_schedule_rule",
  title: "Create schedule rule",
  description: "Add a non-negotiable rule to the weekly planner.",
  inputSchema: {
    text: z.string().min(1),
    kind: z.string().optional().describe("Defaults to non_negotiable."),
    order_index: z.number().int().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("schedule_rules").insert(input).select().single();
    return error ? fail(error.message) : ok({ rule: data });
  },
});

export const updateScheduleRule = defineTool({
  name: "update_schedule_rule",
  title: "Update schedule rule",
  description: "Edit or reorder a schedule rule.",
  inputSchema: {
    id: z.string(),
    text: z.string().optional(),
    kind: z.string().optional(),
    order_index: z.number().int().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ id, ...patch }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    if (Object.keys(clean).length === 0) return fail("Nothing to update.");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("schedule_rules")
      .update(clean)
      .eq("id", id)
      .select()
      .single();
    return error ? fail(error.message) : ok({ rule: data });
  },
});

export const deleteScheduleRule = defineTool({
  name: "delete_schedule_rule",
  title: "Delete schedule rule",
  description: "Delete a schedule rule.",
  inputSchema: { id: z.string() },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("schedule_rules").delete().eq("id", id);
    return error ? fail(error.message) : ok({ deleted: id });
  },
});
