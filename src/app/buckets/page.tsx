"use client";

import Link from "next/link";
import {
  useBucketStore,
  selectBucketsByType,
  selectBucketSummary,
} from "@/stores/buckets";
import { BucketCard } from "@/components/buckets/BucketCard";
import { Button } from "@/components/ui/button";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BucketsPage() {
  const state = useBucketStore();
  const projects = selectBucketsByType(state, "project").filter((b) => b.isActive);
  const sinkingFunds = selectBucketsByType(state, "sinking_fund").filter((b) => b.isActive);
  const savingsGoals = selectBucketsByType(state, "savings_goal").filter((b) => b.isActive);
  const summary = selectBucketSummary(state);

  return (
    <div className="flex flex-col pb-4 safe-top">
      {/* Status bar spacer */}
      <div className="h-[60px]" />

      <div className="flex flex-col gap-5 px-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <Link
              href="/"
              className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              &larr; Dashboard
            </Link>
            <h1 className="text-lg font-medium">Buckets</h1>
          </div>
          <Link href="/buckets/new">
            <Button size="sm">+ New</Button>
          </Link>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-3 text-xs text-text-tertiary">
          <span>
            <span className="font-medium text-text-primary tabular-nums">
              {summary.totalProjects + summary.totalSinkingFunds + summary.totalSavingsGoals}
            </span>{" "}
            buckets
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="font-medium text-text-primary tabular-nums">
              {formatCurrency(summary.totalAllocated)}
            </span>{" "}
            allocated
          </span>
        </div>

        {/* Empty state */}
        {projects.length === 0 && sinkingFunds.length === 0 && savingsGoals.length === 0 && (
          <div className="rounded-xl border border-dashed border-border-secondary bg-bg-secondary px-4 py-10 text-center">
            <div className="text-3xl mb-2">🪣</div>
            <p className="text-sm font-medium text-text-secondary">No buckets yet</p>
            <p className="mt-1 text-xs text-text-tertiary max-w-[260px] mx-auto">
              Buckets help you group transactions into projects, savings goals, and sinking funds.
            </p>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="flex flex-col gap-1.5">
            <p className="section-label">Projects</p>
            <div className="flex flex-col gap-1">
              {projects.map((bucket) => (
                <BucketCard key={bucket.id} bucket={bucket} />
              ))}
            </div>
          </section>
        )}

        {/* Sinking Funds */}
        {sinkingFunds.length > 0 && (
          <section className="flex flex-col gap-1.5">
            <p className="section-label">Sinking Funds</p>
            <div className="flex flex-col gap-1">
              {sinkingFunds.map((bucket) => (
                <BucketCard key={bucket.id} bucket={bucket} />
              ))}
            </div>
          </section>
        )}

        {/* Savings Goals */}
        {savingsGoals.length > 0 && (
          <section className="flex flex-col gap-1.5">
            <p className="section-label">Savings Goals</p>
            <div className="flex flex-col gap-1">
              {savingsGoals.map((bucket) => (
                <BucketCard key={bucket.id} bucket={bucket} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bottom safe area */}
      <div className="h-8 safe-bottom" />
    </div>
  );
}
