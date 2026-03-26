import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  transactions as seedTransactions,
  type Transaction,
  type AccountType,
} from "@/data/transactions";
import { useAccountStore } from "./accounts";

// ─── Mutable Transaction type (same shape, but writable) ──────

type MutableTransaction = {
  -readonly [K in keyof Transaction]: Transaction[K];
};

// ─── State ────────────────────────────────────────────────────

interface TransactionState {
  readonly transactions: readonly MutableTransaction[];
  readonly notes: Record<string, string>;
}

interface TransactionActions {
  readonly setTransactions: (txns: readonly Transaction[]) => void;
  readonly updateTransaction: (
    id: string,
    updates: Partial<MutableTransaction>,
    notes?: string
  ) => void;
  readonly excludeFromCashFlow: (id: string) => void;
  readonly reviewTransaction: (
    id: string,
    bucket: string,
    roi?: number,
    roiType?: string,
    noRoiReason?: string
  ) => void;
  readonly unReviewTransaction: (id: string) => void;
  readonly moveToAccountType: (
    txnId: string,
    targetType: "business" | "personal"
  ) => void;
  readonly resetToDefaults: () => void;
}

// ─── Selectors (pure functions, call with store state) ────────

export function selectTransaction(
  state: TransactionState,
  id: string
): MutableTransaction | null {
  return state.transactions.find((t) => t.id === id) ?? null;
}

export function selectUnreviewed(
  state: TransactionState
): readonly MutableTransaction[] {
  return state.transactions.filter((t) => !t.reviewed && !t.isTransfer);
}

/**
 * Select unreviewed transactions by account type.
 * Pass accountIds explicitly to avoid cross-store getState().
 */
export function selectUnreviewedByType(
  state: TransactionState,
  type: AccountType,
  accountIds?: readonly string[]
): readonly MutableTransaction[] {
  const ids =
    accountIds ??
    useAccountStore
      .getState()
      .getAccountsByType(type)
      .map((a) => a.id);
  return state.transactions.filter(
    (t) => !t.reviewed && !t.isTransfer && ids.includes(t.accountId)
  );
}

export function selectByCategory(
  state: TransactionState,
  category: string
): readonly MutableTransaction[] {
  return state.transactions.filter(
    (t) => t.category === category && !t.isTransfer
  );
}

export function selectCashFlow(
  state: TransactionState
): readonly MutableTransaction[] {
  return state.transactions.filter((t) => t.amount < 0 && !t.isTransfer);
}

export function selectMerchantYearTotal(
  transactions: readonly MutableTransaction[],
  merchantName: string,
  year: number
): number {
  return transactions
    .filter(
      (t) =>
        t.merchantName === merchantName &&
        new Date(t.date).getFullYear() === year &&
        t.amount > 0 &&
        !t.isTransfer
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

export function selectBusinessTransactions(
  state: TransactionState,
  businessAccountIds?: readonly string[]
): readonly MutableTransaction[] {
  const bizIds =
    businessAccountIds ??
    useAccountStore
      .getState()
      .getAccountsByType("business")
      .map((a) => a.id);
  return state.transactions.filter(
    (t) => bizIds.includes(t.accountId) && !t.isTransfer
  );
}

export function selectPersonalTransactions(
  state: TransactionState,
  personalAccountIds?: readonly string[]
): readonly MutableTransaction[] {
  const personalIds =
    personalAccountIds ??
    useAccountStore
      .getState()
      .getAccountsByType("personal")
      .map((a) => a.id);
  return state.transactions.filter(
    (t) => personalIds.includes(t.accountId) && !t.isTransfer
  );
}

// ─── Store ────────────────────────────────────────────────────

export const useTransactionStore = create<TransactionState & TransactionActions>()(
  persist(
    (set) => ({
      transactions: seedTransactions.map((t) => ({ ...t })),
      notes: {},

      setTransactions: (txns) =>
        set({ transactions: txns.map((t) => ({ ...t })), notes: {} }),

      updateTransaction: (id, updates, notes) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
          notes:
            notes !== undefined
              ? { ...state.notes, [id]: notes }
              : state.notes,
        })),

      excludeFromCashFlow: (id) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, isTransfer: true } : t
          ),
        })),

      reviewTransaction: (id, bucket, roi, roiType, noRoiReason) =>
        set((state) => {
          const txn = state.transactions.find((t) => t.id === id);
          if (!txn) return state;

          const account = useAccountStore.getState().getAccountById(txn.accountId);
          const isBusiness = account?.type === "business";

          const updates: Partial<MutableTransaction> = {
            reviewed: true,
            reviewedAt: new Date().toISOString().split("T")[0],
          };

          if (isBusiness) {
            updates.businessBucket =
              bucket as MutableTransaction["businessBucket"];
            if (roi !== undefined) updates.roiRating = roi;
            if (roiType !== undefined)
              updates.roiType = roiType as MutableTransaction["roiType"];
            if (noRoiReason !== undefined)
              updates.noRoiReason = noRoiReason;
          } else {
            updates.personalBucket =
              bucket as MutableTransaction["personalBucket"];
          }

          return {
            ...state,
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          };
        }),

      unReviewTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  reviewed: false,
                  reviewedAt: undefined,
                  businessBucket: undefined,
                  personalBucket: undefined,
                  roiRating: undefined,
                  roiType: undefined,
                  noRoiReason: undefined,
                }
              : t
          ),
        })),

      moveToAccountType: (txnId, targetType) => {
        const accounts = useAccountStore.getState().accounts;
        const targetAccount = accounts.find((a) => a.type === targetType);
        if (!targetAccount) return;
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === txnId ? { ...t, accountId: targetAccount.id } : t
          ),
        }));
      },

      resetToDefaults: () =>
        set({
          transactions: seedTransactions.map((t) => ({ ...t })),
          notes: {},
        }),
    }),
    {
      name: "sailor-transactions",
    }
  )
);

// ─── Backward-compatible hooks ────────────────────────────────

type CompatAction =
  | {
      type: "UPDATE_TRANSACTION";
      id: string;
      updates: Partial<MutableTransaction>;
      notes?: string;
    }
  | { type: "EXCLUDE_FROM_CASHFLOW"; id: string }
  | {
      type: "REVIEW_TRANSACTION";
      id: string;
      bucket: string;
      roi?: number;
      roiType?: string;
      noRoiReason?: string;
    }
  | {
      type: "MOVE_TO_ACCOUNT_TYPE";
      id: string;
      targetType: "business" | "personal";
    }
  | { type: "UN_REVIEW_TRANSACTION"; id: string };

export function useTransactions(): TransactionState {
  const transactions = useTransactionStore((s) => s.transactions);
  const notes = useTransactionStore((s) => s.notes);
  return { transactions, notes };
}

export function useTransactionDispatch(): (action: CompatAction) => void {
  const store = useTransactionStore;
  return (action: CompatAction) => {
    switch (action.type) {
      case "UPDATE_TRANSACTION":
        store.getState().updateTransaction(action.id, action.updates, action.notes);
        break;
      case "EXCLUDE_FROM_CASHFLOW":
        store.getState().excludeFromCashFlow(action.id);
        break;
      case "REVIEW_TRANSACTION":
        store.getState().reviewTransaction(
          action.id,
          action.bucket,
          action.roi,
          action.roiType,
          action.noRoiReason
        );
        break;
      case "MOVE_TO_ACCOUNT_TYPE":
        store.getState().moveToAccountType(action.id, action.targetType);
        break;
      case "UN_REVIEW_TRANSACTION":
        store.getState().unReviewTransaction(action.id);
        break;
    }
  };
}
