import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsQO, tasksQO } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { TaskList } from "@/components/TaskList";
import { format, isToday, parseISO } from "date-fns";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Today — Focus" },
      { name: "description", content: "Today's tasks and in-progress work." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(tasksQO);
    context.queryClient.ensureQueryData(projectsQO);
  },
  component: TodayView,
});

function TodayView() {
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const { data: projects } = useSuspenseQuery(projectsQO);

  const relevant = tasks.filter(
    (t) =>
      t.status === "in_progress" ||
      (t.due_date && isToday(parseISO(t.due_date))) ||
      (t.status === "done" && t.due_date && isToday(parseISO(t.due_date)))
  );

  const grouped = new Map<string | null, typeof tasks>();
  for (const t of relevant) {
    const key = t.project_id ?? null;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(t);
  }

  return (
    <>
      <PageHeader
        title="Today"
        count={relevant.filter((t) => t.status !== "done").length}
        action={
          <span className="text-xs text-muted-foreground">{format(new Date(), "EEEE, MMM d")}</span>
        }
      />

      {relevant.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          <div className="text-3xl mb-2">✦</div>
          Nothing due today. Enjoy the calm.
        </div>
      ) : (
        <div className="space-y-6">
          {[...grouped.entries()].map(([projectId, items]) => {
            const project = projects.find((p) => p.id === projectId);
            return (
              <div key={projectId ?? "none"}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  {project ? (
                    <>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                      <span className="text-xs font-medium">{project.name}</span>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">No project</span>
                  )}
                </div>
                <TaskList tasks={items} projects={projects} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
