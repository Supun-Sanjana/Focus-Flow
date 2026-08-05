import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ChevronLeft, Plus, Trash2, GripVertical, Palette, X, LayoutList, Frame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { roadmapQO } from "../../lib/roadmap-queries";
import { defaultPhase, PHASE_ACCENTS, uid, updateRoadmap, type RoadmapData, type RoadmapItem, type RoadmapPhase } from "../../lib/roadmap-api";
import { PhaseCard, STATUS_META } from "../../components/roadmap/PhaseCard";
import { RoadmapCanvas } from "../../components/roadmap/RoadmapCanvas";










export const Route = createFileRoute("/_authenticated/roadmaps/$id")({
  head: () => ({
    meta: [
      { title: "Roadmap canvas — Focus" },
      { name: "description", content: "Plan a goal on a phase-by-phase roadmap canvas with progress tracking." },
      { property: "og:title", content: "Roadmap canvas — Focus" },
      { property: "og:description", content: "Drag phases on a canvas and track what's done, in progress and upcoming." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(roadmapQO(params.id)),
  component: RoadmapDetail,
});

function RoadmapDetail() {
  const { id } = Route.useParams();
  const { data: roadmap } = useSuspenseQuery(roadmapQO(id));
  const qc = useQueryClient();

  const [title, setTitle] = useState(roadmap.title);
  const [description, setDescription] = useState(roadmap.description ?? "");
  const [data, setData] = useState<RoadmapData>(roadmap.data ?? { phases: [] });
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [view, setView] = useState<"canvas" | "list">("canvas");
  const firstRun = useRef(true);

  // Auto-save (debounced)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSaving("saving");
    const t = setTimeout(async () => {
      await updateRoadmap(id, { title, description, data } as any);
      qc.setQueryData(["roadmap", id], (prev: any) => (prev ? { ...prev, title, description, data } : prev));
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1200);
    }, 600);
    return () => clearTimeout(t);
  }, [title, description, data, id, qc]);

  const mutatePhases = (fn: (phases: RoadmapPhase[]) => RoadmapPhase[]) =>
    setData((d) => ({ ...d, phases: fn(d.phases) }));

  const addPhase = (pos?: { x: number; y: number }) =>
    mutatePhases((phases) => {
      const accent = PHASE_ACCENTS[phases.length % PHASE_ACCENTS.length];
      const p = defaultPhase(`Phase ${phases.length + 1}`, accent, phases.length);
      return [...phases, pos ? { ...p, pos } : p];
    });

  const updatePhase = (pid: string, patch: Partial<RoadmapPhase>) =>
    mutatePhases((phases) => phases.map((p) => (p.id === pid ? { ...p, ...patch } : p)));

  const removePhase = (pid: string) => mutatePhases((phases) => phases.filter((p) => p.id !== pid));

  const movePhase = (pid: string, dir: -1 | 1) =>
    mutatePhases((phases) => {
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
  const pct = data.phases.length ? Math.round((doneCount / data.phases.length) * 100) : 0;

  if (view === "canvas") {
    return (
      <RoadmapCanvas
        phases={data.phases}
        onChangePhase={updatePhase}
        onDeletePhase={removePhase}
        onAddPhase={(pos) => addPhase(pos)}
        title={title}
        onTitleChange={setTitle}
        description={description}
        onDescriptionChange={setDescription}
        saving={saving}
        view={view}
        onViewChange={setView}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-[12px] text-muted-foreground">
        <Link to="/roadmaps" className="flex items-center gap-1 hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" /> Roadmaps
        </Link>
        <span className="ml-auto">
          {saving === "saving" && "Saving…"}
          {saving === "saved" && "Saved"}
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-[26px] font-semibold tracking-tight outline-none placeholder:text-muted-foreground"
            placeholder="Roadmap title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal, timeline, or context…"
            rows={2}
            className="mt-1 w-full resize-none bg-transparent text-[13px] text-muted-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border p-1">
          <button
            onClick={() => setView("canvas")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] font-medium ${view === "canvas" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
          >
            <Frame className="h-3.5 w-3.5" /> Canvas
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] font-medium ${view === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
          >
            <LayoutList className="h-3.5 w-3.5" /> List
          </button>
        </div>
      </div>

      {/* Progress / current place */}
      <div className="mt-4 rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
          <span className="font-semibold" style={{ color: STATUS_META.done.color }}>
            {doneCount}/{data.phases.length} phases done
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            You are here:{" "}
            <span className="font-medium text-foreground">
              {current ? current.title : doneCount === data.phases.length && data.phases.length ? "All phases complete 🎉" : "Not started"}
            </span>
          </span>
          <span className="ml-auto tabular-nums text-muted-foreground">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: STATUS_META.done.color }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {data.phases.map((p, i) => {
            const s = p.status ?? "todo";
            return (
              <button
                key={p.id}
                onClick={() =>
                  updatePhase(p.id, { status: s === "done" ? "todo" : s === "current" ? "done" : "current" })
                }
                className="rounded px-2 py-0.5 text-[10.5px] font-medium"
                style={{ backgroundColor: `${STATUS_META[s].color}1f`, color: STATUS_META[s].color }}
                title="Click to advance status"
              >
                {String(i + 1).padStart(2, "0")} {p.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {data.phases.map((phase, idx) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            index={idx}
            total={data.phases.length}
            onChange={(patch) => updatePhase(phase.id, patch)}
            onDelete={() => removePhase(phase.id)}
            onMove={(dir) => movePhase(phase.id, dir)}
          />
        ))}
        <button
          onClick={() => addPhase()}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-border text-[13px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add phase
        </button>
      </div>
    </div>
  );
}
