import { useEffect, useMemo, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Bell, BellOff } from "lucide-react";
import { tasksQO } from "../lib/queries";
import { PRIORITY_META, useUI } from "../lib/store";
import { collectUpcoming, ensureNotificationPermission, triggerLabel } from "../lib/notifications";



function useNotifPermission() {
  const [perm, setPerm] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "denied",
  );
  useEffect(() => {
    const id = window.setInterval(() => {
      if ("Notification" in window) setPerm(Notification.permission);
    }, 2000);
    return () => window.clearInterval(id);
  }, []);
  return [perm, setPerm] as const;
}

function relTime(d: Date, now = new Date()) {
  const diff = d.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const m = Math.round(abs / 60000);
  const h = Math.round(abs / 3_600_000);
  const suffix = diff < 0 ? " ago" : "";
  const prefix = diff < 0 ? "" : "in ";
  if (m < 60) return `${prefix}${m}m${suffix}`;
  if (h < 24) return `${prefix}${h}h${suffix}`;
  const days = Math.round(abs / 86_400_000);
  return `${prefix}${days}d${suffix}`;
}

export function NotificationsBell() {
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const setSelected = useUI((s) => s.setSelectedTask);
  const [open, setOpen] = useState(false);
  const [perm, setPerm] = useNotifPermission();
  const ref = useRef<HTMLDivElement>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const items = useMemo(() => collectUpcoming(tasks), [tasks]);
  const overdueCount = items.filter((i) => i.overdue).length;
  const total = items.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-muted hover:bg-sidebar-hover hover:text-white text-[13px]"
        aria-label="Notifications"
      >
        {perm === "denied" ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {total > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-semibold flex items-center justify-center ${
              overdueCount > 0 ? "bg-red-500 text-white" : "bg-accent-violet text-white"
            }`}
          >
            {total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 md:left-full md:ml-2 bottom-full mb-2 md:bottom-auto md:top-0 w-[300px] bg-card text-foreground rounded-lg border border-border shadow-xl z-[70] overflow-hidden">
          <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reminders
            </span>
            {perm !== "granted" && "Notification" in window && (
              <button
                onClick={async () => setPerm(await ensureNotificationPermission())}
                className="text-[11px] text-accent-violet hover:underline"
              >
                {perm === "denied" ? "Blocked" : "Enable browser alerts"}
              </button>
            )}
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {items.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                No upcoming reminders
              </div>
            )}
            {items.map((it) => (
              <button
                key={it.key}
                onClick={() => {
                  setSelected(it.task.id);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-muted border-b border-border/60 last:border-0 flex items-start gap-2"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: PRIORITY_META[it.task.priority]?.color ?? "#9CA3AF" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] truncate">{it.task.title}</div>
                  <div className="text-[11px] mt-0.5 flex items-center gap-1.5">
                    <span className={it.overdue ? "text-red-500 font-medium" : "text-muted-foreground"}>
                      {triggerLabel(it.trigger)}
                    </span>
                    <span className="text-muted-foreground">· {relTime(it.fireAt)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
