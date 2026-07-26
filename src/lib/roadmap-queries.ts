import { queryOptions } from "@tanstack/react-query";
import { fetchRoadmap, fetchRoadmaps } from "./roadmap-api";

export const roadmapsQO = queryOptions({
  queryKey: ["roadmaps"],
  queryFn: fetchRoadmaps,
});

export const roadmapQO = (id: string) =>
  queryOptions({
    queryKey: ["roadmap", id],
    queryFn: () => fetchRoadmap(id),
    enabled: !!id,
  });
