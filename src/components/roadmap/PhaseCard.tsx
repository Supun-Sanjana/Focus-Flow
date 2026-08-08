import { useState, useRef, useLayoutEffect } from "react";
import { Trash2, GripVertical, Palette, X, Check, Circle, Play } from "lucide-react";
import { PHASE_ACCENTS, uid, type PhaseStatus, type RoadmapItem, type RoadmapPhase } from "../../lib/roadmap-api";








export const STATUS_META: Record<PhaseStatus, { label: string; color: string }> = {
  done: { label: "Done", color: "#10B981" },
  current: { label: "In progress", color: "#F59E0B" },
  todo: { label: "Upcoming", color: "#94A3B8" },
};

export function StatusBadge({
  status,
  onChange,
}: {
  status: PhaseStatus;
  onChange?: (s: PhaseStatus) => void;
}) {
  const order: PhaseStatus[] = ["todo", "current", "done"];
  const meta = STATUS_META[status];
  const Icon = status === "done" ? Check : status === "current" ? Play : Circle;
  return (
    <button
      type="button"
      onClick={() => onChange?.(order[(order.indexOf(status) + 1) % order.length])}
      title="Change phase status"
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
    >
      <Icon className="h-2.5 w-2.5" /> {meta.label}
    </button>
  );
}

export function PhaseCard({
  phase,
  index,
  total,
  onChange,
  onDelete,
  onMove,
  dragHandleProps,
}: {
  phase: RoadmapPhase;
  index: number;
  total: number;
  onChange: (patch: Partial<RoadmapPhase>) => void;
  onDelete: () => void;
  onMove?: (dir: -1 | 1) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const [showPalette, setShowPalette] = useState(false);
  const status = phase.status ?? "todo";
  const isDone = status === "done";
  const isCurrent = status === "current";
  const statusColor = STATUS_META[status].color;

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

  const accent = isDone ? STATUS_META.done.color : phase.accent;

  return (
    <div
      className="rounded-xl border bg-card overflow-hidden transition-all duration-200"
      style={{
        borderColor: isDone || isCurrent ? `${statusColor}66` : `${phase.accent}33`,
        boxShadow: isCurrent ? `0 0 0 3px ${statusColor}22` : isDone ? `0 0 0 3px ${statusColor}1a` : undefined,
      }}
    >
      {/* Header */}
      <div
        {...dragHandleProps}
        className="flex flex-col gap-2 px-4 py-3 border-b"
        style={{
          background: isDone
            ? `linear-gradient(90deg, ${statusColor}26, transparent)`
            : `linear-gradient(90deg, ${phase.accent}18, transparent)`,
          borderColor: `${accent}33`,
        }}
      >
        {/* Row 1: Title & Action buttons */}
        <div className="flex items-center gap-2.5 w-full">
          <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: accent }} />
          <input
            value={phase.title}
            onChange={(e) => onChange({ title: e.target.value })}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-transparent text-[15px] font-bold tracking-tight outline-none min-w-0 flex-1 w-full"
            style={{ color: accent }}
          />
          <div className="flex items-center gap-0.5 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={() => setShowPalette((s) => !s)}
                className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                aria-label="Change color"
              >
                <Palette className="h-3.5 w-3.5" />
              </button>
              {showPalette && (
                <div className="absolute right-0 top-7 z-20 flex gap-1 p-1.5 rounded-md border border-border bg-popover shadow-md">
                  {PHASE_ACCENTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onChange({ accent: c });
                        setShowPalette(false);
                      }}
                      className="h-4 w-4 rounded-full ring-1 ring-black/10 transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>
            {onMove && (
              <>
                <button
                  onClick={() => onMove(-1)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                  aria-label="Move up"
                >
                  <GripVertical className="h-3.5 w-3.5 rotate-90" />
                </button>
                <button
                  onClick={() => onMove(1)}
                  disabled={index === total - 1}
                  className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                  aria-label="Move down"
                >
                  <GripVertical className="h-3.5 w-3.5 -rotate-90" />
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (confirm(`Delete ${phase.title}?`)) onDelete();
              }}
              className="p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
              aria-label="Delete phase"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Status & Meta */}
        <div className="flex items-center justify-between gap-3 w-full pl-5" onPointerDown={(e) => e.stopPropagation()}>
          <StatusBadge status={status} onChange={(s) => onChange({ status: s })} />
          <input
            value={phase.meta ?? ""}
            onChange={(e) => onChange({ meta: e.target.value })}
            placeholder="Weeks 1-2 · ~7 hrs"
            className="bg-transparent text-[11.5px] font-medium text-muted-foreground/80 outline-none text-right flex-1 min-w-0 placeholder:text-muted-foreground/40 focus:text-foreground transition-colors"
          />
        </div>
      </div>

      {/* Columns */}
      <div
        className={`grid divide-y md:divide-y-0 md:divide-x divide-border w-full ${
          phase.columns.length === 1
            ? "grid-cols-1"
            : phase.columns.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-3"
        }`}
        style={isDone ? { backgroundColor: `${STATUS_META.done.color}0d` } : undefined}
      >
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
    <div className="p-3.5 w-full flex flex-col min-w-0" onPointerDown={(e) => e.stopPropagation()}>
      <input
        value={column.title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full bg-transparent text-[11px] font-bold uppercase tracking-wider text-muted-foreground outline-none mb-2.5 block"
      />
      <div className="space-y-1.5 flex-1 w-full min-w-0">
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
        className="mt-2.5 w-full"
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

function AutoGrowTextarea({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      className={`resize-none overflow-hidden whitespace-pre-wrap break-words leading-snug ${className ?? ""}`}
    />
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
    <div className="group relative flex items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/50 w-full transition-colors">
      <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0 bg-muted-foreground/70" />
      <div className="flex-1 min-w-0 pr-14">
        <AutoGrowTextarea
          value={item.text}
          onChange={(text) => onChange({ text })}
          className="w-full bg-transparent text-[13px] outline-none leading-relaxed text-foreground/90 font-normal"
        />
        {(item.chips?.length || addingChip) && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {item.chips?.map((chip, i) => (
              <span
                key={i}
                className="group/chip inline-flex items-center gap-1 rounded bg-muted/80 px-1.5 py-0.5 text-[10.5px] font-mono text-foreground/80 border border-border/50"
              >
                {chip}
                <button
                  onClick={() => onChange({ chips: item.chips?.filter((_, idx) => idx !== i) })}
                  className="opacity-0 group-hover/chip:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
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
                  className="w-16 rounded bg-muted px-1.5 py-0.5 text-[10.5px] font-mono outline-none border border-border"
                />
              </form>
            )}
          </div>
        )}
      </div>
      <div className="absolute right-1 top-1 flex items-center gap-1 rounded-md bg-card border border-border/70 px-1.5 py-0.5 opacity-0 shadow-sm group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setAddingChip(true)}
          className="text-[10.5px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          title="Add tag"
        >
          +tag
        </button>
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive transition-colors pl-0.5"
          aria-label="Remove"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}