import { defineMcp } from "@lovable.dev/mcp-js";
import { auth } from "@lovable.dev/mcp-js";
import * as projects from "./tools/projects";
import * as tasks from "./tools/tasks";
import * as habits from "./tools/habits";
import * as schedule from "./tools/schedule";
import * as roadmaps from "./tools/roadmaps";

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] ?? "";
const parsedRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? parsedRef ?? "project-ref-unset";

export default defineMcp({
  name: "focus-flow",
  title: "Focus Flow",
  version: "0.1.0",
  instructions:
    "Tools for Focus Flow, a personal task manager. Full CRUD over projects, tasks, subtasks, habits, the recurring weekly schedule (blocks + non-negotiable rules), and goal roadmaps (phases with columns of items, plus phase progress). All calls act as the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    projects.listProjects,
    projects.createProject,
    projects.updateProject,
    projects.deleteProject,
    tasks.listTasks,
    tasks.createTask,
    tasks.updateTask,
    tasks.deleteTask,
    tasks.listSubtasks,
    tasks.createSubtask,
    tasks.updateSubtask,
    tasks.deleteSubtask,
    habits.listHabits,
    habits.createHabit,
    habits.updateHabit,
    habits.deleteHabit,
    habits.setHabitLog,
    schedule.listScheduleBlocks,
    schedule.createScheduleBlock,
    schedule.updateScheduleBlock,
    schedule.deleteScheduleBlock,
    schedule.listScheduleRules,
    schedule.createScheduleRule,
    schedule.updateScheduleRule,
    schedule.deleteScheduleRule,
    roadmaps.listRoadmaps,
    roadmaps.getRoadmap,
    roadmaps.createRoadmap,
    roadmaps.importRoadmapMarkdown,
    roadmaps.updateRoadmap,
    roadmaps.setRoadmapPhaseStatus,
    roadmaps.deleteRoadmap,
  ],
});
