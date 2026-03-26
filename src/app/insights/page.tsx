"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import { useBucketStore, selectBucketsByType } from "@/stores/buckets";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import {
  DollarSign,
  Building2,
  Utensils,
  Monitor,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Wallet,
  CreditCard,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Star,
  AlertTriangle,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// ─── Donut Chart ────────────────────────────────────────────

function DonutChart({
  segments,
  size = 140,
  centerLabel,
}: {
  readonly segments: readonly { readonly label: string; readonly value: number; readonly color: string }[];
  readonly size?: number;
  readonly centerLabel?: string;
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
          {centerLabel ?? formatCurrency(total)}
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

// ─── Waterfall Meter ─────────────────────────────────────────

function WaterfallMeter({
  label,
  icon: Icon,
  current,
  target,
  description,
}: {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly current: number;
  readonly target: number;
  readonly description: string;
}) {
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  const isFull = pct >= 100;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary">
          <Icon className="size-4 text-text-secondary" />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <p className="text-[13px] font-semibold text-text-primary">{label}</p>
          <p className="text-[13px] font-bold tabular-nums text-text-primary">
            {formatCurrency(current)}
            <span className="text-text-tertiary font-normal"> / {formatCurrency(target)}</span>
          </p>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isFull ? "bg-emerald-500" : "bg-fg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-text-tertiary">{description}</p>
        <p className={`text-[10px] font-semibold tabular-nums ${isFull ? "text-emerald-600" : "text-text-secondary"}`}>
          {pct}%
        </p>
      </div>
    </div>
  );
}

// ─── Review Summary Card ─────────────────────────────────────

function ReviewBucketRow({
  icon: Icon,
  label,
  count,
  amount,
  href,
}: {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly count: number;
  readonly amount: number;
  readonly href: string;
}) {
  if (count === 0) return null;
  return (
    <Link href={href} className="flex items-center justify-between py-2 group/row hover:bg-bg-secondary/30 -mx-1 px-1 rounded-lg transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-text-secondary" />
        <span className="text-[12px] text-text-primary">{label}</span>
        <span className="text-[10px] text-text-tertiary">({count})</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[12px] font-bold tabular-nums text-text-primary">{formatCurrency(amount)}</span>
        <ChevronRight className="size-3 text-text-quaternary group-hover/row:text-text-primary transition-colors" />
      </div>
    </Link>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function InsightsPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const accounts = useAccountStore((s) => s.accounts);
  const buckets = useBucketStore((s) => s.buckets);

  // ─── Cashflow Waterfall Health ───────────────────────────
  const waterfallHealth = useMemo(() => {
    const bizAccounts = accounts.filter((a) => a.type === "business");
    const bizExpenses = transactions.filter((t) => {
      const isBiz = bizAccounts.some((a) => a.id === t.accountId);
      return isBiz && t.amount > 0 && !t.isTransfer;
    });
    const monthlyExpenses = bizExpenses.reduce((sum, t) => sum + t.amount, 0);

    // Buffer = checking balance (business checking)
    const bizChecking = bizAccounts.filter((a) => a.category === "checking" || a.category === "hysa");
    const checkingBalance = bizChecking.reduce((sum, a) => sum + Math.max(a.balance, 0), 0);
    const bufferTarget = monthlyExpenses; // 1 month of expenses

    // Working Capital = 2x monthly expenses
    const wcTarget = monthlyExpenses * 2;
    // Approximate WC from savings-type accounts
    const bizSavings = bizAccounts.filter((a) => a.category === "savings" || a.category === "hysa");
    const wcCurrent = bizSavings.reduce((sum, a) => sum + Math.max(a.balance, 0), 0);

    // Tax savings from buckets
    const taxBuckets = buckets.filter(
      (b) => b.isActive && b.name.toLowerCase().includes("tax")
    );
    const taxSaved = taxBuckets.reduce((sum, b) => sum + b.current, 0);
    const taxTarget = taxBuckets.reduce((sum, b) => sum + (b.target ?? 0), 0);

    return {
      checkingBalance,
      bufferTarget,
      wcCurrent,
      wcTarget,
      taxSaved,
      taxTarget: taxTarget > 0 ? taxTarget : monthlyExpenses * 0.25, // fallback: 25% of expenses
      monthlyExpenses,
    };
  }, [transactions, accounts, buckets]);

  // ─── Review Summary ──────────────────────────────────────
  const reviewSummary = useMemo(() => {
    const reviewed = transactions.filter((t) => t.reviewed && !t.isTransfer);
    const unreviewed = transactions.filter((t) => !t.reviewed && !t.isTransfer && t.amount > 0);

    const biz = reviewed.filter((t) => {
      const acct = accounts.find((a) => a.id === t.accountId);
      return acct?.type === "business" && t.amount > 0;
    });
    const personal = reviewed.filter((t) => {
      const acct = accounts.find((a) => a.id === t.accountId);
      return acct?.type === "personal" && t.amount > 0;
    });

    const highRoi = biz.filter((t) => t.businessBucket === "high_roi");
    const noRoi = biz.filter((t) => t.businessBucket === "no_roi");
    const unsure = biz.filter((t) => t.businessBucket === "unsure");

    const essential = personal.filter((t) => t.personalBucket === "essential");
    const meaningful = personal.filter((t) => t.personalBucket === "meaningful");
    const mismatch = personal.filter((t) => t.personalBucket === "mismatch");

    const sum = (txns: typeof biz) => txns.reduce((s, t) => s + t.amount, 0);

    return {
      unreviewedCount: unreviewed.length,
      business: {
        highRoi: { count: highRoi.length, amount: sum(highRoi) },
        noRoi: { count: noRoi.length, amount: sum(noRoi) },
        unsure: { count: unsure.length, amount: sum(unsure) },
        total: biz.length,
      },
      personal: {
        essential: { count: essential.length, amount: sum(essential) },
        meaningful: { count: meaningful.length, amount: sum(meaningful) },
        mismatch: { count: mismatch.length, amount: sum(mismatch) },
        total: personal.length,
      },
    };
  }, [transactions, accounts]);

  // ─── Category Breakdown ──────────────────────────────────
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

  // ─── Money Flow ──────────────────────────────────────────
  const moneyFlow = useMemo(() => {
    const nonTransfer = transactions.filter((t) => !t.isTransfer);
    const moneyIn = Math.abs(nonTransfer.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    const moneyOut = nonTransfer.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    return { moneyIn, moneyOut, leftOver: moneyIn - moneyOut };
  }, [transactions]);

  // ─── Debt ────────────────────────────────────────────────
  const debtAccounts = useMemo(
    () =>
      accounts
        .filter(
          (a) =>
            a.category === "credit_card" ||
            a.category === "loan" ||
            a.category === "line_of_credit"
        )
        .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)),
    [accounts]
  );
  const totalDebt = debtAccounts.reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const estimatedMonthlyInterest = Math.round(totalDebt * 0.22 / 12);

  // ─── Recurring ───────────────────────────────────────────
  const topRecurring = useMemo(() => {
    return transactions
      .filter((t) => t.isRecurring && t.amount > 0 && !t.isTransfer && t.annualProjection)
      .sort((a, b) => (b.annualProjection ?? 0) - (a.annualProjection ?? 0))
      .slice(0, 5);
  }, [transactions]);

  // ─── Smart Alerts ────────────────────────────────────────
  const alerts = useMemo(() => {
    const result: Array<{ icon: LucideIcon; title: string; description: string; severity: "info" | "warning" | "success" }> = [];

    // Buffer below target
    if (waterfallHealth.bufferTarget > 0 && waterfallHealth.checkingBalance < waterfallHealth.bufferTarget * 0.5) {
      result.push({
        icon: AlertCircle,
        title: `Checking is ${formatCurrency(waterfallHealth.checkingBalance)} — below your buffer`,
        description: `Your buffer target is ${formatCurrency(waterfallHealth.bufferTarget)} (1 month of expenses). You're at ${Math.round((waterfallHealth.checkingBalance / waterfallHealth.bufferTarget) * 100)}%. Focus on building this before paying down debt.`,
        severity: "warning",
      });
    }

    // CC interest
    if (estimatedMonthlyInterest > 0) {
      result.push({
        icon: CreditCard,
        title: `~${formatCurrency(estimatedMonthlyInterest)}/mo in estimated interest`,
        description: `You're carrying ${formatCurrency(totalDebt)} in debt. At ~22% APR, that's roughly ${formatCurrency(estimatedMonthlyInterest * 12)}/yr. Pay down the highest-rate balance first.`,
        severity: "warning",
      });
    }

    // Biz/personal bleed — transactions on wrong account type
    const bizAccountIds = accounts.filter((a) => a.type === "business").map((a) => a.id);
    const personalOnBiz = transactions.filter(
      (t) => bizAccountIds.includes(t.accountId) && t.personalBucket && !t.isTransfer
    );
    if (personalOnBiz.length > 0) {
      result.push({
        icon: Building2,
        title: `${personalOnBiz.length} personal expenses on business accounts`,
        description: "Move personal charges off business accounts to keep your P&L clean. Your bookkeeper will thank you.",
        severity: "warning",
      });
    }

    // High mismatch rate
    if (reviewSummary.personal.total > 0) {
      const mismatchPct = Math.round((reviewSummary.personal.mismatch.count / reviewSummary.personal.total) * 100);
      if (mismatchPct > 25) {
        result.push({
          icon: AlertTriangle,
          title: `${mismatchPct}% of personal spending is mismatch`,
          description: `${formatCurrency(reviewSummary.personal.mismatch.amount)} didn't align with your values. That's okay — awareness is the first step. What pattern do you notice?`,
          severity: "info",
        });
      }
    }

    // High no-ROI rate
    if (reviewSummary.business.total > 0) {
      const noRoiPct = Math.round((reviewSummary.business.noRoi.count / reviewSummary.business.total) * 100);
      if (noRoiPct > 20) {
        result.push({
          icon: TrendingDown,
          title: `${formatCurrency(reviewSummary.business.noRoi.amount)} in No-ROI business spend`,
          description: `${noRoiPct}% of reviewed business expenses aren't driving returns. Can you cut or renegotiate any of these?`,
          severity: "info",
        });
      }
    }

    // Unreviewed transactions
    if (reviewSummary.unreviewedCount > 5) {
      result.push({
        icon: ArrowRight,
        title: `${reviewSummary.unreviewedCount} transactions waiting for review`,
        description: "Your weekly review keeps you in touch with your money story. It only takes a few minutes.",
        severity: "info",
      });
    }

    // Waterfall overflow (good news)
    if (waterfallHealth.bufferTarget > 0 && waterfallHealth.checkingBalance > waterfallHealth.bufferTarget * 1.2) {
      const overflow = waterfallHealth.checkingBalance - waterfallHealth.bufferTarget;
      result.push({
        icon: ShieldCheck,
        title: `${formatCurrency(overflow)} above your buffer — time to waterfall`,
        description: "Move the excess to working capital, tax savings, or make a debt payment. Don't let it sit in checking.",
        severity: "success",
      });
    }

    return result;
  }, [waterfallHealth, estimatedMonthlyInterest, totalDebt, accounts, transactions, reviewSummary]);

  const hasReviewData = reviewSummary.business.total > 0 || reviewSummary.personal.total > 0;

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

        {/* ── Cashflow Waterfall Health ── */}
        <section className="flex flex-col gap-2">
          <p className="section-label">Cashflow Waterfall</p>
          <p className="text-[11px] text-text-tertiary -mt-1 mb-1">
            Build your safety system: buffer first, then working capital, then taxes.
          </p>
          <WaterfallMeter
            label="Buffer"
            icon={ShieldCheck}
            current={waterfallHealth.checkingBalance}
            target={waterfallHealth.bufferTarget}
            description="1 month of expenses in checking"
          />
          <WaterfallMeter
            label="Working Capital"
            icon={Wallet}
            current={waterfallHealth.wcCurrent}
            target={waterfallHealth.wcTarget}
            description="2 months of expenses in savings"
          />
          {waterfallHealth.taxTarget > 0 && (
            <Link href="/insights/taxes" className="block">
              <WaterfallMeter
                label="Tax Savings"
                icon={Building2}
                current={waterfallHealth.taxSaved}
                target={waterfallHealth.taxTarget}
                description="Estimated quarterly liability \u2192 Tap to calculate"
              />
            </Link>
          )}
        </section>

        {/* ── Smart Alerts ── */}
        {alerts.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label">Smart Alerts</p>
            {alerts.map((alert, i) => (
              <InsightCard
                key={i}
                icon={alert.icon}
                title={alert.title}
                description={alert.description}
                severity={alert.severity}
              />
            ))}
          </section>
        )}

        {/* ── Review Summary ── */}
        {hasReviewData && (
          <section className="flex flex-col gap-2">
            <p className="section-label">Review Summary</p>

            {reviewSummary.business.total > 0 && (
              <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                  Business ({reviewSummary.business.total} reviewed)
                </p>
                <div className="flex flex-col divide-y divide-border-secondary">
                  <ReviewBucketRow
                    icon={TrendingUp}
                    label="High ROI"
                    count={reviewSummary.business.highRoi.count}
                    amount={reviewSummary.business.highRoi.amount}
                    href="/insights/business/high-roi"
                  />
                  <ReviewBucketRow
                    icon={TrendingDown}
                    label="No ROI"
                    count={reviewSummary.business.noRoi.count}
                    amount={reviewSummary.business.noRoi.amount}
                    href="/insights/business/no-roi"
                  />
                  <ReviewBucketRow
                    icon={HelpCircle}
                    label="Unsure"
                    count={reviewSummary.business.unsure.count}
                    amount={reviewSummary.business.unsure.amount}
                    href="/insights/unsure-review"
                  />
                </div>
              </div>
            )}

            {reviewSummary.personal.total > 0 && (
              <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                  Personal ({reviewSummary.personal.total} reviewed)
                </p>
                <div className="flex flex-col divide-y divide-border-secondary">
                  <ReviewBucketRow
                    icon={Sparkles}
                    label="Essential"
                    count={reviewSummary.personal.essential.count}
                    amount={reviewSummary.personal.essential.amount}
                    href="/insights/personal/essential"
                  />
                  <ReviewBucketRow
                    icon={Star}
                    label="Meaningful"
                    count={reviewSummary.personal.meaningful.count}
                    amount={reviewSummary.personal.meaningful.amount}
                    href="/insights/personal/meaningful"
                  />
                  <ReviewBucketRow
                    icon={AlertTriangle}
                    label="Mismatch"
                    count={reviewSummary.personal.mismatch.count}
                    amount={reviewSummary.personal.mismatch.amount}
                    href="/insights/personal/mismatch"
                  />
                </div>
              </div>
            )}

            {reviewSummary.unreviewedCount > 0 && (
              <Link
                href="/review/business"
                className="flex items-center justify-center gap-2 rounded-xl bg-bg-secondary py-3 text-[12px] font-semibold text-text-primary transition-colors hover:bg-bg-secondary-hover"
              >
                Review {reviewSummary.unreviewedCount} more transactions
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </section>
        )}

        {/* ── Money Flow ── */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="section-label">Money Flow</p>
            <Link href="/insights/cashflow-review" className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-primary transition-colors">
              Review <ChevronRight className="size-3" />
            </Link>
          </div>
          <Link href="/insights/cashflow-review" className="block">
            <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
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
          </Link>
        </section>

        {/* ── Spending Breakdown (Donut) ── */}
        <section className="flex flex-col gap-3">
          <p className="section-label">Spending by Category</p>
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5 shadow-sm">
            <DonutChart segments={donutSegments} size={160} />
          </div>
        </section>

        {/* ── Debt Stack ── */}
        {debtAccounts.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label">Debt Stack</p>
            <p className="text-[11px] text-text-tertiary -mt-1 mb-1">
              Pay highest-rate first. Total: {formatCurrency(totalDebt)}
              {estimatedMonthlyInterest > 0 && ` · ~${formatCurrency(estimatedMonthlyInterest)}/mo interest`}
            </p>
            <div className="rounded-xl border border-border-secondary bg-bg-primary shadow-sm divide-y divide-border-secondary">
              {debtAccounts.map((card) => (
                <div key={card.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary">
                      <CreditCard className="size-4 text-text-secondary" />
                    </div>
                    <div className="flex flex-col gap-0">
                      <p className="text-[13px] font-semibold text-text-primary">{card.name}</p>
                      <p className="text-[10px] text-text-tertiary">{card.institution} ****{card.lastFour}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0">
                    <p className="text-[13px] font-bold text-text-primary tabular-nums">{formatCurrency(Math.abs(card.balance))}</p>
                    <p className="text-[10px] text-text-tertiary tabular-nums">~${Math.round(Math.abs(card.balance) * 0.22 / 12)}/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Most Expensive Recurring ── */}
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

        {/* ── Business Expense Audit ── */}
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

        {/* ── Personal Expense Audit ── */}
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
      </div>

      <div className="h-8 safe-bottom" />
    </div>
  );
}
