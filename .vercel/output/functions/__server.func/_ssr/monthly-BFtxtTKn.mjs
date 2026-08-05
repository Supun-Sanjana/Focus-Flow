import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as projectsQO, f as useTaskMutations, s as tasksQO } from "./queries-CbT8XRDi.mjs";
import { t as PageHeader } from "./PageHeader-BpzNKZ4U.mjs";
import { a as useUI, t as PRIORITY_META } from "./store-K6GGHyA2.mjs";
import { F as ChevronLeft, P as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as isSameMonth, c as endOfWeek, d as isSameDay, f as startOfWeek, i as isToday, l as startOfMonth, m as addDays, n as parseISO, p as addMonths, s as format, t as subMonths, u as endOfMonth } from "../_libs/date-fns.mjs";
import { n as useDraggable, r as useDroppable, t as DndContext } from "../_libs/@dnd-kit/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/monthly-BFtxtTKn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Monthly() {
	const { data: tasks } = useSuspenseQuery(tasksQO);
	const { data: projects } = useSuspenseQuery(projectsQO);
	const { update } = useTaskMutations();
	const [cursor, setCursor] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const monthStart = startOfMonth(cursor);
	const monthEnd = endOfMonth(cursor);
	const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
	const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
	const days = [];
	for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);
	const unscheduled = tasks.filter((t) => !t.due_date && t.status !== "done");
	const onDragEnd = (e) => {
		const taskId = e.active.id;
		const dayIso = e.over?.id;
		if (!dayIso) return;
		update.mutate({
			id: taskId,
			patch: { due_date: dayIso === "unscheduled" ? null : dayIso }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-none -mx-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Monthly",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCursor(subMonths(cursor, 1)),
						className: "p-1.5 rounded-md hover:bg-muted text-muted-foreground",
						"aria-label": "Previous month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-medium min-w-[110px] text-center",
						children: format(cursor, "MMMM yyyy")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCursor(addMonths(cursor, 1)),
						className: "p-1.5 rounded-md hover:bg-muted text-muted-foreground",
						"aria-label": "Next month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCursor(/* @__PURE__ */ new Date()),
						className: "ml-1 px-2 py-1 text-[12px] rounded-md border border-border hover:bg-muted",
						children: "Today"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
			onDragEnd,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-1 mb-1",
						children: [
							"Mon",
							"Tue",
							"Wed",
							"Thu",
							"Fri",
							"Sat",
							"Sun"
						].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1",
							children: d
						}, d))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-1",
						children: days.map((d) => {
							const iso = format(d, "yyyy-MM-dd");
							const dayTasks = tasks.filter((t) => t.due_date && isSameDay(parseISO(t.due_date), d));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayCell, {
								id: iso,
								date: d,
								inMonth: isSameMonth(d, cursor),
								tasks: dayTasks,
								projects
							}, iso);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnscheduledColumn, {
					tasks: unscheduled,
					projects
				})]
			})
		})]
	});
}
function DayCell({ id, date, inMonth, tasks, projects }) {
	const { setNodeRef, isOver } = useDroppable({ id });
	const today = isToday(date);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		className: `min-h-[200px] rounded-md border p-1.5 transition-colors ${isOver ? "border-accent-violet bg-accent/40" : today ? "border-accent-violet bg-card" : "border-border bg-card"} ${inMonth ? "" : "opacity-50"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `text-[11px] font-semibold ${today ? "text-accent-violet" : inMonth ? "" : "text-muted-foreground"}`,
				children: format(date, "d")
			}), tasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[9px] text-muted-foreground",
				children: tasks.length
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [tasks.slice(0, 6).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraggableCard, {
				task: t,
				projects,
				compact: true
			}, t.id)), tasks.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[10px] text-muted-foreground px-1",
				children: [
					"+",
					tasks.length - 6,
					" more"
				]
			})]
		})]
	});
}
function UnscheduledColumn({ tasks, projects }) {
	const { setNodeRef, isOver } = useDroppable({ id: "unscheduled" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		className: `w-[220px] shrink-0 bg-card border rounded-lg p-2 min-h-[400px] transition-colors ${isOver ? "border-accent-violet bg-accent/40" : "border-border"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-1 pb-2 border-b border-border mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold",
				children: "Unscheduled"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] text-muted-foreground",
				children: tasks.length
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-1.5",
			children: tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraggableCard, {
				task: t,
				projects
			}, t.id))
		})]
	});
}
function DraggableCard({ task, projects, compact = false }) {
	const setSelected = useUI((s) => s.setSelectedTask);
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
	const project = projects.find((p) => p.id === task.project_id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		...attributes,
		...listeners,
		onClick: () => setSelected(task.id),
		style: transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : void 0,
		className: `bg-background border border-border rounded ${compact ? "px-1.5 py-0.5" : "p-2"} text-[11px] cursor-grab active:cursor-grabbing hover:border-accent-violet ${isDragging ? "opacity-50" : ""} ${task.status === "done" ? "line-through opacity-60" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-1.5 w-1.5 rounded-full shrink-0",
				style: { backgroundColor: PRIORITY_META[task.priority].color }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: task.title
			})]
		}), !compact && project && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1 text-[10px] text-muted-foreground mt-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-1.5 w-1.5 rounded-full",
				style: { backgroundColor: project.color }
			}), project.name]
		})]
	});
}
//#endregion
export { Monthly as component };
