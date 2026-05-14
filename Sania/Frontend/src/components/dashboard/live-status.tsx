export function LiveStatus({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground">
      <span className="live-dot" />
      {label}
    </span>
  );
}
