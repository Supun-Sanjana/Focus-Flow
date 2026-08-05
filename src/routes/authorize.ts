import { createFileRoute, redirect } from "@tanstack/react-router";
import { projectRef } from "@/lib/mcp/index";

export const Route = createFileRoute("/authorize")({
  loader: ({ location }) => {
    const targetUrl = `https://${projectRef}.supabase.co/auth/v1/authorize${location.searchStr}`;
    throw redirect({ href: targetUrl });
  },
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const targetUrl = `https://${projectRef}.supabase.co/auth/v1/authorize${url.search}`;
        return Response.redirect(targetUrl, 302);
      },
    },
  },
});
