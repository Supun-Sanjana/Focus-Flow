import { createFileRoute } from "@tanstack/react-router";
import { projectsQO, tasksQO } from "../../lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "../../components/PageHeader";
import { TaskList } from "../../components/TaskList";

export const Route = createFileRoute("/_authenticated/unscheduled")({
  head: () => ({
    meta: [
      { title: "Unscheduled — Focus" },
      { name: "description", content: "Tasks without a due date, ready to triage." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(tasksQO);
    context.queryClient.ensureQueryData(projectsQO);
  },
  component: Unscheduled,
});

function Unscheduled() {
  const { data: tasks } = useSuspenseQuery(tasksQO);
  const { data: projects } = useSuspenseQuery(projectsQO);
  const items = tasks.filter((t) => !t.due_date && t.status !== "done");
  return (
    <>
      <PageHeader title="Unscheduled" count={items.length} />
      <TaskList tasks={items} projects={projects} emptyText="Nothing to triage — you're all set." />
    </>
  );
}
