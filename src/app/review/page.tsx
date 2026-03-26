"use client";

import Link from "next/link";
import { useTransactionStore, selectUnreviewedByType } from "@/stores/transactions";

export default function ReviewPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  const bizCount = selectUnreviewedByType({ transactions, notes }, "business").length;
  const personalCount = selectUnreviewedByType({ transactions, notes }, "personal").length;

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />
      <div className="flex flex-col gap-6 px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-text-tertiary text-sm">
            &larr; Back
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Expense Review
          </h1>
          <p className="text-sm text-text-tertiary">
            Categorize your recent transactions into alignment buckets.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="section-label">Choose a flow</p>

          <Link href="/review/business" className="block">
            <div className="card p-4 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-text-primary">
                  Business Expenses
                </p>
                <p className="text-[10px] text-text-tertiary">
                  Sort into High ROI / No ROI / Unsure
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-text-primary text-bg-primary text-xs font-bold px-2.5 py-1 rounded-lg">
                  {bizCount}
                </span>
                <span className="text-text-tertiary">&rarr;</span>
              </div>
            </div>
          </Link>

          <Link href="/review/personal" className="block">
            <div className="card p-4 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-text-primary">
                  Personal Expenses
                </p>
                <p className="text-[10px] text-text-tertiary">
                  Sort into Essential / Meaningful / Mismatch
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-text-primary text-bg-primary text-xs font-bold px-2.5 py-1 rounded-lg">
                  {personalCount}
                </span>
                <span className="text-text-tertiary">&rarr;</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
