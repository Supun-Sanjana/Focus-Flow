import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";

export const projectsQO = queryOptions({
  queryKey: ["projects"],
  queryFn: api.fetchProjects,
});
export const tasksQO = queryOptions({
  queryKey: ["tasks"],
  queryFn: api.fetchTasks,
});
export const habitsQO = queryOptions({
  queryKey: ["habits"],
  queryFn: api.fetchHabits,
});
export const habitLogsQO = queryOptions({
  queryKey: ["habit_logs"],
  queryFn: api.fetchHabitLogs,
});
export const subtasksQO = (taskId: string) =>
  queryOptions({
    queryKey: ["subtasks", taskId],
    queryFn: () => api.fetchSubtasks(taskId),
    enabled: !!taskId,
  });

export function useInvalidate() {
  const qc = useQueryClient();
  return (key: string) => qc.invalidateQueries({ queryKey: [key] });
}

export function useTaskMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["tasks"] });
  return {
    create: useMutation({ mutationFn: api.createTask, onSuccess: inv }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<api.Task> }) =>
        api.updateTask(id, patch),
      onSuccess: inv,
    }),
    remove: useMutation({ mutationFn: api.deleteTask, onSuccess: inv }),
  };
}

export function useProjectMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["projects"] });
  return {
    create: useMutation({ mutationFn: api.createProject, onSuccess: inv }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<api.Project> }) =>
        api.updateProject(id, patch),
      onSuccess: inv,
    }),
    remove: useMutation({
      mutationFn: api.deleteProject,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["projects"] });
        qc.invalidateQueries({ queryKey: ["tasks"] });
      },
    }),
  };
}

export function useSubtaskMutations(taskId: string) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["subtasks", taskId] });
  return {
    create: useMutation({ mutationFn: api.createSubtask, onSuccess: inv }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<api.Subtask> }) =>
        api.updateSubtask(id, patch),
      onSuccess: inv,
    }),
    remove: useMutation({ mutationFn: api.deleteSubtask, onSuccess: inv }),
  };
}
