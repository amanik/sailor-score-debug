"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TransactionDetail } from "@/components/transactions/TransactionDetail";
import { useTransactions, selectTransaction } from "@/stores/transactions";

interface PageProps {
  readonly params: Promise<{ category: string; id: string }>;
}

export default function TransactionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const state = useTransactions();
  const transaction = selectTransaction(state, id);
  const router = useRouter();

  if (!transaction) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 safe-top">
        <p className="text-sm text-text-tertiary">Transaction not found</p>
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-text-primary underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <TransactionDetail
      transaction={transaction}
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    />
  );
}
