"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { useAccountStore } from "@/stores/accounts";
import type { Account, AccountCategory } from "@/data/transactions";

const INSTITUTION_COLORS: Record<string, string> = {
  Chase: "bg-blue-600",
  "Bank of America": "bg-red-600",
  "Wells Fargo": "bg-yellow-600",
  "Capital One": "bg-red-500",
  Ally: "bg-violet-600",
  USAA: "bg-blue-800",
  Mercury: "bg-slate-800",
  "American Express": "bg-blue-500",
  Stripe: "bg-indigo-600",
};

function getInstitutionColor(institution: string): string {
  return INSTITUTION_COLORS[institution] ?? "bg-gray-500";
}

const CATEGORY_LABELS: Record<AccountCategory, string> = {
  checking: "Checking",
  savings: "Savings",
  credit_card: "Credit Card",
  investment: "Investment",
  hysa: "HYSA",
  loan: "Loan",
  line_of_credit: "Line of Credit",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function AccountCard({
  account,
  onClick,
}: {
  readonly account: Account;
  readonly onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-bg-secondary"
    >
      {/* Institution logo circle */}
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${getInstitutionColor(account.institution)}`}
      >
        {account.institution.charAt(0).toUpperCase()}
      </div>

      {/* Account details */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-text-primary">
            {account.name}
          </span>
          <span className="shrink-0 rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-text-tertiary">
            {CATEGORY_LABELS[account.category]}
          </span>
        </div>
        <span className="text-xs text-text-tertiary">
          {account.institution} &middot; ••••{account.lastFour}
        </span>
      </div>

      {/* Balance */}
      <span
        className={`shrink-0 text-sm font-semibold tabular-nums ${
          account.balance < 0 ? "text-text-error-primary" : "text-text-primary"
        }`}
      >
        {formatCurrency(account.balance)}
      </span>
    </button>
  );
}

export default function AccountsPage() {
  const router = useRouter();
  const accounts = useAccountStore((s) => s.accounts);

  const businessAccounts = accounts.filter((a) => a.type === "business");
  const personalAccounts = accounts.filter((a) => a.type === "personal");
  const hasAccounts = accounts.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary safe-top">
      {/* Status bar spacer */}
      <div className="h-[60px]" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary transition-colors hover:bg-bg-secondary-hover"
          >
            <ChevronLeft className="size-4 text-text-primary" />
          </button>
          <h1 className="text-lg font-bold text-text-primary">Accounts</h1>
        </div>
        <button
          onClick={() => router.push("/accounts/link")}
          className="flex items-center gap-1.5 rounded-lg bg-text-primary px-3 py-2 text-xs font-semibold text-bg-primary transition-opacity hover:opacity-90"
        >
          <Plus className="size-3.5" />
          Link Account
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {hasAccounts ? (
          <div className="flex flex-col gap-6">
            {/* Business Accounts */}
            {businessAccounts.length > 0 && (
              <section className="flex flex-col gap-1.5">
                <p className="section-label">Business Accounts</p>
                <div className="flex flex-col gap-1">
                  {businessAccounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      onClick={() => router.push(`/accounts/link`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Personal Accounts */}
            {personalAccounts.length > 0 && (
              <section className="flex flex-col gap-1.5">
                <p className="section-label">Personal Accounts</p>
                <div className="flex flex-col gap-1">
                  {personalAccounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      onClick={() => router.push(`/accounts/link`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Add Manually link */}
            <div className="text-center">
              <button
                onClick={() => router.push("/accounts/new")}
                className="text-xs font-medium text-text-tertiary underline transition-colors hover:text-text-primary"
              >
                Add account manually
              </button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="flex size-16 items-center justify-center rounded-full bg-bg-secondary text-2xl">
              🏦
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-semibold text-text-primary">
                No accounts yet
              </p>
              <p className="text-xs text-text-tertiary">
                Link a bank or add an account manually to get started.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => router.push("/accounts/link")}
                className="rounded-lg bg-text-primary px-4 py-2.5 text-xs font-semibold text-bg-primary transition-opacity hover:opacity-90"
              >
                Link Account
              </button>
              <button
                onClick={() => router.push("/accounts/new")}
                className="text-xs font-medium text-text-tertiary underline transition-colors hover:text-text-primary"
              >
                Add manually
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
