import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./schedule-api";

export const scheduleBlocksQO = queryOptions({
  queryKey: ["schedule_blocks"],
  queryFn: api.fetchScheduleBlocks,
});

export const scheduleRulesQO = queryOptions({
  queryKey: ["schedule_rules"],
  queryFn: api.fetchScheduleRules,
});

export function useScheduleBlockMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["schedule_blocks"] });
  return {
    create: useMutation({ mutationFn: api.createScheduleBlock, onSuccess: inv }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<api.ScheduleBlock> }) =>
        api.updateScheduleBlock(id, patch),
      onSuccess: inv,
    }),
    remove: useMutation({ mutationFn: api.deleteScheduleBlock, onSuccess: inv }),
  };
}

export function useScheduleRuleMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["schedule_rules"] });
  return {
    create: useMutation({ mutationFn: api.createScheduleRule, onSuccess: inv }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<api.ScheduleRule> }) =>
        api.updateScheduleRule(id, patch),
      onSuccess: inv,
    }),
    remove: useMutation({ mutationFn: api.deleteScheduleRule, onSuccess: inv }),
  };
}
