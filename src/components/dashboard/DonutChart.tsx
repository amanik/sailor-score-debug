"use client";

export interface DonutSegment {
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

const GRAYSCALE_COLORS = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
] as const;

interface DonutChartProps {
  readonly segments: readonly DonutSegment[];
  readonly size?: number;
  readonly centerLabel?: string;
}

export function assignGrayscaleColors(
  items: readonly { readonly label: string; readonly value: number }[]
): readonly DonutSegment[] {
  return items.map((item, i) => ({
    ...item,
    color: GRAYSCALE_COLORS[i % GRAYSCALE_COLORS.length],
  }));
}

export function DonutChart({
  segments,
  size = 140,
  centerLabel,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-bg-secondary"
          strokeWidth={14}
        />
        {segments.map((seg) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const dashOffset = -offset;
          offset += dash;
          return (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={14}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
            />
          );
        })}
        {centerLabel && (
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-text-primary rotate-90 text-[11px] font-bold"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {centerLabel}
          </text>
        )}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[10px] text-text-tertiary">
              {seg.label}
            </span>
            <span className="font-mono text-[10px] font-medium text-text-secondary">
              {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
