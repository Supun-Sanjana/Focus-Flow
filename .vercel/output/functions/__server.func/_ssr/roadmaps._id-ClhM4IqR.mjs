import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { o as useQueryClient, r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Crosshair, F as ChevronLeft, I as Check, T as Frame, b as LayoutList, m as Maximize2, n as ZoomIn, p as Minimize2, t as ZoomOut, u as Plus, w as GripHorizontal, x as LayoutGrid } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as defaultPhase, l as updateRoadmap, o as roadmapQO, t as PHASE_ACCENTS } from "./roadmap-queries-DOINgKpp.mjs";
import { t as Route } from "./roadmaps._id-BBeB75rr.mjs";
import { n as STATUS_META, t as PhaseCard } from "./PhaseCard-Dm_HYwgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmaps._id-ClhM4IqR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CARD_W = 420;
var CARD_H_EST = 300;
var MIN_ZOOM = .3;
var MAX_ZOOM = 1.6;
var clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function RoadmapCanvas({ phases, onChangePhase, onDeletePhase, onAddPhase }) {
	const [scale, setScale] = (0, import_react.useState)(.85);
	const [offset, setOffset] = (0, import_react.useState)({
		x: 40,
		y: 40
	});
	const [fullscreen, setFullscreen] = (0, import_react.useState)(false);
	const [draggingId, setDraggingId] = (0, import_react.useState)(null);
	const [heights, setHeights] = (0, import_react.useState)({});
	const containerRef = (0, import_react.useRef)(null);
	const cardRefs = (0, import_react.useRef)({});
	const stateRef = (0, import_react.useRef)({
		scale,
		offset
	});
	stateRef.current = {
		scale,
		offset
	};
	const posOf = (0, import_react.useCallback)((p, i) => p.pos ?? {
		x: 40 + i % 3 * 540,
		y: 40 + Math.floor(i / 3) * 460
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		const ro = new ResizeObserver(() => {
			setHeights((prev) => {
				let changed = false;
				const next = { ...prev };
				for (const [id, el] of Object.entries(cardRefs.current)) {
					if (!el) continue;
					const h = el.offsetHeight;
					if (next[id] !== h) {
						next[id] = h;
						changed = true;
					}
				}
				return changed ? next : prev;
			});
		});
		for (const el of Object.values(cardRefs.current)) if (el) ro.observe(el);
		return () => ro.disconnect();
	}, [phases.length, phases.map((p) => p.columns.length).join(",")]);
	const startPan = (e) => {
		if (e.button !== 0) return;
		const s = {
			x: e.clientX,
			y: e.clientY,
			ox: stateRef.current.offset.x,
			oy: stateRef.current.offset.y
		};
		const onMove = (ev) => setOffset({
			x: s.ox + (ev.clientX - s.x),
			y: s.oy + (ev.clientY - s.y)
		});
		const onUp = () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	};
	const startCardDrag = (phase, i) => (e) => {
		if (e.button !== 0) return;
		e.stopPropagation();
		e.preventDefault();
		const p = posOf(phase, i);
		const { scale: sc, offset: off } = stateRef.current;
		const dx = e.clientX - (p.x * sc + off.x);
		const dy = e.clientY - (p.y * sc + off.y);
		setDraggingId(phase.id);
		const onMove = (ev) => {
			const { scale: s2, offset: o2 } = stateRef.current;
			onChangePhase(phase.id, { pos: {
				x: Math.max(0, (ev.clientX - dx - o2.x) / s2),
				y: Math.max(0, (ev.clientY - dy - o2.y) / s2)
			} });
		};
		const onUp = () => {
			setDraggingId(null);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
		};
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
	};
	(0, import_react.useEffect)(() => {
		const el = containerRef.current;
		if (!el) return;
		const onWheel = (e) => {
			e.preventDefault();
			const rect = el.getBoundingClientRect();
			const px = e.clientX - rect.left;
			const py = e.clientY - rect.top;
			const { scale: s, offset: o } = stateRef.current;
			const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
			const next = clamp(s * Math.exp(-dy * .0018), MIN_ZOOM, MAX_ZOOM);
			if (next === s) return;
			const k = next / s;
			setScale(next);
			setOffset({
				x: px - (px - o.x) * k,
				y: py - (py - o.y) * k
			});
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!fullscreen) return;
		const onKey = (e) => e.key === "Escape" && setFullscreen(false);
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [fullscreen]);
	const zoomAtCenter = (dir) => {
		const rect = containerRef.current?.getBoundingClientRect();
		const cx = (rect?.width ?? 800) / 2;
		const cy = (rect?.height ?? 600) / 2;
		const { scale: s, offset: o } = stateRef.current;
		const next = clamp(s * (dir === 1 ? 1.15 : 1 / 1.15), MIN_ZOOM, MAX_ZOOM);
		const k = next / s;
		setScale(next);
		setOffset({
			x: cx - (cx - o.x) * k,
			y: cy - (cy - o.y) * k
		});
	};
	const autoLayout = () => {
		phases.forEach((p, i) => onChangePhase(p.id, { pos: {
			x: 40 + i % 3 * 540,
			y: 40 + Math.floor(i / 3) * 460
		} }));
		resetView();
	};
	const resetView = () => {
		setOffset({
			x: 40,
			y: 40
		});
		setScale(.85);
	};
	const fitToView = () => {
		const el = containerRef.current;
		if (!el || phases.length === 0) return resetView();
		let maxX = 0;
		let maxY = 0;
		phases.forEach((p, i) => {
			const pos = posOf(p, i);
			maxX = Math.max(maxX, pos.x + CARD_W);
			maxY = Math.max(maxY, pos.y + (heights[p.id] ?? CARD_H_EST));
		});
		const s = clamp(Math.min((el.clientWidth - 80) / maxX, (el.clientHeight - 80) / maxY), MIN_ZOOM, 1);
		setScale(s);
		setOffset({
			x: 40,
			y: 40
		});
	};
	const btn = "p-1.5 rounded hover:bg-muted text-foreground/80";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: fullscreen ? "fixed inset-0 z-50 overflow-hidden bg-background" : "relative h-[calc(100vh-230px)] min-h-[460px] overflow-hidden rounded-xl border border-border bg-muted/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 top-3 z-20 flex items-center gap-1 rounded-lg border border-border bg-card/95 p-1 shadow-sm backdrop-blur",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => zoomAtCenter(-1),
						className: btn,
						"aria-label": "Zoom out",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "w-10 text-center text-[11px] tabular-nums text-muted-foreground",
						children: [Math.round(scale * 100), "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => zoomAtCenter(1),
						className: btn,
						"aria-label": "Zoom in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-4 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: autoLayout,
						className: btn,
						"aria-label": "Auto layout",
						title: "Auto layout",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: fitToView,
						className: btn,
						"aria-label": "Fit to view",
						title: "Fit to view",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFullscreen((f) => !f),
						className: btn,
						"aria-label": fullscreen ? "Exit full screen" : "Full screen",
						title: fullscreen ? "Exit full screen (Esc)" : "Full screen",
						children: fullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onAddPhase({
					x: (-offset.x + 80) / scale,
					y: (-offset.y + 80) / scale
				}),
				className: "absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-lg border border-border bg-card/95 px-2.5 py-1.5 text-[12px] font-medium shadow-sm backdrop-blur hover:bg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add phase"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				className: `h-full w-full touch-none ${draggingId ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"}`,
				style: {
					backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
					backgroundSize: `${24 * scale}px ${24 * scale}px`,
					backgroundPosition: `${offset.x}px ${offset.y}px`
				},
				onPointerDown: startPan,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative origin-top-left",
					style: { transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "pointer-events-none absolute inset-0 overflow-visible",
						width: 1,
						height: 1,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("marker", {
							id: "rm-arrow",
							viewBox: "0 0 10 10",
							refX: "8",
							refY: "5",
							markerWidth: "6",
							markerHeight: "6",
							orient: "auto-start-reverse",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 0 0 L 10 5 L 0 10 z",
								fill: "currentColor"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("marker", {
							id: "rm-arrow-done",
							viewBox: "0 0 10 10",
							refX: "8",
							refY: "5",
							markerWidth: "6",
							markerHeight: "6",
							orient: "auto-start-reverse",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 0 0 L 10 5 L 0 10 z",
								fill: STATUS_META.done.color
							})
						})] }), phases.slice(0, -1).map((p, i) => {
							const next = phases[i + 1];
							const a = posOf(p, i);
							const b = posOf(next, i + 1);
							const ha = heights[p.id] ?? CARD_H_EST;
							const hb = heights[next.id] ?? CARD_H_EST;
							const x1 = a.x + CARD_W;
							const y1 = a.y + ha / 2;
							const x2 = b.x;
							const y2 = b.y + hb / 2;
							const bend = Math.max(40, Math.abs(x2 - x1) / 2);
							const done = (p.status ?? "todo") === "done";
							const color = done ? STATUS_META.done.color : "hsl(var(--muted-foreground))";
							const mx = (x1 + x2) / 2;
							const my = (y1 + y2) / 2;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								style: { color },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
										fill: "none",
										stroke: color,
										strokeWidth: 2,
										strokeOpacity: done ? .9 : .45,
										strokeDasharray: done ? void 0 : "7 7",
										markerEnd: done ? "url(#rm-arrow-done)" : "url(#rm-arrow)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: x1,
										cy: y1,
										r: 4,
										fill: color
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: mx,
										cy: my,
										r: 3,
										fill: "hsl(var(--background))",
										stroke: color,
										strokeWidth: 1.5
									})
								]
							}, p.id);
						})]
					}), phases.map((phase, i) => {
						const p = posOf(phase, i);
						const status = phase.status ?? "todo";
						const isDragging = draggingId === phase.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: (el) => {
								cardRefs.current[phase.id] = el;
							},
							className: "absolute",
							style: {
								left: p.x,
								top: p.y,
								width: CARD_W,
								zIndex: isDragging ? 30 : 1,
								filter: isDragging ? "drop-shadow(0 12px 24px rgba(0,0,0,0.25))" : void 0
							},
							onPointerDown: (e) => e.stopPropagation(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(i + 1).padStart(2, "0") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onPointerDown: startCardDrag(phase, i),
										title: "Drag to move this phase",
										className: "flex flex-1 cursor-move items-center gap-1.5 rounded px-1 py-0.5 hover:bg-muted/70",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripHorizontal, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => onChangePhase(phase.id, { status: status === "done" ? "todo" : "done" }),
										className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] font-semibold tracking-normal",
										style: {
											borderColor: status === "done" ? `${STATUS_META.done.color}66` : "hsl(var(--border))",
											color: status === "done" ? STATUS_META.done.color : "hsl(var(--muted-foreground))",
											backgroundColor: status === "done" ? `${STATUS_META.done.color}1f` : "transparent"
										},
										title: "Mark phase complete",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-2.5 w-2.5" }), status === "done" ? "Completed" : "Mark complete"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseCard, {
								phase,
								index: i,
								total: phases.length,
								onChange: (patch) => onChangePhase(phase.id, patch),
								onDelete: () => onDeletePhase(phase.id),
								dragHandleProps: {
									onPointerDown: startCardDrag(phase, i),
									className: "cursor-move select-none"
								}
							})]
						}, phase.id);
					})]
				})
			}),
			fullscreen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card/95 px-3 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur",
				children: "Scroll to zoom · drag background to pan · Esc to exit full screen"
			})
		]
	});
}
function RoadmapDetail() {
	const { id } = Route.useParams();
	const { data: roadmap } = useSuspenseQuery(roadmapQO(id));
	const qc = useQueryClient();
	const [title, setTitle] = (0, import_react.useState)(roadmap.title);
	const [description, setDescription] = (0, import_react.useState)(roadmap.description ?? "");
	const [data, setData] = (0, import_react.useState)(roadmap.data ?? { phases: [] });
	const [saving, setSaving] = (0, import_react.useState)("idle");
	const [view, setView] = (0, import_react.useState)("canvas");
	const firstRun = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		if (firstRun.current) {
			firstRun.current = false;
			return;
		}
		setSaving("saving");
		const t = setTimeout(async () => {
			await updateRoadmap(id, {
				title,
				description,
				data
			});
			qc.setQueryData(["roadmap", id], (prev) => prev ? {
				...prev,
				title,
				description,
				data
			} : prev);
			qc.invalidateQueries({ queryKey: ["roadmaps"] });
			setSaving("saved");
			setTimeout(() => setSaving("idle"), 1200);
		}, 600);
		return () => clearTimeout(t);
	}, [
		title,
		description,
		data,
		id,
		qc
	]);
	const mutatePhases = (fn) => setData((d) => ({
		...d,
		phases: fn(d.phases)
	}));
	const addPhase = (pos) => mutatePhases((phases) => {
		const accent = PHASE_ACCENTS[phases.length % PHASE_ACCENTS.length];
		const p = defaultPhase(`Phase ${phases.length + 1}`, accent, phases.length);
		return [...phases, pos ? {
			...p,
			pos
		} : p];
	});
	const updatePhase = (pid, patch) => mutatePhases((phases) => phases.map((p) => p.id === pid ? {
		...p,
		...patch
	} : p));
	const removePhase = (pid) => mutatePhases((phases) => phases.filter((p) => p.id !== pid));
	const movePhase = (pid, dir) => mutatePhases((phases) => {
		const i = phases.findIndex((p) => p.id === pid);
		if (i < 0) return phases;
		const j = i + dir;
		if (j < 0 || j >= phases.length) return phases;
		const copy = [...phases];
		[copy[i], copy[j]] = [copy[j], copy[i]];
		return copy;
	});
	const doneCount = data.phases.filter((p) => (p.status ?? "todo") === "done").length;
	const current = data.phases.find((p) => (p.status ?? "todo") === "current");
	const pct = data.phases.length ? Math.round(doneCount / data.phases.length * 100) : 0;
	if (view === "canvas") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoadmapCanvas, {
		phases: data.phases,
		onChangePhase: updatePhase,
		onDeletePhase: removePhase,
		onAddPhase: (pos) => addPhase(pos),
		title,
		onTitleChange: setTitle,
		description,
		onDescriptionChange: setDescription,
		saving,
		view,
		onViewChange: setView
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-2 text-[12px] text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/roadmaps",
				className: "flex items-center gap-1 hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }), " Roadmaps"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ml-auto",
				children: [saving === "saving" && "Saving…", saving === "saved" && "Saved"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "w-full bg-transparent text-[26px] font-semibold tracking-tight outline-none placeholder:text-muted-foreground",
					placeholder: "Roadmap title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					placeholder: "Describe your goal, timeline, or context…",
					rows: 2,
					className: "mt-1 w-full resize-none bg-transparent text-[13px] text-muted-foreground outline-none placeholder:text-muted-foreground/60"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-1 rounded-lg border border-border p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setView("canvas"),
					className: `flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] font-medium ${view === "canvas" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, { className: "h-3.5 w-3.5" }), " Canvas"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setView("list"),
					className: `flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] font-medium ${view === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutList, { className: "h-3.5 w-3.5" }), " List"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-lg border border-border bg-card px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold",
							style: { color: STATUS_META.done.color },
							children: [
								doneCount,
								"/",
								data.phases.length,
								" phases done"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								"You are here:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: current ? current.title : doneCount === data.phases.length && data.phases.length ? "All phases complete 🎉" : "Not started"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto tabular-nums text-muted-foreground",
							children: [pct, "%"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-1.5 overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full transition-all",
						style: {
							width: `${pct}%`,
							backgroundColor: STATUS_META.done.color
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: data.phases.map((p, i) => {
						const s = p.status ?? "todo";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => updatePhase(p.id, { status: s === "done" ? "todo" : s === "current" ? "done" : "current" }),
							className: "rounded px-2 py-0.5 text-[10.5px] font-medium",
							style: {
								backgroundColor: `${STATUS_META[s].color}1f`,
								color: STATUS_META[s].color
							},
							title: "Click to advance status",
							children: [
								String(i + 1).padStart(2, "0"),
								" ",
								p.title
							]
						}, p.id);
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 space-y-4",
			children: [data.phases.map((phase, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseCard, {
				phase,
				index: idx,
				total: data.phases.length,
				onChange: (patch) => updatePhase(phase.id, patch),
				onDelete: () => removePhase(phase.id),
				onMove: (dir) => movePhase(phase.id, dir)
			}, phase.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => addPhase(),
				className: "w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-border text-[13px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add phase"]
			})]
		})
	] });
}
//#endregion
export { RoadmapDetail as component };
