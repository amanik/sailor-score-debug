"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, Loader2, Search } from "lucide-react";
import { useAccountStore } from "@/stores/accounts";
import type { AccountType, AccountCategory } from "@/data/transactions";

type FlowStep = "bank" | "auth" | "select" | "success";

interface BankOption {
  readonly name: string;
  readonly letter: string;
  readonly color: string;
}

const BANKS: readonly BankOption[] = [
  { name: "Chase", letter: "C", color: "bg-blue-600" },
  { name: "Bank of America", letter: "B", color: "bg-red-600" },
  { name: "Wells Fargo", letter: "W", color: "bg-yellow-600" },
  { name: "Capital One", letter: "C", color: "bg-red-500" },
  { name: "Ally", letter: "A", color: "bg-violet-600" },
  { name: "USAA", letter: "U", color: "bg-blue-800" },
  { name: "Mercury", letter: "M", color: "bg-slate-800" },
  { name: "American Express", letter: "A", color: "bg-blue-500" },
];

interface MockAccount {
  readonly name: string;
  readonly category: AccountCategory;
  readonly lastFour: string;
  readonly balance: number;
  readonly selected: boolean;
  readonly accountType: AccountType;
}

function createMockAccounts(): readonly MockAccount[] {
  return [
    {
      name: "Checking",
      category: "checking",
      lastFour: "4521",
      balance: 3245.67,
      selected: true,
      accountType: "personal",
    },
    {
      name: "Savings",
      category: "savings",
      lastFour: "8903",
      balance: 12500.0,
      selected: true,
      accountType: "personal",
    },
    {
      name: "Credit Card",
      category: "credit_card",
      lastFour: "1234",
      balance: -2341.89,
      selected: false,
      accountType: "personal",
    },
  ];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function LinkAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("bank");
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [mockAccounts, setMockAccounts] = useState<readonly MockAccount[]>(
    createMockAccounts
  );
  const [linkedCount, setLinkedCount] = useState(0);

  const filteredBanks =
    searchQuery.trim() === ""
      ? BANKS
      : BANKS.filter((b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleBankSelect = useCallback((bank: BankOption) => {
    setSelectedBank(bank);
    setStep("auth");
  }, []);

  const handleConnect = useCallback(() => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setStep("select");
    }, 1500);
  }, []);

  const toggleAccountSelection = useCallback((index: number) => {
    setMockAccounts((prev) =>
      prev.map((acc, i) =>
        i === index ? { ...acc, selected: !acc.selected } : acc
      )
    );
  }, []);

  const toggleAccountType = useCallback((index: number) => {
    setMockAccounts((prev) =>
      prev.map((acc, i) =>
        i === index
          ? {
              ...acc,
              accountType:
                acc.accountType === "personal" ? "business" : "personal",
            }
          : acc
      )
    );
  }, []);

  const handleLinkSelected = useCallback(() => {
    const selected = mockAccounts.filter((a) => a.selected);
    const addAccount = useAccountStore.getState().addAccount;

    for (const acc of selected) {
      addAccount({
        id: `acc_linked_${crypto.randomUUID()}`,
        name: `${selectedBank?.name ?? "Bank"} ${acc.name}`,
        institution: selectedBank?.name ?? "Bank",
        type: acc.accountType,
        category: acc.category,
        lastFour: acc.lastFour,
        balance: acc.balance,
      });
    }

    setLinkedCount(selected.length);
    setStep("success");
  }, [mockAccounts, selectedBank]);

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary safe-top">
      {/* Status bar spacer */}
      <div className="h-[60px]" />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-4">
        <button
          onClick={() => {
            if (step === "bank") {
              router.back();
            } else if (step === "auth") {
              setStep("bank");
            } else if (step === "select") {
              setStep("auth");
            } else {
              router.push("/accounts");
            }
          }}
          className="flex size-8 items-center justify-center rounded-lg bg-bg-secondary transition-colors hover:bg-bg-secondary-hover"
        >
          <ChevronLeft className="size-4 text-text-primary" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Link Account</h1>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1 px-4 pb-4">
        {(["bank", "auth", "select", "success"] as const).map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <=
              ["bank", "auth", "select", "success"].indexOf(step)
                ? "bg-text-primary"
                : "bg-bg-secondary"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {/* ── Step 1: Bank Selection ── */}
        {step === "bank" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-tertiary">
              Choose your bank to connect securely.
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-quaternary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search banks..."
                className="h-10 w-full rounded-lg border border-border-secondary bg-bg-secondary pl-9 pr-3 text-sm text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
              />
            </div>

            {/* Bank grid */}
            <div className="grid grid-cols-2 gap-2">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.name}
                  onClick={() => handleBankSelect(bank)}
                  className="card flex items-center gap-3 p-3 transition-colors hover:bg-bg-secondary"
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${bank.color}`}
                  >
                    {bank.letter}
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {bank.name}
                  </span>
                </button>
              ))}
            </div>

            {filteredBanks.length === 0 && (
              <p className="py-8 text-center text-sm text-text-tertiary">
                No banks found matching &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        )}

        {/* ── Step 2: Simulated Auth ── */}
        {step === "auth" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 py-4">
              <div
                className={`flex size-14 items-center justify-center rounded-full text-lg font-bold text-white ${selectedBank?.color ?? "bg-gray-500"}`}
              >
                {selectedBank?.letter}
              </div>
              <p className="text-sm font-semibold text-text-primary">
                Connect to {selectedBank?.name}
              </p>
              <p className="text-xs text-text-tertiary">
                Enter your credentials to securely link your account.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="plaid-username"
                  className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
                >
                  Username
                </label>
                <input
                  id="plaid-username"
                  type="text"
                  defaultValue="user_demo"
                  className="h-10 rounded-lg border border-border-secondary bg-bg-secondary px-3 text-sm text-text-primary outline-none focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="plaid-password"
                  className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
                >
                  Password
                </label>
                <input
                  id="plaid-password"
                  type="password"
                  defaultValue="pass_demo"
                  className="h-10 rounded-lg border border-border-secondary bg-bg-secondary px-3 text-sm text-text-primary outline-none focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Account Selection ── */}
        {step === "select" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-tertiary">
              We found {mockAccounts.length} accounts at {selectedBank?.name}.
              Select which to link.
            </p>

            <div className="flex flex-col gap-2">
              {mockAccounts.map((acc, index) => (
                <div
                  key={acc.lastFour}
                  className="card flex flex-col gap-2 p-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleAccountSelection(index)}
                      className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
                        acc.selected
                          ? "border-text-primary bg-text-primary"
                          : "border-border-secondary bg-bg-secondary"
                      }`}
                    >
                      {acc.selected && (
                        <Check className="size-3 text-bg-primary" />
                      )}
                    </button>

                    {/* Account info */}
                    <div className="flex min-w-0 flex-1 items-center justify-between">
                      <div className="flex flex-col gap-0">
                        <span className="text-sm font-medium text-text-primary">
                          {acc.name}
                        </span>
                        <span className="text-xs text-text-tertiary">
                          ••••{acc.lastFour}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          acc.balance < 0
                            ? "text-text-error-primary"
                            : "text-text-primary"
                        }`}
                      >
                        {formatCurrency(acc.balance)}
                      </span>
                    </div>
                  </div>

                  {/* Type toggle */}
                  {acc.selected && (
                    <div className="ml-8 flex gap-1.5">
                      <button
                        onClick={() =>
                          acc.accountType !== "personal" &&
                          toggleAccountType(index)
                        }
                        className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                          acc.accountType === "personal"
                            ? "bg-text-primary text-bg-primary"
                            : "bg-bg-secondary text-text-tertiary hover:bg-bg-secondary-hover"
                        }`}
                      >
                        Personal
                      </button>
                      <button
                        onClick={() =>
                          acc.accountType !== "business" &&
                          toggleAccountType(index)
                        }
                        className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                          acc.accountType === "business"
                            ? "bg-text-primary text-bg-primary"
                            : "bg-bg-secondary text-text-tertiary hover:bg-bg-secondary-hover"
                        }`}
                      >
                        Business
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="flex size-16 items-center justify-center rounded-full bg-utility-green-100 text-utility-green-600">
              <Check className="size-8" />
            </div>
            <p className="text-lg font-semibold text-text-primary">
              {linkedCount} account{linkedCount !== 1 ? "s" : ""} linked
              successfully
            </p>
            <p className="text-sm text-text-tertiary">
              Your {selectedBank?.name} accounts are now connected.
            </p>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      {step !== "bank" && (
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="mx-auto flex w-full max-w-[390px] gap-3 border-t border-border-secondary bg-bg-primary px-4 pb-8 pt-3 safe-bottom">
            {step === "auth" && (
              <>
                <button
                  onClick={() => setStep("bank")}
                  className="flex-1 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-text-primary px-4 py-3 text-[13px] font-semibold text-bg-primary transition-all hover:opacity-90 disabled:opacity-60"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </>
            )}

            {step === "select" && (
              <>
                <button
                  onClick={() => setStep("auth")}
                  className="flex-1 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-bg-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleLinkSelected}
                  disabled={!mockAccounts.some((a) => a.selected)}
                  className="flex-1 rounded-xl bg-text-primary px-4 py-3 text-[13px] font-semibold text-bg-primary transition-all hover:opacity-90 disabled:opacity-40"
                >
                  Link Selected
                </button>
              </>
            )}

            {step === "success" && (
              <button
                onClick={() => router.push("/accounts")}
                className="flex-1 rounded-xl bg-text-primary px-4 py-3 text-[13px] font-semibold text-bg-primary transition-all hover:opacity-90"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
