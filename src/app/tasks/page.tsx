"use client";

import { useMemo, useState, useRef } from "react";
import { useTransactionStore } from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import { useBucketStore } from "@/stores/buckets";
import { useTasksStore } from "@/stores/tasks";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import {
  Eye,
  ShieldCheck,
  Wallet,
  Building2,
  CreditCard,
  HelpCircle,
  AlertTriangle,
  Calculator,
  Scissors,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  type LucideIcon,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface GeneratedTask {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly href?: string;
  readonly priority: "high" | "medium" | "low";
}

// ─── Task Row ───────────────────────────────────────────────

function TaskRow({
  id,
  icon: Icon,
  title,
  description,
  href,
  completed,
  onToggle,
}: {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description?: string;
  readonly href?: string;
  readonly completed: boolean;
  readonly onToggle: (id: string) => void;
}) {
  const content = (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3.5 shadow-sm transition-all duration-200 ${
        completed ? "opacity-50" : "hover:shadow-md"
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(id);
        }}
        className="mt-0.5 shrink-0 p-0.5 -ml-0.5"
      >
        {completed ? (
          <CheckCircle2 className="size-5 text-text-tertiary" strokeWidth={2} />
        ) : (
          <Circle className="size-5 text-text-quaternary" strokeWidth={1.5} />
        )}
      </button>

      {/* Icon */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-bg-secondary mt-0.5">
        <Icon className="size-3.5 text-text-secondary" />
      </div>

      {/* Text */}
      <div className="flex flex-1 min-w-0 flex-col gap-0.5">
        <p
          className={`text-[13px] font-semibold leading-tight ${
            completed
              ? "text-text-tertiary line-through"
              : "text-text-primary"
          }`}
        >
          {title}
        </p>
        {description && (
          <p className="text-[11px] text-text-tertiary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Link arrow (only if href) */}
      {href && !completed && (
        <ChevronRight className="size-4 shrink-0 text-text-quaternary mt-1.5" />
      )}
    </div>
  );

  if (href && !completed) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}

// ─── Manual Task Row ────────────────────────────────────────

function ManualTaskRow({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}: {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly onToggle: (id: string) => void;
  readonly onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3 shadow-sm transition-all duration-200 ${
        completed ? "opacity-50" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="shrink-0 p-0.5 -ml-0.5"
      >
        {completed ? (
          <CheckCircle2 className="size-5 text-text-tertiary" strokeWidth={2} />
        ) : (
          <Circle className="size-5 text-text-quaternary" strokeWidth={1.5} />
        )}
      </button>
      <p
        className={`flex-1 text-[13px] font-medium ${
          completed
            ? "text-text-tertiary line-through"
            : "text-text-primary"
        }`}
      >
        {title}
      </p>
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="shrink-0 p-1 text-text-quaternary hover:text-text-secondary transition-colors"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

// ─── Add Task Input ─────────────────────────────────────────

function AddTaskInput({ onAdd }: { readonly onAdd: (title: string) => void }) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border-secondary bg-bg-primary px-4 py-2.5">
      <Plus className="size-4 shrink-0 text-text-quaternary" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder="Add a task..."
        className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-quaternary outline-none"
      />
      {value.trim() && (
        <button
          type="button"
          onClick={handleSubmit}
          className="shrink-0 rounded-lg bg-bg-secondary px-3 py-1 text-[11px] font-semibold text-text-primary transition-colors hover:bg-bg-secondary-hover"
        >
          Add
        </button>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────

export default function TasksPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  const accounts = useAccountStore((s) => s.accounts);
  const buckets = useBucketStore((s) => s.buckets);

  const completedIds = useTasksStore((s) => s.completedIds);
  const manualTasks = useTasksStore((s) => s.manualTasks);
  const toggleComplete = useTasksStore((s) => s.toggleComplete);
  const addManualTask = useTasksStore((s) => s.addManualTask);
  const removeManualTask = useTasksStore((s) => s.removeManualTask);
  const clearCompleted = useTasksStore((s) => s.clearCompleted);

  // ── Auto-generated tasks ──────────────────────────────────

  const generated = useMemo(() => {
    const result: GeneratedTask[] = [];

    const bizAccounts = accounts.filter((a) => a.type === "business");
    const bizAccountIds = bizAccounts.map((a) => a.id);
    const personalAccountIds = accounts
      .filter((a) => a.type === "personal")
      .map((a) => a.id);

    // Unreviewed transactions
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
      });
    }

    // Cancel No-ROI recurring subscriptions
    const noRoiRecurring = transactions.filter(
      (t) =>
        t.reviewed &&
        t.businessBucket === "no_roi" &&
        t.isRecurring &&
        !t.isTransfer &&
        bizAccountIds.includes(t.accountId)
    );

    const noRoiMerchants = new Map<
      string,
      { name: string; monthlyAmount: number }
    >();
    for (const t of noRoiRecurring) {
      const key = t.merchantName;
      const existing = noRoiMerchants.get(key);
      if (existing) {
        noRoiMerchants.set(key, {
          ...existing,
          monthlyAmount: Math.max(existing.monthlyAmount, t.amount),
        });
      } else {
        noRoiMerchants.set(key, { name: key, monthlyAmount: t.amount });
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
        description: `${formatCurrency(totalNoRoiRecurring)}/mo · ${noRoiList
          .slice(0, 3)
          .map((m) => m.name)
          .join(", ")}${noRoiList.length > 3 ? ` +${noRoiList.length - 3} more` : ""}`,
        href: "/insights/business/no-roi",
        priority: "high",
      });
    }

    // Mismatch recurring
    const mismatchRecurring = transactions.filter(
      (t) =>
        t.reviewed &&
        t.personalBucket === "mismatch" &&
        t.isRecurring &&
        !t.isTransfer &&
        personalAccountIds.includes(t.accountId)
    );
    const mismatchMerchants = new Map<
      string,
      { name: string; amount: number }
    >();
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
        description: `${formatCurrency(totalMismatchRecurring)}/mo didn't align with your values.`,
        href: "/insights/personal/mismatch",
        priority: "medium",
      });
    }

    // Re-review unsure
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
        description: `${formatCurrency(unsureTotal)} in business expenses — take another look.`,
        href: "/insights/unsure-review",
        priority: "medium",
      });
    }

    // Cashflow waterfall
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
        description: `${formatCurrency(checkingBalance)} of ${formatCurrency(bufferTarget)} target. Focus here before debt.`,
        priority: checkingBalance < bufferTarget * 0.5 ? "high" : "medium",
      });
    }

    if (bufferTarget > 0 && checkingBalance > bufferTarget * 1.2) {
      const overflow = checkingBalance - bufferTarget;
      result.push({
        id: "waterfall-overflow",
        icon: Wallet,
        title: `Move ${formatCurrency(overflow)} to working capital`,
        description: `Buffer is full — move excess to WC or tax savings.`,
        priority: "medium",
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
        description: `${formatCurrency(taxSaved)} of ${formatCurrency(taxTarget)} saved.`,
        href: "/insights/taxes",
        priority: "medium",
      });
    }

    // Debt paydown
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
      const sorted = [...debtAccounts].sort(
        (a, b) => Math.abs(b.balance) - Math.abs(a.balance)
      );
      result.push({
        id: "pay-debt",
        icon: CreditCard,
        title: `Pay down ${sorted[0]?.name ?? "highest-rate debt"}`,
        description: `${formatCurrency(totalDebt)} total · ~${formatCurrency(Math.round(totalDebt * 0.22 / 12))}/mo interest.`,
        priority: "medium",
      });
    }

    // Profit → debt paydown
    const bizIncome = transactions.filter(
      (t) =>
        bizAccountIds.includes(t.accountId) && t.amount < 0 && !t.isTransfer
    );
    const totalRevenue = Math.abs(
      bizIncome.reduce((sum, t) => sum + t.amount, 0)
    );
    const taxBucketsList = buckets.filter(
      (b) => b.isActive && b.name.toLowerCase().includes("tax")
    );
    const totalTaxes = taxBucketsList.reduce(
      (sum, b) => sum + b.current,
      0
    );
    const profit = totalRevenue - monthlyExpenses - totalTaxes;
    if (
      profit > 0 &&
      totalDebt > 0 &&
      bufferTarget > 0 &&
      checkingBalance >= bufferTarget
    ) {
      const topDebt = [...debtAccounts].sort(
        (a, b) => Math.abs(b.balance) - Math.abs(a.balance)
      )[0];
      result.push({
        id: "profit-to-debt",
        icon: CreditCard,
        title: `Put ${formatCurrency(Math.round(profit * 0.5))} of profit toward ${topDebt?.name ?? "debt"}`,
        description: `You made money this month. Let's put it to work.`,
        priority: "medium",
      });
    }

    // Biz/personal bleed
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
        description: `Keep your P&L clean.`,
        priority: "low",
      });
    }

    return result;
  }, [transactions, notes, accounts, buckets]);

  // ── Split into active/completed ───────────────────────────

  const activeGenerated = generated.filter(
    (t) => !completedIds.includes(t.id)
  );
  const completedGenerated = generated.filter((t) =>
    completedIds.includes(t.id)
  );

  const activeManual = manualTasks.filter(
    (t) => !completedIds.includes(t.id)
  );
  const completedManual = manualTasks.filter((t) =>
    completedIds.includes(t.id)
  );

  const totalCompleted = completedGenerated.length + completedManual.length;

  const highActive = activeGenerated.filter((t) => t.priority === "high");
  const mediumActive = activeGenerated.filter((t) => t.priority === "medium");
  const lowActive = activeGenerated.filter((t) => t.priority === "low");

  const hasNoTasks =
    activeGenerated.length === 0 &&
    activeManual.length === 0 &&
    totalCompleted === 0;

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

        {/* Empty state */}
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

        {/* Do First (high priority) */}
        {highActive.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label px-1">Do First</p>
            <div className="flex flex-col gap-1.5">
              {highActive.map((task) => (
                <TaskRow
                  key={task.id}
                  id={task.id}
                  icon={task.icon}
                  title={task.title}
                  description={task.description}
                  href={task.href}
                  completed={false}
                  onToggle={toggleComplete}
                />
              ))}
            </div>
          </section>
        )}

        {/* This Week (medium priority) */}
        {mediumActive.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label px-1">This Week</p>
            <div className="flex flex-col gap-1.5">
              {mediumActive.map((task) => (
                <TaskRow
                  key={task.id}
                  id={task.id}
                  icon={task.icon}
                  title={task.title}
                  description={task.description}
                  href={task.href}
                  completed={false}
                  onToggle={toggleComplete}
                />
              ))}
            </div>
          </section>
        )}

        {/* When You Have Time (low priority) */}
        {lowActive.length > 0 && (
          <section className="flex flex-col gap-2">
            <p className="section-label px-1">When You Have Time</p>
            <div className="flex flex-col gap-1.5">
              {lowActive.map((task) => (
                <TaskRow
                  key={task.id}
                  id={task.id}
                  icon={task.icon}
                  title={task.title}
                  description={task.description}
                  href={task.href}
                  completed={false}
                  onToggle={toggleComplete}
                />
              ))}
            </div>
          </section>
        )}

        {/* My Tasks (manual) */}
        <section className="flex flex-col gap-2">
          <p className="section-label px-1">My Tasks</p>
          <div className="flex flex-col gap-1.5">
            {activeManual.map((task) => (
              <ManualTaskRow
                key={task.id}
                id={task.id}
                title={task.title}
                completed={false}
                onToggle={toggleComplete}
                onDelete={removeManualTask}
              />
            ))}
            <AddTaskInput onAdd={addManualTask} />
          </div>
        </section>

        {/* Completed */}
        {totalCompleted > 0 && (
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <p className="section-label">
                Completed ({totalCompleted})
              </p>
              <button
                type="button"
                onClick={clearCompleted}
                className="text-[10px] text-text-quaternary hover:text-text-secondary transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {completedGenerated.map((task) => (
                <TaskRow
                  key={task.id}
                  id={task.id}
                  icon={task.icon}
                  title={task.title}
                  completed={true}
                  onToggle={toggleComplete}
                />
              ))}
              {completedManual.map((task) => (
                <ManualTaskRow
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  completed={true}
                  onToggle={toggleComplete}
                  onDelete={removeManualTask}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="h-24 safe-bottom" />
    </div>
  );
}
