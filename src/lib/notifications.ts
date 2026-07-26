import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Task } from "./api";


const STORAGE_KEY = "focus.notified.v2";
const READ_KEY = "focus.notif.read.v1";
const PERM_ASKED_KEY = "focus.notif.perm-asked";

export function loadReadSet(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}
function saveReadSet(set: Set<string>) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore */
  }
}
export function markRead(keys: string[]) {
  const set = loadReadSet();
  for (const k of keys) set.add(k);
  saveReadSet(set);
  window.dispatchEvent(new Event("focus:notif-read-changed"));
}
export function markUnread(keys: string[]) {
  const set = loadReadSet();
  for (const k of keys) set.delete(k);
  saveReadSet(set);
  window.dispatchEvent(new Event("focus:notif-read-changed"));
}

type Trigger = "lead" | "morning" | "overdue";

function loadFired(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}
function saveFired(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore */
  }
}

/** 9am local on the given YYYY-MM-DD date. */
function dueMoment(dueDate: string): Date {
  const [y, m, d] = dueDate.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 9, 0, 0, 0);
}
/** End of the given day (23:59:59 local). */
function endOfDay(dueDate: string): Date {
  const [y, m, d] = dueDate.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999);
}

export interface ReminderItem {
  task: Task;
  trigger: Trigger;
  fireAt: Date;
  overdue: boolean;
  key: string;
}

/** All triggers currently due to fire for a task (respecting `now`). */
function pendingTriggers(task: Task, now: Date): ReminderItem[] {
  if (!task.due_date || task.status === "done") return [];
  const out: ReminderItem[] = [];
  const due = dueMoment(task.due_date);
  const overdueAt = endOfDay(task.due_date);
  const lead = (task as unknown as { remind_lead_minutes: number | null }).remind_lead_minutes;

  if (typeof lead === "number" && lead > 0) {
    const at = new Date(due.getTime() - lead * 60_000);
    if (now >= at && now < due) {
      out.push({ task, trigger: "lead", fireAt: at, overdue: false, key: `${task.id}:lead:${task.due_date}` });
    }
  }
  if (now >= due && now < overdueAt) {
    out.push({ task, trigger: "morning", fireAt: due, overdue: false, key: `${task.id}:morning:${task.due_date}` });
  }
  if (now > overdueAt) {
    out.push({ task, trigger: "overdue", fireAt: overdueAt, overdue: true, key: `${task.id}:overdue:${task.due_date}` });
  }
  return out;
}

/** Upcoming reminders in the next 24h + all overdue tasks — for the bell dropdown. */
export function collectUpcoming(tasks: Task[], now = new Date()): ReminderItem[] {
  const items: ReminderItem[] = [];
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  for (const t of tasks) {
    if (!t.due_date || t.status === "done") continue;
    const due = dueMoment(t.due_date);
    const overdueAt = endOfDay(t.due_date);
    const lead = (t as unknown as { remind_lead_minutes: number | null }).remind_lead_minutes;

    if (now > overdueAt) {
      items.push({ task: t, trigger: "overdue", fireAt: overdueAt, overdue: true, key: `${t.id}:overdue` });
      continue;
    }
    // pick the next upcoming fire time
    let next: Date | null = null;
    let trig: Trigger = "morning";
    if (typeof lead === "number" && lead > 0) {
      const at = new Date(due.getTime() - lead * 60_000);
      if (at > now) { next = at; trig = "lead"; }
    }
    if (!next && due > now) { next = due; trig = "morning"; }
    if (!next && now >= due && now < overdueAt) { next = due; trig = "morning"; }
    if (next && next <= in24h) {
      items.push({ task: t, trigger: trig, fireAt: next, overdue: false, key: `${t.id}:${trig}` });
    }
  }
  return items.sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
}

export function triggerLabel(t: Trigger) {
  return t === "lead" ? "Upcoming" : t === "morning" ? "Due today" : "Overdue";
}

/** Ask the browser for Notification permission (idempotent). */
export async function ensureNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

function fireNotification(item: ReminderItem) {
  const title =
    item.trigger === "overdue"
      ? `Overdue: ${item.task.title}`
      : item.trigger === "morning"
      ? `Due today: ${item.task.title}`
      : `Reminder: ${item.task.title}`;

  const body = item.task.due_date ? `Due ${item.task.due_date}` : undefined;

  toast(title, { description: body });

  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body, tag: item.key, silent: false });
    } catch {
      /* some browsers throw when constructed outside SW */
    }
  }
}

/** Mount once in the authenticated layout. Ticks every 30s, fires due reminders. */
export function useReminderEngine() {
  const qc = useQueryClient();
  const [, force] = useState(0);

  useEffect(() => {
    // Ask once, quietly, after mount.
    if (typeof window !== "undefined" && "Notification" in window) {
      const asked = localStorage.getItem(PERM_ASKED_KEY);
      if (!asked && Notification.permission === "default") {
        localStorage.setItem(PERM_ASKED_KEY, "1");
        void ensureNotificationPermission();
      }
    }

    const tick = () => {
      const tasks = qc.getQueryData<Task[]>(["tasks"]) ?? [];
      const fired = loadFired();
      const now = new Date();
      let changed = false;
      for (const t of tasks) {
        for (const item of pendingTriggers(t, now)) {
          if (fired.has(item.key)) continue;
          fireNotification(item);
          fired.add(item.key);
          changed = true;
        }
      }
      if (changed) saveFired(fired);
      force((n) => n + 1);
    };

    tick();
    const id = window.setInterval(tick, 30_000);
    const onVisible = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [qc]);
}
