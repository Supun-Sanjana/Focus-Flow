import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ToolContext, ToolDefinition } from "./types";

import * as projects from "./tools/projects";
import * as tasks from "./tools/tasks";
import * as habits from "./tools/habits";
import * as schedule from "./tools/schedule";
import * as roadmaps from "./tools/roadmaps";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] ?? "";
const parsedRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
export const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? parsedRef ?? "project-ref-unset";

export const allTools: ToolDefinition[] = [
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
];

export function getMcpMetadata() {
  return {
    resource: `https://focusflow.cylvox.com/mcp`,
    authorization_servers: [`https://${projectRef}.supabase.co/auth/v1`],
    scopes_supported: ["authenticated"],
    bearer_methods_supported: ["header"],
  };
}

export function extractBearerToken(request: Request): string | undefined {
  const authHeader = request.headers.get("Authorization") ?? request.headers.get("authorization");
  if (!authHeader) return undefined;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim();
}

export function createToolContext(token?: string): ToolContext {
  return {
    getToken: () => token,
    isAuthenticated: () => Boolean(token),
    principal: token ? { sub: "authenticated-user" } : undefined,
  };
}

export async function invokeMcpTool(name: string, rawInput: unknown, token?: string) {
  const tool = allTools.find((t) => t.name === name);
  if (!tool) {
    return { content: [{ type: "text", text: `Tool '${name}' not found.` }], isError: true };
  }
  const ctx = createToolContext(token);
  const schema = z.object(tool.inputSchema);
  const parsed = schema.safeParse(rawInput ?? {});
  if (!parsed.success) {
    return { content: [{ type: "text", text: `Invalid arguments: ${parsed.error.message}` }], isError: true };
  }
  return tool.handler(parsed.data as any, ctx);
}

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "focus-flow",
    version: "0.1.0",
  });

  for (const tool of allTools) {
    server.tool(tool.name, tool.description, tool.inputSchema, async (args, extra) => {
      // Get bearer token from extra if passed in context
      const token = (extra as any)?.token;
      const ctx = createToolContext(token);
      const res = await tool.handler(args as any, ctx);
      return res as any;
    });
  }

  return server;
}
