import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ReviewCTAProps {
  readonly unreviewedCount: number;
  readonly estimatedMinutes?: number;
  readonly type?: "business" | "personal";
}

export function ReviewCTA({
  unreviewedCount,
  estimatedMinutes = 3,
  type,
}: ReviewCTAProps) {
  const href = type ? `/review/${type}` : "/review";

  if (unreviewedCount === 0) {
    return (
      <div className="rounded-xl border border-border-secondary bg-bg-primary px-4 py-5 text-center shadow-sm">
        <p className="text-sm font-bold text-text-primary">All caught up</p>
        <p className="mt-1 text-[10px] text-text-tertiary">
          No new transactions to review
        </p>
      </div>
    );
  }

  return (
    <Link href={href} className="block">
      <div className="flex items-center justify-between rounded-xl bg-fg-primary px-5 py-4 shadow-lg transition-transform duration-200 active:scale-[0.98]">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-bold text-white tracking-tight">
            Review your {type ?? ""} expenses
          </p>
          <p className="text-[10px] text-text-quaternary">
            ~{estimatedMinutes} min &middot; {unreviewedCount} new items
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 font-mono text-xs font-bold text-white">
            {unreviewedCount}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white/60 hover:text-white hover:bg-white/10"
            render={<span />}
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
