import { useEffect, useState } from "react";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { X, Trash2, Plus, Check } from "lucide-react";
import { PRIORITY_META, STATUS_LABEL, STATUSES, useUI } from "../lib/store";
import { projectsQO, subtasksQO, tasksQO, useSubtaskMutations, useTaskMutations } from "../lib/queries";

export function TaskDetail() {
  const selectedId = useUI((s) => s.selectedTaskId);
  const setSelected = useUI((s) => s.setSelectedTask);
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const { data: projects } = useSuspenseQuery(projectsQO);
  const task = tasks.find((t) => t.id === selectedId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSelected]);

  const { update, remove } = useTaskMutations();
  const { data: subtasks = [] } = useQuery(subtasksQO(task?.id ?? ""));
  const sub = useSubtaskMutations(task?.id ?? "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setTagsInput((task.tags ?? []).join(", "));
    }
  }, [task?.id]);

  if (!task) return null;

  const patch = (p: Partial<typeof task>) => update.mutate({ id: task.id, patch: p });

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={() => setSelected(null)}
      />
      <aside className="fixed right-0 top-0 h-full w-full md:w-[380px] bg-card z-50 border-l border-border shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-4 h-12 border-b border-border">
          <span className="text-xs text-muted-foreground">Task</span>
          <button
            onClick={() => setSelected(null)}
            className="p-1 hover:bg-muted rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title !== task.title && patch({ title })}
            className="w-full text-lg font-semibold bg-transparent outline-none focus:border-b focus:border-accent-violet"
          />

          <Field label="Status">
            <div className="flex gap-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => patch({ status: s })}
                  className={`px-2.5 py-1 rounded text-xs border ${
                    task.status === s
                      ? "bg-accent-violet text-white border-accent-violet"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Priority">
            <div className="flex gap-1.5">
              {(["p1", "p2", "p3", "p4"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => patch({ priority: p })}
                  className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 border ${
                    task.priority === p ? "border-foreground" : "border-border hover:bg-muted"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PRIORITY_META[p].color }} />
                  {PRIORITY_META[p].label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Project">
            <select
              value={task.project_id ?? ""}
              onChange={(e) => patch({ project_id: e.target.value || null })}
              className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded"
            >
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Due date">
            <input
              type="date"
              value={task.due_date ?? ""}
              onChange={(e) => patch({ due_date: e.target.value || null })}
              className="px-2 py-1.5 text-sm bg-background border border-border rounded"
            />
          </Field>

          <Field label="Tags">
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onBlur={() =>
                patch({
                  tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
              placeholder="work, urgent, ..."
              className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {(task.tags ?? []).map((tag) => (
                <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => description !== (task.description ?? "") && patch({ description })}
              rows={4}
              className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded resize-none"
              placeholder="Add notes..."
            />
          </Field>

          <Field label="Subtasks">
            <div className="space-y-1">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => sub.update.mutate({ id: st.id, patch: { is_done: !st.is_done } })}
                    className={`h-4 w-4 rounded border-[1.5px] flex items-center justify-center ${
                      st.is_done ? "bg-accent-violet border-accent-violet" : "border-muted-foreground/40"
                    }`}
                  >
                    {st.is_done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </button>
                  <span className={`text-sm flex-1 ${st.is_done ? "line-through text-muted-foreground" : ""}`}>
                    {st.title}
                  </span>
                  <button
                    onClick={() => sub.remove.mutate(st.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newSubtask.trim()) return;
                  sub.create.mutate({
                    task_id: task.id,
                    title: newSubtask.trim(),
                    order_index: subtasks.length,
                  });
                  setNewSubtask("");
                }}
                className="flex items-center gap-2 pt-1"
              >
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add subtask"
                  className="flex-1 text-sm bg-transparent outline-none"
                />
              </form>
            </div>
          </Field>

          <Field label="Recurring">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={task.is_recurring}
                  onChange={(e) => patch({ is_recurring: e.target.checked, recur_pattern: e.target.checked ? (task.recur_pattern ?? "daily") : null })}
                />
                Recurring
              </label>
              {task.is_recurring && (
                <select
                  value={task.recur_pattern ?? "daily"}
                  onChange={(e) => patch({ recur_pattern: e.target.value })}
                  className="px-2 py-1 text-sm bg-background border border-border rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              )}
            </div>
          </Field>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              if (confirm("Delete this task?")) {
                remove.mutate(task.id);
                setSelected(null);
              }
            }}
            className="flex items-center gap-2 text-sm text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded"
          >
            <Trash2 className="h-4 w-4" />
            Delete task
          </button>
        </div>
      </aside>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </div>
  );
}
