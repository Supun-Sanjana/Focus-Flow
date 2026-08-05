import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as projectsQO, f as useTaskMutations, s as tasksQO } from "./queries-CbT8XRDi.mjs";
import { t as PageHeader } from "./PageHeader-BpzNKZ4U.mjs";
import { n as PROJECT_COLORS } from "./store-K6GGHyA2.mjs";
import { O as Eye, R as CalendarPlus, i as X, k as EyeOff, o as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { f as startOfWeek, m as addDays, s as format } from "../_libs/date-fns.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useScheduleBlockMutations, i as scheduleRulesQO, n as blockRange, o as useScheduleRuleMutations, r as scheduleBlocksQO, t as DAYS } from "./schedule-queries-ChbbeOIA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/weekly-B16di0hT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Weekly() {
	const { data: blocks } = useSuspenseQuery(scheduleBlocksQO);
	const { data: rules } = useSuspenseQuery(scheduleRulesQO);
	const { data: projects } = useSuspenseQuery(projectsQO);
	const { data: tasks } = useSuspenseQuery(tasksQO);
	const blockM = useScheduleBlockMutations();
	const ruleM = useScheduleRuleMutations();
	const taskM = useTaskMutations();
	const [addingDay, setAddingDay] = (0, import_react.useState)(null);
	const [ruleText, setRuleText] = (0, import_react.useState)("");
	const [weekOffset, setWeekOffset] = (0, import_react.useState)(0);
	const weekStart = addDays(startOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 }), weekOffset * 7);
	const generateWeek = async () => {
		const active = blocks.filter((b) => b.is_active);
		if (active.length === 0) {
			toast.error("Add some blocks first");
			return;
		}
		let created = 0;
		for (const b of active) {
			const date = format(addDays(weekStart, b.day_of_week - 1), "yyyy-MM-dd");
			if (tasks.some((t) => t.due_date === date && t.title === b.title)) continue;
			await taskM.create.mutateAsync({
				title: b.title,
				description: b.details ?? null,
				due_date: date,
				project_id: b.project_id ?? null,
				is_recurring: true,
				recur_pattern: "weekly"
			});
			created++;
		}
		toast.success(created > 0 ? `Added ${created} task${created > 1 ? "s" : ""} for week of ${format(weekStart, "MMM d")}` : "This week is already planned");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Weekly Schedule",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: weekOffset,
					onChange: (e) => setWeekOffset(Number(e.target.value)),
					className: "text-[12px] rounded-md border border-border bg-background px-2 py-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 0,
							children: "This week"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 1,
							children: "Next week"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 2,
							children: "In 2 weeks"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: generateWeek,
					className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-accent-violet text-white text-[12px] font-medium hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-3.5 w-3.5" }), "Add to calendar"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[12px] text-muted-foreground -mt-2 mb-4",
			children: [
				"This is your repeating routine. Blocks stay here every week — press",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Add to calendar"
				}),
				" to turn them into dated tasks that show up in Today and Monthly."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2 md:grid-cols-4 xl:grid-cols-7",
			children: DAYS.map((d) => {
				const dayBlocks = blocks.filter((b) => b.day_of_week === d.value);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2 px-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold uppercase tracking-wider",
								children: d.short
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setAddingDay(addingDay === d.value ? null : d.value),
								className: "text-muted-foreground hover:text-foreground",
								"aria-label": `Add block on ${d.label}`,
								children: addingDay === d.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
							})]
						}),
						addingDay === d.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewBlockForm, {
							onCancel: () => setAddingDay(null),
							onSubmit: async (input) => {
								await blockM.create.mutateAsync({
									day_of_week: d.value,
									...input
								});
								setAddingDay(null);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [dayBlocks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockCard, {
								block: b,
								projectName: projects.find((p) => p.id === b.project_id)?.name,
								onToggle: () => blockM.update.mutate({
									id: b.id,
									patch: { is_active: !b.is_active }
								}),
								onDelete: () => blockM.remove.mutate(b.id)
							}, b.id)), dayBlocks.length === 0 && addingDay !== d.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground px-1 py-2",
								children: "Free"
							})]
						})
					]
				}, d.value);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 bg-card border border-border rounded-lg p-4 max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-semibold uppercase tracking-wider mb-3",
					children: "Non-negotiables"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-1.5 mb-3",
					children: [rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2 text-[13px] group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-accent-violet mt-0.5",
								children: "→"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1",
								children: r.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => ruleM.remove.mutate(r.id),
								className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive",
								"aria-label": "Delete rule",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					}, r.id)), rules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-[12px] text-muted-foreground",
						children: "Add the rules that protect this schedule."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						if (!ruleText.trim()) return;
						ruleM.create.mutate({
							text: ruleText.trim(),
							order_index: rules.length
						});
						setRuleText("");
					},
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: ruleText,
						onChange: (e) => setRuleText(e.target.value),
						placeholder: "e.g. AWS 30 min every single day — no skip",
						className: "flex-1 text-[13px] rounded-md border border-border bg-background px-2.5 py-1.5"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "px-2.5 py-1.5 rounded-md border border-border text-[12px] hover:bg-muted",
						children: "Add"
					})]
				})
			]
		})
	] });
}
function BlockCard({ block, projectName, onToggle, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `group rounded-md border p-2 ${block.is_active ? "" : "opacity-50"}`,
		style: {
			borderColor: `${block.color}55`,
			backgroundColor: `${block.color}12`
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted-foreground",
						children: blockRange(block)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] font-medium leading-snug",
						style: { color: block.color },
						children: block.title
					}),
					block.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted-foreground mt-0.5 leading-snug",
						children: block.details
					}),
					projectName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted-foreground mt-0.5",
						children: projectName
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 opacity-0 group-hover:opacity-100",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onToggle,
					"aria-label": "Toggle block",
					className: "text-muted-foreground hover:text-foreground",
					children: block.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onDelete,
					"aria-label": "Delete block",
					className: "text-muted-foreground hover:text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
				})]
			})]
		})
	});
}
function NewBlockForm({ onSubmit, onCancel }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [start, setStart] = (0, import_react.useState)("20:00");
	const [end, setEnd] = (0, import_react.useState)("20:30");
	const [details, setDetails] = (0, import_react.useState)("");
	const [color, setColor] = (0, import_react.useState)(PROJECT_COLORS[0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			if (!title.trim()) return;
			onSubmit({
				title: title.trim(),
				start_time: start,
				end_time: end || null,
				details: details.trim() || null,
				color
			});
		},
		className: "mb-2 space-y-1.5 rounded-md border border-border p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				autoFocus: true,
				value: title,
				onChange: (e) => setTitle(e.target.value),
				placeholder: "Block title",
				className: "w-full text-[12px] rounded border border-border bg-background px-2 py-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "time",
					value: start,
					onChange: (e) => setStart(e.target.value),
					className: "flex-1 text-[11px] rounded border border-border bg-background px-1.5 py-1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "time",
					value: end,
					onChange: (e) => setEnd(e.target.value),
					className: "flex-1 text-[11px] rounded border border-border bg-background px-1.5 py-1"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: details,
				onChange: (e) => setDetails(e.target.value),
				placeholder: "Notes (optional)",
				className: "w-full text-[11px] rounded border border-border bg-background px-2 py-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1",
				children: PROJECT_COLORS.slice(0, 8).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setColor(c),
					"aria-label": `Color ${c}`,
					className: `h-3.5 w-3.5 rounded-full ${color === c ? "ring-2 ring-offset-1 ring-foreground/40" : ""}`,
					style: { backgroundColor: c }
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "flex-1 text-[11px] rounded bg-accent-violet text-white py-1 hover:opacity-90",
					children: "Save"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onCancel,
					className: "px-2 text-[11px] rounded border border-border hover:bg-muted",
					children: "Cancel"
				})]
			})
		]
	});
}
//#endregion
export { Weekly as component };
