import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsQO, tasksQO, useProjectMutations } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { TaskList, TaskRow } from "@/components/TaskList";
import { STATUSES, STATUS_LABEL, useUI } from "@/lib/store";
import { useState } from "react";
import { LayoutGrid, List, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/projects/$id")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(projectsQO);
    context.queryClient.ensureQueryData(tasksQO);
  },
  component: ProjectView,
});

function ProjectView() {
  const { id } = Route.useParams();
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const project = projects.find((p) => p.id === id);
  const setQuickAdd = useUI((s) => s.setQuickAddOpen);
  const [view, setView] = useState<"list" | "kanban">("list");
  const nav = useNavigate();
  const { remove } = useProjectMutations();

  if (!project) return <div className="text-sm text-muted-foreground">Project not found.</div>;
  const projectTasks = tasks.filter((t) => t.project_id === project.id);

  return (
    <>
      <PageHeader
        title={project.name}
        count={projectTasks.filter((t) => t.status !== "done").length}
        action={
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded p-0.5">
              <button
                onClick={() => setView("list")}
                className={`p-1 rounded ${view === "list" ? "bg-background shadow-sm" : ""}`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`p-1 rounded ${view === "kanban" ? "bg-background shadow-sm" : ""}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => setQuickAdd(true, project.id)}
              className="text-xs bg-accent-violet text-white px-2.5 py-1 rounded flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Task
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete "${project.name}"? Tasks will be moved to Inbox.`)) {
                  remove.mutate(project.id);
                  nav({ to: "/projects" });
                }
              }}
              className="text-muted-foreground hover:text-destructive p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        }
      />
      <div className="flex items-center gap-2 mb-4 -mt-4">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
        <span className="text-xs text-muted-foreground">Project</span>
      </div>

      {view === "list" ? (
        <TaskList tasks={projectTasks} projects={projects} emptyText="No tasks in this project yet." />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {STATUSES.map((s) => {
            const items = projectTasks.filter((t) => t.status === s);
            return (
              <div key={s} className="bg-card border border-border rounded-lg p-2 min-h-[300px]">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-1 pb-2 border-b border-border mb-2">
                  {STATUS_LABEL[s]} · {items.length}
                </div>
                <div className="divide-y divide-border">
                  {items.map((t) => (
                    <TaskRow key={t.id} task={t} projects={projects} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
