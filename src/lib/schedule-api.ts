import { supabase } from "../integrations/supabase/client";

export type ScheduleBlock = {
  id: string;
  user_id: string;
  day_of_week: number; // 1 = Mon ... 7 = Sun
  start_time: string; // "HH:MM:SS"
  end_time: string | null;
  title: string;
  details: string | null;
  color: string;
  project_id: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type ScheduleRule = {
  id: string;
  user_id: string;
  text: string;
  kind: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

const blocks = () => supabase.from("schedule_blocks" as never);
const rules = () => supabase.from("schedule_rules" as never);

export async function fetchScheduleBlocks(): Promise<ScheduleBlock[]> {
  const { data, error } = await blocks()
    .select("*")
    .order("day_of_week")
    .order("start_time");
  if (error) throw error;
  return (data ?? []) as unknown as ScheduleBlock[];
}

export async function createScheduleBlock(input: {
  day_of_week: number;
  title: string;
  start_time?: string;
  end_time?: string | null;
  color?: string;
  details?: string | null;
  project_id?: string | null;
}) {
  const { data, error } = await blocks()
    .insert(input as never)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as ScheduleBlock;
}

export async function updateScheduleBlock(id: string, patch: Partial<ScheduleBlock>) {
  const { error } = await blocks().update(patch as never).eq("id", id);
  if (error) throw error;
}

export async function deleteScheduleBlock(id: string) {
  const { error } = await blocks().delete().eq("id", id);
  if (error) throw error;
}

export async function fetchScheduleRules(): Promise<ScheduleRule[]> {
  const { data, error } = await rules().select("*").order("order_index");
  if (error) throw error;
  return (data ?? []) as unknown as ScheduleRule[];
}

export async function createScheduleRule(input: { text: string; kind?: string; order_index?: number }) {
  const { data, error } = await rules().insert(input as never).select().single();
  if (error) throw error;
  return data as unknown as ScheduleRule;
}

export async function updateScheduleRule(id: string, patch: Partial<ScheduleRule>) {
  const { error } = await rules().update(patch as never).eq("id", id);
  if (error) throw error;
}

export async function deleteScheduleRule(id: string) {
  const { error } = await rules().delete().eq("id", id);
  if (error) throw error;
}

export const DAYS = [
  { value: 1, short: "Mon", label: "Monday" },
  { value: 2, short: "Tue", label: "Tuesday" },
  { value: 3, short: "Wed", label: "Wednesday" },
  { value: 4, short: "Thu", label: "Thursday" },
  { value: 5, short: "Fri", label: "Friday" },
  { value: 6, short: "Sat", label: "Saturday" },
  { value: 7, short: "Sun", label: "Sunday" },
];

export function fmtTime(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hh = Number(h);
  const suffix = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${m}${suffix}`;
}

export function blockRange(b: Pick<ScheduleBlock, "start_time" | "end_time">) {
  return b.end_time ? `${fmtTime(b.start_time)} – ${fmtTime(b.end_time)}` : fmtTime(b.start_time);
}
