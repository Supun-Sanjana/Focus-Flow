import { t as supabase } from "./client-T7L3gOdv.mjs";
import { n as queryOptions, o as useQueryClient, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schedule-queries-ChbbeOIA.js
var blocks = () => supabase.from("schedule_blocks");
var rules = () => supabase.from("schedule_rules");
async function fetchScheduleBlocks() {
	const { data, error } = await blocks().select("*").order("day_of_week").order("start_time");
	if (error) throw error;
	return data ?? [];
}
async function createScheduleBlock(input) {
	const { data, error } = await blocks().insert(input).select().single();
	if (error) throw error;
	return data;
}
async function updateScheduleBlock(id, patch) {
	const { error } = await blocks().update(patch).eq("id", id);
	if (error) throw error;
}
async function deleteScheduleBlock(id) {
	const { error } = await blocks().delete().eq("id", id);
	if (error) throw error;
}
async function fetchScheduleRules() {
	const { data, error } = await rules().select("*").order("order_index");
	if (error) throw error;
	return data ?? [];
}
async function createScheduleRule(input) {
	const { data, error } = await rules().insert(input).select().single();
	if (error) throw error;
	return data;
}
async function updateScheduleRule(id, patch) {
	const { error } = await rules().update(patch).eq("id", id);
	if (error) throw error;
}
async function deleteScheduleRule(id) {
	const { error } = await rules().delete().eq("id", id);
	if (error) throw error;
}
var DAYS = [
	{
		value: 1,
		short: "Mon",
		label: "Monday"
	},
	{
		value: 2,
		short: "Tue",
		label: "Tuesday"
	},
	{
		value: 3,
		short: "Wed",
		label: "Wednesday"
	},
	{
		value: 4,
		short: "Thu",
		label: "Thursday"
	},
	{
		value: 5,
		short: "Fri",
		label: "Friday"
	},
	{
		value: 6,
		short: "Sat",
		label: "Saturday"
	},
	{
		value: 7,
		short: "Sun",
		label: "Sunday"
	}
];
function fmtTime(t) {
	if (!t) return "";
	const [h, m] = t.split(":");
	const hh = Number(h);
	const suffix = hh >= 12 ? "PM" : "AM";
	return `${hh % 12 === 0 ? 12 : hh % 12}:${m}${suffix}`;
}
function blockRange(b) {
	return b.end_time ? `${fmtTime(b.start_time)} – ${fmtTime(b.end_time)}` : fmtTime(b.start_time);
}
var scheduleBlocksQO = queryOptions({
	queryKey: ["schedule_blocks"],
	queryFn: fetchScheduleBlocks
});
var scheduleRulesQO = queryOptions({
	queryKey: ["schedule_rules"],
	queryFn: fetchScheduleRules
});
function useScheduleBlockMutations() {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["schedule_blocks"] });
	return {
		create: useMutation({
			mutationFn: createScheduleBlock,
			onSuccess: inv
		}),
		update: useMutation({
			mutationFn: ({ id, patch }) => updateScheduleBlock(id, patch),
			onSuccess: inv
		}),
		remove: useMutation({
			mutationFn: deleteScheduleBlock,
			onSuccess: inv
		})
	};
}
function useScheduleRuleMutations() {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["schedule_rules"] });
	return {
		create: useMutation({
			mutationFn: createScheduleRule,
			onSuccess: inv
		}),
		update: useMutation({
			mutationFn: ({ id, patch }) => updateScheduleRule(id, patch),
			onSuccess: inv
		}),
		remove: useMutation({
			mutationFn: deleteScheduleRule,
			onSuccess: inv
		})
	};
}
//#endregion
export { useScheduleBlockMutations as a, scheduleRulesQO as i, blockRange as n, useScheduleRuleMutations as o, scheduleBlocksQO as r, DAYS as t };
