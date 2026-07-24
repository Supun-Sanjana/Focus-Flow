import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PRIORITY_META, useUI } from "../lib/store";
import { projectsQO, useTaskMutations } from "../lib/queries";


export function QuickAdd() {
  const open = useUI((s) => s.quickAddOpen);
  const setOpen = useUI((s) => s.setQuickAddOpen);
  const defaultProject = useUI((s) => s.quickAddDefaultProject);
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { create } = useTaskMutations();

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<"p1" | "p2" | "p3" | "p4">("p4");

  useEffect(() => {
    if (open) {
      setTitle("");
      setProjectId(defaultProject ?? "");
      setDueDate("");
      setPriority("p4");
    }
  }, [open, defaultProject]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const editable = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (!open && !editable && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        setOpen(true);
      }
      if (open && e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    create.mutate({
      title: title.trim(),
      project_id: projectId || null,
      due_date: dueDate || null,
      priority,
    });
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[60] flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
      >
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="w-full px-4 py-3.5 text-[15px] bg-transparent outline-none border-b border-border"
        />
        <div className="flex items-center gap-2 px-3 py-2.5">
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="text-xs bg-muted rounded px-2 py-1 border border-border"
          >
            <option value="">Inbox</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="text-xs bg-muted rounded px-2 py-1 border border-border"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as never)}
            className="text-xs bg-muted rounded px-2 py-1 border border-border"
          >
            {(["p1", "p2", "p3", "p4"] as const).map((p) => (
              <option key={p} value={p}>{PRIORITY_META[p].label}</option>
            ))}
          </select>
          <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>Enter to save</span>
            <span>·</span>
            <span>Esc to close</span>
          </div>
        </div>
      </form>
    </div>
  );
}
