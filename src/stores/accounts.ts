import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  accounts as seedAccounts,
  type Account,
  type AccountType,
} from "@/data/transactions";

interface AccountState {
  readonly accounts: readonly Account[];
}

interface AccountActions {
  readonly setAccounts: (accounts: readonly Account[]) => void;
  readonly addAccount: (account: Account) => void;
  readonly updateAccount: (id: string, updates: Partial<Account>) => void;
  readonly deleteAccount: (id: string) => void;
  readonly resetToDefaults: () => void;
  readonly getAccountById: (id: string) => Account | undefined;
  readonly getAccountsByType: (type: AccountType) => readonly Account[];
}

export const useAccountStore = create<AccountState & AccountActions>()(
  persist(
    (set, get) => ({
      accounts: [...seedAccounts],

      setAccounts: (accounts) => set({ accounts }),

      addAccount: (account) =>
        set((state) => ({ accounts: [...state.accounts, account] })),

      updateAccount: (id, updates) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),

      resetToDefaults: () => set({ accounts: [...seedAccounts] }),

      getAccountById: (id) => get().accounts.find((a) => a.id === id),

      getAccountsByType: (type) =>
        get().accounts.filter((a) => a.type === type),
    }),
    {
      name: "sailor-accounts",
    }
  )
);
