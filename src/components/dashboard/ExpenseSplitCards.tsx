import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface ExpenseCardProps {
  readonly label: string;
  readonly sublabel: string;
  readonly amount: number;
  readonly avgMonthly: number;
  readonly href: string;
}

function ExpenseCard({ label, sublabel, amount, avgMonthly, href }: ExpenseCardProps) {
  const diff = ((amount - avgMonthly) / avgMonthly) * 100;
  const isAbove = diff > 0;
  const pctLabel = `${Math.abs(Math.round(diff))}%`;

  return (
    <Link href={href} className="block flex-1 group/link">
      <Card className="h-full shadow-sm transition-shadow duration-200 hover:shadow-md ring-0 border border-border-secondary">
        <CardContent className="flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-primary leading-tight">
                {label}
              </p>
              <p className="text-[9px] font-medium text-text-tertiary">{sublabel}</p>
            </div>
            <ChevronRight className="mt-0.5 size-3.5 text-text-tertiary transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-text-primary">
                {pctLabel}
              </span>
              <span className="text-[8px] text-text-tertiary">
                {isAbove ? "above" : "below"} avg
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <p className="text-base font-bold tracking-tighter text-text-primary">
                ${amount.toLocaleString()}
              </p>
              <p className="text-[8px] font-medium text-text-tertiary">
                ${avgMonthly.toLocaleString()}/mo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ExpenseSplitCardsProps {
  readonly businessExpenses: number;
  readonly personalExpenses: number;
  readonly avgMonthlyBusiness: number;
  readonly avgMonthlyPersonal: number;
}

export function ExpenseSplitCards({
  businessExpenses,
  personalExpenses,
  avgMonthlyBusiness,
  avgMonthlyPersonal,
}: ExpenseSplitCardsProps) {
  return (
    <div className="flex gap-2">
      <ExpenseCard
        label="Business Expenses"
        sublabel="Outflow"
        amount={businessExpenses}
        avgMonthly={avgMonthlyBusiness}
        href="/transactions/business-expenses"
      />
      <ExpenseCard
        label="Personal Expenses"
        sublabel="Outflow"
        amount={personalExpenses}
        avgMonthly={avgMonthlyPersonal}
        href="/transactions/personal-expenses"
      />
    </div>
  );
}
