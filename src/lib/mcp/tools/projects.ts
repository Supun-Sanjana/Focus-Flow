import { defineTool } from "../types";
import { z } from "zod";
import { fail, ok, supabaseForUser } from "../supabase";

export const listProjects = defineTool({
  name: "list_projects",
  title: "List projects",
  description: "List all projects belonging to the signed-in user.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("projects").select("*").order("created_at");
    return error ? fail(error.message) : ok({ projects: data ?? [] });
  },
});

export const createProject = defineTool({
  name: "create_project",
  title: "Create project",
  description: "Create a new project for the signed-in user.",
  inputSchema: {
    name: z.string().min(1).describe("Project name."),
    color: z.string().optional().describe("Hex color such as #7C3AED."),
    icon: z.string().optional().describe("Lucide icon name, e.g. folder."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ name, color, icon }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("projects")
      .insert({ name, color: color ?? "#7C3AED", icon: icon ?? "folder" })
      .select()
      .single();
    return error ? fail(error.message) : ok({ project: data });
  },
});

export const updateProject = defineTool({
  name: "update_project",
  title: "Update project",
  description: "Update a project's name, color, or icon.",
  inputSchema: {
    id: z.string().describe("Project id."),
    name: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ id, ...patch }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    if (Object.keys(clean).length === 0) return fail("Nothing to update.");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("projects").update(clean).eq("id", id).select().single();
    return error ? fail(error.message) : ok({ project: data });
  },
});

export const deleteProject = defineTool({
  name: "delete_project",
  title: "Delete project",
  description: "Delete a project. Tasks in the project are unassigned, not deleted.",
  inputSchema: { id: z.string().describe("Project id.") },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    return error ? fail(error.message) : ok({ deleted: id });
  },
});
