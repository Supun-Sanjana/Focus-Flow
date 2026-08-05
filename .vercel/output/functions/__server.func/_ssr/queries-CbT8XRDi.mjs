import { t as supabase } from "./client-T7L3gOdv.mjs";
import { n as queryOptions, o as useQueryClient, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-CbT8XRDi.js
async function fetchProjects() {
	const { data, error } = await supabase.from("projects").select("*").order("created_at");
	if (error) throw error;
	return data ?? [];
}
async function fetchTasks() {
	const { data, error } = await supabase.from("tasks").select("*").order("order_index");
	if (error) throw error;
	return data ?? [];
}
async function fetchSubtasks(taskId) {
	const { data, error } = await supabase.from("subtasks").select("*").eq("task_id", taskId).order("order_index");
	if (error) throw error;
	return data ?? [];
}
async function createProject(input) {
	const { data, error } = await supabase.from("projects").insert({
		name: input.name,
		color: input.color,
		icon: input.icon ?? "folder"
	}).select().single();
	if (error) throw error;
	return data;
}
async function updateProject(id, patch) {
	const { error } = await supabase.from("projects").update(patch).eq("id", id);
	if (error) throw error;
}
async function deleteProject(id) {
	const { error } = await supabase.from("projects").delete().eq("id", id);
	if (error) throw error;
}
async function createTask(input) {
	const { data, error } = await supabase.from("tasks").insert(input).select().single();
	if (error) throw error;
	return data;
}
async function updateTask(id, patch) {
	const { error } = await supabase.from("tasks").update(patch).eq("id", id);
	if (error) throw error;
}
async function deleteTask(id) {
	const { error } = await supabase.from("tasks").delete().eq("id", id);
	if (error) throw error;
}
async function createSubtask(input) {
	const { data, error } = await supabase.from("subtasks").insert({
		task_id: input.task_id,
		title: input.title,
		order_index: input.order_index ?? 0
	}).select().single();
	if (error) throw error;
	return data;
}
async function updateSubtask(id, patch) {
	const { error } = await supabase.from("subtasks").update(patch).eq("id", id);
	if (error) throw error;
}
async function deleteSubtask(id) {
	const { error } = await supabase.from("subtasks").delete().eq("id", id);
	if (error) throw error;
}
async function fetchHabits() {
	const { data, error } = await supabase.from("habits").select("*").order("created_at");
	if (error) throw error;
	return data ?? [];
}
async function fetchHabitLogs() {
	const { data, error } = await supabase.from("habit_logs").select("*").order("logged_date", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function createHabit(title) {
	const { data, error } = await supabase.from("habits").insert({ title }).select().single();
	if (error) throw error;
	return data;
}
async function deleteHabit(id) {
	const { error } = await supabase.from("habits").delete().eq("id", id);
	if (error) throw error;
}
async function toggleHabitLog(habitId, date, on) {
	if (on) {
		const { error } = await supabase.from("habit_logs").insert({
			habit_id: habitId,
			logged_date: date
		});
		if (error && error.code !== "23505") throw error;
	} else {
		const { error } = await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("logged_date", date);
		if (error) throw error;
	}
}
var projectsQO = queryOptions({
	queryKey: ["projects"],
	queryFn: fetchProjects
});
var tasksQO = queryOptions({
	queryKey: ["tasks"],
	queryFn: fetchTasks
});
var habitsQO = queryOptions({
	queryKey: ["habits"],
	queryFn: fetchHabits
});
var habitLogsQO = queryOptions({
	queryKey: ["habit_logs"],
	queryFn: fetchHabitLogs
});
var subtasksQO = (taskId) => queryOptions({
	queryKey: ["subtasks", taskId],
	queryFn: () => fetchSubtasks(taskId),
	enabled: !!taskId
});
function useInvalidate() {
	const qc = useQueryClient();
	return (key) => qc.invalidateQueries({ queryKey: [key] });
}
function useTaskMutations() {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["tasks"] });
	return {
		create: useMutation({
			mutationFn: createTask,
			onSuccess: inv
		}),
		update: useMutation({
			mutationFn: ({ id, patch }) => updateTask(id, patch),
			onSuccess: inv
		}),
		remove: useMutation({
			mutationFn: deleteTask,
			onSuccess: inv
		})
	};
}
function useProjectMutations() {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["projects"] });
	return {
		create: useMutation({
			mutationFn: createProject,
			onSuccess: inv
		}),
		update: useMutation({
			mutationFn: ({ id, patch }) => updateProject(id, patch),
			onSuccess: inv
		}),
		remove: useMutation({
			mutationFn: deleteProject,
			onSuccess: () => {
				qc.invalidateQueries({ queryKey: ["projects"] });
				qc.invalidateQueries({ queryKey: ["tasks"] });
			}
		})
	};
}
function useSubtaskMutations(taskId) {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["subtasks", taskId] });
	return {
		create: useMutation({
			mutationFn: createSubtask,
			onSuccess: inv
		}),
		update: useMutation({
			mutationFn: ({ id, patch }) => updateSubtask(id, patch),
			onSuccess: inv
		}),
		remove: useMutation({
			mutationFn: deleteSubtask,
			onSuccess: inv
		})
	};
}
//#endregion
export { projectsQO as a, toggleHabitLog as c, useSubtaskMutations as d, useTaskMutations as f, habitsQO as i, useInvalidate as l, deleteHabit as n, subtasksQO as o, habitLogsQO as r, tasksQO as s, createHabit as t, useProjectMutations as u };
