import { supabase } from "../integrations/supabase/client";
import type { Database } from "../integrations/supabase/types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Subtask = Database["public"]["Tables"]["subtasks"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];

export type TaskStatus = "todo" | "in_progress" | "done";
export type Priority = "p1" | "p2" | "p3" | "p4";

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*").order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from("tasks").select("*").order("order_index");
  if (error) throw error;
  return data ?? [];
}

export async function fetchSubtasks(taskId: string): Promise<Subtask[]> {
  const { data, error } = await supabase
    .from("subtasks").select("*").eq("task_id", taskId).order("order_index");
  if (error) throw error;
  return data ?? [];
}

export async function createProject(input: { name: string; color: string; icon?: string }) {
  const { data, error } = await supabase
    .from("projects").insert({ name: input.name, color: input.color, icon: input.icon ?? "folder" })
    .select().single();
  if (error) throw error;
  return data;
}
export async function updateProject(id: string, patch: Partial<Project>) {
  const { error } = await supabase.from("projects").update(patch).eq("id", id);
  if (error) throw error;
}
export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function createTask(input: Partial<Task> & { title: string }) {
  const { data, error } = await supabase.from("tasks").insert(input as never).select().single();
  if (error) throw error;
  return data;
}
export async function updateTask(id: string, patch: Partial<Task>) {
  const { error } = await supabase.from("tasks").update(patch).eq("id", id);
  if (error) throw error;
}
export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function createSubtask(input: { task_id: string; title: string; order_index?: number }) {
  const { data, error } = await supabase.from("subtasks")
    .insert({ task_id: input.task_id, title: input.title, order_index: input.order_index ?? 0 })
    .select().single();
  if (error) throw error;
  return data;
}
export async function updateSubtask(id: string, patch: Partial<Subtask>) {
  const { error } = await supabase.from("subtasks").update(patch).eq("id", id);
  if (error) throw error;
}
export async function deleteSubtask(id: string) {
  const { error } = await supabase.from("subtasks").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase.from("habits").select("*").order("created_at");
  if (error) throw error;
  return data ?? [];
}
export async function fetchHabitLogs(): Promise<HabitLog[]> {
  const { data, error } = await supabase.from("habit_logs").select("*").order("logged_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function createHabit(title: string) {
  const { data, error } = await supabase.from("habits").insert({ title }).select().single();
  if (error) throw error;
  return data;
}
export async function deleteHabit(id: string) {
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw error;
}
export async function toggleHabitLog(habitId: string, date: string, on: boolean) {
  if (on) {
    const { error } = await supabase.from("habit_logs").insert({ habit_id: habitId, logged_date: date });
    if (error && error.code !== "23505") throw error;
  } else {
    const { error } = await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("logged_date", date);
    if (error) throw error;
  }
}
