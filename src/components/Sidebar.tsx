import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";

import {
  CalendarDays, Inbox, CalendarRange, ListTodo, Flame, Plus, Focus as FocusIcon, LogOut,
} from "lucide-react";
import { projectsQO } from "../lib/queries";
import { useUI } from "../lib/store";
import { supabase } from "../integrations/supabase/client";
import { NotificationsBell } from "./NitificationBell";

const NAV = [
  { to: "/", label: "Today", icon: CalendarDays },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/weekly", label: "Weekly", icon: CalendarRange },
  { to: "/habits", label: "Habits", icon: Flame },
];

export function Sidebar() {
  const { data: projects } = useSuspenseQuery(projectsQO);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setQuickAdd = useUI((s) => s.setQuickAddOpen);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-[240px] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-5 py-5 flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-accent-violet flex items-center justify-center">
          <FocusIcon className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">Focus</span>
        <div className="ml-auto">
          <NotificationsBell />
        </div>
      </div>

      <nav className="px-2 space-y-0.5">
        {NAV.map((n) => {
          const active = pathname === n.to;
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                active ? "bg-sidebar-hover text-white" : "text-sidebar-foreground hover:bg-sidebar-hover"
              }`}
            >
              <Icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-sidebar-muted">Projects</span>
          <Link to="/projects" className="text-sidebar-muted hover:text-white text-xs">
            <ListTodo className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-0.5">
          {projects.map((p) => {
            const to = `/projects/${p.id}`;
            const active = pathname === to;
            return (
              <Link
                key={p.id}
                to="/projects/$id"
                params={{ id: p.id }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                  active ? "bg-sidebar-hover text-white" : "text-sidebar-foreground hover:bg-sidebar-hover"
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="truncate">{p.name}</span>
              </Link>
            );
          })}
          {projects.length === 0 && (
            <div className="text-xs text-sidebar-muted px-2 py-1">No projects yet</div>
          )}
        </div>
      </div>

      <div className="mt-auto p-3 space-y-2">
        <button
          onClick={() => setQuickAdd(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-accent-violet hover:opacity-90 text-white text-[13px] font-medium transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Task
          <span className="ml-auto text-[10px] opacity-70 border border-white/20 rounded px-1">N</span>
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sidebar-muted hover:bg-sidebar-hover hover:text-white text-[12px]"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setQuickAdd = useUI((s) => s.setQuickAddOpen);
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = pathname === n.to;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] ${active ? "text-white" : "text-sidebar-muted"}`}
            >
              <Icon className="h-5 w-5" />
              {n.label}
            </Link>
          );
        })}
        <button
          onClick={() => setQuickAdd(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] text-accent-violet"
        >
          <Plus className="h-5 w-5" />
          Add
        </button>
      </div>
    </div>
  );
}
