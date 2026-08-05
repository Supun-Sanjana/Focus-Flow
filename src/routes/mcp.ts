import { createFileRoute } from "@tanstack/react-router";
import { createTanStackMcpHandler } from "@lovable.dev/mcp-js/stacks/tanstack";
import mcp from "../lib/mcp/index";
import { createElement } from "react";
import { Server, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";

export const Route = createFileRoute("/mcp")({
  server: {
    handlers: {
      ANY: createTanStackMcpHandler(mcp, {
        resourcePath: "/mcp",
        metadataPath: "/.well-known/oauth-protected-resource",
        trustForwardedHost: true,
      }),
    },
  },
  component: McpInfoPage,
});

function McpInfoPage() {
  return createElement(
    "div",
    { className: "min-h-screen bg-background text-foreground flex items-center justify-center p-6" },
    createElement(
      "div",
      { className: "max-w-2xl w-full space-y-6 bg-card border border-border p-8 rounded-2xl shadow-xl" },
      createElement(
        "div",
        { className: "flex items-center justify-between pb-6 border-b border-border" },
        createElement(
          "div",
          { className: "flex items-center gap-3" },
          createElement("div", { className: "p-3 bg-accent-violet/10 rounded-xl text-accent-violet" }, createElement(Server, { className: "h-6 w-6" })),
          createElement(
            "div",
            null,
            createElement("h1", { className: "text-xl font-bold" }, "Focus Flow MCP Server"),
            createElement("p", { className: "text-xs text-muted-foreground" }, "Model Context Protocol Endpoint")
          )
        ),
        createElement(
          "div",
          { className: "flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium border border-emerald-500/20" },
          createElement(CheckCircle2, { className: "h-3.5 w-3.5" }),
          "Active (31 Tools)"
        )
      ),
      createElement(
        "div",
        { className: "p-4 bg-muted/50 rounded-xl border border-border text-sm space-y-2" },
        createElement("p", { className: "font-medium text-foreground flex items-center gap-2" }, createElement(Cpu, { className: "h-4 w-4 text-accent-violet" }), "AI Client Endpoint Notice"),
        createElement(
          "p",
          { className: "text-muted-foreground text-xs leading-relaxed" },
          "This URL (/mcp) is a specialized backend endpoint that communicates via JSON-RPC POST requests. It is designed to be connected to AI clients such as Claude Desktop, Cursor, or Claude.ai Connectors."
        )
      ),
      createElement(
        "div",
        { className: "space-y-3" },
        createElement("h2", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground" }, "Server Endpoints"),
        createElement(
          "div",
          { className: "grid gap-2 text-xs" },
          createElement(
            "div",
            { className: "p-3 bg-background rounded-lg border border-border flex items-center justify-between" },
            createElement("div", null, createElement("span", { className: "font-mono font-semibold text-foreground" }, "GET /.mcp/list-tools"), createElement("p", { className: "text-muted-foreground text-[11px]" }, "Inspect JSON catalog of all 31 registered tools")),
            createElement("a", { href: "/.mcp/list-tools", target: "_blank", rel: "noreferrer", className: "px-2.5 py-1 bg-muted hover:bg-muted/80 rounded font-mono text-[11px]" }, "View Catalog \u2192")
          ),
          createElement(
            "div",
            { className: "p-3 bg-background rounded-lg border border-border flex items-center justify-between" },
            createElement("div", null, createElement("span", { className: "font-mono font-semibold text-foreground" }, "GET /.well-known/oauth-protected-resource"), createElement("p", { className: "text-muted-foreground text-[11px]" }, "RFC 9728 OAuth discovery metadata")),
            createElement("a", { href: "/.well-known/oauth-protected-resource", target: "_blank", rel: "noreferrer", className: "px-2.5 py-1 bg-muted hover:bg-muted/80 rounded font-mono text-[11px]" }, "View Metadata \u2192")
          )
        )
      ),
      createElement(
        "div",
        { className: "p-4 bg-accent-violet/5 border border-accent-violet/10 rounded-xl flex items-start gap-3" },
        createElement(ShieldCheck, { className: "h-5 w-5 text-accent-violet shrink-0 mt-0.5" }),
        createElement(
          "div",
          { className: "text-xs space-y-1" },
          createElement("p", { className: "font-medium text-foreground" }, "Authenticated & RLS Protected"),
          createElement("p", { className: "text-muted-foreground leading-relaxed" }, "All tool executions authenticate via Supabase OAuth bearer tokens. Row Level Security policies ensure your tasks, habits, and roadmaps remain private to your account.")
        )
      )
    )
  );
}
