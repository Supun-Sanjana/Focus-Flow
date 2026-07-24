import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsQO, tasksQO, useTaskMutations } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { PRIORITY_META, useUI } from "@/lib/store";
import { startOfWeek, addDays, format, isSameDay, parseISO, isToday } from "date-fns";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import type { Project, Task } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/weekly")({
  head: () => ({ meta: [{ title: "Weekly — Focus" }, { name: "description", content: "Plan your week by dragging tasks into day columns." }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(tasksQO);
    context.queryClient.ensureQueryData(projectsQO);
  },
  component: Weekly,
});

function Weekly() {
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { update } = useTaskMutations();

  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const unscheduled = tasks.filter((t) => !t.due_date && t.status !== "done");

  const onDragEnd = (e: DragEndEvent) => {
    const taskId = e.active.id as string;
    const dayIso = e.over?.id as string | undefined;
    if (!dayIso) return;
    update.mutate({ id: taskId, patch: { due_date: dayIso === "unscheduled" ? null : dayIso } });
  };

  return (
    <div className="max-w-none -mx-2">
      <PageHeader title="Weekly" />
      <DndContext onDragEnd={onDragEnd}>
        <div className="flex gap-3">
          <DayColumn
            id="unscheduled"
            title="Unscheduled"
            subtitle={`${unscheduled.length}`}
            tasks={unscheduled}
            projects={projects}
            highlight={false}
          />
          {days.map((d) => {
            const dayTasks = tasks.filter((t) => t.due_date && isSameDay(parseISO(t.due_date), d));
            const iso = format(d, "yyyy-MM-dd");
            return (
              <DayColumn
                key={iso}
                id={iso}
                title={format(d, "EEE")}
                subtitle={format(d, "MMM d")}
                tasks={dayTasks}
                projects={projects}
                highlight={isToday(d)}
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}

function DayColumn({
  id, title, subtitle, tasks, projects, highlight,
}: {
  id: string;
  title: string;
  subtitle: string;
  tasks: Task[];
  projects: Project[];
  highlight: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[140px] bg-card border rounded-lg p-2 min-h-[400px] transition-colors ${
        isOver ? "border-accent-violet bg-accent/40" : highlight ? "border-accent-violet" : "border-border"
      }`}
    >
      <div className="px-1 pb-2 border-b border-border mb-2">
        <div className={`text-xs font-semibold ${highlight ? "text-accent-violet" : ""}`}>{title}</div>
        <div className="text-[10px] text-muted-foreground">{subtitle}</div>
      </div>
      <div className="space-y-1.5">
        {tasks.map((t) => (
          <DraggableCard key={t.id} task={t} projects={projects} />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({ task, projects }: {
  task: Task;
  projects: Project[];
}) {
  const setSelected = useUI((s) => s.setSelectedTask);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const project = projects.find((p) => p.id === task.project_id);
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => setSelected(task.id)}
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      className={`bg-background border border-border rounded p-2 text-xs cursor-grab active:cursor-grabbing hover:border-accent-violet ${
        isDragging ? "opacity-50" : ""
      } ${task.status === "done" ? "line-through opacity-60" : ""}`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PRIORITY_META[task.priority].color }} />
        <span className="line-clamp-2">{task.title}</span>
      </div>
      {project && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.color }} />
          {project.name}
        </div>
      )}
    </div>
  );
}
