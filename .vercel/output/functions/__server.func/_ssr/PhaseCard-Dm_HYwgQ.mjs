import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as GripVertical, I as Check, M as Circle, d as Play, f as Palette, i as X, o as Trash2 } from "../_libs/lucide-react.mjs";
import { c as uid, t as PHASE_ACCENTS } from "./roadmap-queries-DOINgKpp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PhaseCard-Dm_HYwgQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_META = {
	done: {
		label: "Done",
		color: "#10B981"
	},
	current: {
		label: "In progress",
		color: "#F59E0B"
	},
	todo: {
		label: "Upcoming",
		color: "#94A3B8"
	}
};
function StatusBadge({ status, onChange }) {
	const order = [
		"todo",
		"current",
		"done"
	];
	const meta = STATUS_META[status];
	const Icon = status === "done" ? Check : status === "current" ? Play : Circle;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onChange?.(order[(order.indexOf(status) + 1) % order.length]),
		title: "Change phase status",
		className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
		style: {
			backgroundColor: `${meta.color}22`,
			color: meta.color
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-2.5 w-2.5" }),
			" ",
			meta.label
		]
	});
}
function PhaseCard({ phase, index, total, onChange, onDelete, onMove, dragHandleProps }) {
	const [showPalette, setShowPalette] = (0, import_react.useState)(false);
	const status = phase.status ?? "todo";
	const isDone = status === "done";
	const isCurrent = status === "current";
	const statusColor = STATUS_META[status].color;
	const updateColumn = (cid, patch) => onChange({ columns: phase.columns.map((c) => c.id === cid ? {
		...c,
		...patch
	} : c) });
	const addItem = (cid, text) => {
		if (!text.trim()) return;
		const item = {
			id: uid(),
			text: text.trim()
		};
		onChange({ columns: phase.columns.map((c) => c.id === cid ? {
			...c,
			items: [...c.items, item]
		} : c) });
	};
	const removeItem = (cid, iid) => onChange({ columns: phase.columns.map((c) => c.id === cid ? {
		...c,
		items: c.items.filter((i) => i.id !== iid)
	} : c) });
	const updateItem = (cid, iid, patch) => onChange({ columns: phase.columns.map((c) => c.id === cid ? {
		...c,
		items: c.items.map((i) => i.id === iid ? {
			...i,
			...patch
		} : i)
	} : c) });
	const accent = isDone ? STATUS_META.done.color : phase.accent;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card overflow-hidden transition-all duration-200",
		style: {
			borderColor: isDone || isCurrent ? `${statusColor}66` : `${phase.accent}33`,
			boxShadow: isCurrent ? `0 0 0 3px ${statusColor}22` : isDone ? `0 0 0 3px ${statusColor}1a` : void 0
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			...dragHandleProps,
			className: "flex flex-col gap-2 px-4 py-3 border-b",
			style: {
				background: isDone ? `linear-gradient(90deg, ${statusColor}26, transparent)` : `linear-gradient(90deg, ${phase.accent}18, transparent)`,
				borderColor: `${accent}33`
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-2.5 w-2.5 rounded-full shrink-0 shadow-sm",
						style: { backgroundColor: accent }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: phase.title,
						onChange: (e) => onChange({ title: e.target.value }),
						onPointerDown: (e) => e.stopPropagation(),
						className: "bg-transparent text-[15px] font-bold tracking-tight outline-none min-w-0 flex-1 w-full",
						style: { color: accent }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-0.5 shrink-0",
						onPointerDown: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowPalette((s) => !s),
									className: "p-1 rounded hover:bg-muted text-muted-foreground transition-colors",
									"aria-label": "Change color",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-3.5 w-3.5" })
								}), showPalette && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-0 top-7 z-20 flex gap-1 p-1.5 rounded-md border border-border bg-popover shadow-md",
									children: PHASE_ACCENTS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											onChange({ accent: c });
											setShowPalette(false);
										},
										className: "h-4 w-4 rounded-full ring-1 ring-black/10 transition-transform hover:scale-110",
										style: { backgroundColor: c }
									}, c))
								})]
							}),
							onMove && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onMove(-1),
								disabled: index === 0,
								className: "p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors",
								"aria-label": "Move up",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-3.5 w-3.5 rotate-90" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onMove(1),
								disabled: index === total - 1,
								className: "p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors",
								"aria-label": "Move down",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-3.5 w-3.5 -rotate-90" })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (confirm(`Delete ${phase.title}?`)) onDelete();
								},
								className: "p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors",
								"aria-label": "Delete phase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 w-full pl-5",
				onPointerDown: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
					status,
					onChange: (s) => onChange({ status: s })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: phase.meta ?? "",
					onChange: (e) => onChange({ meta: e.target.value }),
					placeholder: "Weeks 1-2 · ~7 hrs",
					className: "bg-transparent text-[11.5px] font-medium text-muted-foreground/80 outline-none text-right flex-1 min-w-0 placeholder:text-muted-foreground/40 focus:text-foreground transition-colors"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `grid divide-y md:divide-y-0 md:divide-x divide-border w-full ${phase.columns.length === 1 ? "grid-cols-1" : phase.columns.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`,
			style: isDone ? { backgroundColor: `${STATUS_META.done.color}0d` } : void 0,
			children: phase.columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColumnView, {
				column: col,
				onTitleChange: (title) => updateColumn(col.id, { title }),
				onAdd: (text) => addItem(col.id, text),
				onRemove: (iid) => removeItem(col.id, iid),
				onUpdate: (iid, patch) => updateItem(col.id, iid, patch)
			}, col.id))
		})]
	});
}
function ColumnView({ column, onTitleChange, onAdd, onRemove, onUpdate }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-3.5 w-full flex flex-col min-w-0",
		onPointerDown: (e) => e.stopPropagation(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: column.title,
				onChange: (e) => onTitleChange(e.target.value),
				className: "w-full bg-transparent text-[11px] font-bold uppercase tracking-wider text-muted-foreground outline-none mb-2.5 block"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-1.5 flex-1 w-full min-w-0",
				children: column.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemRow, {
					item,
					onChange: (patch) => onUpdate(item.id, patch),
					onRemove: () => onRemove(item.id)
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					onAdd(draft);
					setDraft("");
				},
				className: "mt-2.5 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "+ Add item",
					className: "w-full bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground/60 py-1 border-b border-transparent focus:border-border transition-colors"
				})
			})
		]
	});
}
function AutoGrowTextarea({ value, onChange, className }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const el = ref.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		ref,
		value,
		onChange: (e) => onChange(e.target.value),
		rows: 1,
		className: `resize-none overflow-hidden whitespace-pre-wrap break-words leading-snug ${className ?? ""}`
	});
}
function ItemRow({ item, onChange, onRemove }) {
	const [chipDraft, setChipDraft] = (0, import_react.useState)("");
	const [addingChip, setAddingChip] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/50 w-full transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 h-1.5 w-1.5 rounded-full shrink-0 bg-muted-foreground/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0 pr-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoGrowTextarea, {
					value: item.text,
					onChange: (text) => onChange({ text }),
					className: "w-full bg-transparent text-[13px] outline-none leading-relaxed text-foreground/90 font-normal"
				}), (item.chips?.length || addingChip) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex flex-wrap gap-1",
					children: [item.chips?.map((chip, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "group/chip inline-flex items-center gap-1 rounded bg-muted/80 px-1.5 py-0.5 text-[10.5px] font-mono text-foreground/80 border border-border/50",
						children: [chip, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onChange({ chips: item.chips?.filter((_, idx) => idx !== i) }),
							className: "opacity-0 group-hover/chip:opacity-100 text-muted-foreground hover:text-foreground transition-opacity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-2.5 w-2.5" })
						})]
					}, i)), addingChip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							if (chipDraft.trim()) {
								onChange({ chips: [...item.chips ?? [], chipDraft.trim()] });
								setChipDraft("");
							}
							setAddingChip(false);
						},
						className: "inline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: chipDraft,
							onChange: (e) => setChipDraft(e.target.value),
							onBlur: () => {
								if (chipDraft.trim()) onChange({ chips: [...item.chips ?? [], chipDraft.trim()] });
								setChipDraft("");
								setAddingChip(false);
							},
							placeholder: "chip",
							className: "w-16 rounded bg-muted px-1.5 py-0.5 text-[10.5px] font-mono outline-none border border-border"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-1 top-1 flex items-center gap-1 rounded-md bg-card border border-border/70 px-1.5 py-0.5 opacity-0 shadow-sm group-hover:opacity-100 transition-opacity",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setAddingChip(true),
					className: "text-[10.5px] font-medium text-muted-foreground hover:text-foreground transition-colors",
					title: "Add tag",
					children: "+tag"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onRemove,
					className: "text-muted-foreground hover:text-destructive transition-colors pl-0.5",
					"aria-label": "Remove",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
				})]
			})
		]
	});
}
//#endregion
export { STATUS_META as n, PhaseCard as t };
