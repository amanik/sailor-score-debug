"use client";

import { TabBar } from "@/components/dashboard/TabBar";
import { ReviewCTA } from "@/components/dashboard/ReviewCTA";
import { useMemo } from "react";
import {
  useTransactionStore,
  selectUnreviewedByType,
} from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import {
  useBucketStore,
  selectBucketsByType,
  selectBucketProgress,
} from "@/stores/buckets";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Bucket } from "@/data/buckets";
import { formatCurrency } from "@/lib/format";
import { getCategoryIcon } from "@/lib/icons";

// ─── Shared Components ──────────────────────────────────────

function ProgressBar({
  current,
  target,
  label,
}: {
  readonly current: number;
  readonly target: number;
  readonly label: string;
}) {
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-text-primary">{label}</p>
        <p className="text-[11px] font-medium tabular-nums text-text-secondary">
          {formatCurrency(current)} / {formatCurrency(target)}
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
        <div
          className="h-full rounded-full bg-fg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] text-text-tertiary tabular-nums">{percentage}% funded</p>
    </div>
  );
}

function BucketCard({ bucket }: { readonly bucket: Bucket }) {
  const progress = selectBucketProgress(bucket);
  return (
    <Link href={`/buckets/${bucket.id}`} className="block">
      <div className="flex items-center gap-2.5 rounded-xl border border-border-secondary bg-bg-primary px-3.5 py-2.5 shadow-sm transition-shadow hover:shadow-md">
        <span className="text-lg">{bucket.emoji}</span>
        <div className="flex flex-1 min-w-0 flex-col gap-0">
          <p className="text-[13px] font-semibold text-text-primary truncate">
            {bucket.name}
          </p>
          <p className="text-[10px] text-text-tertiary tabular-nums">
            {formatCurrency(bucket.current)}
            {bucket.target ? ` / ${formatCurrency(bucket.target)} (${progress}%)` : " spent"}
          </p>
        </div>
        <ChevronRight className="size-4 text-text-quaternary" />
      </div>
    </Link>
  );
}

// Mini donut/ring chart for percentages
function MiniDonut({
  percentage,
  size = 28,
}: {
  readonly percentage: number;
  readonly size?: number;
}) {
  const r = (size - 4) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (percentage / 100) * circumference;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        className="stroke-bg-secondary"
        strokeWidth={3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        className="stroke-fg-primary"
        strokeWidth={3}
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

function DebtRow({
  name,
  institution,
  balance,
  lastFour,
}: {
  readonly name: string;
  readonly institution: string;
  readonly balance: number;
  readonly lastFour: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex flex-col gap-0">
        <p className="text-[13px] font-semibold text-text-primary">{name}</p>
        <p className="text-[10px] text-text-tertiary">
          {institution} ****{lastFour}
        </p>
      </div>
      <p className="text-[13px] font-bold tracking-tight text-text-primary tabular-nums">
        {formatCurrency(Math.abs(balance))}
      </p>
    </div>
  );
}

function WaterfallBreakdown({
  items,
  result,
  resultLabel,
}: {
  readonly items: readonly { readonly label: string; readonly amount: number }[];
  readonly result: number;
  readonly resultLabel: string;
}) {
  const maxAmount = Math.max(...items.map((i) => Math.abs(i.amount)), Math.abs(result));
  return (
    <Card className="shadow-sm ring-0 border border-border-secondary">
      <CardHeader className="flex-row items-start justify-between pb-0">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-primary">
            {resultLabel}
          </p>
          <p className="text-2xl font-bold tracking-tighter text-text-primary">
            {result >= 0 ? "+" : "-"}{formatCurrency(Math.abs(result))}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <Separator className="mb-1" />
        {items.map((item) => {
          const width = maxAmount > 0 ? Math.min((Math.abs(item.amount) / maxAmount) * 100, 100) : 0;
          return (
            <div key={item.label} className="flex items-center gap-2">
              <div className="bar-bg flex-1 flex items-center">
                <div
                  className="bar-fill flex items-center justify-between px-2.5 py-1.5"
                  style={{ width: `${width}%`, minWidth: "fit-content" }}
                >
                  <span className="font-mono text-[9px] font-medium text-bg-primary whitespace-nowrap">
                    {item.label}
                  </span>
                  <span className="font-mono text-[9px] font-medium text-bg-primary whitespace-nowrap ml-2">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <Separator className="mt-1" />
        <div className="flex items-center justify-between px-1 font-mono text-[9px] font-semibold text-text-primary">
          <span>{resultLabel}</span>
          <span>{result >= 0 ? "+" : "-"}{formatCurrency(Math.abs(result))}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryList({
  type,
}: {
  readonly type: "business" | "personal";
}) {
  const transactions = useTransactionStore((s) => s.transactions);
  const accounts = useAccountStore((s) => s.accounts);

  const accountIds = useMemo(
    () => accounts.filter((a) => a.type === type).map((a) => a.id),
    [accounts, type]
  );

  const breakdown = useMemo(() => {
    const relevant = transactions.filter(
      (t) =>
        accountIds.includes(t.accountId) &&
        t.amount > 0 &&
        !t.isTransfer
    );

    const total = relevant.reduce((sum, t) => sum + t.amount, 0);

    const grouped = relevant.reduce<Record<string, { total: number; count: number }>>(
      (acc, t) => {
        const existing = acc[t.category] ?? { total: 0, count: 0 };
        return {
          ...acc,
          [t.category]: {
            total: existing.total + t.amount,
            count: existing.count + 1,
          },
        };
      },
      {}
    );

    return Object.entries(grouped)
      .map(([category, data]) => ({
        category,
        total: Math.round(data.total * 100) / 100,
        count: data.count,
        percentage: total > 0 ? Math.round((data.total / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions, accountIds]);

  const slugify = (cat: string) =>
    cat.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {breakdown.map((item) => {
        const Icon = getCategoryIcon(item.category);
        return (
          <Link
            key={item.category}
            href={`/transactions/${slugify(item.category)}`}
            className="group/cat block"
          >
            <div className="flex items-center gap-3 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="flex size-7 items-center justify-center rounded-lg bg-bg-secondary">
                <Icon className="size-4 text-text-secondary" />
              </div>
              <div className="flex flex-1 min-w-0 flex-col gap-0.5">
                <p className="text-[13px] font-semibold text-text-primary">
                  {item.category}
                </p>
                <p className="text-[10px] text-text-tertiary">
                  {item.count} transaction{item.count !== 1 ? "s" : ""} &middot; {item.percentage}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-bold tracking-tight text-text-primary tabular-nums">
                  ${item.total.toLocaleString()}
                </p>
                <ChevronRight className="size-4 text-text-quaternary transition-transform duration-200 group-hover/cat:translate-x-0.5 group-hover/cat:text-text-primary" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Business Tab ──────────────────────────────────────────

function BusinessContent() {
  const transactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  const accounts = useAccountStore((s) => s.accounts);
  const buckets = useBucketStore((s) => s.buckets);

  const businessAccountIds = useMemo(
    () => accounts.filter((a) => a.type === "business").map((a) => a.id),
    [accounts]
  );

  const unreviewedCount = useMemo(
    () => selectUnreviewedByType({ transactions, notes }, "business", businessAccountIds).length,
    [transactions, notes, businessAccountIds]
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

  const taxBuckets = useMemo(
    () =>
      buckets.filter(
        (b) => b.isActive && b.name.toLowerCase().includes("tax")
      ),
    [buckets]
  );

  const totalTaxes = useMemo(
    () => taxBuckets.reduce((sum, b) => sum + b.current, 0),
    [taxBuckets]
  );

  const profit = useMemo(
    () => Math.round(revenue - expenses - totalTaxes),
    [revenue, expenses, totalTaxes]
  );

  const debtAccounts = useMemo(
    () =>
      accounts.filter(
        (a) =>
          a.type === "business" &&
          (a.category === "credit_card" ||
            a.category === "loan" ||
            a.category === "line_of_credit")
      ),
    [accounts]
  );

  const projectBuckets = useMemo(
    () => selectBucketsByType({ buckets }, "project").filter((b) => b.isActive),
    [buckets]
  );

  return (
    <div className="flex flex-col gap-5">
      <ReviewCTA
        unreviewedCount={unreviewedCount}
        estimatedMinutes={Math.max(1, Math.round(unreviewedCount * 0.3))}
        type="business"
      />

      {/* Revenue */}
      <section className="flex flex-col gap-2">
        <p className="section-label px-1">Revenue</p>
        <div className="flex items-center justify-between rounded-xl bg-bg-secondary px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              Cash Collected
            </p>
            <p className="text-xl font-bold tracking-tighter text-text-primary">
              {formatCurrency(revenue)}
            </p>
          </div>
          <p className="font-mono text-[10px] text-text-tertiary">
            Business accounts only
          </p>
        </div>
      </section>

      {/* Expenses */}
      <section className="flex flex-col gap-2">
        <p className="section-label px-1">Expenses</p>
        <CategoryList type="business" />
      </section>

      {/* Tax Withholdings */}
      {taxBuckets.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">Tax Withholdings</p>
          <div className="flex flex-col gap-3 rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm">
            {taxBuckets.map((bucket) => (
              <ProgressBar
                key={bucket.id}
                label={`${bucket.emoji} ${bucket.name}`}
                current={bucket.current}
                target={bucket.target ?? 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Profit */}
      <section className="flex flex-col gap-2">
        <p className="section-label px-1">Profit</p>
        <WaterfallBreakdown
          items={[
            { label: "Revenue", amount: Math.round(revenue) },
            { label: "Expenses", amount: Math.round(expenses) },
            { label: "Taxes", amount: Math.round(totalTaxes) },
          ]}
          result={profit}
          resultLabel="Profit"
        />
      </section>

      {/* Debt */}
      {debtAccounts.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">Debt</p>
          <div className="rounded-xl border border-border-secondary bg-bg-primary px-4 shadow-sm divide-y divide-border-secondary">
            {debtAccounts.map((account) => (
              <DebtRow
                key={account.id}
                name={account.name}
                institution={account.institution}
                balance={account.balance}
                lastFour={account.lastFour}
              />
            ))}
          </div>
          <p className="text-[10px] text-text-tertiary px-1">
            Total owed: {formatCurrency(debtAccounts.reduce((sum, a) => sum + Math.abs(a.balance), 0))}
          </p>
        </section>
      )}

      {/* Projects */}
      {projectBuckets.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">Projects</p>
          <div className="flex flex-col gap-1.5">
            {projectBuckets.map((bucket) => (
              <BucketCard key={bucket.id} bucket={bucket} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Personal Tab ──────────────────────────────────────────

function PersonalContent() {
  const transactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  const accounts = useAccountStore((s) => s.accounts);
  const buckets = useBucketStore((s) => s.buckets);

  const personalAccountIds = useMemo(
    () => accounts.filter((a) => a.type === "personal").map((a) => a.id),
    [accounts]
  );

  const unreviewedCount = useMemo(
    () => selectUnreviewedByType({ transactions, notes }, "personal", personalAccountIds).length,
    [transactions, notes, personalAccountIds]
  );

  const income = useMemo(() => {
    const inflow = transactions.filter(
      (t) =>
        personalAccountIds.includes(t.accountId) &&
        t.amount < 0 &&
        !t.isTransfer
    );
    return Math.abs(inflow.reduce((sum, t) => sum + t.amount, 0));
  }, [transactions, personalAccountIds]);

  const expenses = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          personalAccountIds.includes(t.accountId) &&
          t.amount > 0 &&
          !t.isTransfer
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, personalAccountIds]);

  const savingsGoalBuckets = useMemo(
    () =>
      selectBucketsByType({ buckets }, "savings_goal").filter((b) => b.isActive),
    [buckets]
  );

  const sinkingFundBuckets = useMemo(
    () =>
      selectBucketsByType({ buckets }, "sinking_fund").filter((b) => b.isActive),
    [buckets]
  );

  const debtAccounts = useMemo(
    () =>
      accounts.filter(
        (a) =>
          a.type === "personal" &&
          (a.category === "credit_card" ||
            a.category === "loan" ||
            a.category === "line_of_credit")
      ),
    [accounts]
  );

  return (
    <div className="flex flex-col gap-5">
      <ReviewCTA
        unreviewedCount={unreviewedCount}
        estimatedMinutes={Math.max(1, Math.round(unreviewedCount * 0.3))}
        type="personal"
      />

      {/* Income */}
      <section className="flex flex-col gap-2">
        <p className="section-label px-1">Income</p>
        <div className="flex items-center justify-between rounded-xl bg-bg-secondary px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              Cash Received
            </p>
            <p className="text-xl font-bold tracking-tighter text-text-primary">
              {formatCurrency(income)}
            </p>
          </div>
          <p className="font-mono text-[10px] text-text-tertiary">
            Distributions + other
          </p>
        </div>
      </section>

      {/* Expenses */}
      <section className="flex flex-col gap-2">
        <p className="section-label px-1">Expenses</p>
        <CategoryList type="personal" />
      </section>

      {/* Savings & Goals */}
      {savingsGoalBuckets.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">Savings &amp; Goals</p>
          <div className="flex flex-col gap-3 rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm">
            {savingsGoalBuckets.map((bucket) => (
              <ProgressBar
                key={bucket.id}
                label={`${bucket.emoji} ${bucket.name}`}
                current={bucket.current}
                target={bucket.target ?? 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Debt */}
      {debtAccounts.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">Debt</p>
          <div className="rounded-xl border border-border-secondary bg-bg-primary px-4 shadow-sm divide-y divide-border-secondary">
            {debtAccounts.map((account) => (
              <DebtRow
                key={account.id}
                name={account.name}
                institution={account.institution}
                balance={account.balance}
                lastFour={account.lastFour}
              />
            ))}
          </div>
          <p className="text-[10px] text-text-tertiary px-1">
            Total owed: {formatCurrency(debtAccounts.reduce((sum, a) => sum + Math.abs(a.balance), 0))}
          </p>
        </section>
      )}

      {/* Sinking Funds */}
      {sinkingFundBuckets.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">Sinking Funds</p>
          <div className="flex flex-col gap-1.5">
            {sinkingFundBuckets.map((bucket) => (
              <BucketCard key={bucket.id} bucket={bucket} />
            ))}
          </div>
        </section>
      )}

      {/* Savings Goals (as clickable bucket cards) */}
      {savingsGoalBuckets.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">Savings Goals</p>
          <div className="flex flex-col gap-1.5">
            {savingsGoalBuckets.map((bucket) => (
              <BucketCard key={bucket.id} bucket={bucket} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────

function useDashboardMonth(): string {
  const transactions = useTransactionStore((s) => s.transactions);
  return useMemo(() => {
    if (transactions.length === 0) return "Dashboard";
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latest = new Date(sorted[0].date + "T12:00:00");
    return latest.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [transactions]);
}

export default function DashboardPage() {
  const monthLabel = useDashboardMonth();

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />

      <div className="flex flex-col gap-4 px-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-text-quaternary">
              Sailor
            </p>
            <h1 className="text-lg font-bold tracking-tight text-text-primary">
              {monthLabel}
            </h1>
          </div>
        </div>

        <TabBar
          defaultTab="Business"
          children={{
            Business: <BusinessContent />,
            Personal: <PersonalContent />,
          }}
        />
      </div>

      <div className="h-8 safe-bottom" />
    </div>
  );
}
