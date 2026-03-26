"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import { formatCurrency } from "@/lib/format";
import {
  DollarSign,
  Building2,
  Utensils,
  Monitor,
  RefreshCw,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

// ─── Donut Chart ────────────────────────────────────────────

function DonutChart({
  segments,
  size = 140,
}: {
  readonly segments: readonly { readonly label: string; readonly value: number; readonly color: string }[];
  readonly size?: number;
}) {
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
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-text-primary text-lg font-bold rotate-90"
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        >
          {formatCurrency(total)}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-[10px] text-text-tertiary">{seg.label}</span>
            <span className="text-[10px] font-semibold text-text-primary tabular-nums">{formatCurrency(seg.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────

function HorizontalBar({
  label,
  value,
  maxValue,
  color = "bg-fg-primary",
}: {
  readonly label: string;
  readonly value: number;
  readonly maxValue: number;
  readonly color?: string;
}) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-secondary">{label}</span>
        <span className="text-[11px] font-semibold text-text-primary tabular-nums">{formatCurrency(value)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Insight Card ────────────────────────────────────────────

function InsightCard({
  icon: Icon,
  title,
  description,
  severity = "info",
}: {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly severity?: "info" | "warning" | "success";
}) {
  const borderColor =
    severity === "warning"
      ? "border-amber-300"
      : severity === "success"
        ? "border-emerald-300"
        : "border-border-secondary";

  return (
    <div className={`flex gap-3 rounded-xl border ${borderColor} bg-bg-primary p-4 shadow-sm`}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-secondary">
        <Icon className="size-4 text-text-secondary" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] font-semibold text-text-primary">{title}</p>
        <p className="text-[11px] text-text-tertiary leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function InsightsPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const accounts = useAccountStore((s) => s.accounts);

  const categoryBreakdown = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount > 0 && !t.isTransfer);
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);
    const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
      return { ...acc, [t.category]: (acc[t.category] ?? 0) + t.amount };
    }, {});
    return Object.entries(grouped)
      .map(([category, amount]) => ({ category, amount, pct: total > 0 ? Math.round((amount / total) * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const COLORS = ["var(--color-fg-primary)", "var(--color-text-secondary)", "var(--color-text-tertiary)", "var(--color-text-quaternary)", "var(--color-border-secondary)", "var(--color-bg-secondary)"];
  const donutSegments = useMemo(() => {
    const top5 = categoryBreakdown.slice(0, 5);
    const rest = categoryBreakdown.slice(5);
    const segments = top5.map((item, i) => ({
      label: item.category,
      value: Math.round(item.amount),
      color: COLORS[i] ?? COLORS[COLORS.length - 1],
    }));
    if (rest.length > 0) {
      segments.push({
        label: "Other",
        value: Math.round(rest.reduce((sum, r) => sum + r.amount, 0)),
        color: COLORS[5] ?? "var(--color-bg-secondary)",
      });
    }
    return segments;
  }, [categoryBreakdown]);

  const moneyFlow = useMemo(() => {
    const nonTransfer = transactions.filter((t) => !t.isTransfer);
    const moneyIn = Math.abs(nonTransfer.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    const moneyOut = nonTransfer.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    return { moneyIn, moneyOut, leftOver: moneyIn - moneyOut };
  }, [transactions]);

  const spendingByDay = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayTotals = new Array(7).fill(0) as number[];
    transactions
      .filter((t) => t.amount > 0 && !t.isTransfer)
      .forEach((t) => {
        const day = new Date(t.date + "T12:00:00").getDay();
        dayTotals[day] += t.amount;
      });
    const maxDay = Math.max(...dayTotals);
    return days.map((label, i) => ({ label, value: Math.round(dayTotals[i]), maxValue: maxDay }));
  }, [transactions]);

  const creditCards = useMemo(
    () => accounts.filter((a) => a.category === "credit_card"),
    [accounts]
  );
  const totalCCBalance = creditCards.reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const estimatedFees = Math.round(totalCCBalance * 0.22 / 12);

  const accountCount = accounts.length;
  const checkingAccounts = accounts.filter((a) => a.category === "checking" || a.category === "hysa");
  const totalLiquid = checkingAccounts.reduce((sum, a) => sum + Math.max(a.balance, 0), 0);

  const topRecurring = useMemo(() => {
    return transactions
      .filter((t) => t.isRecurring && t.amount > 0 && !t.isTransfer && t.annualProjection)
      .sort((a, b) => (b.annualProjection ?? 0) - (a.annualProjection ?? 0))
      .slice(0, 5);
  }, [transactions]);

  const businessExpenses = useMemo(() => {
    const bizIds = accounts.filter((a) => a.type === "business").map((a) => a.id);
    return transactions.filter((t) => bizIds.includes(t.accountId) && t.amount > 0 && !t.isTransfer);
  }, [transactions, accounts]);

  const softwareSpend = businessExpenses
    .filter((t) => t.category === "Software")
    .reduce((sum, t) => sum + t.amount, 0);

  const personalExpenses = useMemo(() => {
    const personalIds = accounts.filter((a) => a.type === "personal").map((a) => a.id);
    return transactions.filter((t) => personalIds.includes(t.accountId) && t.amount > 0 && !t.isTransfer);
  }, [transactions, accounts]);

  const eatingOutSpend = personalExpenses
    .filter((t) => t.category === "Eating Out")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />
      <div className="flex flex-col gap-6 px-4">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Your Money Story
          </h1>
          <p className="text-sm text-text-tertiary">
            Here&apos;s what we&apos;d tell you if we weren&apos;t afraid to hurt your feelings.
          </p>
        </div>

        {/* Smart Alerts */}
        <section className="flex flex-col gap-2">
          <p className="section-label">Smart Alerts</p>
          {estimatedFees > 0 && (
            <InsightCard
              icon={DollarSign}
              title={`~${formatCurrency(estimatedFees)}/mo in credit card interest`}
              description={`You're carrying ${formatCurrency(totalCCBalance)} across ${creditCards.length} credit cards. At ~22% APR, that's roughly ${formatCurrency(estimatedFees * 12)}/yr in fees. Pay down the highest-rate card first.`}
              severity="warning"
            />
          )}
          {accountCount > 6 && (
            <InsightCard
              icon={Building2}
              title={`${accountCount} accounts might be too many`}
              description={`Your money is spread across ${accountCount} accounts (${formatCurrency(totalLiquid)} liquid). This can cause overdrafts, missed bills, and makes tracking harder. Consider consolidating.`}
              severity="warning"
            />
          )}
          {eatingOutSpend > 100 && (
            <InsightCard
              icon={Utensils}
              title={`${formatCurrency(eatingOutSpend)} on eating out`}
              description="Can you maintain this if your income doesn't increase? Would you do this again? Consider if the quality matched the price."
              severity="info"
            />
          )}
          {softwareSpend > 50 && (
            <InsightCard
              icon={Monitor}
              title={`${formatCurrency(softwareSpend)} on software subscriptions`}
              description="Are you getting 5x ROI on each tool? Did you already solve some of these problems but are still paying for the solution?"
              severity="info"
            />
          )}
          {topRecurring.length > 0 && topRecurring[0].annualProjection && topRecurring[0].annualProjection > 1000 && (
            <InsightCard
              icon={RefreshCw}
              title={`Your top recurring: ${topRecurring[0].merchantName} (${formatCurrency(topRecurring[0].annualProjection)}/yr)`}
              description="Do you like how frequently you're using this? Can you afford this current frequency if your income doesn't increase?"
              severity="info"
            />
          )}
        </section>

        {/* Spending Breakdown (Donut) */}
        <section className="flex flex-col gap-3">
          <p className="section-label">Spending by Category</p>
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5 shadow-sm">
            <DonutChart segments={donutSegments} size={160} />
          </div>
        </section>

        {/* Money Flow */}
        <section className="flex flex-col gap-2">
          <p className="section-label">Money Flow</p>
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-tertiary">Money in</span>
              <span className="text-[13px] font-bold text-text-primary tabular-nums">+{formatCurrency(moneyFlow.moneyIn)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-tertiary">Money out</span>
              <span className="text-[13px] font-bold text-text-primary tabular-nums">-{formatCurrency(moneyFlow.moneyOut)}</span>
            </div>
            <div className="border-t border-border-secondary pt-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-primary">Left over</span>
              <span className="text-[13px] font-bold tabular-nums text-text-primary">
                {moneyFlow.leftOver >= 0 ? "+" : "-"}{formatCurrency(moneyFlow.leftOver)}
              </span>
            </div>
          </div>
        </section>

        {/* Spending by Day */}
        <section className="flex flex-col gap-2">
          <p className="section-label">Spending by Day of Week</p>
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm flex flex-col gap-2">
            {spendingByDay.map((day) => (
              <HorizontalBar key={day.label} label={day.label} value={day.value} maxValue={day.maxValue} />
            ))}
          </div>
        </section>

        {/* Most Expensive Recurring */}
        {topRecurring.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label">Most Expensive Recurring</p>
            <div className="rounded-xl border border-border-secondary bg-bg-primary shadow-sm divide-y divide-border-secondary">
              {topRecurring.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary">
                      <RefreshCw className="size-4 text-text-secondary" />
                    </div>
                    <div className="flex flex-col gap-0">
                      <p className="text-[13px] font-semibold text-text-primary">{txn.merchantName}</p>
                      <p className="text-[10px] text-text-tertiary">{txn.recurringFrequency}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0">
                    <p className="text-[13px] font-bold text-text-primary tabular-nums">${txn.amount.toFixed(2)}</p>
                    {txn.annualProjection && (
                      <p className="text-[10px] text-text-tertiary tabular-nums">{formatCurrency(txn.annualProjection)}/yr</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Business Expense Audit */}
        <section className="flex flex-col gap-2">
          <p className="section-label">Business Expense Audit</p>
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm flex flex-col gap-2.5">
            <p className="text-[11px] text-text-tertiary leading-relaxed">
              Ask yourself about each business expense:
            </p>
            {[
              "Can I do this with existing team or by myself?",
              "Am I getting a 5x ROI on this expense?",
              "Can I do this cheaper?",
              "Do I fundamentally need this?",
              "Did I already solve this problem but I'm still paying for the solution?",
              "Is this just me people-pleasing with spending?",
            ].map((q) => (
              <div key={q} className="flex items-start gap-2">
                <AlertCircle className="size-3 text-text-quaternary mt-0.5 shrink-0" />
                <p className="text-[11px] text-text-secondary">{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Expense Audit */}
        <section className="flex flex-col gap-2">
          <p className="section-label">Personal Expense Audit</p>
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm flex flex-col gap-2.5">
            <p className="text-[11px] text-text-tertiary leading-relaxed">
              Ask yourself about each personal expense:
            </p>
            {[
              "Can I maintain this if my income doesn't increase?",
              "Do I like how frequently I'm using this?",
              "Did the quality match the price?",
              "Would I do this again?",
              "Am I just bored?",
              "Is this me trying to buy myself an identity?",
            ].map((q) => (
              <div key={q} className="flex items-start gap-2">
                <AlertCircle className="size-3 text-text-quaternary mt-0.5 shrink-0" />
                <p className="text-[11px] text-text-secondary">{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Credit Card Stack */}
        {creditCards.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label">Most Expensive Credit Cards</p>
            <div className="rounded-xl border border-border-secondary bg-bg-primary shadow-sm divide-y divide-border-secondary">
              {creditCards
                .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
                .map((card) => (
                  <div key={card.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex flex-col gap-0">
                      <p className="text-[13px] font-semibold text-text-primary">{card.name}</p>
                      <p className="text-[10px] text-text-tertiary">{card.institution} ****{card.lastFour}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0">
                      <p className="text-[13px] font-bold text-text-primary tabular-nums">{formatCurrency(Math.abs(card.balance))}</p>
                      <p className="text-[10px] text-text-tertiary tabular-nums">~${Math.round(Math.abs(card.balance) * 0.22 / 12)}/mo interest</p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      <div className="h-8 safe-bottom" />
    </div>
  );
}
