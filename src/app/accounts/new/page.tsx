"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAccountStore } from "@/stores/accounts";
import type { AccountType, AccountCategory } from "@/data/transactions";

const CATEGORY_OPTIONS: readonly {
  readonly value: AccountCategory;
  readonly label: string;
}[] = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "credit_card", label: "Credit Card" },
  { value: "hysa", label: "HYSA" },
  { value: "investment", label: "Investment" },
  { value: "loan", label: "Loan" },
  { value: "line_of_credit", label: "Line of Credit" },
];

export default function NewAccountPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [category, setCategory] = useState<AccountCategory>("checking");
  const [lastFour, setLastFour] = useState("");
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(false);

  const isValid = name.trim().length > 0;

  function handleCreate() {
    if (!isValid || saving) return;
    setSaving(true);

    const newAccount = {
      id: `acc_manual_${crypto.randomUUID()}`,
      name: name.trim(),
      institution: institution.trim() || "Manual",
      type: accountType,
      category,
      lastFour: lastFour.padStart(4, "0").slice(-4),
      balance: balance ? Number(balance) : 0,
    };

    setTimeout(() => {
      useAccountStore.getState().addAccount(newAccount);
      setSaving(false);
      setCreated(true);
      setTimeout(() => router.push("/accounts"), 600);
    }, 300);
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary safe-top">
      {/* Header */}
      <div className="h-[60px]" />
      <div className="flex items-center gap-3 px-4 pb-4">
        <button
          onClick={() => router.back()}
          className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary transition-colors hover:bg-bg-secondary-hover"
        >
          <ChevronLeft className="size-4 text-text-primary" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Add Account</h1>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <p className="mb-6 text-sm text-text-tertiary">
          Manually add a bank account, credit card, or other financial account.
        </p>

        <div className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="account-name"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
            >
              Name *
            </label>
            <input
              id="account-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chase Checking"
              className="h-10 rounded-lg border border-border-secondary bg-bg-secondary px-3 text-sm text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
            />
          </div>

          {/* Institution */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="account-institution"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
            >
              Institution
            </label>
            <input
              id="account-institution"
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Chase, Ally, Mercury"
              className="h-10 rounded-lg border border-border-secondary bg-bg-secondary px-3 text-sm text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
            />
          </div>

          {/* Type: Business / Personal */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              Type
            </span>
            <div className="flex gap-2">
              {(
                [
                  { value: "personal", label: "Personal" },
                  { value: "business", label: "Business" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAccountType(opt.value)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    accountType === opt.value
                      ? "border-border-brand bg-bg-brand-secondary text-text-primary"
                      : "border-border-secondary text-text-secondary hover:bg-bg-secondary"
                  }`}
                >
                  <span
                    className={`size-3.5 rounded-full border-2 ${
                      accountType === opt.value
                        ? "border-text-primary bg-text-primary"
                        : "border-border-secondary"
                    }`}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCategory(opt.value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    category === opt.value
                      ? "border-border-brand bg-bg-brand-secondary text-text-primary"
                      : "border-border-secondary text-text-secondary hover:bg-bg-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Last Four Digits */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="account-last-four"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
            >
              Last Four Digits
            </label>
            <input
              id="account-last-four"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={lastFour}
              onChange={(e) =>
                setLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="0000"
              className="h-10 w-24 rounded-lg border border-border-secondary bg-bg-secondary px-3 text-sm tabular-nums text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
            />
          </div>

          {/* Balance */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="account-balance"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
            >
              Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-tertiary">
                $
              </span>
              <input
                id="account-balance"
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                className="h-10 w-full rounded-lg border border-border-secondary bg-bg-secondary pl-7 pr-3 text-sm tabular-nums text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
              />
            </div>
            <p className="text-[10px] text-text-quaternary">
              Use a negative number for credit card balances owed.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="mx-auto flex w-full max-w-[390px] gap-3 border-t border-border-secondary bg-bg-primary px-4 pb-8 pt-3 safe-bottom">
          <button
            onClick={() => router.back()}
            className="flex-1 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!isValid || saving || created}
            className={`flex-1 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all disabled:opacity-40 ${
              created
                ? "bg-utility-green-600 text-white"
                : "bg-text-primary text-bg-primary hover:opacity-90"
            }`}
          >
            {created
              ? "Created!"
              : saving
                ? "Creating..."
                : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
