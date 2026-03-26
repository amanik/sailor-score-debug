"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import type { Transaction } from "@/data/transactions";
import { useAccountStore } from "@/stores/accounts";
import { useTransactionStore, selectMerchantYearTotal } from "@/stores/transactions";
import { TransactionOverflowMenu } from "@/components/transactions/TransactionOverflowMenu";
import { getCategoryIcon } from "@/lib/icons";

interface ExpenseCardProps {
  readonly transaction: Transaction;
  readonly direction?: "left" | "right" | "up" | null;
  readonly onSwipe?: (direction: "left" | "right" | "up") => void;
  readonly leftLabel?: string;
  readonly rightLabel?: string;
  readonly upLabel?: string;
}

export function ExpenseCard({
  transaction,
  direction,
  onSwipe,
  leftLabel,
  rightLabel,
  upLabel,
}: ExpenseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const accounts = useAccountStore((s) => s.accounts);
  const account = accounts.find((a) => a.id === transaction.accountId);
  const allTransactions = useTransactionStore((s) => s.transactions);

  const txnYear = new Date(transaction.date).getFullYear();
  const merchantYearTotal = selectMerchantYearTotal(
    allTransactions,
    transaction.merchantName,
    txnYear
  );

  const CategoryIcon = getCategoryIcon(transaction.category);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Drag hint overlay opacities
  const rightOverlayOpacity = useTransform(x, [0, 100], [0, 0.8]);
  const leftOverlayOpacity = useTransform(x, [-100, 0], [0.8, 0]);
  const upOverlayOpacity = useTransform(y, [-100, 0], [0.8, 0]);

  const exitVariants = {
    left: { x: -400, opacity: 0, rotate: -10 },
    right: { x: 400, opacity: 0, rotate: 10 },
    up: { y: -400, opacity: 0 },
  };

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const { offset, velocity } = info;

    if (offset.x > 100 || velocity.x > 500) {
      onSwipe?.("right");
    } else if (offset.x < -100 || velocity.x < -500) {
      onSwipe?.("left");
    } else if (offset.y < -100 || velocity.y < -500) {
      onSwipe?.("up");
    }
  }

  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={direction ? exitVariants[direction] : { opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ x, y }}
      className="card p-5 flex flex-col gap-4 w-full relative overflow-hidden touch-none"
    >
      {/* Drag hint overlays */}
      {rightLabel && (
        <motion.div
          style={{ opacity: rightOverlayOpacity }}
          className="absolute inset-0 bg-utility-green-100 flex items-center justify-center pointer-events-none z-10 rounded-2xl"
        >
          <span className="text-utility-green-700 font-bold text-lg">{rightLabel}</span>
        </motion.div>
      )}
      {leftLabel && (
        <motion.div
          style={{ opacity: leftOverlayOpacity }}
          className="absolute inset-0 bg-utility-red-100 flex items-center justify-center pointer-events-none z-10 rounded-2xl"
        >
          <span className="text-utility-red-700 font-bold text-lg">{leftLabel}</span>
        </motion.div>
      )}
      {upLabel && (
        <motion.div
          style={{ opacity: upOverlayOpacity }}
          className="absolute inset-0 bg-bg-secondary flex items-center justify-center pointer-events-none z-10 rounded-2xl"
        >
          <span className="text-text-primary font-bold text-lg">{upLabel}</span>
        </motion.div>
      )}

      {/* 3-dot overflow menu trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(true);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-lg hover:bg-bg-secondary/50"
      >
        <MoreHorizontal className="size-4 text-text-tertiary" />
      </button>

      <TransactionOverflowMenu
        transaction={transaction}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex items-center gap-3">
        <div className="bg-bg-secondary rounded-xl size-12 flex items-center justify-center">
          <CategoryIcon className="size-6 text-text-secondary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text-primary">
            {transaction.merchantName}
          </p>
          <p className="text-[10px] text-text-tertiary">
            {new Date(transaction.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-4xl font-bold tracking-tighter text-text-primary">
          ${transaction.amount.toFixed(2)}
        </p>
        {transaction.isRecurring && transaction.annualProjection && (
          <p className="text-[10px] text-text-tertiary mt-1">
            {"\u2248"} ${transaction.annualProjection.toLocaleString()}/yr {"\u00B7"} Recurring{" "}
            {transaction.recurringFrequency}
          </p>
        )}
        {merchantYearTotal > 0 && (
          <p className="text-[10px] text-text-tertiary mt-1">
            ${merchantYearTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} at {transaction.merchantName} this year
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-border-secondary pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-tertiary">Category</span>
          <span className="text-[10px] font-semibold text-text-primary">
            {transaction.category}
          </span>
        </div>
        {account && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-tertiary">Account</span>
            <span className="text-[10px] font-semibold text-text-primary">
              {account.type === "personal" ? "PERSONAL" : "BIZ"} -{" "}
              {account.name}
            </span>
          </div>
        )}
        {transaction.rawDescription && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-tertiary">Description</span>
            <span className="text-[10px] font-mono text-text-tertiary truncate max-w-[200px]">
              {transaction.rawDescription}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
