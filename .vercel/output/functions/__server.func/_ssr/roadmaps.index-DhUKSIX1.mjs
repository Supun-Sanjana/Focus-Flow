import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { o as useQueryClient, r as useSuspenseQuery, s as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as PageHeader } from "./PageHeader-BpzNKZ4U.mjs";
import { H as ArrowRight, a as Upload, h as Map, o as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { s as format } from "../_libs/date-fns.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as deleteRoadmap, n as createRoadmap, r as createRoadmapFromData, s as roadmapsQO } from "./roadmap-queries-DOINgKpp.mjs";
import { n as STATUS_META } from "./PhaseCard-Dm_HYwgQ.mjs";
import { t as parseRoadmapMarkdown } from "./roadmap-import-7Ltes41q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmaps.index-DhUKSIX1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoadmapsIndex() {
	const { data: roadmaps } = useSuspenseQuery(roadmapsQO);
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [title, setTitle] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [importError, setImportError] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const create = useMutation({
		mutationFn: (t) => createRoadmap({ title: t }),
		onSuccess: (row) => {
			qc.invalidateQueries({ queryKey: ["roadmaps"] });
			navigate({
				to: "/roadmaps/$id",
				params: { id: row.id }
			});
		}
	});
	const importMd = useMutation({
		mutationFn: async (file) => {
			const parsed = parseRoadmapMarkdown(await file.text());
			if (!parsed.data.phases.length) throw new Error("No phases found — use ## headings for phases.");
			const fallback = file.name.replace(/\.(md|markdown|txt)$/i, "");
			return createRoadmapFromData({
				title: parsed.title === "Imported roadmap" ? fallback || parsed.title : parsed.title,
				description: parsed.description,
				data: parsed.data
			});
		},
		onSuccess: (row) => {
			setImportError(null);
			qc.invalidateQueries({ queryKey: ["roadmaps"] });
			navigate({
				to: "/roadmaps/$id",
				params: { id: row.id }
			});
		},
		onError: (e) => setImportError(e?.message ?? "Could not import that file.")
	});
	const remove = useMutation({
		mutationFn: (id) => deleteRoadmap(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["roadmaps"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Roadmaps",
			count: roadmaps.length,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: ".md,.markdown,.txt,text/markdown,text/plain",
						className: "hidden",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) importMd.mutate(f);
							e.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => fileRef.current?.click(),
						disabled: importMd.isPending,
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-[13px] font-medium hover:bg-muted disabled:opacity-60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
							" ",
							importMd.isPending ? "Importing…" : "Import .md"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpen(true),
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-violet text-white text-[13px] font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New roadmap"]
					})
				]
			})
		}),
		importError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive",
			children: importError
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				if (!title.trim()) return;
				create.mutate(title.trim());
				setTitle("");
				setOpen(false);
			},
			className: "mb-5 flex gap-2 rounded-lg border border-border bg-card p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "e.g. Learn Linux for DevOps",
					className: "flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "px-3 py-1 text-[13px] rounded-md bg-foreground text-background",
					children: "Create"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(false),
					className: "px-3 py-1 text-[13px] rounded-md text-muted-foreground hover:bg-muted",
					children: "Cancel"
				})
			]
		}),
		roadmaps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-dashed border-border py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "No roadmaps yet. Create one, or import a markdown file."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mx-auto mt-4 w-fit rounded-md bg-muted px-4 py-3 text-left text-[11px] leading-relaxed text-muted-foreground",
					children: `# My roadmap
## Phase 1 — Foundations (done)
*Weeks 1-2 · ~7 hrs*
### Topics
- Files & navigation \`ls\` \`cd\` \`pwd\`
### Why it matters
- Everything else builds on this`
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: roadmaps.map((r) => {
				const phases = r.data?.phases ?? [];
				const phaseCount = phases.length;
				const doneCount = phases.filter((p) => (p.status ?? "todo") === "done").length;
				const current = phases.find((p) => (p.status ?? "todo") === "current");
				const itemCount = phases.reduce((n, p) => n + p.columns.reduce((m, c) => m + c.items.length, 0), 0);
				const pct = phaseCount ? Math.round(doneCount / phaseCount * 100) : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/roadmaps/$id",
						params: { id: r.id },
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-md bg-accent flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "h-4 w-4 text-accent-violet" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-[14px] font-semibold",
											children: r.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												phaseCount,
												" phase",
												phaseCount === 1 ? "" : "s",
												" · ",
												itemCount,
												" item",
												itemCount === 1 ? "" : "s",
												" · updated ",
												format(new Date(r.updated_at), "MMM d")
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-1.5 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full",
									style: {
										width: `${pct}%`,
										backgroundColor: STATUS_META.done.color
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex items-center gap-2 text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: { color: STATUS_META.done.color },
									children: [
										doneCount,
										"/",
										phaseCount,
										" done"
									]
								}), current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate text-muted-foreground",
									children: ["· now: ", current.title]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (confirm(`Delete roadmap "${r.title}"?`)) remove.mutate(r.id);
						},
						className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted",
						"aria-label": "Delete",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-muted-foreground" })
					})]
				}, r.id);
			})
		})
	] });
}
//#endregion
export { RoadmapsIndex as component };
