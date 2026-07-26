import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ChevronLeft, Plus, Trash2, GripVertical, Palette, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { roadmapQO } from "../../lib/roadmap-queries";
import { defaultPhase, PHASE_ACCENTS, uid, updateRoadmap, type RoadmapData, type RoadmapItem, type RoadmapPhase } from "../../lib/roadmap-api";

export const Route = createFileRoute("/_authenticated/roadmaps/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Roadmap — Focus` },
      { name: "description", content: `Roadmap ${params.id}` },
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

  const addPhase = () => {
    const accent = PHASE_ACCENTS[data.phases.length % PHASE_ACCENTS.length];
    mutatePhases((phases) => [...phases, defaultPhase(`Phase ${phases.length + 1}`, accent)]);
  };

  const updatePhase = (pid: string, patch: Partial<RoadmapPhase>) =>
    mutatePhases((phases) => phases.map((p) => (p.id === pid ? { ...p, ...patch } : p)));

  const removePhase = (pid: string) =>
    mutatePhases((phases) => phases.filter((p) => p.id !== pid));

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
          onClick={addPhase}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-border text-[13px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add phase
        </button>
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  index,
  total,
  onChange,
  onDelete,
  onMove,
}: {
  phase: RoadmapPhase;
  index: number;
  total: number;
  onChange: (patch: Partial<RoadmapPhase>) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [showPalette, setShowPalette] = useState(false);

  const updateColumn = (cid: string, patch: Partial<RoadmapPhase["columns"][number]>) =>
    onChange({ columns: phase.columns.map((c) => (c.id === cid ? { ...c, ...patch } : c)) });

  const addItem = (cid: string, text: string) => {
    if (!text.trim()) return;
    const item: RoadmapItem = { id: uid(), text: text.trim() };
    onChange({
      columns: phase.columns.map((c) => (c.id === cid ? { ...c, items: [...c.items, item] } : c)),
    });
  };

  const removeItem = (cid: string, iid: string) =>
    onChange({
      columns: phase.columns.map((c) =>
        c.id === cid ? { ...c, items: c.items.filter((i) => i.id !== iid) } : c,
      ),
    });

  const updateItem = (cid: string, iid: string, patch: Partial<RoadmapItem>) =>
    onChange({
      columns: phase.columns.map((c) =>
        c.id === cid ? { ...c, items: c.items.map((i) => (i.id === iid ? { ...i, ...patch } : i)) } : c,
      ),
    });

  return (
    <div
      className="rounded-xl border bg-card overflow-hidden"
      style={{ borderColor: `${phase.accent}33` }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{
          background: `linear-gradient(90deg, ${phase.accent}18, transparent)`,
          borderColor: `${phase.accent}33`,
        }}
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: phase.accent }} />
        <input
          value={phase.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="bg-transparent text-[14px] font-semibold outline-none min-w-0 flex-shrink"
          style={{ color: phase.accent }}
        />
        <input
          value={phase.meta ?? ""}
          onChange={(e) => onChange({ meta: e.target.value })}
          placeholder="Weeks 1-2 · ~7 hrs"
          className="ml-auto bg-transparent text-[11px] text-muted-foreground outline-none text-right w-48 placeholder:text-muted-foreground/50"
        />
        <div className="relative">
          <button
            onClick={() => setShowPalette((s) => !s)}
            className="p-1 rounded hover:bg-muted text-muted-foreground"
            aria-label="Change color"
          >
            <Palette className="h-3.5 w-3.5" />
          </button>
          {showPalette && (
            <div className="absolute right-0 top-7 z-10 flex gap-1 p-1.5 rounded-md border border-border bg-popover shadow-md">
              {PHASE_ACCENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onChange({ accent: c });
                    setShowPalette(false);
                  }}
                  className="h-4 w-4 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => onMove(-1)}
          disabled={index === 0}
          className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
          aria-label="Move up"
        >
          <GripVertical className="h-3.5 w-3.5 rotate-90" />
        </button>
        <button
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
          aria-label="Move down"
        >
          <GripVertical className="h-3.5 w-3.5 -rotate-90" />
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete ${phase.title}?`)) onDelete();
          }}
          className="p-1 rounded hover:bg-muted text-muted-foreground"
          aria-label="Delete phase"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
        {phase.columns.map((col) => (
          <ColumnView
            key={col.id}
            column={col}
            onTitleChange={(title) => updateColumn(col.id, { title })}
            onAdd={(text) => addItem(col.id, text)}
            onRemove={(iid) => removeItem(col.id, iid)}
            onUpdate={(iid, patch) => updateItem(col.id, iid, patch)}
          />
        ))}
      </div>
    </div>
  );
}

function ColumnView({
  column,
  onTitleChange,
  onAdd,
  onRemove,
  onUpdate,
}: {
  column: RoadmapPhase["columns"][number];
  onTitleChange: (t: string) => void;
  onAdd: (text: string) => void;
  onRemove: (iid: string) => void;
  onUpdate: (iid: string, patch: Partial<RoadmapItem>) => void;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div className="p-3">
      <input
        value={column.title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full bg-transparent text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground outline-none mb-2"
      />
      <div className="space-y-1.5">
        {column.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onChange={(patch) => onUpdate(item.id, patch)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAdd(draft);
          setDraft("");
        }}
        className="mt-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="+ Add item"
          className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground/60 py-1 border-b border-transparent focus:border-border transition-colors"
        />
      </form>
    </div>
  );
}

function ItemRow({
  item,
  onChange,
  onRemove,
}: {
  item: RoadmapItem;
  onChange: (patch: Partial<RoadmapItem>) => void;
  onRemove: () => void;
}) {
  const [chipDraft, setChipDraft] = useState("");
  const [addingChip, setAddingChip] = useState(false);

  return (
    <div className="group flex items-start gap-2 rounded-md px-1.5 py-1 hover:bg-muted/50">
      <span className="mt-2 h-1 w-2 shrink-0 bg-foreground/60" />
      <div className="flex-1 min-w-0">
        <input
          value={item.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full bg-transparent text-[13px] outline-none"
        />
        {(item.chips?.length || addingChip) && (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.chips?.map((chip, i) => (
              <span
                key={i}
                className="group/chip inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10.5px] font-mono text-foreground/80"
              >
                {chip}
                <button
                  onClick={() =>
                    onChange({ chips: item.chips?.filter((_, idx) => idx !== i) })
                  }
                  className="opacity-0 group-hover/chip:opacity-100"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            {addingChip && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (chipDraft.trim()) {
                    onChange({ chips: [...(item.chips ?? []), chipDraft.trim()] });
                    setChipDraft("");
                  }
                  setAddingChip(false);
                }}
                className="inline"
              >
                <input
                  autoFocus
                  value={chipDraft}
                  onChange={(e) => setChipDraft(e.target.value)}
                  onBlur={() => {
                    if (chipDraft.trim())
                      onChange({ chips: [...(item.chips ?? []), chipDraft.trim()] });
                    setChipDraft("");
                    setAddingChip(false);
                  }}
                  placeholder="chip"
                  className="w-16 rounded bg-muted px-1.5 py-0.5 text-[10.5px] font-mono outline-none"
                />
              </form>
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => setAddingChip(true)}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-foreground"
        title="Add tag"
      >
        +tag
      </button>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
        aria-label="Remove"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
