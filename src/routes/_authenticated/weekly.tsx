import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { Plus, Trash2, X, CalendarPlus, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";

import { scheduleBlocksQO, scheduleRulesQO, useScheduleBlockMutations, useScheduleRuleMutations } from "../../lib/schedule-queries";
import { projectsQO, tasksQO, useTaskMutations } from "../../lib/queries";
import { blockRange, DAYS, type ScheduleBlock } from "../../lib/schedule-api";
import { PageHeader } from "../../components/PageHeader";
import { PROJECT_COLORS } from "../../lib/store";


export const Route = createFileRoute("/_authenticated/weekly")({
  head: () => ({
    meta: [
      { title: "Weekly Schedule — Focus" },
      {
        name: "description",
        content:
          "Design the weekly routine that repeats every week, and push it into your calendar as tasks.",
      },
      { property: "og:title", content: "Weekly Schedule — Focus" },
      {
        property: "og:description",
        content: "Recurring weekly time blocks plus the non-negotiables that keep them honest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(scheduleBlocksQO);
    context.queryClient.ensureQueryData(scheduleRulesQO);
    context.queryClient.ensureQueryData(projectsQO);
    context.queryClient.ensureQueryData(tasksQO);
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="p-6 text-sm text-destructive">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-6 text-sm">Nothing here.</div>,
  component: Weekly,
});

function Weekly() {
  const { data: blocks } = useSuspenseQuery(scheduleBlocksQO);
  const { data: rules } = useSuspenseQuery(scheduleRulesQO);
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const blockM = useScheduleBlockMutations();
  const ruleM = useScheduleRuleMutations();
  const taskM = useTaskMutations();
  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [ruleText, setRuleText] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset * 7);

  const generateWeek = async () => {
    const active = blocks.filter((b) => b.is_active);
    if (active.length === 0) {
      toast.error("Add some blocks first");
      return;
    }
    let created = 0;
    for (const b of active) {
      const date = format(addDays(weekStart, b.day_of_week - 1), "yyyy-MM-dd");
      const exists = tasks.some((t) => t.due_date === date && t.title === b.title);
      if (exists) continue;
      await taskM.create.mutateAsync({
        title: b.title,
        description: b.details ?? null,
        due_date: date,
        project_id: b.project_id ?? null,
        is_recurring: true,
        recur_pattern: "weekly",
      } as never);
      created++;
    }
    toast.success(
      created > 0
        ? `Added ${created} task${created > 1 ? "s" : ""} for week of ${format(weekStart, "MMM d")}`
        : "This week is already planned",
    );
  };

  return (
    <div>
      <PageHeader
        title="Weekly Schedule"
        action={
          <div className="flex items-center gap-2">
            <select
              value={weekOffset}
              onChange={(e) => setWeekOffset(Number(e.target.value))}
              className="text-[12px] rounded-md border border-border bg-background px-2 py-1"
            >
              <option value={0}>This week</option>
              <option value={1}>Next week</option>
              <option value={2}>In 2 weeks</option>
            </select>
            <button
              onClick={generateWeek}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-accent-violet text-white text-[12px] font-medium hover:opacity-90"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Add to calendar
            </button>
          </div>
        }
      />

      <p className="text-[12px] text-muted-foreground -mt-2 mb-4">
        This is your repeating routine. Blocks stay here every week — press{" "}
        <span className="font-medium">Add to calendar</span> to turn them into dated tasks that show
        up in Today and Monthly.
      </p>

      <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-7">
        {DAYS.map((d) => {
          const dayBlocks = blocks.filter((b) => b.day_of_week === d.value);
          return (
            <div key={d.value} className="bg-card border border-border rounded-lg p-2">
              <div className="flex items-center justify-between mb-2 px-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider">{d.short}</span>
                <button
                  onClick={() => setAddingDay(addingDay === d.value ? null : d.value)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Add block on ${d.label}`}
                >
                  {addingDay === d.value ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </button>
              </div>

              {addingDay === d.value && (
                <NewBlockForm
                  onCancel={() => setAddingDay(null)}
                  onSubmit={async (input) => {
                    await blockM.create.mutateAsync({ day_of_week: d.value, ...input });
                    setAddingDay(null);
                  }}
                />
              )}

              <div className="space-y-1.5">
                {dayBlocks.map((b) => (
                  <BlockCard
                    key={b.id}
                    block={b}
                    projectName={projects.find((p) => p.id === b.project_id)?.name}
                    onToggle={() =>
                      blockM.update.mutate({ id: b.id, patch: { is_active: !b.is_active } })
                    }
                    onDelete={() => blockM.remove.mutate(b.id)}
                  />
                ))}
                {dayBlocks.length === 0 && addingDay !== d.value && (
                  <div className="text-[11px] text-muted-foreground px-1 py-2">Free</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-card border border-border rounded-lg p-4 max-w-2xl">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-3">
          Non-negotiables
        </div>
        <ul className="space-y-1.5 mb-3">
          {rules.map((r) => (
            <li key={r.id} className="flex items-start gap-2 text-[13px] group">
              <span className="text-accent-violet mt-0.5">→</span>
              <span className="flex-1">{r.text}</span>
              <button
                onClick={() => ruleM.remove.mutate(r.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                aria-label="Delete rule"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          {rules.length === 0 && (
            <li className="text-[12px] text-muted-foreground">
              Add the rules that protect this schedule.
            </li>
          )}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!ruleText.trim()) return;
            ruleM.create.mutate({ text: ruleText.trim(), order_index: rules.length });
            setRuleText("");
          }}
          className="flex gap-2"
        >
          <input
            value={ruleText}
            onChange={(e) => setRuleText(e.target.value)}
            placeholder="e.g. AWS 30 min every single day — no skip"
            className="flex-1 text-[13px] rounded-md border border-border bg-background px-2.5 py-1.5"
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 rounded-md border border-border text-[12px] hover:bg-muted"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

function BlockCard({
  block,
  projectName,
  onToggle,
  onDelete,
}: {
  block: ScheduleBlock;
  projectName?: string;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`group rounded-md border p-2 ${block.is_active ? "" : "opacity-50"}`}
      style={{ borderColor: `${block.color}55`, backgroundColor: `${block.color}12` }}
    >
      <div className="flex items-start gap-1">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-muted-foreground">{blockRange(block)}</div>
          <div className="text-[12px] font-medium leading-snug" style={{ color: block.color }}>
            {block.title}
          </div>
          {block.details && (
            <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              {block.details}
            </div>
          )}
          {projectName && (
            <div className="text-[10px] text-muted-foreground mt-0.5">{projectName}</div>
          )}
        </div>
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100">
          <button onClick={onToggle} aria-label="Toggle block" className="text-muted-foreground hover:text-foreground">
            {block.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </button>
          <button onClick={onDelete} aria-label="Delete block" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NewBlockForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: {
    title: string;
    start_time: string;
    end_time: string | null;
    details: string | null;
    color: string;
  }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("20:00");
  const [end, setEnd] = useState("20:30");
  const [details, setDetails] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({
          title: title.trim(),
          start_time: start,
          end_time: end || null,
          details: details.trim() || null,
          color,
        });
      }}
      className="mb-2 space-y-1.5 rounded-md border border-border p-2"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Block title"
        className="w-full text-[12px] rounded border border-border bg-background px-2 py-1"
      />
      <div className="flex gap-1">
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="flex-1 text-[11px] rounded border border-border bg-background px-1.5 py-1"
        />
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="flex-1 text-[11px] rounded border border-border bg-background px-1.5 py-1"
        />
      </div>
      <input
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full text-[11px] rounded border border-border bg-background px-2 py-1"
      />
      <div className="flex flex-wrap gap-1">
        {PROJECT_COLORS.slice(0, 8).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            aria-label={`Color ${c}`}
            className={`h-3.5 w-3.5 rounded-full ${color === c ? "ring-2 ring-offset-1 ring-foreground/40" : ""}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex gap-1">
        <button
          type="submit"
          className="flex-1 text-[11px] rounded bg-accent-violet text-white py-1 hover:opacity-90"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-2 text-[11px] rounded border border-border hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
