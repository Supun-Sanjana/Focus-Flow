import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";

import { extractErrorMessage, isClockSkewJwtError } from "../lib/auth-recovery";
import { supabase } from "../integrations/supabase/client";
import appCss from "../style.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">Page not found.</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const clockSkew = isClockSkewJwtError(error);
  const message = extractErrorMessage(error);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore errors on sign out
    }
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/auth";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold">
          {clockSkew ? "Your device clock looks off" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {clockSkew
            ? "Your computer's date & time is ahead of the server, so your sign-in token was rejected. Enable 'Set time automatically' in Windows Settings, then try again."
            : message || "An unexpected error occurred."}
        </p>
        <div className="mt-5 flex gap-3 justify-center">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="px-4 py-2 text-sm bg-accent-violet text-white rounded font-medium"
          >
            Try again
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm border border-border rounded font-medium hover:bg-muted/50"
          >
            Sign out & Re-authenticate
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Focus — Personal Task Manager" },
      { name: "description", content: "A minimal, keyboard-first task manager for focused work." },
      { property: "og:title", content: "Focus — Personal Task Manager" },
      { property: "og:description", content: "A minimal, keyboard-first task manager for focused work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
