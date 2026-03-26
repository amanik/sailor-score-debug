import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";

interface BarItemProps {
  readonly label: string;
  readonly amount: number;
  readonly maxAmount: number;
  readonly target?: number;
  readonly href: string;
}

function BarItem({ label, amount, maxAmount, target, href }: BarItemProps) {
  const width = Math.min((amount / maxAmount) * 100, 100);

  return (
    <Link href={href} className="group/bar block">
      <div className="flex items-center gap-2">
        <div className="bar-bg flex-1 flex items-center justify-between transition-opacity duration-200 group-hover/bar:opacity-80">
          <div
            className="bar-fill flex items-center justify-between px-2.5 py-1.5"
            style={{ width: `${width}%`, minWidth: "fit-content" }}
          >
            <span className="font-mono text-[9px] font-medium text-bg-primary whitespace-nowrap">
              {label}
            </span>
            <span className="font-mono text-[9px] font-medium text-bg-primary whitespace-nowrap ml-2">
              ${amount.toLocaleString()}
            </span>
          </div>
          {target !== undefined && (
            <div className="flex items-center justify-end px-2.5 h-full">
              <span className="font-mono text-[9px] text-text-tertiary">
                ${target.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <ChevronRight className="size-3.5 text-text-quaternary transition-all duration-200 group-hover/bar:text-text-primary group-hover/bar:translate-x-0.5" />
      </div>
    </Link>
  );
}

interface ProfitBreakdownProps {
  readonly cashCollected: number;
  readonly businessExp: number;
  readonly personalExp: number;
  readonly avgPersonalExp: number;
  readonly tax: number;
  readonly horizonFunds: number;
  readonly horizonGoal: number;
  readonly profit: number;
}

export function ProfitBreakdown({
  cashCollected,
  businessExp,
  personalExp,
  avgPersonalExp,
  tax,
  horizonFunds,
  horizonGoal,
  profit,
}: ProfitBreakdownProps) {
  return (
    <Card className="shadow-sm ring-0 border border-border-secondary">
      <CardHeader className="flex-row items-start justify-between pb-0">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-primary">
            Estimated Profit
          </p>
          <p className="text-2xl font-bold tracking-tighter text-text-primary">
            +${profit.toLocaleString()}
          </p>
        </div>
        <div className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" className="stroke-fg-primary" strokeWidth="1" />
            <path
              d="M7 1C7 1 7 7 7 7L11 7"
              className="stroke-fg-primary"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5">
        <Separator className="mb-1" />

        <div className="flex items-center justify-between px-1 font-mono text-[9px] text-text-primary">
          <span>Cash Collected</span>
          <span>${cashCollected.toLocaleString()}</span>
        </div>

        <BarItem
          label="Business Exp"
          amount={businessExp}
          maxAmount={cashCollected}
          href="/transactions/business-expenses"
        />
        <BarItem
          label="Personal Exp"
          amount={personalExp}
          maxAmount={cashCollected}
          target={avgPersonalExp}
          href="/transactions/personal-expenses"
        />
        <BarItem
          label="Tax"
          amount={tax}
          maxAmount={cashCollected}
          href="/transactions/taxes"
        />
        <BarItem
          label="Horizon Funds"
          amount={horizonFunds}
          maxAmount={cashCollected}
          target={horizonGoal}
          href="/transactions/horizon-funds"
        />

        <Separator className="mt-1" />

        <div className="flex items-center justify-between px-1 font-mono text-[9px] font-semibold text-text-primary">
          <span>Profit</span>
          <span>+${profit.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
