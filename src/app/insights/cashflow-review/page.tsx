"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, DollarSign, RefreshCcw, Trash2, Undo2 } from "lucide-react";
import {
  useTransactionStore,
  useTransactionDispatch,
  selectCashFlow,
} from "@/stores/transactions";
import type { Transaction } from "@/data/transactions";
import { ExpenseCard } from "@/components/review/ExpenseCard";
import { ProgressBar } from "@/components/review/ProgressBar";
import { CATEGORIES } from "@/lib/constants";
import { MonthPicker, getAvailableMonths, filterByMonth } from "@/components/dashboard/MonthPicker";

type FlowState = "review" | "recategorize" | "done";

export default function CashflowReviewPage() {
  const router = useRouter();
  const allTransactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  const dispatch = useTransactionDispatch();

  // ─── Month Picker ──────────────────────────────────────────
  const allCashflow = useMemo(
    () => selectCashFlow({ transactions: allTransactions, notes }),
    [allTransactions, notes]
  );
  const months = useMemo(() => getAvailableMonths(allCashflow), [allCashflow]);
  const latestMonth = months.length > 0 ? months[months.length - 1].key : "";
  const [selectedMonth, setSelectedMonth] = useState(latestMonth);

  useEffect(() => {
    if (months.length > 0 && !months.some((m) => m.key === selectedMonth)) {
      setSelectedMonth(months[months.length - 1].key);
    }
  }, [months, selectedMonth]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flowState, setFlowState] = useState<FlowState>("review");
  const [direction, setDirection] = useState<"left" | "right" | "up" | null>(null);
  const [stats, setStats] = useState({ confirmed: 0, recategorized: 0, removed: 0 });
  const [reviewedLocal, setReviewedLocal] = useState<Array<{ txn: Transaction; action: string }>>([]);

  const txnSnapshot = useMemo(
    () => filterByMonth(allCashflow, selectedMonth) as Transaction[],
    [allCashflow, selectedMonth]
  );

  // Reset index when month changes
  useEffect(() => {
    setCurrentIndex(0);
    setFlowState("review");
    setDirection(null);
    setStats({ confirmed: 0, recategorized: 0, removed: 0 });
    setReviewedLocal([]);
  }, [selectedMonth]);

  const current = txnSnapshot[currentIndex] as Transaction | undefined;
  const total = txnSnapshot.length;

  function advanceToNext() {
    setDirection(null);
    setFlowState("review");
    if (currentIndex + 1 >= total) {
      setFlowState("done");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleConfirm() {
    if (current) {
      setReviewedLocal((prev) => [...prev, { txn: current, action: "confirmed" }]);
      setStats((s) => ({ ...s, confirmed: s.confirmed + 1 }));
    }
    setDirection("right");
    setTimeout(advanceToNext, 300);
  }

  function handleNotThis() {
    setDirection("left");
    setTimeout(() => setFlowState("recategorize"), 300);
  }

  function handleRemove() {
    if (current) {
      dispatch({ type: "EXCLUDE_FROM_CASHFLOW", id: current.id });
      setReviewedLocal((prev) => [...prev, { txn: current, action: "removed" }]);
      setStats((s) => ({ ...s, removed: s.removed + 1 }));
    }
    setDirection("up");
    setTimeout(advanceToNext, 300);
  }

  function handleRecategorize(category: string) {
    if (current) {
      dispatch({
        type: "UPDATE_TRANSACTION",
        id: current.id,
        updates: { category },
      });
      setReviewedLocal((prev) => [...prev, { txn: current, action: `recategorized:${category}` }]);
      setStats((s) => ({ ...s, recategorized: s.recategorized + 1 }));
    }
    advanceToNext();
  }

  function handleUndo() {
    if (reviewedLocal.length === 0) return;
    const last = reviewedLocal[reviewedLocal.length - 1];
    // Undo the stats
    if (last.action === "confirmed") {
      setStats((s) => ({ ...s, confirmed: s.confirmed - 1 }));
    } else if (last.action === "removed") {
      // Un-exclude from cashflow by setting isTransfer back to false
      dispatch({
        type: "UPDATE_TRANSACTION",
        id: last.txn.id,
        updates: { isTransfer: false },
      });
      setStats((s) => ({ ...s, removed: s.removed - 1 }));
    } else if (last.action.startsWith("recategorized:")) {
      // Revert category
      dispatch({
        type: "UPDATE_TRANSACTION",
        id: last.txn.id,
        updates: { category: last.txn.category },
      });
      setStats((s) => ({ ...s, recategorized: s.recategorized - 1 }));
    }
    setReviewedLocal((prev) => prev.slice(0, -1));
    setCurrentIndex((i) => Math.max(0, i - 1));
    setFlowState("review");
    setDirection(null);
  }

  function handleSwipe(swipeDirection: "left" | "right" | "up") {
    if (swipeDirection === "right") handleConfirm();
    else if (swipeDirection === "left") handleNotThis();
    else handleRemove();
  }

  if (total === 0 || flowState === "done") {
    return (
      <div className="flex flex-col pb-4 safe-top">
        <div className="h-[60px]" />
        <div className="flex flex-col gap-6 px-4 items-center text-center pt-12">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-bg-secondary">
            <DollarSign className="size-8 text-text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Cashflow Review Complete
          </h1>
          <p className="text-sm text-text-tertiary">
            {total > 0
              ? `You reviewed ${total} income transactions`
              : "No income transactions to review!"}
          </p>
          {(stats.confirmed > 0 || stats.recategorized > 0 || stats.removed > 0) && (
            <div className="flex gap-4 mt-4">
              <div className="card p-3 flex flex-col items-center gap-1">
                <DollarSign className="size-5 text-text-secondary" />
                <span className="text-lg font-bold text-text-primary">{stats.confirmed}</span>
                <span className="text-[9px] text-text-tertiary">Confirmed</span>
              </div>
              <div className="card p-3 flex flex-col items-center gap-1">
                <RefreshCcw className="size-5 text-text-secondary" />
                <span className="text-lg font-bold text-text-primary">{stats.recategorized}</span>
                <span className="text-[9px] text-text-tertiary">Recategorized</span>
              </div>
              <div className="card p-3 flex flex-col items-center gap-1">
                <Trash2 className="size-5 text-text-secondary" />
                <span className="text-lg font-bold text-text-primary">{stats.removed}</span>
                <span className="text-[9px] text-text-tertiary">Removed</span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 mt-6 w-full max-w-[280px]">
            <Link href="/insights" className="bg-text-primary text-bg-primary px-6 py-3 rounded-xl text-sm font-bold text-center">
              View Insights
            </Link>
            <Link href="/" className="text-text-tertiary text-sm text-center mt-2">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />
      <div className="flex flex-col gap-4 px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="text-text-tertiary text-sm">
            {"\u2190"} Back
          </button>
          <p className="section-label">Cashflow Review</p>
          {reviewedLocal.length > 0 && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 text-text-tertiary text-sm hover:text-text-primary transition-colors"
            >
              <Undo2 className="size-3.5" />
              Undo
            </button>
          )}
        </div>

        <MonthPicker months={months} selected={selectedMonth} onSelect={setSelectedMonth} />

        <ProgressBar current={currentIndex + 1} total={total} />

        {/* Card */}
        <div className="relative min-h-[320px]">
          <AnimatePresence mode="wait">
            <ExpenseCard
              key={current.id}
              transaction={current}
              direction={direction}
              onSwipe={handleSwipe}
              rightLabel="Cash Flow"
              leftLabel="Recategorize"
              upLabel="Remove"
            />
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="flex-1 card p-3 flex flex-col items-center gap-1.5 hover:bg-bg-secondary transition-colors active:scale-95"
          >
            <DollarSign className="size-5 text-text-secondary" />
            <span className="text-[10px] font-bold text-text-primary">Cash Flow</span>
          </button>
          <button
            onClick={handleNotThis}
            className="flex-1 card p-3 flex flex-col items-center gap-1.5 hover:bg-bg-secondary transition-colors active:scale-95"
          >
            <RefreshCcw className="size-5 text-text-secondary" />
            <span className="text-[10px] font-bold text-text-primary">Recategorize</span>
          </button>
          <button
            onClick={handleRemove}
            className="flex-1 card p-3 flex flex-col items-center gap-1.5 hover:bg-bg-secondary transition-colors active:scale-95"
          >
            <Trash2 className="size-5 text-text-secondary" />
            <span className="text-[10px] font-bold text-text-primary">Remove</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Sheet: Category Picker ── */}
      <AnimatePresence>
        {flowState === "recategorize" && current && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => { setFlowState("review"); setDirection(null); }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg max-h-[70vh] overflow-y-auto"
            >
              <div className="rounded-t-2xl bg-bg-primary px-4 pb-8 pt-4">
                <div className="mb-4 flex justify-center">
                  <div className="h-1 w-10 rounded-full bg-border-secondary" />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="section-label">Recategorize</p>
                  <button
                    onClick={() => { setFlowState("review"); setDirection(null); }}
                    className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-bg-secondary"
                  >
                    <X className="size-4 text-text-tertiary" />
                  </button>
                </div>
                <h2 className="text-lg font-bold tracking-tight text-text-primary text-center mb-4">
                  What category is this?
                </h2>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleRecategorize(cat)}
                      className="card p-3 text-left text-sm font-semibold text-text-primary hover:bg-bg-secondary transition-colors active:scale-[0.98]"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
