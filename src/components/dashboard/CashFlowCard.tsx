import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CashFlowCardProps {
  readonly cashCollected: number;
  readonly avgMonthly: number;
}

export function CashFlowCard({ cashCollected, avgMonthly }: CashFlowCardProps) {
  const diff = avgMonthly > 0 ? ((cashCollected - avgMonthly) / avgMonthly) * 100 : 0;
  const isBelow = diff < 0;
  const pctLabel = `${Math.abs(Math.round(diff))}%`;

  return (
    <Link href="/transactions/cash-flow" className="block group/link">
      <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md ring-0 border border-border-secondary">
        <CardContent className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-primary">
              Cash Collected
            </p>
            <p className="text-[9px] font-medium text-text-tertiary">
              Inflow this month
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="rounded bg-bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-text-primary">
                {pctLabel}
              </span>
              <span className="text-[9px] text-text-tertiary">
                {isBelow ? "below" : "above"} mo. avg
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-end gap-1">
              <p className="text-2xl font-bold tracking-tighter text-text-primary">
                ${cashCollected.toLocaleString()}
              </p>
              <p className="text-[9px] font-medium text-text-tertiary">
                Avg: ${avgMonthly.toLocaleString()}/mo
              </p>
            </div>
            <ChevronRight className="mt-1.5 size-4 text-text-tertiary transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
