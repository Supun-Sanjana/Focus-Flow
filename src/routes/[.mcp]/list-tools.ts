import { createFileRoute } from "@tanstack/react-router";
import { allTools } from "../../lib/mcp/index";

export const Route = createFileRoute("/.mcp/list-tools")({
  server: {
    handlers: {
      GET: () => {
        const catalog = allTools.map((t) => ({
          name: t.name,
          title: t.title ?? t.name,
          description: t.description,
          inputSchema: t.inputSchema,
          annotations: t.annotations ?? {},
        }));
        return Response.json({ tools: catalog }, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
      OPTIONS: () => {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
          },
        });
      },
    },
  },
});
