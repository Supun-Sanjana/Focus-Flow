import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Crosshair,
  GripHorizontal,
  Check,
} from "lucide-react";
import { PhaseCard, STATUS_META } from "./PhaseCard";
import type { RoadmapPhase } from "../../lib/roadmap-api";

const CARD_W = 420;
const CARD_H_EST = 300;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.6;
const COL_GAP = 120;
const ROW_GAP = 160;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function RoadmapCanvas({
  phases,
  onChangePhase,
  onDeletePhase,
  onAddPhase,
}: {
  phases: RoadmapPhase[];
  onChangePhase: (id: string, patch: Partial<RoadmapPhase>) => void;
  onDeletePhase: (id: string) => void;
  onAddPhase: (pos: { x: number; y: number }) => void;
}) {
  const [scale, setScale] = useState(0.85);
  const [offset, setOffset] = useState({ x: 40, y: 40 });
  const [fullscreen, setFullscreen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [heights, setHeights] = useState<Record<string, number>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const stateRef = useRef({ scale, offset });
  stateRef.current = { scale, offset };

  const posOf = useCallback(
    (p: RoadmapPhase, i: number) =>
      p.pos ?? {
        x: 40 + (i % 3) * (CARD_W + COL_GAP),
        y: 40 + Math.floor(i / 3) * (CARD_H_EST + ROW_GAP),
      },
    [],
  );

  /* ---------------- measure card heights (for connectors) ---------------- */
  useLayoutEffect(() => {
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

  /* ---------------- panning + card dragging (window listeners) ---------------- */
  const startPan = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const s = { x: e.clientX, y: e.clientY, ox: stateRef.current.offset.x, oy: stateRef.current.offset.y };
    const onMove = (ev: PointerEvent) =>
      setOffset({ x: s.ox + (ev.clientX - s.x), y: s.oy + (ev.clientY - s.y) });
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startCardDrag = (phase: RoadmapPhase, i: number) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    const p = posOf(phase, i);
    const { scale: sc, offset: off } = stateRef.current;
    const dx = e.clientX - (p.x * sc + off.x);
    const dy = e.clientY - (p.y * sc + off.y);
    setDraggingId(phase.id);

    const onMove = (ev: PointerEvent) => {
      const { scale: s2, offset: o2 } = stateRef.current;
      onChangePhase(phase.id, {
        pos: {
          x: Math.max(0, (ev.clientX - dx - o2.x) / s2),
          y: Math.max(0, (ev.clientY - dy - o2.y) / s2),
        },
      });
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

  /* ---------------- cursor-anchored wheel zoom ---------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const { scale: s, offset: o } = stateRef.current;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const next = clamp(s * Math.exp(-dy * 0.0018), MIN_ZOOM, MAX_ZOOM);
      if (next === s) return;
      const k = next / s;
      setScale(next);
      setOffset({ x: px - (px - o.x) * k, y: py - (py - o.y) * k });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /* ---------------- fullscreen (escape to exit) ---------------- */
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const zoomAtCenter = (dir: 1 | -1) => {
    const el = containerRef.current;
    const rect = el?.getBoundingClientRect();
    const cx = (rect?.width ?? 800) / 2;
    const cy = (rect?.height ?? 600) / 2;
    const { scale: s, offset: o } = stateRef.current;
    const next = clamp(s * (dir === 1 ? 1.15 : 1 / 1.15), MIN_ZOOM, MAX_ZOOM);
    const k = next / s;
    setScale(next);
    setOffset({ x: cx - (cx - o.x) * k, y: cy - (cy - o.y) * k });
  };

  const autoLayout = () => {
    phases.forEach((p, i) =>
      onChangePhase(p.id, {
        pos: { x: 40 + (i % 3) * (CARD_W + COL_GAP), y: 40 + Math.floor(i / 3) * (CARD_H_EST + ROW_GAP) },
      }),
    );
    resetView();
  };

  const resetView = () => {
    setOffset({ x: 40, y: 40 });
    setScale(0.85);
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
    setOffset({ x: 40, y: 40 });
  };

  const btn = "p-1.5 rounded hover:bg-muted text-foreground/80";

  const surface = (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 overflow-hidden bg-background"
          : "relative h-[calc(100vh-230px)] min-h-[460px] overflow-hidden rounded-xl border border-border bg-muted/30"
      }
    >
      {/* Toolbar */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-lg border border-border bg-card/95 p-1 shadow-sm backdrop-blur">
        <button onClick={() => zoomAtCenter(-1)} className={btn} aria-label="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-[11px] tabular-nums text-muted-foreground">
          {Math.round(scale * 100)}%
        </span>
        <button onClick={() => zoomAtCenter(1)} className={btn} aria-label="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button onClick={autoLayout} className={btn} aria-label="Auto layout" title="Auto layout">
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button onClick={fitToView} className={btn} aria-label="Fit to view" title="Fit to view">
          <Crosshair className="h-4 w-4" />
        </button>
        <button
          onClick={() => setFullscreen((f) => !f)}
          className={btn}
          aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          title={fullscreen ? "Exit full screen (Esc)" : "Full screen"}
        >
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      <button
        onClick={() => onAddPhase({ x: (-offset.x + 80) / scale, y: (-offset.y + 80) / scale })}
        className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-lg border border-border bg-card/95 px-2.5 py-1.5 text-[12px] font-medium shadow-sm backdrop-blur hover:bg-muted"
      >
        <Plus className="h-3.5 w-3.5" /> Add phase
      </button>

      {/* Canvas surface */}
      <div
        ref={containerRef}
        className={`h-full w-full touch-none ${draggingId ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"}`}
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: `${24 * scale}px ${24 * scale}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
        onPointerDown={startPan}
      >
        <div
          className="relative origin-top-left"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        >
          {/* n8n-style connectors */}
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={1} height={1}>
            <defs>
              <marker id="rm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
              <marker id="rm-arrow-done" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={STATUS_META.done.color} />
              </marker>
            </defs>
            {phases.slice(0, -1).map((p, i) => {
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
              return (
                <g key={p.id} style={{ color }}>
                  <path
                    d={`M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeOpacity={done ? 0.9 : 0.45}
                    strokeDasharray={done ? undefined : "7 7"}
                    markerEnd={done ? "url(#rm-arrow-done)" : "url(#rm-arrow)"}
                  />
                  <circle cx={x1} cy={y1} r={4} fill={color} />
                  <circle cx={mx} cy={my} r={3} fill="hsl(var(--background))" stroke={color} strokeWidth={1.5} />
                </g>
              );
            })}
          </svg>

          {phases.map((phase, i) => {
            const p = posOf(phase, i);
            const status = phase.status ?? "todo";
            const isDragging = draggingId === phase.id;
            return (
              <div
                key={phase.id}
                ref={(el) => {
                  cardRefs.current[phase.id] = el;
                }}
                className="absolute"
                style={{
                  left: p.x,
                  top: p.y,
                  width: CARD_W,
                  zIndex: isDragging ? 30 : 1,
                  filter: isDragging ? "drop-shadow(0 12px 24px rgba(0,0,0,0.25))" : undefined,
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {/* drag rail + complete toggle */}
                <div className="mb-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div
                    onPointerDown={startCardDrag(phase, i)}
                    title="Drag to move this phase"
                    className="flex flex-1 cursor-move items-center gap-1.5 rounded px-1 py-0.5 hover:bg-muted/70"
                  >
                    <GripHorizontal className="h-3 w-3" />
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <button
                    onClick={() => onChangePhase(phase.id, { status: status === "done" ? "todo" : "done" })}
                    className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] font-semibold tracking-normal"
                    style={{
                      borderColor: status === "done" ? `${STATUS_META.done.color}66` : "hsl(var(--border))",
                      color: status === "done" ? STATUS_META.done.color : "hsl(var(--muted-foreground))",
                      backgroundColor: status === "done" ? `${STATUS_META.done.color}1f` : "transparent",
                    }}
                    title="Mark phase complete"
                  >
                    <Check className="h-2.5 w-2.5" />
                    {status === "done" ? "Completed" : "Mark complete"}
                  </button>
                </div>
                <PhaseCard
                  phase={phase}
                  index={i}
                  total={phases.length}
                  onChange={(patch) => onChangePhase(phase.id, patch)}
                  onDelete={() => onDeletePhase(phase.id)}
                  dragHandleProps={{
                    onPointerDown: startCardDrag(phase, i),
                    className: "cursor-move select-none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {fullscreen && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card/95 px-3 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
          Scroll to zoom · drag background to pan · Esc to exit full screen
        </div>
      )}
    </div>
  );

  return surface;
}
