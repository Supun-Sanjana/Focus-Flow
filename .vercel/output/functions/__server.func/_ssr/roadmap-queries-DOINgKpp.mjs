import { t as supabase } from "./client-T7L3gOdv.mjs";
import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmap-queries-DOINgKpp.js
var table = () => supabase.from("roadmaps");
async function fetchRoadmaps() {
	const { data, error } = await table().select("*").order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function fetchRoadmap(id) {
	const { data, error } = await table().select("*").eq("id", id).single();
	if (error) throw error;
	return data;
}
async function createRoadmap(input) {
	const data = { phases: [defaultPhase("Phase 1", "#7C3AED", 0)] };
	const { data: row, error } = await table().insert({
		title: input.title,
		description: input.description ?? null,
		data
	}).select().single();
	if (error) throw error;
	return row;
}
async function createRoadmapFromData(input) {
	const { data: row, error } = await table().insert({
		title: input.title,
		description: input.description ?? null,
		data: input.data
	}).select().single();
	if (error) throw error;
	return row;
}
async function updateRoadmap(id, patch) {
	const { error } = await table().update(patch).eq("id", id);
	if (error) throw error;
}
async function deleteRoadmap(id) {
	const { error } = await table().delete().eq("id", id);
	if (error) throw error;
}
function uid() {
	return Math.random().toString(36).slice(2, 10);
}
function defaultPhase(title, accent, index = 0) {
	return {
		id: uid(),
		title,
		meta: "",
		accent,
		status: "todo",
		pos: {
			x: 40 + index % 3 * 480,
			y: 40 + Math.floor(index / 3) * 440
		},
		columns: [{
			id: uid(),
			title: "Topics",
			items: []
		}]
	};
}
var PHASE_ACCENTS = [
	"#7C3AED",
	"#10B981",
	"#F97316",
	"#EF4444",
	"#0EA5E9",
	"#EAB308",
	"#EC4899",
	"#06B6D4"
];
var roadmapsQO = queryOptions({
	queryKey: ["roadmaps"],
	queryFn: fetchRoadmaps
});
var roadmapQO = (id) => queryOptions({
	queryKey: ["roadmap", id],
	queryFn: () => fetchRoadmap(id),
	enabled: !!id
});
//#endregion
export { deleteRoadmap as a, uid as c, defaultPhase as i, updateRoadmap as l, createRoadmap as n, roadmapQO as o, createRoadmapFromData as r, roadmapsQO as s, PHASE_ACCENTS as t };
