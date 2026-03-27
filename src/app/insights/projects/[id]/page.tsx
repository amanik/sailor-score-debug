"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBucketStore, selectBucketById } from "@/stores/buckets";
import { useTransactionStore } from "@/stores/transactions";
import { formatCurrency } from "@/lib/format";
import {
  TrendingUp,
  TrendingDown,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  FolderKanban,
  type LucideIcon,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  color = "text-text-secondary",
}: {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string | number;
  readonly color?: string;
}) {
  return (
    <div className="card p-3 flex flex-col items-center gap-1">
      <Icon className={`size-5 ${color}`} />
      <span className="text-lg font-bold text-text-primary">{value}</span>
      <span className="text-[9px] text-text-tertiary">{label}</span>
    </div>
  );
}

export default function ProjectInsightPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const bucketState = useBucketStore();
  const transactions = useTransactionStore((s) => s.transactions);

  const bucket = selectBucketById(bucketState, params.id);

  const insight = useMemo(() => {
    if (!bucket) return null;
    const linkedTxns = bucket.transactionIds
      .map((tid) => transactions.find((t) => t.id === tid))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);

    const totalSpent = linkedTxns.reduce((sum, t) => sum + t.amount, 0);
    const highRoi = linkedTxns.filter((t) => t.businessBucket === "high_roi");
    const noRoi = linkedTxns.filter((t) => t.businessBucket === "no_roi");
    const unsure = linkedTxns.filter((t) => t.businessBucket === "unsure");
    const unreviewed = linkedTxns.filter((t) => !t.reviewed);

    // Category breakdown within project
    const byCategory = linkedTxns.reduce<Record<string, number>>((acc, t) => {
      return { ...acc, [t.category]: (acc[t.category] ?? 0) + t.amount };
    }, {});
    const categories = Object.entries(byCategory)
      .map(([cat, amount]) => ({ category: cat, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Date range
    const dates = linkedTxns.map((t) => t.date).sort();
    const dateRange =
      dates.length > 0
        ? `${dates[0]} — ${dates[dates.length - 1]}`
        : "No transactions";

    // Health assessment
    const total = linkedTxns.length;
    const highRoiPct = total > 0 ? Math.round((highRoi.length / total) * 100) : 0;
    let health: "healthy" | "concerning" | "unknown" = "unknown";
    if (total >= 2) {
      health = highRoiPct >= 50 ? "healthy" : "concerning";
    }

    return {
      totalSpent,
      highRoi,
      noRoi,
      unsure,
      unreviewed,
      categories,
      dateRange,
      health,
      highRoiPct,
      txnCount: linkedTxns.length,
    };
  }, [bucket, transactions]);

  if (!bucket || !insight) {
    return (
      <div className="flex flex-col pb-4 safe-top">
        <div className="h-[60px]" />
        <div className="flex flex-col gap-6 px-4 items-center text-center pt-12">
          <FolderKanban className="size-8 text-text-tertiary" />
          <h1 className="text-xl font-bold text-text-primary">Project not found</h1>
          <Link href="/insights" className="text-sm text-text-tertiary">
            Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  const healthLabel =
    insight.health === "healthy"
      ? "This project looks healthy"
      : insight.health === "concerning"
        ? "This project needs attention"
        : "Not enough data to assess";

  const healthDescription =
    insight.health === "healthy"
      ? `${insight.highRoiPct}% of spend has clear ROI. Keep monitoring to ensure returns continue.`
      : insight.health === "concerning"
        ? `Only ${insight.highRoiPct}% of spend has clear ROI. Review whether the remaining expenses are justified.`
        : "Review more transactions in this project to get an assessment.";

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />
      <div className="flex flex-col gap-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="text-text-tertiary text-sm">
            {"\u2190"} Back
          </button>
          <p className="section-label">Project Insight</p>
          <div className="w-12" />
        </div>

        {/* Project title */}
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-bg-secondary">
            <span className="text-2xl">{bucket.emoji}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">{bucket.name}</h1>
            {bucket.description && (
              <p className="text-[11px] text-text-tertiary mt-0.5">{bucket.description}</p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3">
          <StatCard icon={FolderKanban} label="Transactions" value={insight.txnCount} />
          <StatCard icon={TrendingUp} label="High ROI" value={insight.highRoi.length} color="text-emerald-500" />
          <StatCard icon={TrendingDown} label="No ROI" value={insight.noRoi.length} color="text-red-400" />
          <StatCard icon={HelpCircle} label="Unsure" value={insight.unsure.length} color="text-amber-400" />
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-tertiary">Total Spent</span>
            <span className="text-[13px] font-bold text-text-primary tabular-nums">{formatCurrency(insight.totalSpent)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-tertiary">Date Range</span>
            <span className="text-[11px] text-text-primary">{insight.dateRange}</span>
          </div>
        </div>

        {/* Coach Annie Assessment */}
        <section className="flex flex-col gap-2">
          <p className="section-label">Coach Annie&apos;s Take</p>
          <div className={`rounded-xl border p-4 shadow-sm ${
            insight.health === "healthy"
              ? "border-emerald-300 bg-emerald-50/30"
              : insight.health === "concerning"
                ? "border-amber-300 bg-amber-50/30"
                : "border-border-secondary bg-bg-primary"
          }`}>
            <p className="text-[13px] font-semibold text-text-primary mb-1">{healthLabel}</p>
            <p className="text-[11px] text-text-tertiary leading-relaxed">{healthDescription}</p>
          </div>
        </section>

        {/* Category Breakdown */}
        {insight.categories.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label">Spend by Category</p>
            <div className="rounded-xl border border-border-secondary bg-bg-primary shadow-sm divide-y divide-border-secondary">
              {insight.categories.map(({ category, amount }) => (
                <div key={category} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[12px] text-text-primary">{category}</span>
                  <span className="text-[12px] font-bold tabular-nums text-text-primary">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {insight.unsure.length > 0 && (
            <Link
              href="/insights/unsure-review"
              className="flex items-center justify-center gap-2 rounded-xl bg-text-primary text-bg-primary py-3 text-[12px] font-semibold transition-colors hover:opacity-90"
            >
              Re-review {insight.unsure.length} unsure expenses
              <ArrowRight className="size-3.5" />
            </Link>
          )}
          <Link
            href={`/buckets/${bucket.id}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-bg-secondary py-3 text-[12px] font-semibold text-text-primary transition-colors hover:bg-bg-secondary-hover"
          >
            Manage Transactions
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="h-8 safe-bottom" />
    </div>
  );
}
