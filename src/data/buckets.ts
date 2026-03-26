// Sailor App — Buckets Data Model
// Buckets group transactions into Projects (track ROI), Sinking Funds (save toward goals), or Savings Goals.

import { transactions, type Transaction } from "./transactions";

export type BucketType = "project" | "sinking_fund" | "savings_goal";

export interface Bucket {
  readonly id: string;
  readonly name: string;
  readonly type: BucketType;
  readonly emoji: string;
  readonly target?: number;
  readonly current: number;
  readonly transactionIds: readonly string[];
  readonly createdAt: string;
  readonly description?: string;
  readonly isActive: boolean;
}

export interface BucketSummary {
  readonly totalProjects: number;
  readonly totalSinkingFunds: number;
  readonly totalSavingsGoals: number;
  readonly totalAllocated: number;
}

// ─── Sample Buckets ─────────────────────────────────────────

export const buckets: readonly Bucket[] = [
  // Projects — track spending & ROI
  {
    id: "bucket_001",
    name: "Website Redesign",
    type: "project",
    emoji: "🎨",
    current: 1_522.19,
    transactionIds: ["txn_004", "txn_009"],
    createdAt: "2026-01-15",
    description:
      "Full redesign including domain, Figma, and freelance designer costs.",
    isActive: true,
  },
  {
    id: "bucket_002",
    name: "Facebook Ads Campaign",
    type: "project",
    emoji: "📢",
    current: 847.32,
    transactionIds: ["txn_006"],
    createdAt: "2026-02-01",
    description: "February paid-acquisition sprint on Facebook and Instagram.",
    isActive: true,
  },

  // Sinking Funds — save toward predictable expenses
  {
    id: "bucket_003",
    name: "Q2 Taxes",
    type: "sinking_fund",
    emoji: "🏛️",
    target: 3_560,
    current: 4_300,
    transactionIds: [],
    createdAt: "2026-01-01",
    description: "Estimated quarterly tax payment due June 15.",
    isActive: true,
  },
  {
    id: "bucket_004",
    name: "Annual Software",
    type: "sinking_fund",
    emoji: "💻",
    target: 2_000,
    current: 137.43,
    transactionIds: ["txn_005", "txn_008"],
    createdAt: "2026-01-10",
    description:
      "Annual renewals for Notion, AWS, and other software subscriptions.",
    isActive: true,
  },

  // Savings Goals — long-term targets
  {
    id: "bucket_005",
    name: "Emergency Fund",
    type: "savings_goal",
    emoji: "🛟",
    target: 1_250,
    current: 875,
    transactionIds: [],
    createdAt: "2025-12-01",
    description: "3-month runway for personal expenses.",
    isActive: true,
  },
  {
    id: "bucket_006",
    name: "Equipment Upgrade",
    type: "savings_goal",
    emoji: "🖥️",
    target: 3_000,
    current: 200,
    transactionIds: [],
    createdAt: "2026-02-10",
    description: "New MacBook Pro and studio monitor.",
    isActive: true,
  },
];

// ─── Helper Functions ───────────────────────────────────────

export function getBucketsByType(type: BucketType): readonly Bucket[] {
  return buckets.filter((b) => b.type === type);
}

export function getBucketById(id: string): Bucket | undefined {
  return buckets.find((b) => b.id === id);
}

export function getBucketTransactions(
  bucket: Bucket
): readonly Transaction[] {
  return bucket.transactionIds
    .map((tid) => transactions.find((t) => t.id === tid))
    .filter((t): t is Transaction => t !== undefined);
}

export function getBucketSummary(): BucketSummary {
  const projects = getBucketsByType("project");
  const sinkingFunds = getBucketsByType("sinking_fund");
  const savingsGoals = getBucketsByType("savings_goal");

  const totalAllocated = buckets.reduce((sum, b) => sum + b.current, 0);

  return {
    totalProjects: projects.length,
    totalSinkingFunds: sinkingFunds.length,
    totalSavingsGoals: savingsGoals.length,
    totalAllocated,
  };
}

export function getBucketProgress(bucket: Bucket): number {
  if (!bucket.target || bucket.target === 0) return 0;
  return Math.round((bucket.current / bucket.target) * 100);
}

export function formatBucketType(type: BucketType): string {
  const labels: Record<BucketType, string> = {
    project: "Project",
    sinking_fund: "Sinking Fund",
    savings_goal: "Savings Goal",
  };
  return labels[type];
}
