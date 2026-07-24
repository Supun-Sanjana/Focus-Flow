
import { format, isToday, isPast, parseISO } from "date-fns";
import { Check } from "lucide-react";
import type { Project, Task } from "../lib/api";
import { useTaskMutations } from "../lib/queries";
import { PRIORITY_META, useUI } from "../lib/store";

export function TaskRow({ task, projects }: { task: Task; projects: Project[] }) {
  const setSelected = useUI((s) => s.setSelectedTask);
  const { update } = useTaskMutations();
  const project = projects.find((p) => p.id === task.project_id);
  const done = task.status === "done";
  const prio = PRIORITY_META[task.priority] ?? PRIORITY_META.p4;

  return (
    <div
      onClick={() => setSelected(task.id)}
      className={`group flex items-center gap-3 px-4 py-2.5 border-b border-border hover:bg-muted/40 cursor-pointer transition-colors ${
        done ? "opacity-50" : ""
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          update.mutate({ id: task.id, patch: { status: done ? "todo" : "done" } });
        }}
        className={`h-4 w-4 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${
          done ? "bg-accent-violet border-accent-violet" : "border-muted-foreground/40 hover:border-accent-violet"
        }`}
        aria-label="toggle complete"
      >
        {done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
      </button>

      <span
        className={`h-1.5 w-1.5 rounded-full flex-shrink-0`}
        style={{ backgroundColor: prio.color }}
        title={prio.label}
      />

      <span className={`flex-1 text-[13px] truncate ${done ? "line-through" : ""}`}>
        {task.title}
      </span>

      {task.status === "in_progress" && (
        <span className="text-[10px] uppercase tracking-wider text-accent-violet font-medium">
          In progress
        </span>
      )}

      {project && (
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.color }} />
          {project.name}
        </span>
      )}

      {task.due_date && (
        <span
          className={`text-[11px] ${
            isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) && !done
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {isToday(parseISO(task.due_date)) ? "Today" : format(parseISO(task.due_date), "MMM d")}
        </span>
      )}
    </div>
  );
}

export function TaskList({ tasks, projects, emptyText }: { tasks: Task[]; projects: Project[]; emptyText?: string }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        {emptyText ?? "Nothing here yet."}
      </div>
    );
  }
  const active = tasks.filter((t) => t.status !== "done");
  const done = tasks.filter((t) => t.status === "done");
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {active.map((t) => (
        <TaskRow key={t.id} task={t} projects={projects} />
      ))}
      {done.map((t) => (
        <TaskRow key={t.id} task={t} projects={projects} />
      ))}
    </div>
  );
}
