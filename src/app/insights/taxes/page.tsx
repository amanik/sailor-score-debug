"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { useTransactionStore } from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import { useBucketStore } from "@/stores/buckets";
import { formatCurrency } from "@/lib/format";

export default function TaxCalculatorPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const accounts = useAccountStore((s) => s.accounts);
  const buckets = useBucketStore((s) => s.buckets);
  const [taxPct, setTaxPct] = useState(25);

  const businessAccountIds = useMemo(
    () => accounts.filter((a) => a.type === "business").map((a) => a.id),
    [accounts]
  );

  const revenue = useMemo(() => {
    const income = transactions.filter(
      (t) =>
        businessAccountIds.includes(t.accountId) &&
        t.amount < 0 &&
        !t.isTransfer
    );
    return Math.abs(income.reduce((sum, t) => sum + t.amount, 0));
  }, [transactions, businessAccountIds]);

  const expenses = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          businessAccountIds.includes(t.accountId) &&
          t.amount > 0 &&
          !t.isTransfer
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, businessAccountIds]);

  const profit = Math.round(revenue - expenses);
  const taxAmount = Math.round(profit * (taxPct / 100));
  const monthlySetAside = Math.round(taxAmount / 12);

  const taxBuckets = useMemo(
    () => buckets.filter((b) => b.isActive && b.name.toLowerCase().includes("tax")),
    [buckets]
  );
  const totalSaved = taxBuckets.reduce((sum, b) => sum + b.current, 0);
  const remaining = Math.max(0, taxAmount - totalSaved);

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />
      <div className="flex flex-col gap-5 px-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/insights"
            className="flex size-8 items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors"
          >
            <ArrowLeft className="size-4 text-text-secondary" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary">
              <Building2 className="size-4 text-text-secondary" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-text-primary">
              Tax Estimate
            </h1>
          </div>
        </div>

        {/* Explanation */}
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm">
          <p className="text-[11px] text-text-tertiary leading-relaxed">
            This is a rough estimate based on your revenue minus business expenses.
            Adjust the tax rate to match your bracket. The goal is to set aside enough
            so you&apos;re never surprised at tax time.
          </p>
        </div>

        {/* Revenue → Expenses → Profit breakdown */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] text-text-secondary">Revenue</span>
            <span className="text-[13px] font-bold text-text-primary tabular-nums">
              {formatCurrency(revenue)}
            </span>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] text-text-secondary">Business Expenses</span>
            <span className="text-[13px] font-bold text-text-primary tabular-nums">
              -{formatCurrency(expenses)}
            </span>
          </div>
          <div className="border-t border-border-secondary pt-2 flex items-center justify-between px-1">
            <span className="text-[12px] font-semibold text-text-primary">Profit</span>
            <span className="text-[13px] font-bold text-text-primary tabular-nums">
              {formatCurrency(profit)}
            </span>
          </div>
        </div>

        {/* Tax rate slider */}
        <section className="flex flex-col gap-3 rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold text-text-primary">Tax Rate</p>
            <p className="text-2xl font-bold text-text-primary tabular-nums">{taxPct}%</p>
          </div>
          <input
            type="range"
            min={15}
            max={40}
            value={taxPct}
            onChange={(e) => setTaxPct(Number(e.target.value))}
            className="w-full accent-text-primary"
          />
          <div className="flex items-center justify-between text-[10px] text-text-tertiary">
            <span>15%</span>
            <span>40%</span>
          </div>
        </section>

        {/* Result */}
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5 shadow-sm text-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-1">
            Set aside for taxes
          </p>
          <p className="text-3xl font-bold tracking-tighter text-text-primary">
            {formatCurrency(taxAmount)}
          </p>
          <p className="text-[11px] text-text-tertiary mt-1">
            ~{formatCurrency(monthlySetAside)}/month
          </p>
        </div>

        {/* Current tax bucket progress */}
        {taxBuckets.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label">Tax Savings Progress</p>
            {taxBuckets.map((bucket) => {
              const target = bucket.target ?? taxAmount;
              const pct = target > 0 ? Math.min(Math.round((bucket.current / target) * 100), 100) : 0;
              return (
                <div
                  key={bucket.id}
                  className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-text-primary">
                      {bucket.emoji} {bucket.name}
                    </p>
                    <p className="text-[13px] font-bold tabular-nums text-text-primary">
                      {formatCurrency(bucket.current)}
                      <span className="text-text-tertiary font-normal"> / {formatCurrency(target)}</span>
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? "bg-emerald-500" : "bg-fg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-text-tertiary tabular-nums">{pct}% funded</p>
                </div>
              );
            })}
          </section>
        )}

        {/* Remaining */}
        {remaining > 0 && (
          <div className="rounded-xl bg-bg-secondary p-4 text-center">
            <p className="text-[11px] text-text-secondary">
              Still need to save <span className="font-bold text-text-primary">{formatCurrency(remaining)}</span> to cover estimated taxes
            </p>
          </div>
        )}
      </div>

      <div className="h-8 safe-bottom" />
    </div>
  );
}
