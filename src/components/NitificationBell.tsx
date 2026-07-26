import { useEffect, useMemo, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Bell, BellOff, Check } from "lucide-react";
import { tasksQO } from "../lib/queries";
import { PRIORITY_META, useUI } from "../lib/store";
import { collectUpcoming, ensureNotificationPermission, loadReadSet, markRead, markUnread, triggerLabel } from "../lib/notifications";



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

function useReadSet() {
  const [set, setSet] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set() : loadReadSet(),
  );
  useEffect(() => {
    const refresh = () => setSet(loadReadSet());
    window.addEventListener("focus:notif-read-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus:notif-read-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return set;
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
  const readSet = useReadSet();
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
  const unread = items.filter((i) => !readSet.has(i.key));
  const overdueUnread = unread.filter((i) => i.overdue).length;
  const unreadCount = unread.length;
  const hasAnyUnread = unreadCount > 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-muted hover:bg-sidebar-hover hover:text-white text-[13px]"
        aria-label="Notifications"
      >
        {perm === "denied" ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {unreadCount > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-semibold flex items-center justify-center ${
              overdueUnread > 0 ? "bg-red-500 text-white" : "bg-accent-violet text-white"
            }`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 md:left-full md:ml-2 bottom-full mb-2 md:bottom-auto md:top-0 w-[320px] bg-card text-foreground rounded-lg border border-border shadow-xl z-[70] overflow-hidden">
          <div className="px-3 py-2.5 border-b border-border flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reminders
            </span>
            <div className="flex items-center gap-2">
              {hasAnyUnread && (
                <button
                  onClick={() => markRead(items.map((i) => i.key))}
                  className="text-[11px] text-accent-violet hover:underline"
                >
                  Mark all read
                </button>
              )}
              {perm !== "granted" && "Notification" in window && (
                <button
                  onClick={async () => setPerm(await ensureNotificationPermission())}
                  className="text-[11px] text-accent-violet hover:underline"
                >
                  {perm === "denied" ? "Blocked" : "Enable alerts"}
                </button>
              )}
            </div>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {items.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                No upcoming reminders
              </div>
            )}
            {items.map((it) => {
              const isRead = readSet.has(it.key);
              return (
                <div
                  key={it.key}
                  className={`group w-full px-3 py-2.5 hover:bg-muted border-b border-border/60 last:border-0 flex items-start gap-2 ${
                    isRead ? "opacity-60" : ""
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isRead ? markUnread([it.key]) : markRead([it.key]);
                    }}
                    aria-label={isRead ? "Mark as unread" : "Mark as read"}
                    className="mt-1 shrink-0 relative"
                  >
                    {isRead ? (
                      <span className="h-2 w-2 block rounded-full border border-muted-foreground/50" />
                    ) : (
                      <span
                        className="h-2 w-2 block rounded-full"
                        style={{ backgroundColor: PRIORITY_META[it.task.priority]?.color ?? "#9CA3AF" }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      markRead([it.key]);
                      setSelected(it.task.id);
                      setOpen(false);
                    }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className={`text-[13px] truncate ${isRead ? "" : "font-medium"}`}>
                      {it.task.title}
                    </div>
                    <div className="text-[11px] mt-0.5 flex items-center gap-1.5">
                      <span className={it.overdue && !isRead ? "text-red-500 font-medium" : "text-muted-foreground"}>
                        {triggerLabel(it.trigger)}
                      </span>
                      <span className="text-muted-foreground">· {relTime(it.fireAt)}</span>
                    </div>
                  </button>
                  {!isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markRead([it.key]);
                      }}
                      aria-label="Mark as read"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
