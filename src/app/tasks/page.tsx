"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import { useBucketStore } from "@/stores/buckets";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import {
  Eye,
  TrendingDown,
  ShieldCheck,
  Wallet,
  Building2,
  CreditCard,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Scissors,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface Task {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly priority: "high" | "medium" | "low";
  readonly category: "review" | "cashflow" | "debt" | "savings" | "cancel";
}

// ─── Task Card ──────────────────────────────────────────────

function TaskCard({ task }: { readonly task: Task }) {
  const priorityBorder =
    task.priority === "high"
      ? "border-text-secondary"
      : task.priority === "medium"
        ? "border-border-secondary"
        : "border-border-secondary/50";

  return (
    <Link href={task.href} className="group/task block">
      <div
        className={`flex items-start gap-3 rounded-xl border ${priorityBorder} bg-bg-primary px-4 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md`}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-secondary mt-0.5">
          <task.icon className="size-4 text-text-secondary" />
        </div>
        <div className="flex flex-1 min-w-0 flex-col gap-1">
          <p className="text-[13px] font-semibold text-text-primary leading-tight">
            {task.title}
          </p>
          <p className="text-[11px] text-text-tertiary leading-relaxed">
            {task.description}
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-text-quaternary mt-2 transition-transform duration-200 group-hover/task:translate-x-0.5" />
      </div>
    </Link>
  );
}

// ─── Page ───────────────────────────────────────────────────

export default function TasksPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  const accounts = useAccountStore((s) => s.accounts);
  const buckets = useBucketStore((s) => s.buckets);

  const tasks = useMemo(() => {
    const result: Task[] = [];

    const bizAccounts = accounts.filter((a) => a.type === "business");
    const bizAccountIds = bizAccounts.map((a) => a.id);
    const personalAccountIds = accounts
      .filter((a) => a.type === "personal")
      .map((a) => a.id);

    // ── Unreviewed transactions ──
    const unreviewedBiz = transactions.filter(
      (t) =>
        !t.reviewed && !t.isTransfer && bizAccountIds.includes(t.accountId)
    );
    const unreviewedPersonal = transactions.filter(
      (t) =>
        !t.reviewed &&
        !t.isTransfer &&
        personalAccountIds.includes(t.accountId)
    );

    if (unreviewedBiz.length > 0) {
      result.push({
        id: "review-biz",
        icon: Eye,
        title: `Review ${unreviewedBiz.length} business transactions`,
        description: `${Math.max(1, Math.round(unreviewedBiz.length * 0.3))} min · Your weekly check-in keeps your P&L honest.`,
        href: "/review/business",
        priority: "high",
        category: "review",
      });
    }

    if (unreviewedPersonal.length > 0) {
      result.push({
        id: "review-personal",
        icon: Eye,
        title: `Review ${unreviewedPersonal.length} personal transactions`,
        description: `${Math.max(1, Math.round(unreviewedPersonal.length * 0.3))} min · Check in with your spending story.`,
        href: "/review/personal",
        priority: "high",
        category: "review",
      });
    }

    // ── Cancel No-ROI recurring subscriptions ──
    const noRoiRecurring = transactions.filter(
      (t) =>
        t.reviewed &&
        t.businessBucket === "no_roi" &&
        t.isRecurring &&
        !t.isTransfer &&
        bizAccountIds.includes(t.accountId)
    );

    // Deduplicate by merchant
    const noRoiMerchants = new Map<
      string,
      { name: string; monthlyAmount: number; count: number }
    >();
    for (const t of noRoiRecurring) {
      const key = t.merchantName;
      const existing = noRoiMerchants.get(key);
      if (existing) {
        noRoiMerchants.set(key, {
          ...existing,
          monthlyAmount: Math.max(existing.monthlyAmount, t.amount),
          count: existing.count + 1,
        });
      } else {
        noRoiMerchants.set(key, {
          name: key,
          monthlyAmount: t.amount,
          count: 1,
        });
      }
    }

    const noRoiList = [...noRoiMerchants.values()].sort(
      (a, b) => b.monthlyAmount - a.monthlyAmount
    );
    const totalNoRoiRecurring = noRoiList.reduce(
      (sum, m) => sum + m.monthlyAmount,
      0
    );

    if (noRoiList.length > 0) {
      result.push({
        id: "cancel-no-roi",
        icon: Scissors,
        title: `Cancel ${noRoiList.length} No-ROI subscription${noRoiList.length !== 1 ? "s" : ""}`,
        description: `${formatCurrency(totalNoRoiRecurring)}/mo in recurring expenses you rated No ROI. ${noRoiList.slice(0, 3).map((m) => m.name).join(", ")}${noRoiList.length > 3 ? ` +${noRoiList.length - 3} more` : ""}.`,
        href: "/insights/business/no-roi",
        priority: "high",
        category: "cancel",
      });
    }

    // ── Also surface personal mismatch recurring ──
    const mismatchRecurring = transactions.filter(
      (t) =>
        t.reviewed &&
        t.personalBucket === "mismatch" &&
        t.isRecurring &&
        !t.isTransfer &&
        personalAccountIds.includes(t.accountId)
    );

    const mismatchMerchants = new Map<string, { name: string; amount: number }>();
    for (const t of mismatchRecurring) {
      const key = t.merchantName;
      if (!mismatchMerchants.has(key)) {
        mismatchMerchants.set(key, { name: key, amount: t.amount });
      }
    }
    const mismatchList = [...mismatchMerchants.values()];
    const totalMismatchRecurring = mismatchList.reduce(
      (sum, m) => sum + m.amount,
      0
    );

    if (mismatchList.length > 0) {
      result.push({
        id: "cancel-mismatch",
        icon: AlertTriangle,
        title: `Review ${mismatchList.length} mismatch subscription${mismatchList.length !== 1 ? "s" : ""}`,
        description: `${formatCurrency(totalMismatchRecurring)}/mo in recurring spending that didn't align with your values.`,
        href: "/insights/personal/mismatch",
        priority: "medium",
        category: "cancel",
      });
    }

    // ── Re-review unsure transactions ──
    const unsureTxns = transactions.filter(
      (t) =>
        t.reviewed &&
        t.businessBucket === "unsure" &&
        !t.isTransfer &&
        bizAccountIds.includes(t.accountId)
    );
    if (unsureTxns.length > 0) {
      const unsureTotal = unsureTxns.reduce((sum, t) => sum + t.amount, 0);
      result.push({
        id: "re-review-unsure",
        icon: HelpCircle,
        title: `Decide on ${unsureTxns.length} Unsure expenses`,
        description: `${formatCurrency(unsureTotal)} in business expenses you weren't sure about. Take another look.`,
        href: "/insights/unsure-review",
        priority: "medium",
        category: "review",
      });
    }

    // ── Cashflow waterfall tasks ──
    const bizExpenses = transactions.filter(
      (t) =>
        bizAccountIds.includes(t.accountId) && t.amount > 0 && !t.isTransfer
    );
    const monthlyExpenses = bizExpenses.reduce((sum, t) => sum + t.amount, 0);

    const bizChecking = bizAccounts.filter(
      (a) => a.category === "checking" || a.category === "hysa"
    );
    const checkingBalance = bizChecking.reduce(
      (sum, a) => sum + Math.max(a.balance, 0),
      0
    );
    const bufferTarget = monthlyExpenses;

    if (bufferTarget > 0 && checkingBalance < bufferTarget) {
      const gap = bufferTarget - checkingBalance;
      result.push({
        id: "build-buffer",
        icon: ShieldCheck,
        title: `Build buffer — ${formatCurrency(gap)} to go`,
        description: `Your checking has ${formatCurrency(checkingBalance)} of your ${formatCurrency(bufferTarget)} buffer target (1 month expenses). Focus here before debt.`,
        href: "/insights",
        priority: checkingBalance < bufferTarget * 0.5 ? "high" : "medium",
        category: "cashflow",
      });
    }

    // Buffer overflow → move to WC
    if (bufferTarget > 0 && checkingBalance > bufferTarget * 1.2) {
      const overflow = checkingBalance - bufferTarget;
      result.push({
        id: "waterfall-overflow",
        icon: Wallet,
        title: `Move ${formatCurrency(overflow)} to working capital`,
        description: `Your buffer is full — move excess to working capital or tax savings. Don't let it sit in checking.`,
        href: "/insights",
        priority: "medium",
        category: "cashflow",
      });
    }

    // Tax savings
    const taxBuckets = buckets.filter(
      (b) => b.isActive && b.name.toLowerCase().includes("tax")
    );
    const taxSaved = taxBuckets.reduce((sum, b) => sum + b.current, 0);
    const taxTarget =
      taxBuckets.reduce((sum, b) => sum + (b.target ?? 0), 0) ||
      monthlyExpenses * 0.25;

    if (taxTarget > 0 && taxSaved < taxTarget) {
      const taxGap = taxTarget - taxSaved;
      result.push({
        id: "set-aside-taxes",
        icon: Calculator,
        title: `Set aside ${formatCurrency(taxGap)} for taxes`,
        description: `You've saved ${formatCurrency(taxSaved)} of your ${formatCurrency(taxTarget)} target. Tap to adjust your tax rate.`,
        href: "/insights/taxes",
        priority: "medium",
        category: "savings",
      });
    }

    // ── Debt paydown ──
    const debtAccounts = accounts.filter(
      (a) =>
        a.category === "credit_card" ||
        a.category === "loan" ||
        a.category === "line_of_credit"
    );
    const totalDebt = debtAccounts.reduce(
      (sum, a) => sum + Math.abs(a.balance),
      0
    );

    if (totalDebt > 0 && bufferTarget > 0 && checkingBalance >= bufferTarget) {
      const highestRate = debtAccounts.sort(
        (a, b) => Math.abs(b.balance) - Math.abs(a.balance)
      )[0];
      result.push({
        id: "pay-debt",
        icon: CreditCard,
        title: `Pay down ${highestRate?.name ?? "highest-rate debt"}`,
        description: `${formatCurrency(totalDebt)} total debt · ~${formatCurrency(Math.round(totalDebt * 0.22 / 12))}/mo in interest. Your buffer is funded — start chipping away.`,
        href: "/insights",
        priority: "medium",
        category: "debt",
      });
    }

    // ── Biz/personal bleed ──
    const personalOnBiz = transactions.filter(
      (t) =>
        bizAccountIds.includes(t.accountId) &&
        t.personalBucket &&
        !t.isTransfer
    );
    if (personalOnBiz.length > 0) {
      result.push({
        id: "separate-accounts",
        icon: Building2,
        title: `Move ${personalOnBiz.length} personal charges off business`,
        description: `You have personal expenses on business accounts. Clean this up to keep your P&L accurate.`,
        href: "/insights",
        priority: "low",
        category: "review",
      });
    }

    return result;
  }, [transactions, notes, accounts, buckets]);

  const highPriority = tasks.filter((t) => t.priority === "high");
  const mediumPriority = tasks.filter((t) => t.priority === "medium");
  const lowPriority = tasks.filter((t) => t.priority === "low");

  const hasNoTasks = tasks.length === 0;

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />
      <div className="flex flex-col gap-6 px-4">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Action Items
          </h1>
          <p className="text-sm text-text-tertiary">
            What Coach Annie would tell you to do this week.
          </p>
        </div>

        {hasNoTasks && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-bg-secondary">
              <ShieldCheck className="size-6 text-text-tertiary" />
            </div>
            <p className="text-[15px] font-semibold text-text-primary">
              You&apos;re all caught up
            </p>
            <p className="text-[13px] text-text-tertiary max-w-[260px]">
              No action items right now. Upload transactions or complete a review
              to generate tasks.
            </p>
          </div>
        )}

        {/* High Priority */}
        {highPriority.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label px-1">Do First</p>
            <div className="flex flex-col gap-1.5">
              {highPriority.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {/* Medium Priority */}
        {mediumPriority.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label px-1">This Week</p>
            <div className="flex flex-col gap-1.5">
              {mediumPriority.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {/* Low Priority */}
        {lowPriority.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label px-1">When You Have Time</p>
            <div className="flex flex-col gap-1.5">
              {lowPriority.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="h-8 safe-bottom" />
    </div>
  );
}
