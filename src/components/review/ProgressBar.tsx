interface ProgressBarProps {
  readonly current: number;
  readonly total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="section-label">Review Progress</span>
        <span className="text-[10px] font-semibold text-text-primary">
          {current} of {total}
        </span>
      </div>
      <div className="bar-bg h-1.5">
        <div
          className="bar-fill h-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
