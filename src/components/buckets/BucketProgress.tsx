"use client";

import { cn } from "@/lib/utils";

interface BucketProgressProps {
  readonly current: number;
  readonly target?: number;
  readonly className?: string;
  readonly size?: "sm" | "default";
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BucketProgress({
  current,
  target,
  className,
  size = "default",
}: BucketProgressProps) {
  const percentage =
    target && target > 0 ? Math.round((current / target) * 100) : 0;
  const isOverfunded = percentage > 100;
  const clampedValue = Math.min(percentage, 100);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="h-2 w-full rounded-full bg-bg-quaternary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isOverfunded ? "bg-utility-green-500" : "bg-fg-primary"
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span
          className={cn(
            size === "default" ? "text-xs" : "text-[11px]",
            "text-text-tertiary",
            isOverfunded && "text-utility-green-600"
          )}
        >
          {target ? `${percentage}%` : "No target"}
        </span>
        <span
          className={cn(
            size === "default" ? "text-xs" : "text-[11px]",
            "text-text-tertiary",
            isOverfunded && "text-utility-green-600"
          )}
        >
          {formatCurrency(current)}
          {target ? ` / ${formatCurrency(target)}` : ""}
        </span>
      </div>
    </div>
  );
}
