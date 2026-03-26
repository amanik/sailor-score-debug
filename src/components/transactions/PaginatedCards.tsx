"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Transaction } from "@/data/transactions";

interface PaginatedCardsProps {
  readonly transactions: readonly Transaction[];
  readonly pageSize?: number;
}

export function PaginatedCards({
  transactions,
  pageSize = 10,
}: PaginatedCardsProps) {
  const [page, setPage] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));

  // Clamp page index when transaction list shrinks (e.g., after filtering)
  useEffect(() => {
    if (page >= totalPages) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * pageSize;
  const end = start + pageSize;
  const currentItems = transactions.slice(start, end);

  function handlePrev() {
    setPage((p) => Math.max(0, p - 1));
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

  function handleTap(transaction: Transaction) {
    router.push(`${pathname}/${transaction.id}`);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Transaction cards */}
      <div className="flex flex-col gap-1.5">
        {currentItems.map((txn) => (
          <TransactionCard key={txn.id} transaction={txn} onTap={handleTap} />
        ))}
      </div>

      {/* Empty state */}
      {transactions.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-text-tertiary">
            No transactions found
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handlePrev}
            disabled={page === 0}
            className="text-text-tertiary disabled:opacity-30"
            render={<button />}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="font-mono text-[11px] font-medium text-text-secondary tabular-nums">
            {page + 1} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className="text-text-tertiary disabled:opacity-30"
            render={<button />}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
