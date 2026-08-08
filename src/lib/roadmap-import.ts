import { uid, PHASE_ACCENTS, type RoadmapData, type RoadmapPhase, type RoadmapItem } from "./roadmap-api";

export type ParsedRoadmap = {
  title: string;
  description: string;
  data: RoadmapData;
};

const CHIP_RE = /`([^`]+)`/g;

function toItem(raw: string): RoadmapItem {
  const chips: string[] = [];
  let text = raw.replace(CHIP_RE, (_m, c) => {
    chips.push(String(c).trim());
    return "";
  });
  text = text.replace(/\*\*|__|\*|_/g, "").replace(/\s{2,}/g, " ").trim();
  if (!text && chips.length) text = chips.shift() as string;
  return { id: uid(), text, ...(chips.length ? { chips } : {}) };
}

function newPhase(title: string, index: number): RoadmapPhase {
  return {
    id: uid(),
    title,
    meta: "",
    accent: PHASE_ACCENTS[index % PHASE_ACCENTS.length],
    status: "todo",
    columns: [],
  };
}

/**
 * Parses a markdown roadmap.
 *  # Title                -> roadmap title
 *  > text / plain text    -> description (before first phase)
 *  ## Phase name          -> phase  (supports "- [x]" / "(done)" / "(current)")
 *  *Weeks 1-2 · ~7 hrs*   -> phase meta
 *  ### Column name        -> column inside phase
 *  - item with `chips`    -> item
 */
export function parseRoadmapMarkdown(md: string): ParsedRoadmap {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  let title = "";
  const descParts: string[] = [];
  const phases: RoadmapPhase[] = [];
  let phase: RoadmapPhase | null = null;
  let column: RoadmapPhase["columns"][number] | null = null;

  const ensureColumn = () => {
    if (!phase) {
      phase = newPhase("Phase 1", 0);
      phases.push(phase);
    }
    if (!column) {
      column = { id: uid(), title: "Topics", items: [] };
      phase.columns.push(column);
    }
    return column;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || /^([-*_])\1{2,}$/.test(line)) continue;

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].replace(/[*_`]/g, "").trim();
      if (level === 1 && !title) {
        title = text;
        continue;
      }
      if (level <= 2) {
        let status: RoadmapPhase["status"] = "todo";
        let name = text;
        if (/\[x\]|\(done\)|✅/i.test(name)) status = "done";
        else if (/\(current\)|\(in progress\)|👉/i.test(name)) status = "current";
        name = name
          .replace(/\[[ xX]\]/g, "")
          .replace(/\((done|current|in progress)\)/gi, "")
          .replace(/[✅👉]/g, "")
          .trim();
        phase = newPhase(name || `Phase ${phases.length + 1}`, phases.length);
        phase.status = status;
        phases.push(phase);
        column = null;
        continue;
      }
      // level >= 3 -> column
      if (!phase) {
        phase = newPhase(title || "Phase 1", 0);
        phases.push(phase);
      }
      column = { id: uid(), title: text, items: [] };
      phase.columns.push(column);
      continue;
    }

    const bullet = line.match(/^(?:[-*+]|\d+\.)\s+(.*)$/);
    if (bullet) {
      let body = bullet[1];
      const done = /^\[x\]/i.test(body);
      body = body.replace(/^\[[ xX]\]\s*/, "");
      const item = toItem(body);
      if (done) item.chips = [...(item.chips ?? []), "done"];
      if (!phase) {
        descParts.push(item.text);
      } else {
        ensureColumn().items.push(item);
      }
      continue;
    }

    // meta line right under a phase heading
    if (phase && !column && (/^[*_].*[*_]$/.test(line) || /week|hour|hrs|day|month/i.test(line)) && line.length < 90) {
      phase.meta = phase.meta ? `${phase.meta} · ${line.replace(/[*_>]/g, "").trim()}` : line.replace(/[*_>]/g, "").trim();
      continue;
    }

    const plain = line.replace(/^>\s*/, "").trim();
    if (!phase) descParts.push(plain);
    else ensureColumn().items.push(toItem(plain));
  }

  // normalise: every phase gets at least one column, keep max 3 wide
  for (const p of phases) {
    if (p.columns.length === 0) p.columns.push({ id: uid(), title: "Topics", items: [] });
  }

  // simple auto layout on canvas
  phases.forEach((p, i) => {
    p.pos = { x: 40 + (i % 3) * 480, y: 40 + Math.floor(i / 3) * 440 };
  });

  return {
    title: title || "Imported roadmap",
    description: descParts.slice(0, 3).join(" ").slice(0, 400),
    data: { phases },
  };
}
