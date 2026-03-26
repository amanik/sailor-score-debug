"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PaginatedCards } from "@/components/transactions/PaginatedCards";
import {
  useTransactionStore,
  selectBusinessTransactions,
  selectPersonalTransactions,
} from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import type { Transaction } from "@/data/transactions";

interface CategoryConfig {
  readonly title: string;
  readonly subtitle: string;
  readonly getTransactions: (
    allTxns: readonly Transaction[],
    bizTxns: readonly Transaction[],
    personalTxns: readonly Transaction[],
    accountIds: { hysa: readonly string[] }
  ) => readonly Transaction[];
}

const categoryMap: Record<string, CategoryConfig> = {
  "cash-flow": {
    title: "Cash Flow",
    subtitle: "All income and inflows",
    getTransactions: (all) => all.filter((t) => t.amount < 0 && !t.isTransfer),
  },
  "business-expenses": {
    title: "Business Expenses",
    subtitle: "All business outflows",
    getTransactions: (_, biz) => biz.filter((t) => t.amount > 0),
  },
  "personal-expenses": {
    title: "Personal Expenses",
    subtitle: "All personal outflows",
    getTransactions: (_, __, personal) => personal.filter((t) => t.amount > 0),
  },
  taxes: {
    title: "Taxes Held",
    subtitle: "Tax withholding transactions",
    getTransactions: (all) =>
      all.filter(
        (t) => t.category.toLowerCase().includes("tax") && !t.isTransfer
      ),
  },
  "horizon-funds": {
    title: "Horizon Funds",
    subtitle: "Savings and investment transfers",
    getTransactions: (all, _, __, { hysa }) =>
      all.filter(
        (t) =>
          t.category.toLowerCase().includes("horizon") ||
          (t.isTransfer && hysa.includes(t.accountId))
      ),
  },
  software: {
    title: "Software",
    subtitle: "SaaS and software subscriptions",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Software" && !t.isTransfer),
  },
  marketing: {
    title: "Marketing",
    subtitle: "Advertising and marketing spend",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Marketing" && !t.isTransfer),
  },
  "contract-labor": {
    title: "Contract Labor",
    subtitle: "Freelancer and contractor payments",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Contract Labor" && !t.isTransfer),
  },
  groceries: {
    title: "Groceries",
    subtitle: "Grocery store purchases",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Groceries" && !t.isTransfer),
  },
  "eating-out": {
    title: "Eating Out",
    subtitle: "Restaurants and food delivery",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Eating Out" && !t.isTransfer),
  },
  subscriptions: {
    title: "Subscriptions",
    subtitle: "Personal subscriptions",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Subscriptions" && !t.isTransfer),
  },
  "travel-vacation": {
    title: "Travel & Vacation",
    subtitle: "Travel bookings and expenses",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Travel & Vacation" && !t.isTransfer),
  },
  "health-fitness": {
    title: "Health & Fitness",
    subtitle: "Gym, wellness, and health expenses",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Health & Fitness" && !t.isTransfer),
  },
  shopping: {
    title: "Shopping",
    subtitle: "Retail and online purchases",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Shopping" && !t.isTransfer),
  },
  "auto-gas": {
    title: "Auto & Gas",
    subtitle: "Fuel and automotive expenses",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Auto & Gas" && !t.isTransfer),
  },
  insurance: {
    title: "Insurance",
    subtitle: "Insurance premiums",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Insurance" && !t.isTransfer),
  },
  health: {
    title: "Health",
    subtitle: "Medical and pharmacy",
    getTransactions: (all) =>
      all.filter((t) => t.category === "Health" && !t.isTransfer),
  },
};

interface PageProps {
  readonly params: Promise<{ category: string }>;
}

export default function TransactionCategoryPage({ params }: PageProps) {
  const { category } = use(params);
  const config = categoryMap[category];

  if (!config) {
    notFound();
  }

  const state = useTransactionStore();
  const accounts = useAccountStore((s) => s.accounts);
  const bizTxns = selectBusinessTransactions(state);
  const personalTxns = selectPersonalTransactions(state);
  const hysaIds = accounts
    .filter((a) => a.category === "hysa")
    .map((a) => a.id);

  const txns = config.getTransactions(
    state.transactions,
    bizTxns,
    personalTxns,
    { hysa: hysaIds }
  );
  const total = txns.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="flex flex-col pb-4 safe-top">
      <div className="h-[60px]" />

      <div className="flex flex-col gap-4 px-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary transition-colors hover:bg-bg-secondary-hover"
          >
            <ChevronLeft className="size-4 text-text-primary" />
          </Link>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold tracking-tight text-text-primary">
              {config.title}
            </h1>
            <p className="text-[10px] text-text-tertiary">{config.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-bg-secondary px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              Total
            </p>
            <p className="text-xl font-bold tracking-tighter text-text-primary">
              ${total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              Count
            </p>
            <p className="text-xl font-bold tracking-tighter text-text-primary">
              {txns.length}
            </p>
          </div>
        </div>

        <PaginatedCards transactions={txns} />
      </div>

      <div className="h-8 safe-bottom" />
    </div>
  );
}
