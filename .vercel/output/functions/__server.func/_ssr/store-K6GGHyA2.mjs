import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-K6GGHyA2.js
var useUI = create((set) => ({
	selectedTaskId: null,
	quickAddOpen: false,
	quickAddDefaultProject: null,
	setSelectedTask: (id) => set({ selectedTaskId: id }),
	setQuickAddOpen: (open, defaultProject = null) => set({
		quickAddOpen: open,
		quickAddDefaultProject: defaultProject
	})
}));
var PROJECT_COLORS = [
	"#7C3AED",
	"#0EA5E9",
	"#10B981",
	"#F97316",
	"#EF4444",
	"#EAB308",
	"#EC4899",
	"#06B6D4",
	"#8B5CF6",
	"#64748B"
];
var PRIORITY_META = {
	p1: {
		label: "P1",
		color: "#EF4444"
	},
	p2: {
		label: "P2",
		color: "#F97316"
	},
	p3: {
		label: "P3",
		color: "#EAB308"
	},
	p4: {
		label: "P4",
		color: "#9CA3AF"
	}
};
var STATUSES = [
	"todo",
	"in_progress",
	"done"
];
var STATUS_LABEL = {
	todo: "Todo",
	in_progress: "In Progress",
	done: "Done"
};
//#endregion
export { useUI as a, STATUS_LABEL as i, PROJECT_COLORS as n, STATUSES as r, PRIORITY_META as t };
