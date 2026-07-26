import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Map, Plus, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { roadmapsQO } from "../../lib/roadmap-queries";
import { createRoadmap, deleteRoadmap } from "../../lib/roadmap-api";
import { PageHeader } from "../../components/PageHeader";

export const Route = createFileRoute("/_authenticated/roadmaps/")({
  head: () => ({
    meta: [
      { title: "Roadmaps — Focus" },
      { name: "description", content: "Plan multi-phase goals with structured roadmaps." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(roadmapsQO),
  component: RoadmapsIndex,
});

function RoadmapsIndex() {
  const { data: roadmaps } = useSuspenseQuery(roadmapsQO);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  const create = useMutation({
    mutationFn: (t: string) => createRoadmap({ title: t }),
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
      navigate({ to: "/roadmaps/$id", params: { id: row.id } });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRoadmap(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roadmaps"] }),
  });

  return (
    <div>
      <PageHeader
        title="Roadmaps"
        count={roadmaps.length}
        action={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-violet text-white text-[13px] font-medium"
          >
            <Plus className="h-4 w-4" /> New roadmap
          </button>
        }
      />

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            create.mutate(title.trim());
            setTitle("");
            setOpen(false);
          }}
          className="mb-5 flex gap-2 rounded-lg border border-border bg-card p-3"
        >
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Learn Linux for DevOps"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
          />
          <button className="px-3 py-1 text-[13px] rounded-md bg-foreground text-background">Create</button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-1 text-[13px] rounded-md text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
        </form>
      )}

      {roadmaps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <Map className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No roadmaps yet. Create one to plan a multi-phase goal.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {roadmaps.map((r) => {
            const phaseCount = r.data?.phases?.length ?? 0;
            const itemCount = (r.data?.phases ?? []).reduce(
              (n, p) => n + p.columns.reduce((m, c) => m + c.items.length, 0),
              0,
            );
            return (
              <div key={r.id} className="group relative rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                <Link to="/roadmaps/$id" params={{ id: r.id }} className="block">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center">
                      <Map className="h-4 w-4 text-accent-violet" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold">{r.title}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {phaseCount} phase{phaseCount === 1 ? "" : "s"} · {itemCount} item{itemCount === 1 ? "" : "s"} · updated {format(new Date(r.updated_at), "MMM d")}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete roadmap "${r.title}"?`)) remove.mutate(r.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
