import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { supabase } from "../../integrations/supabase/client";
import { useReminderEngine } from "../../lib/notifications";
import { MobileNav, Sidebar } from "../../components/Sidebar";
import { QuickAdd } from "../../components/QuickAdd";
import { TaskDetail } from "../../components/TaskDetail";
import { Loader2 } from "lucide-react";
import { getSessionSafe } from "../../lib/auth-recovery";

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // getSessionSafe never throws on JWT/clock-skew errors ("JWT issued at future"),
    // which previously bubbled to the root error boundary as a full-app crash.
    const session = await getSessionSafe();
    if (!session?.user) throw redirect({ to: "/auth" });
    return { user: session.user };
  },
  component: AuthenticatedLayout,
  pendingComponent: Loading,
  pendingMs: 0,
});

function AuthenticatedLayout() {
  useReminderEngine();
  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:pl-[240px] pb-20 md:pb-0">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
        <MobileNav />
        <TaskDetail />
        <QuickAdd />
      </div>
    </Suspense>
  );
}

