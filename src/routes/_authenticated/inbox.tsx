import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsQO, tasksQO } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { TaskList } from "@/components/TaskList";

export const Route = createFileRoute("/_authenticated/inbox")({
  head: () => ({ meta: [{ title: "Inbox — Focus" }, { name: "description", content: "Unscheduled tasks to triage." }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(tasksQO);
    context.queryClient.ensureQueryData(projectsQO);
  },
  component: Inbox,
});

function Inbox() {
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const { data: projects } = useSuspenseQuery(projectsQO);
  const inbox = tasks.filter((t) => !t.due_date && t.status !== "done");
  return (
    <>
      <PageHeader title="Inbox" count={inbox.length} />
      <TaskList tasks={inbox} projects={projects} emptyText="Inbox zero. Nice." />
    </>
  );
}
