import { defineTool } from "../types";
import { z } from "zod";
import { fail, ok, supabaseForUser } from "../supabase";

const status = z.enum(["todo", "in_progress", "done"]);
const priority = z.enum(["p1", "p2", "p3", "p4"]);

export const listTasks = defineTool({
  name: "list_tasks",
  title: "List tasks",
  description: "List the signed-in user's tasks, optionally filtered by project, status, or due date.",
  inputSchema: {
    project_id: z.string().optional().describe("Only tasks in this project."),
    status: status.optional(),
    due_date: z.string().optional().describe("Exact due date, YYYY-MM-DD."),
    due_before: z.string().optional().describe("Due on or before this date, YYYY-MM-DD."),
    unscheduled: z.boolean().optional().describe("Only tasks with no due date."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    let q = supabase.from("tasks").select("*").order("order_index");
    if (input.project_id) q = q.eq("project_id", input.project_id);
    if (input.status) q = q.eq("status", input.status);
    if (input.due_date) q = q.eq("due_date", input.due_date);
    if (input.due_before) q = q.lte("due_date", input.due_before);
    if (input.unscheduled) q = q.is("due_date", null);
    const { data, error } = await q;
    return error ? fail(error.message) : ok({ tasks: data ?? [] });
  },
});

export const createTask = defineTool({
  name: "create_task",
  title: "Create task",
  description: "Create a task. Set due_date to schedule it, project_id to file it under a project.",
  inputSchema: {
    title: z.string().min(1),
    description: z.string().optional(),
    project_id: z.string().optional(),
    status: status.optional(),
    priority: priority.optional(),
    due_date: z.string().optional().describe("YYYY-MM-DD."),
    tags: z.array(z.string()).optional(),
    is_recurring: z.boolean().optional(),
    recur_pattern: z.string().optional().describe("e.g. daily, weekly."),
    remind_lead_minutes: z.number().int().optional().describe("Minutes before due time to remind."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("tasks").insert(input).select().single();
    return error ? fail(error.message) : ok({ task: data });
  },
});

export const updateTask = defineTool({
  name: "update_task",
  title: "Update task",
  description: "Update any field of a task, including scheduling it or marking it done.",
  inputSchema: {
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    project_id: z.string().nullable().optional(),
    status: status.optional(),
    priority: priority.optional(),
    due_date: z.string().nullable().optional().describe("YYYY-MM-DD, or null to unschedule."),
    tags: z.array(z.string()).optional(),
    is_recurring: z.boolean().optional(),
    recur_pattern: z.string().nullable().optional(),
    order_index: z.number().int().optional(),
    remind_lead_minutes: z.number().int().nullable().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ id, ...patch }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    if (Object.keys(clean).length === 0) return fail("Nothing to update.");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("tasks").update(clean).eq("id", id).select().single();
    return error ? fail(error.message) : ok({ task: data });
  },
});

export const deleteTask = defineTool({
  name: "delete_task",
  title: "Delete task",
  description: "Delete a task and its subtasks.",
  inputSchema: { id: z.string() },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    return error ? fail(error.message) : ok({ deleted: id });
  },
});

export const listSubtasks = defineTool({
  name: "list_subtasks",
  title: "List subtasks",
  description: "List the subtasks of a task.",
  inputSchema: { task_id: z.string() },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ task_id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("subtasks")
      .select("*")
      .eq("task_id", task_id)
      .order("order_index");
    return error ? fail(error.message) : ok({ subtasks: data ?? [] });
  },
});

export const createSubtask = defineTool({
  name: "create_subtask",
  title: "Create subtask",
  description: "Add a subtask to a task.",
  inputSchema: {
    task_id: z.string(),
    title: z.string().min(1),
    order_index: z.number().int().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("subtasks").insert(input).select().single();
    return error ? fail(error.message) : ok({ subtask: data });
  },
});

export const updateSubtask = defineTool({
  name: "update_subtask",
  title: "Update subtask",
  description: "Rename, reorder, or check off a subtask.",
  inputSchema: {
    id: z.string(),
    title: z.string().optional(),
    is_done: z.boolean().optional(),
    order_index: z.number().int().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ id, ...patch }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    if (Object.keys(clean).length === 0) return fail("Nothing to update.");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("subtasks").update(clean).eq("id", id).select().single();
    return error ? fail(error.message) : ok({ subtask: data });
  },
});

export const deleteSubtask = defineTool({
  name: "delete_subtask",
  title: "Delete subtask",
  description: "Delete a subtask.",
  inputSchema: { id: z.string() },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("subtasks").delete().eq("id", id);
    return error ? fail(error.message) : ok({ deleted: id });
  },
});
