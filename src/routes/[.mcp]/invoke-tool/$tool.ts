import { createFileRoute } from "@tanstack/react-router";
import { extractBearerToken, invokeMcpTool } from "../../../lib/mcp/index";

export const Route = createFileRoute("/.mcp/invoke-tool/$tool")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const token = extractBearerToken(request);
        let rawInput = {};
        try {
          rawInput = await request.json();
        } catch {
          // empty body
        }
        const result = await invokeMcpTool(params.tool, rawInput, token);
        return Response.json(result, {
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
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
          },
        });
      },
    },
  },
});
