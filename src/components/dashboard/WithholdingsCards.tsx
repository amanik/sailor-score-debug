import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CircularGaugeProps {
  readonly percentage: number;
  readonly size?: number;
}

function CircularGauge({ percentage, size = 56 }: CircularGaugeProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const capped = Math.min(percentage, 120);
  const offset = circumference - (capped / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-border-secondary"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-fg-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s ease-out" }}
        />
      </svg>
      <span className="absolute font-mono text-[11px] font-semibold text-text-primary tracking-tight">
        {percentage}%
      </span>
    </div>
  );
}

interface WithholdingCardProps {
  readonly title: string;
  readonly subtitle: string;
  readonly amount: number;
  readonly percentage: number;
  readonly targetLabel: string;
  readonly targetAmount: number;
  readonly href: string;
}

function WithholdingCard({
  title,
  subtitle,
  amount,
  percentage,
  targetLabel,
  targetAmount,
  href,
}: WithholdingCardProps) {
  return (
    <Link href={href} className="block flex-1 group/link">
      <Card className="h-full shadow-sm transition-shadow duration-200 hover:shadow-md ring-0 border border-border-secondary">
        <CardContent className="flex items-start justify-between gap-2">
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-primary">
                {title}
              </p>
              <p className="text-[9px] font-medium text-text-tertiary">{subtitle}</p>
            </div>
            <p className="text-base font-bold tracking-tighter text-text-primary">
              ${amount.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <CircularGauge percentage={percentage} />
            <p className="font-mono text-[8px] font-semibold text-text-tertiary">
              {targetLabel}: ${targetAmount.toLocaleString()}
            </p>
            <ChevronRight className="size-3.5 text-text-tertiary transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface WithholdingsCardsProps {
  readonly taxesHeld: number;
  readonly taxCalc: number;
  readonly taxPercentage: number;
  readonly horizonFunds: number;
  readonly horizonGoal: number;
  readonly horizonPercentage: number;
}

export function WithholdingsCards({
  taxesHeld,
  taxCalc,
  taxPercentage,
  horizonFunds,
  horizonGoal,
  horizonPercentage,
}: WithholdingsCardsProps) {
  return (
    <div className="flex gap-2">
      <WithholdingCard
        title="Taxes Held"
        subtitle="Monthly est."
        amount={taxesHeld}
        percentage={taxPercentage}
        targetLabel="Calc"
        targetAmount={taxCalc}
        href="/transactions/taxes"
      />
      <WithholdingCard
        title="Horizon Funds"
        subtitle="Monthly est."
        amount={horizonFunds}
        percentage={horizonPercentage}
        targetLabel="Goal"
        targetAmount={horizonGoal}
        href="/transactions/horizon-funds"
      />
    </div>
  );
}
