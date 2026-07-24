import { create } from "zustand";

interface UIState {
  selectedTaskId: string | null;
  quickAddOpen: boolean;
  quickAddDefaultProject?: string | null;
  setSelectedTask: (id: string | null) => void;
  setQuickAddOpen: (open: boolean, defaultProject?: string | null) => void;
}

export const useUI = create<UIState>((set) => ({
  selectedTaskId: null,
  quickAddOpen: false,
  quickAddDefaultProject: null,
  setSelectedTask: (id) => set({ selectedTaskId: id }),
  setQuickAddOpen: (open, defaultProject = null) =>
    set({ quickAddOpen: open, quickAddDefaultProject: defaultProject }),
}));

export const PROJECT_COLORS = [
  "#7C3AED", "#0EA5E9", "#10B981", "#F97316", "#EF4444",
  "#EAB308", "#EC4899", "#06B6D4", "#8B5CF6", "#64748B",
];

export const PRIORITY_META: Record<string, { label: string; color: string }> = {
  p1: { label: "P1", color: "#EF4444" },
  p2: { label: "P2", color: "#F97316" },
  p3: { label: "P3", color: "#EAB308" },
  p4: { label: "P4", color: "#9CA3AF" },
};

export const STATUSES = ["todo", "in_progress", "done"] as const;
export const STATUS_LABEL: Record<string, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};
