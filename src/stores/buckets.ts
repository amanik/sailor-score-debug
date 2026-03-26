import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  buckets as seedBuckets,
  type Bucket,
  type BucketType,
  type BucketSummary,
} from "@/data/buckets";

interface BucketState {
  readonly buckets: readonly Bucket[];
}

interface BucketActions {
  readonly setBuckets: (buckets: readonly Bucket[]) => void;
  readonly addBucket: (bucket: Bucket) => void;
  readonly updateBucket: (
    id: string,
    updates: Partial<Omit<Bucket, "id">>
  ) => void;
  readonly archiveBucket: (id: string) => void;
  readonly deleteBucket: (id: string) => void;
  readonly linkTransaction: (bucketId: string, transactionId: string) => void;
  readonly unlinkTransaction: (
    bucketId: string,
    transactionId: string
  ) => void;
  readonly resetToDefaults: () => void;
}

// ─── Selectors (pure functions, call with store state) ────────

export function selectBucketsByType(
  state: BucketState,
  type: BucketType
): readonly Bucket[] {
  return state.buckets.filter((b) => b.type === type);
}

export function selectBucketById(
  state: BucketState,
  id: string
): Bucket | undefined {
  return state.buckets.find((b) => b.id === id);
}

export function selectActiveBuckets(state: BucketState): readonly Bucket[] {
  return state.buckets.filter((b) => b.isActive);
}

export function selectBucketSummary(state: BucketState): BucketSummary {
  const active = state.buckets.filter((b) => b.isActive);
  return {
    totalProjects: active.filter((b) => b.type === "project").length,
    totalSinkingFunds: active.filter((b) => b.type === "sinking_fund").length,
    totalSavingsGoals: active.filter((b) => b.type === "savings_goal").length,
    totalAllocated: active.reduce((sum, b) => sum + b.current, 0),
  };
}

export function selectBucketProgress(bucket: Bucket): number {
  if (!bucket.target || bucket.target === 0) return 0;
  return Math.round((bucket.current / bucket.target) * 100);
}

// ─── Store ────────────────────────────────────────────────────

export const useBucketStore = create<BucketState & BucketActions>()(
  persist(
    (set) => ({
      buckets: [...seedBuckets],

      setBuckets: (buckets) => set({ buckets }),

      addBucket: (bucket) =>
        set((state) => ({ buckets: [...state.buckets, bucket] })),

      updateBucket: (id, updates) =>
        set((state) => ({
          buckets: state.buckets.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      archiveBucket: (id) =>
        set((state) => ({
          buckets: state.buckets.map((b) =>
            b.id === id ? { ...b, isActive: false } : b
          ),
        })),

      deleteBucket: (id) =>
        set((state) => ({
          buckets: state.buckets.filter((b) => b.id !== id),
        })),

      linkTransaction: (bucketId, transactionId) =>
        set((state) => ({
          buckets: state.buckets.map((b) =>
            b.id === bucketId && !b.transactionIds.includes(transactionId)
              ? { ...b, transactionIds: [...b.transactionIds, transactionId] }
              : b
          ),
        })),

      unlinkTransaction: (bucketId, transactionId) =>
        set((state) => ({
          buckets: state.buckets.map((b) =>
            b.id === bucketId
              ? {
                  ...b,
                  transactionIds: b.transactionIds.filter(
                    (tid) => tid !== transactionId
                  ),
                }
              : b
          ),
        })),

      resetToDefaults: () => set({ buckets: [...seedBuckets] }),
    }),
    {
      name: "sailor-buckets",
    }
  )
);
