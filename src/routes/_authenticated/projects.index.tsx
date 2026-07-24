import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsQO, tasksQO, useProjectMutations } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { PROJECT_COLORS } from "@/lib/store";
import { useState } from "react";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/projects/")({
  head: () => ({ meta: [{ title: "Projects — Focus" }, { name: "description", content: "All your projects." }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(projectsQO);
    context.queryClient.ensureQueryData(tasksQO);
  },
  component: ProjectsIndex,
});

function ProjectsIndex() {
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const { create } = useProjectMutations();
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);

  return (
    <>
      <PageHeader title="Projects" count={projects.length} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate({ name: name.trim(), color });
          setName("");
        }}
        className="bg-card border border-border rounded-lg p-3 mb-6 flex items-center gap-2"
      >
        <div className="flex gap-1">
          {PROJECT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-4 w-4 rounded-full ${color === c ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name..."
          className="flex-1 bg-transparent text-sm outline-none px-2"
        />
        <button type="submit" className="bg-accent-violet text-white text-xs px-3 py-1.5 rounded flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((p) => {
          const count = tasks.filter((t) => t.project_id === p.id && t.status !== "done").length;
          return (
            <Link
              key={p.id}
              to="/projects/$id"
              params={{ id: p.id }}
              className="bg-card border border-border rounded-lg p-4 hover:border-accent-violet transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="font-medium text-sm">{p.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">{count} open</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
