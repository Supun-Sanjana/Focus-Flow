import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Map, Plus, Trash2, ArrowRight, MapIcon, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { format } from "date-fns";
import { roadmapsQO } from "../../lib/roadmap-queries";
import { createRoadmap, createRoadmapFromData, deleteRoadmap } from "../../lib/roadmap-api";
import { PageHeader } from "../../components/PageHeader";
import { parseRoadmapMarkdown } from "../../lib/roadmap-import";
import { STATUS_META } from "../../components/roadmap/PhaseCard";














export const Route = createFileRoute("/_authenticated/roadmaps/")({
  head: () => ({
    meta: [
      { title: "Roadmaps — Focus" },
      { name: "description", content: "Plan multi-phase goals on a roadmap canvas, or import one from a markdown file." },
      { property: "og:title", content: "Roadmaps — Focus" },
      { property: "og:description", content: "Plan multi-phase goals on a roadmap canvas, or import one from a markdown file." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(roadmapsQO),
  component: RoadmapsIndex,
});

function RoadmapsIndex() {
  const { data: roadmaps } = useSuspenseQuery(roadmapsQO);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const create = useMutation({
    mutationFn: (t: string) => createRoadmap({ title: t }),
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
      navigate({ to: "/roadmaps/$id", params: { id: row.id } });
    },
  });

  const importMd = useMutation({
    mutationFn: async (file: File) => {
      const text = await file.text();
      const parsed = parseRoadmapMarkdown(text);
      if (!parsed.data.phases.length) throw new Error("No phases found — use ## headings for phases.");
      const fallback = file.name.replace(/\.(md|markdown|txt)$/i, "");
      return createRoadmapFromData({
        title: parsed.title === "Imported roadmap" ? fallback || parsed.title : parsed.title,
        description: parsed.description,
        data: parsed.data,
      });
    },
    onSuccess: (row) => {
      setImportError(null);
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
      navigate({ to: "/roadmaps/$id", params: { id: row.id } });
    },
    onError: (e: any) => setImportError(e?.message ?? "Could not import that file."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRoadmap(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roadmaps"] }),
  });

  return (
    <div>
      <PageHeader
        title="Roadmaps"
        count={roadmaps.length}
        action={
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".md,.markdown,.txt,text/markdown,text/plain"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importMd.mutate(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importMd.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-[13px] font-medium hover:bg-muted disabled:opacity-60"
            >
              <Upload className="h-4 w-4" /> {importMd.isPending ? "Importing…" : "Import .md"}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-violet text-white text-[13px] font-medium"
            >
              <Plus className="h-4 w-4" /> New roadmap
            </button>
          </div>
        }
      />

      {importError && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive">
          {importError}
        </div>
      )}

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            create.mutate(title.trim());
            setTitle("");
            setOpen(false);
          }}
          className="mb-5 flex gap-2 rounded-lg border border-border bg-card p-3"
        >
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Learn Linux for DevOps"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
          />
          <button className="px-3 py-1 text-[13px] rounded-md bg-foreground text-background">Create</button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-1 text-[13px] rounded-md text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
        </form>
      )}

      {roadmaps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <MapIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No roadmaps yet. Create one, or import a markdown file.
          </p>
          <pre className="mx-auto mt-4 w-fit rounded-md bg-muted px-4 py-3 text-left text-[11px] leading-relaxed text-muted-foreground">
{`# My roadmap
## Phase 1 — Foundations (done)
*Weeks 1-2 · ~7 hrs*
### Topics
- Files & navigation \`ls\` \`cd\` \`pwd\`
### Why it matters
- Everything else builds on this`}
          </pre>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {roadmaps.map((r) => {
            const phases = r.data?.phases ?? [];
            const phaseCount = phases.length;
            const doneCount = phases.filter((p) => (p.status ?? "todo") === "done").length;
            const current = phases.find((p) => (p.status ?? "todo") === "current");
            const itemCount = phases.reduce((n, p) => n + p.columns.reduce((m, c) => m + c.items.length, 0), 0);
            const pct = phaseCount ? Math.round((doneCount / phaseCount) * 100) : 0;
            return (
              <div key={r.id} className="group relative rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                <Link to="/roadmaps/$id" params={{ id: r.id }} className="block">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center">
                      <MapIcon className="h-4 w-4 text-accent-violet" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold">{r.title}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {phaseCount} phase{phaseCount === 1 ? "" : "s"} · {itemCount} item{itemCount === 1 ? "" : "s"} · updated {format(new Date(r.updated_at), "MMM d")}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: STATUS_META.done.color }} />
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                    <span style={{ color: STATUS_META.done.color }}>{doneCount}/{phaseCount} done</span>
                    {current && (
                      <span className="truncate text-muted-foreground">· now: {current.title}</span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete roadmap "${r.title}"?`)) remove.mutate(r.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
