import { defineTool } from "../types";
import { z } from "zod";
import { fail, ok, supabaseForUser } from "../supabase";
import { parseRoadmapMarkdown } from "@/lib/roadmap-import";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const PHASE_ACCENTS = ["#7C3AED", "#10B981", "#F97316", "#EF4444", "#0EA5E9", "#EAB308", "#EC4899", "#06B6D4"];

const itemSchema = z.object({
  text: z.string(),
  chips: z.array(z.string()).optional().describe("Short tags shown as pills on the item."),
});

const columnSchema = z.object({
  title: z.string().describe("Column heading, e.g. Topics."),
  items: z.array(itemSchema).optional(),
});

const phaseSchema = z.object({
  title: z.string().describe("Phase title, e.g. 'Phase 1 — Foundations'."),
  meta: z.string().optional().describe("Subtitle, e.g. 'Weeks 1-2 · ~7 hrs'."),
  accent: z.string().optional().describe("Hex accent color."),
  status: z.enum(["todo", "current", "done"]).optional(),
  columns: z.array(columnSchema).optional().describe("Defaults to Topics / Why it matters / Notes."),
});

type PhaseInput = z.infer<typeof phaseSchema>;

function buildPhase(phase: PhaseInput, index: number) {
  const columns =
    phase.columns && phase.columns.length > 0
      ? phase.columns
      : [{ title: "Topics", items: [] }, { title: "Why it matters", items: [] }, { title: "Notes / Angle", items: [] }];
  return {
    id: uid(),
    title: phase.title,
    meta: phase.meta ?? "",
    accent: phase.accent ?? PHASE_ACCENTS[index % PHASE_ACCENTS.length],
    status: phase.status ?? "todo",
    pos: { x: 40 + (index % 3) * 460, y: 40 + Math.floor(index / 3) * 420 },
    columns: columns.map((c) => ({
      id: uid(),
      title: c.title,
      items: (c.items ?? []).map((i) => ({ id: uid(), text: i.text, chips: i.chips ?? [] })),
    })),
  };
}

export const listRoadmaps = defineTool({
  name: "list_roadmaps",
  title: "List roadmaps",
  description: "List the signed-in user's roadmaps with their phases and progress.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .order("created_at", { ascending: false });
    return error ? fail(error.message) : ok({ roadmaps: data ?? [] });
  },
});

export const getRoadmap = defineTool({
  name: "get_roadmap",
  title: "Get roadmap",
  description: "Read one roadmap, including its full phase/column/item structure.",
  inputSchema: { id: z.string() },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("roadmaps").select("*").eq("id", id).single();
    return error ? fail(error.message) : ok({ roadmap: data });
  },
});

export const createRoadmap = defineTool({
  name: "create_roadmap",
  title: "Create roadmap",
  description:
    "Create a roadmap for a goal from a list of phases. Each phase gets columns of items with optional chip tags, laid out on the roadmap canvas.",
  inputSchema: {
    title: z.string().min(1),
    description: z.string().optional(),
    phases: z.array(phaseSchema).optional().describe("Phases in order. Omit for a single empty starter phase."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ title, description, phases }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const list = phases && phases.length > 0 ? phases : [{ title: "Phase 1" }];
    const data = { phases: list.map(buildPhase) };
    const supabase = supabaseForUser(ctx);
    const { data: row, error } = await supabase
      .from("roadmaps")
      .insert({ title, description: description ?? null, data })
      .select()
      .single();
    return error ? fail(error.message) : ok({ roadmap: row });
  },
});

export const importRoadmapMarkdown = defineTool({
  name: "import_roadmap_markdown",
  title: "Import roadmap from markdown",
  description:
    "Create a roadmap from markdown: '# Title', '## Phase', '### Column', '- item' lines with optional `chip` backticks.",
  inputSchema: {
    markdown: z.string().min(1),
    title: z.string().optional().describe("Overrides the markdown title."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ markdown, title }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const parsed = parseRoadmapMarkdown(markdown);
    const supabase = supabaseForUser(ctx);
    const { data: row, error } = await supabase
      .from("roadmaps")
      .insert({
        title: title ?? parsed.title,
        description: parsed.description ?? null,
        data: parsed.data,
      })
      .select()
      .single();
    return error ? fail(error.message) : ok({ roadmap: row });
  },
});

export const updateRoadmap = defineTool({
  name: "update_roadmap",
  title: "Update roadmap",
  description:
    "Update a roadmap's title/description, or replace its phases. Use set_roadmap_phase_status to only change progress.",
  inputSchema: {
    id: z.string(),
    title: z.string().optional(),
    description: z.string().nullable().optional(),
    phases: z.array(phaseSchema).optional().describe("Replaces all existing phases when provided."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ id, title, description, phases }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const patch: Record<string, unknown> = {};
    if (title !== undefined) patch.title = title;
    if (description !== undefined) patch.description = description;
    if (phases) patch.data = { phases: phases.map(buildPhase) };
    if (Object.keys(patch).length === 0) return fail("Nothing to update.");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("roadmaps").update(patch).eq("id", id).select().single();
    return error ? fail(error.message) : ok({ roadmap: data });
  },
});

export const setRoadmapPhaseStatus = defineTool({
  name: "set_roadmap_phase_status",
  title: "Set roadmap phase status",
  description: "Mark a phase as done, current, or upcoming (todo) — this drives the green progress on the canvas.",
  inputSchema: {
    roadmap_id: z.string(),
    phase_id: z.string().optional().describe("Phase id. Omit to match by phase title."),
    phase_title: z.string().optional().describe("Phase title, used when phase_id is omitted."),
    status: z.enum(["todo", "current", "done"]),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ roadmap_id, phase_id, phase_title, status }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data: row, error } = await supabase.from("roadmaps").select("*").eq("id", roadmap_id).single();
    if (error) return fail(error.message);
    const current = (row?.data ?? { phases: [] }) as { phases: Array<Record<string, unknown>> };
    let matched = false;
    const phases = current.phases.map((p) => {
      const isMatch = phase_id ? p.id === phase_id : phase_title ? p.title === phase_title : false;
      if (!isMatch) return p;
      matched = true;
      return { ...p, status };
    });
    if (!matched) return fail("No phase matched the given phase_id/phase_title.");
    const { data: updated, error: updateError } = await supabase
      .from("roadmaps")
      .update({ data: { ...current, phases } })
      .eq("id", roadmap_id)
      .select()
      .single();
    return updateError ? fail(updateError.message) : ok({ roadmap: updated });
  },
});

export const deleteRoadmap = defineTool({
  name: "delete_roadmap",
  title: "Delete roadmap",
  description: "Delete a roadmap.",
  inputSchema: { id: z.string() },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("roadmaps").delete().eq("id", id);
    return error ? fail(error.message) : ok({ deleted: id });
  },
});
