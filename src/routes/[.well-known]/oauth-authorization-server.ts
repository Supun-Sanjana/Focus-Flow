import { createFileRoute } from "@tanstack/react-router";
import { projectRef } from "../../lib/mcp/index";

export const Route = createFileRoute("/.well-known/oauth-authorization-server")({
  server: {
    handlers: {
      GET: () => {
        const issuer = `https://${projectRef}.supabase.co/auth/v1`;
        return Response.json(
          {
            issuer,
            authorization_endpoint: "https://focusflow.cylvox.com/authorize",
            token_endpoint: `${issuer}/token`,
            jwks_uri: `${issuer}/.well-known/jwks.json`,
            response_types_supported: ["code"],
            grant_types_supported: ["authorization_code", "refresh_token"],
            token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic", "none"],
            scopes_supported: ["authenticated"],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
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
