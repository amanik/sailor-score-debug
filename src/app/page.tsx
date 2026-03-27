"use client";

import { TabBar } from "@/components/dashboard/TabBar";
import { ReviewCTA } from "@/components/dashboard/ReviewCTA";
import { useMemo, useState, useRef, useEffect } from "react";
import {
  useTransactionStore,
  selectUnreviewedByType,
  selectBusinessBucketStats,
  selectPersonalBucketStats,
} from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import {
  useBucketStore,
  selectBucketsByType,
  selectBucketProgress,
} from "@/stores/buckets";
import Link from "next/link";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Sparkles,
  Star,
  AlertTriangle,
  Eye,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Bucket } from "@/data/buckets";
import type { Transaction } from "@/data/transactions";
import { formatCurrency } from "@/lib/format";

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
  const absBalance = Math.abs(balance);
  const monthlyInterest = Math.round(absBalance * 0.22 / 12);
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-secondary">
        <CreditCard className="size-4 text-text-secondary" />
      </div>
      <div className="flex flex-1 min-w-0 flex-col gap-0">
        <p className="text-[13px] font-semibold text-text-primary">{name}</p>
        <p className="text-[10px] text-text-tertiary">
          {institution} ****{lastFour}
        </p>
      </div>
      <div className="flex flex-col items-end gap-0">
        <p className="text-[13px] font-bold tracking-tight text-text-primary tabular-nums">
          {formatCurrency(absBalance)}
        </p>
        {monthlyInterest > 0 && (
          <p className="text-[9px] text-text-quaternary tabular-nums">
            ~{formatCurrency(monthlyInterest)}/mo
          </p>
        )}
      </div>
    </div>
  );
}

function WaterfallBreakdown({
  items,
  result,
  resultLabel,
}: {
  readonly items: readonly { readonly label: string; readonly amount: number; readonly href?: string }[];
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
          const barContent = (
            <div className={`flex items-center gap-2 ${item.href ? "group/bar" : ""}`}>
              <div className="bar-bg flex-1 flex items-center">
                <div
                  className={`bar-fill flex items-center justify-between px-2.5 py-2.5 ${item.href ? "transition-opacity hover:opacity-80" : ""}`}
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
              {item.href && (
                <ChevronRight className="size-3 shrink-0 text-text-quaternary transition-transform group-hover/bar:translate-x-0.5" />
              )}
            </div>
          );
          return item.href ? (
            <Link key={item.label} href={item.href} className="block">
              {barContent}
            </Link>
          ) : (
            <div key={item.label}>{barContent}</div>
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

const businessBucketConfig: Record<string, { label: string; icon: LucideIcon; href: string }> = {
  high_roi: { label: "High ROI", icon: TrendingUp, href: "/insights/business/high-roi" },
  no_roi: { label: "No ROI", icon: TrendingDown, href: "/insights/business/no-roi" },
  unsure: { label: "Unsure", icon: HelpCircle, href: "/insights/unsure-review" },
};

const personalBucketConfig: Record<string, { label: string; icon: LucideIcon; href: string }> = {
  essential: { label: "Essential", icon: Sparkles, href: "/insights/personal/essential" },
  meaningful: { label: "Meaningful", icon: Star, href: "/insights/personal/meaningful" },
  mismatch: { label: "Mismatch", icon: AlertTriangle, href: "/insights/personal/mismatch" },
};

function BucketRow({
  icon: Icon,
  label,
  count,
  total,
  href,
}: {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly count: number;
  readonly total: number;
  readonly href: string;
}) {
  if (count === 0) return null;
  return (
    <Link href={href} className="group/bucket block">
      <div className="flex items-center gap-3 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="flex size-7 items-center justify-center rounded-lg bg-bg-secondary">
          <Icon className="size-4 text-text-secondary" />
        </div>
        <div className="flex flex-1 min-w-0 flex-col gap-0.5">
          <p className="text-[13px] font-semibold text-text-primary">{label}</p>
          <p className="text-[10px] text-text-tertiary">
            {count} transaction{count !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-bold tracking-tight text-text-primary tabular-nums">
            {formatCurrency(total)}
          </p>
          <ChevronRight className="size-4 text-text-quaternary transition-transform duration-200 group-hover/bucket:translate-x-0.5 group-hover/bucket:text-text-primary" />
        </div>
      </div>
    </Link>
  );
}

function BusinessBucketList({ accountIds }: { readonly accountIds: readonly string[] }) {
  const transactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);

  const stats = useMemo(
    () => selectBusinessBucketStats({ transactions, notes }, accountIds),
    [transactions, notes, accountIds]
  );

  const unreviewedCount = useMemo(
    () => selectUnreviewedByType({ transactions, notes }, "business", accountIds).length,
    [transactions, notes, accountIds]
  );

  return (
    <div className="flex flex-col gap-1.5">
      {stats.map((s) => {
        const config = businessBucketConfig[s.bucket];
        if (!config) return null;
        return (
          <BucketRow
            key={s.bucket}
            icon={config.icon}
            label={config.label}
            count={s.count}
            total={s.total}
            href={config.href}
          />
        );
      })}
      {unreviewedCount > 0 && (
        <Link href="/review/business" className="group/bucket block">
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border-secondary bg-bg-primary px-4 py-3 transition-shadow duration-200 hover:shadow-md">
            <div className="flex size-7 items-center justify-center rounded-lg bg-bg-secondary">
              <Eye className="size-4 text-text-tertiary" />
            </div>
            <div className="flex flex-1 min-w-0 flex-col gap-0.5">
              <p className="text-[13px] font-semibold text-text-secondary">Unreviewed</p>
              <p className="text-[10px] text-text-tertiary">
                {unreviewedCount} transaction{unreviewedCount !== 1 ? "s" : ""} waiting
              </p>
            </div>
            <ChevronRight className="size-4 text-text-quaternary" />
          </div>
        </Link>
      )}
    </div>
  );
}

function PersonalBucketList({ accountIds }: { readonly accountIds: readonly string[] }) {
  const transactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);

  const stats = useMemo(
    () => selectPersonalBucketStats({ transactions, notes }, accountIds),
    [transactions, notes, accountIds]
  );

  const unreviewedCount = useMemo(
    () => selectUnreviewedByType({ transactions, notes }, "personal", accountIds).length,
    [transactions, notes, accountIds]
  );

  return (
    <div className="flex flex-col gap-1.5">
      {stats.map((s) => {
        const config = personalBucketConfig[s.bucket];
        if (!config) return null;
        return (
          <BucketRow
            key={s.bucket}
            icon={config.icon}
            label={config.label}
            count={s.count}
            total={s.total}
            href={config.href}
          />
        );
      })}
      {unreviewedCount > 0 && (
        <Link href="/review/personal" className="group/bucket block">
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border-secondary bg-bg-primary px-4 py-3 transition-shadow duration-200 hover:shadow-md">
            <div className="flex size-7 items-center justify-center rounded-lg bg-bg-secondary">
              <Eye className="size-4 text-text-tertiary" />
            </div>
            <div className="flex flex-1 min-w-0 flex-col gap-0.5">
              <p className="text-[13px] font-semibold text-text-secondary">Unreviewed</p>
              <p className="text-[10px] text-text-tertiary">
                {unreviewedCount} transaction{unreviewedCount !== 1 ? "s" : ""} waiting
              </p>
            </div>
            <ChevronRight className="size-4 text-text-quaternary" />
          </div>
        </Link>
      )}
    </div>
  );
}

// ─── Business Tab ──────────────────────────────────────────

function BusinessContent({ monthKey }: { readonly monthKey: string }) {
  const allTransactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  const accounts = useAccountStore((s) => s.accounts);
  const buckets = useBucketStore((s) => s.buckets);

  const transactions = useMemo(
    () => filterByMonth(allTransactions, monthKey),
    [allTransactions, monthKey]
  );

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
        <Link href="/insights/cashflow-review" className="block group/revenue">
          <div className="flex items-center justify-between rounded-xl bg-bg-secondary px-4 py-3 transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Cash Collected
              </p>
              <p className="text-xl font-bold tracking-tighter text-text-primary">
                {formatCurrency(revenue)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="font-mono text-[10px] text-text-tertiary">
                Tap to review
              </p>
              <ChevronRight className="size-3.5 text-text-quaternary transition-transform group-hover/revenue:translate-x-0.5" />
            </div>
          </div>
        </Link>
      </section>

      {/* Expenses by Bucket */}
      <section className="flex flex-col gap-2">
        <p className="section-label px-1">Expenses</p>
        <BusinessBucketList accountIds={businessAccountIds} />
      </section>

      {/* Tax Withholdings */}
      {taxBuckets.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">Tax Withholdings</p>
          <Link href="/insights/taxes" className="block group/tax">
            <div className="flex flex-col gap-3 rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-sm transition-shadow hover:shadow-md">
              {taxBuckets.map((bucket) => (
                <ProgressBar
                  key={bucket.id}
                  label={`${bucket.emoji} ${bucket.name}`}
                  current={bucket.current}
                  target={bucket.target ?? 0}
                />
              ))}
              <p className="text-[10px] text-text-quaternary flex items-center gap-1">
                Tap to adjust tax rate <ChevronRight className="size-3 transition-transform group-hover/tax:translate-x-0.5" />
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Profit */}
      <section className="flex flex-col gap-2">
        <p className="section-label px-1">Profit</p>
        <WaterfallBreakdown
          items={[
            { label: "Revenue", amount: Math.round(revenue), href: "/insights/cashflow-review" },
            { label: "Expenses", amount: Math.round(expenses), href: "/review/business" },
            { label: "Taxes", amount: Math.round(totalTaxes), href: "/insights/taxes" },
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

function PersonalContent({ monthKey }: { readonly monthKey: string }) {
  const allTransactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  const accounts = useAccountStore((s) => s.accounts);
  const buckets = useBucketStore((s) => s.buckets);

  const transactions = useMemo(
    () => filterByMonth(allTransactions, monthKey),
    [allTransactions, monthKey]
  );

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
        <Link href="/insights/cashflow-review" className="block group/income">
          <div className="flex items-center justify-between rounded-xl bg-bg-secondary px-4 py-3 transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Cash Received
              </p>
              <p className="text-xl font-bold tracking-tighter text-text-primary">
                {formatCurrency(income)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="font-mono text-[10px] text-text-tertiary">
                Tap to review
              </p>
              <ChevronRight className="size-3.5 text-text-quaternary transition-transform group-hover/income:translate-x-0.5" />
            </div>
          </div>
        </Link>
      </section>

      {/* Expenses by Bucket */}
      <section className="flex flex-col gap-2">
        <p className="section-label px-1">Expenses</p>
        <PersonalBucketList accountIds={personalAccountIds} />
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

// ─── Month Utilities ────────────────────────────────────────

function getAvailableMonths(transactions: readonly Transaction[]): readonly { key: string; label: string; shortLabel: string }[] {
  const monthSet = new Set<string>();
  for (const t of transactions) {
    const key = t.date.slice(0, 7); // "2026-02"
    monthSet.add(key);
  }
  return [...monthSet]
    .sort()
    .map((key) => {
      const d = new Date(key + "-15T12:00:00");
      return {
        key,
        label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        shortLabel: d.toLocaleDateString("en-US", { month: "short" }),
      };
    });
}

function filterByMonth(transactions: readonly Transaction[], monthKey: string): readonly Transaction[] {
  return transactions.filter((t) => t.date.startsWith(monthKey));
}

// ─── Month Picker ──────────────────────────────────────────

function MonthPicker({
  months,
  selected,
  onSelect,
}: {
  readonly months: readonly { key: string; label: string; shortLabel: string }[];
  readonly selected: string;
  readonly onSelect: (key: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector("[data-active=true]");
    if (activeEl) {
      activeEl.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, [selected]);

  if (months.length <= 1) return null;

  return (
    <div
      ref={scrollRef}
      className="flex gap-1.5 overflow-x-auto px-1"
      style={{ scrollbarWidth: "none" }}
    >
      {months.map((m) => {
        const isActive = m.key === selected;
        return (
          <button
            key={m.key}
            data-active={isActive}
            onClick={() => onSelect(m.key)}
            className={`shrink-0 rounded-full px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-text-primary text-bg-primary"
                : "bg-bg-secondary text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {m.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────

export default function DashboardPage() {
  const allTransactions = useTransactionStore((s) => s.transactions);

  const months = useMemo(() => getAvailableMonths(allTransactions), [allTransactions]);
  const latestMonth = months.length > 0 ? months[months.length - 1].key : "";
  const [selectedMonth, setSelectedMonth] = useState(latestMonth);

  // Keep selected month in sync if new data arrives
  useEffect(() => {
    if (months.length > 0 && !months.some((m) => m.key === selectedMonth)) {
      setSelectedMonth(months[months.length - 1].key);
    }
  }, [months, selectedMonth]);

  const monthLabel = useMemo(() => {
    const found = months.find((m) => m.key === selectedMonth);
    return found?.label ?? "Dashboard";
  }, [months, selectedMonth]);

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />

      <div className="flex flex-col gap-4 px-3">
        <div className="flex flex-col gap-2.5 px-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-text-quaternary">
                Sailor
              </p>
              <h1 className="text-lg font-bold tracking-tight text-text-primary">
                {monthLabel}
              </h1>
            </div>
          </div>
          <MonthPicker
            months={months}
            selected={selectedMonth}
            onSelect={setSelectedMonth}
          />
        </div>

        <TabBar
          defaultTab="Business"
          children={{
            Business: <BusinessContent monthKey={selectedMonth} />,
            Personal: <PersonalContent monthKey={selectedMonth} />,
          }}
        />
      </div>

      <div className="h-8 safe-bottom" />
    </div>
  );
}
