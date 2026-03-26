"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Transaction } from "@/data/transactions";
import { useAccountStore } from "@/stores/accounts";

interface TransactionCardProps {
  readonly transaction: Transaction;
  readonly onTap: (transaction: Transaction) => void;
}

export function TransactionCard({ transaction, onTap }: TransactionCardProps) {
  const account = useAccountStore.getState().getAccountById(transaction.accountId);
  const isIncome = transaction.amount < 0;
  const displayAmount = isIncome
    ? `+$${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `-$${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formattedDate = new Date(transaction.date + "T12:00:00").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  );

  return (
    <button
      onClick={() => onTap(transaction)}
      className="block w-full text-left group/txn"
    >
      <Card className="shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99] ring-0 border border-border-secondary">
        <CardContent className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg-secondary text-lg">
            {transaction.merchantLogo}
          </div>

          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <p className="text-[13px] font-semibold text-text-primary truncate">
              {transaction.merchantName}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-text-tertiary">{formattedDate}</span>
              {account && (
                <>
                  <span className="text-[10px] text-text-quaternary">&middot;</span>
                  <span className="text-[10px] text-text-tertiary truncate">
                    {account.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <p className="text-[13px] font-bold tracking-tight text-text-primary">
              {displayAmount}
            </p>
            <span className="rounded bg-bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-text-secondary whitespace-nowrap">
              {transaction.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
