export function PageHeader({ title, count, action }: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        {typeof count === "number" && (
          <span className="text-sm text-muted-foreground">{count} {count === 1 ? "task" : "tasks"}</span>
        )}
      </div>
      {action}
    </div>
  );
}
