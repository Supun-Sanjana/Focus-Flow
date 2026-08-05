import { supabase } from "../integrations/supabase/client";

export type RoadmapItem = {
  id: string;
  text: string;
  chips?: string[];
};

export type RoadmapColumn = {
  id: string;
  title: string;
  items: RoadmapItem[];
};

export type PhaseStatus = "todo" | "current" | "done";

export type RoadmapPhase = {
  id: string;
  title: string;
  meta?: string; // e.g. "Weeks 1-2 · ~7 hrs"
  accent: string; // hex color for header dot / border
  columns: RoadmapColumn[];
  status?: PhaseStatus;
  pos?: { x: number; y: number }; // canvas position
};

export type RoadmapData = {
  phases: RoadmapPhase[];
};

export type Roadmap = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  data: RoadmapData;
  created_at: string;
  updated_at: string;
};

const table = () => (supabase as any).from("roadmaps");

export async function fetchRoadmaps(): Promise<Roadmap[]> {
  const { data, error } = await table().select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Roadmap[];
}

export async function fetchRoadmap(id: string): Promise<Roadmap> {
  const { data, error } = await table().select("*").eq("id", id).single();
  if (error) throw error;
  return data as Roadmap;
}

export async function createRoadmap(input: { title: string; description?: string }): Promise<Roadmap> {
  const data: RoadmapData = { phases: [defaultPhase("Phase 1", "#7C3AED", 0)] };
  const { data: row, error } = await table()
    .insert({ title: input.title, description: input.description ?? null, data })
    .select()
    .single();
  if (error) throw error;
  return row as Roadmap;
}

export async function createRoadmapFromData(input: {
  title: string;
  description?: string;
  data: RoadmapData;
}): Promise<Roadmap> {
  const { data: row, error } = await table()
    .insert({ title: input.title, description: input.description ?? null, data: input.data })
    .select()
    .single();
  if (error) throw error;
  return row as Roadmap;
}


export async function updateRoadmap(id: string, patch: Partial<Roadmap>) {
  const { error } = await table().update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteRoadmap(id: string) {
  const { error } = await table().delete().eq("id", id);
  if (error) throw error;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function defaultPhase(title: string, accent: string, index = 0): RoadmapPhase {
  return {
    id: uid(),
    title,
    meta: "",
    accent,
    status: "todo",
    pos: { x: 40 + (index % 3) * 480, y: 40 + Math.floor(index / 3) * 440 },
    columns: [
      { id: uid(), title: "Topics", items: [] },
    ],
  };
}

export const PHASE_ACCENTS = [
  "#7C3AED", "#10B981", "#F97316", "#EF4444", "#0EA5E9", "#EAB308", "#EC4899", "#06B6D4",
];
