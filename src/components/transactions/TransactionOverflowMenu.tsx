"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Transaction } from "@/data/transactions";
import { formatBucketType } from "@/data/buckets";
import { useAccountStore } from "@/stores/accounts";
import { useTransactionStore } from "@/stores/transactions";
import { useBucketStore, selectActiveBuckets } from "@/stores/buckets";

interface TransactionOverflowMenuProps {
  readonly transaction: Transaction;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const CATEGORIES = [
  "Software",
  "Marketing",
  "Contract Labor",
  "Groceries",
  "Eating Out",
  "Subscriptions",
  "Travel & Vacation",
  "Health & Fitness",
  "Shopping",
  "Auto & Gas",
  "Insurance",
  "Health",
  "Stripe Deposits",
  "Owners Distribution",
];

export function TransactionOverflowMenu({
  transaction,
  isOpen,
  onClose,
}: TransactionOverflowMenuProps) {
  const [showCategories, setShowCategories] = useState(false);

  const account = useAccountStore.getState().getAccountById(transaction.accountId);
  const isBusinessAccount = account?.type === "business";

  const buckets = useBucketStore((s) => s.buckets);
  const activeBuckets = buckets.filter((b) => b.isActive);

  function handleCategorySelect(category: string) {
    useTransactionStore.getState().updateTransaction(transaction.id, {
      category,
    });
    onClose();
  }

  function handleMoveToAccountType() {
    const targetType = isBusinessAccount ? "personal" : "business";
    useTransactionStore.getState().moveToAccountType(transaction.id, targetType);
    onClose();
  }

  function handleAddToBucket(bucketId: string) {
    useBucketStore.getState().linkTransaction(bucketId, transaction.id);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[390px]"
          >
            <div className="max-h-[70vh] overflow-y-auto rounded-t-2xl bg-bg-primary">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-2 pt-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Actions
                </p>
                <button
                  onClick={onClose}
                  className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-bg-secondary"
                >
                  <X className="size-4 text-text-tertiary" />
                </button>
              </div>

              {/* Section 1: Update Category */}
              <div className="border-b border-border-secondary px-4 pb-3">
                <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Category
                </p>
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="w-full rounded-lg p-3 text-left text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-secondary"
                >
                  {transaction.category}{" "}
                  <span className="text-text-quaternary">
                    {showCategories ? "▲" : "▼"}
                  </span>
                </button>
                {showCategories && (
                  <div className="mt-1 flex max-h-48 flex-col gap-0.5 overflow-y-auto rounded-lg border border-border-secondary bg-bg-primary p-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`rounded-md px-3 py-2 text-left text-[12px] font-medium transition-colors ${
                          transaction.category === cat
                            ? "bg-bg-active text-text-primary"
                            : "text-text-secondary hover:bg-bg-secondary"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Move to Business / Personal */}
              <div className="border-b border-border-secondary px-4 py-3">
                <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Account
                </p>
                <button
                  onClick={handleMoveToAccountType}
                  className="w-full rounded-lg p-3 text-left text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-secondary"
                >
                  Move to {isBusinessAccount ? "Personal" : "Business"}
                </button>
              </div>

              {/* Section 3: Add to Bucket */}
              <div className="px-4 pb-6 pt-3">
                <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Add to Bucket
                </p>
                <div className="flex flex-col gap-0.5">
                  {activeBuckets.map((bucket) => (
                    <button
                      key={bucket.id}
                      onClick={() => handleAddToBucket(bucket.id)}
                      className="flex w-full items-center gap-2 rounded-lg p-3 text-left transition-colors hover:bg-bg-secondary"
                    >
                      <span className="text-base">{bucket.emoji}</span>
                      <span className="flex-1 text-[13px] font-medium text-text-primary">
                        {bucket.name}
                      </span>
                      <span className="rounded-md bg-bg-secondary px-2 py-0.5 text-[10px] font-semibold text-text-tertiary">
                        {formatBucketType(bucket.type)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
