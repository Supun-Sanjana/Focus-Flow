import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    format,
    isSameDay,
    isSameMonth,
    parseISO,
    isToday,
} from "date-fns";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { projectsQO, tasksQO, useTaskMutations } from "../../lib/queries";
import { PageHeader } from "../../components/PageHeader";
import type { Project, Task } from "../../lib/api";
import { PRIORITY_META, useUI } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/monthly")({
    head: () => ({
        meta: [
            { title: "Monthly — Focus" },
            { name: "description", content: "See your month at a glance and drag tasks onto any day." },
        ],
    }),
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(tasksQO);
        context.queryClient.ensureQueryData(projectsQO);
    },
    component: Monthly,
});

function Monthly() {
    const { data: tasks } = useSuspenseQuery(tasksQO);
    const { data: projects } = useSuspenseQuery(projectsQO);
    const { update } = useTaskMutations();
    const [cursor, setCursor] = useState(() => new Date());

    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);

    const unscheduled = tasks.filter((t) => !t.due_date && t.status !== "done");

    const onDragEnd = (e: DragEndEvent) => {
        const taskId = e.active.id as string;
        const dayIso = e.over?.id as string | undefined;
        if (!dayIso) return;
        update.mutate({
            id: taskId,
            patch: { due_date: dayIso === "unscheduled" ? null : dayIso },
        });
    };

    return (
        <div className="max-w-none -mx-2">
            <PageHeader
                title="Monthly"
                action={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCursor(subMonths(cursor, 1))}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="text-[13px] font-medium min-w-[110px] text-center">
                            {format(cursor, "MMMM yyyy")}
                        </div>
                        <button
                            onClick={() => setCursor(addMonths(cursor, 1))}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setCursor(new Date())}
                            className="ml-1 px-2 py-1 text-[12px] rounded-md border border-border hover:bg-muted"
                        >
                            Today
                        </button>
                    </div>
                }
            />

            <DndContext onDragEnd={onDragEnd}>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                                <div key={d} className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1">
                                    {d}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((d) => {
                                const iso = format(d, "yyyy-MM-dd");
                                const dayTasks = tasks.filter(
                                    (t) => t.due_date && isSameDay(parseISO(t.due_date), d),
                                );
                                return (
                                    <DayCell
                                        key={iso}
                                        id={iso}
                                        date={d}
                                        inMonth={isSameMonth(d, cursor)}
                                        tasks={dayTasks}
                                        projects={projects}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <UnscheduledColumn tasks={unscheduled} projects={projects} />
                </div>
            </DndContext>
        </div>
    );
}

function DayCell({
    id,
    date,
    inMonth,
    tasks,
    projects,
}: {
    id: string;
    date: Date;
    inMonth: boolean;
    tasks: Task[];
    projects: Project[];
}) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const today = isToday(date);
    return (
        <div
            ref={setNodeRef}
            className={`min-h-[200px] rounded-md border p-1.5 transition-colors ${isOver
                ? "border-accent-violet bg-accent/40"
                : today
                    ? "border-accent-violet bg-card"
                    : "border-border bg-card"
                } ${inMonth ? "" : "opacity-50"}`}
        >
            <div className="flex items-center justify-between mb-1">
                <span
                    className={`text-[11px] font-semibold ${today ? "text-accent-violet" : inMonth ? "" : "text-muted-foreground"
                        }`}
                >
                    {format(date, "d")}
                </span>
                {tasks.length > 0 && (
                    <span className="text-[9px] text-muted-foreground">{tasks.length}</span>
                )}
            </div>
            <div className="space-y-1">
                {tasks.slice(0, 6).map((t) => (
                    <DraggableCard key={t.id} task={t} projects={projects} compact />
                ))}
                {tasks.length > 6 && (
                    <div className="text-[10px] text-muted-foreground px-1">+{tasks.length - 6} more</div>
                )}
            </div>
        </div>
    );
}

function UnscheduledColumn({ tasks, projects }: { tasks: Task[]; projects: Project[] }) {
    const { setNodeRef, isOver } = useDroppable({ id: "unscheduled" });
    return (
        <div
            ref={setNodeRef}
            className={`w-[220px] shrink-0 bg-card border rounded-lg p-2 min-h-[400px] transition-colors ${isOver ? "border-accent-violet bg-accent/40" : "border-border"
                }`}
        >
            <div className="px-1 pb-2 border-b border-border mb-2">
                <div className="text-xs font-semibold">Unscheduled</div>
                <div className="text-[10px] text-muted-foreground">{tasks.length}</div>
            </div>
            <div className="space-y-1.5">
                {tasks.map((t) => (
                    <DraggableCard key={t.id} task={t} projects={projects} />
                ))}
            </div>
        </div>
    );
}

function DraggableCard({
    task,
    projects,
    compact = false,
}: {
    task: Task;
    projects: Project[];
    compact?: boolean;
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
            className={`bg-background border border-border rounded ${compact ? "px-1.5 py-0.5" : "p-2"
                } text-[11px] cursor-grab active:cursor-grabbing hover:border-accent-violet ${isDragging ? "opacity-50" : ""
                } ${task.status === "done" ? "line-through opacity-60" : ""}`}
        >
            <div className="flex items-center gap-1.5">
                <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: PRIORITY_META[task.priority].color }}
                />
                <span className="truncate">{task.title}</span>
            </div>
            {!compact && project && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                    {project.name}
                </div>
            )}
        </div>
    );
}
