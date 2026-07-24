import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { habitLogsQO, habitsQO, useInvalidate } from "@/lib/queries";
import { format, subDays, differenceInCalendarDays } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import * as api from "../../lib/api";
import { useState } from "react";
import { Check, Flame, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/habits")({
  head: () => ({ meta: [{ title: "Habits — Focus" }, { name: "description", content: "Build habits with a daily checklist and streaks." }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(habitsQO);
    context.queryClient.ensureQueryData(habitLogsQO);
  },
  component: Habits,
});

function Habits() {
  const { data: habits } = useSuspenseQuery(habitsQO);
  const { data: logs } = useSuspenseQuery(habitLogsQO);
  const invalidate = useInvalidate();
  const today = format(new Date(), "yyyy-MM-dd");

  const create = useMutation({
    mutationFn: (title: string) => api.createHabit(title),
    onSuccess: () => invalidate("habits"),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.deleteHabit(id),
    onSuccess: () => {
      invalidate("habits");
      invalidate("habit_logs");
    },
  });
  const toggle = useMutation({
    mutationFn: (v: { id: string; date: string; on: boolean }) => api.toggleHabitLog(v.id, v.date, v.on),
    onSuccess: () => invalidate("habit_logs"),
  });

  const [title, setTitle] = useState("");

  const streakFor = (habitId: string) => {
    const set = new Set(logs.filter((l) => l.habit_id === habitId).map((l) => l.logged_date));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      if (set.has(d)) streak++;
      else if (i === 0) continue;
      else break;
    }
    // if today missing but yesterday present, still count from yesterday
    if (!set.has(today) && streak === 0) {
      for (let i = 1; i < 365; i++) {
        const d = format(subDays(new Date(), i), "yyyy-MM-dd");
        if (set.has(d)) streak++;
        else break;
      }
    }
    return streak;
  };

  const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), "yyyy-MM-dd"));

  return (
    <>
      <PageHeader
        title="Habits"
        count={habits.length}
        action={<span className="text-xs text-muted-foreground">{format(new Date(), "EEEE, MMM d")}</span>}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          create.mutate(title.trim());
          setTitle("");
        }}
        className="bg-card border border-border rounded-lg p-3 mb-6 flex items-center gap-2"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New habit..."
          className="flex-1 bg-transparent text-sm outline-none px-2"
        />
        <button type="submit" className="bg-accent-violet text-white text-xs px-3 py-1.5 rounded flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </form>

      {habits.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          <Flame className="h-6 w-6 mx-auto mb-2 opacity-40" />
          Start with one small daily habit.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {habits.map((h) => {
            const set = new Set(logs.filter((l) => l.habit_id === h.id).map((l) => l.logged_date));
            const doneToday = set.has(today);
            const streak = streakFor(h.id);
            return (
              <div key={h.id} className="flex items-center gap-3 px-4 py-3 border-b border-border group">
                <button
                  onClick={() => toggle.mutate({ id: h.id, date: today, on: !doneToday })}
                  className={`h-5 w-5 rounded-full border-[1.5px] flex items-center justify-center ${
                    doneToday ? "bg-accent-violet border-accent-violet" : "border-muted-foreground/40"
                  }`}
                >
                  {doneToday && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </button>
                <span className={`flex-1 text-sm ${doneToday ? "text-muted-foreground" : ""}`}>{h.title}</span>
                <div className="hidden sm:flex items-center gap-0.5">
                  {last7.map((d) => (
                    <span
                      key={d}
                      title={d}
                      className={`h-2 w-2 rounded-sm ${set.has(d) ? "bg-accent-violet" : "bg-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-xs flex items-center gap-1 text-muted-foreground min-w-12 justify-end">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  {streak}
                </span>
                <button
                  onClick={() => confirm("Delete habit?") && remove.mutate(h.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
// silence unused
void differenceInCalendarDays;
