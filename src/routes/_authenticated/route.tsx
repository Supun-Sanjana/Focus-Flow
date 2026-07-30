import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { supabase } from "../../integrations/supabase/client";
import { useReminderEngine } from "../../lib/notifications";
import { MobileNav, Sidebar } from "../../components/Sidebar";
import { QuickAdd } from "../../components/QuickAdd";
import { TaskDetail } from "../../components/TaskDetail";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  useReminderEngine();
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:pl-[240px] pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-6 py-8">
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
