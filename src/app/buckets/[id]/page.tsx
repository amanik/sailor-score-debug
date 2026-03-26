"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBucketStore, selectBucketById, selectBucketProgress } from "@/stores/buckets";
import { useTransactionStore } from "@/stores/transactions";
import { useAccountStore } from "@/stores/accounts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BucketProgress } from "@/components/buckets/BucketProgress";
import { Button } from "@/components/ui/button";
import { formatBucketType } from "@/data/buckets";
import type { BucketType } from "@/data/buckets";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Inline Edit Form ─────────────────────────────────────────

const BUCKET_TYPE_OPTIONS: readonly { value: BucketType; label: string }[] = [
  { value: "project", label: "Project" },
  { value: "sinking_fund", label: "Sinking Fund" },
  { value: "savings_goal", label: "Savings Goal" },
];

const EMOJI_OPTIONS = [
  "🎨", "📢", "🏛️", "💻", "🛟", "🖥️",
  "🚀", "📊", "🎯", "💡", "🔧", "📦",
  "🏠", "✈️", "🎓", "💰", "🛡️", "📱",
];

interface BucketDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

export default function BucketDetailPage({ params }: BucketDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const buckets = useBucketStore((s) => s.buckets);
  const bucket = selectBucketById({ buckets }, id);

  const allTransactions = useTransactionStore((s) => s.transactions);
  const accounts = useAccountStore((s) => s.accounts);

  const getAccount = (accountId: string) =>
    accounts.find((a) => a.id === accountId);

  const [editing, setEditing] = useState(false);
  const [linking, setLinking] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<BucketType>("project");
  const [editEmoji, setEditEmoji] = useState("🎯");
  const [editTarget, setEditTarget] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (!bucket) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 safe-top">
        <p className="text-sm text-text-tertiary">Bucket not found</p>
        <button
          onClick={() => router.push("/buckets")}
          className="text-sm font-semibold text-text-primary underline"
        >
          Back to Buckets
        </button>
      </div>
    );
  }

  const linkedTransactions = bucket.transactionIds
    .map((tid) => allTransactions.find((t) => t.id === tid))
    .filter(Boolean);

  const progress = selectBucketProgress(bucket);
  const hasTarget = bucket.target !== undefined && bucket.target > 0;

  // Unlinked transactions for the link dialog
  const unlinkedTransactions = allTransactions.filter(
    (t) =>
      !bucket.transactionIds.includes(t.id) &&
      !t.isTransfer &&
      (searchQuery === "" ||
        t.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.rawDescription.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Paginate linked: show max 10
  const displayedTransactions = linkedTransactions.slice(0, 10);
  const hasMore = linkedTransactions.length > 10;

  function startEdit() {
    setEditName(bucket!.name);
    setEditType(bucket!.type);
    setEditEmoji(bucket!.emoji);
    setEditTarget(bucket!.target?.toString() ?? "");
    setEditDescription(bucket!.description ?? "");
    setEditing(true);
  }

  function saveEdit() {
    useBucketStore.getState().updateBucket(id, {
      name: editName.trim(),
      type: editType,
      emoji: editEmoji,
      target: editTarget ? Number(editTarget) : undefined,
      description: editDescription.trim() || undefined,
    });
    setEditing(false);
  }

  function handleArchive() {
    useBucketStore.getState().archiveBucket(id);
    router.push("/buckets");
  }

  function handleDelete() {
    useBucketStore.getState().deleteBucket(id);
    router.push("/buckets");
  }

  function handleLink(transactionId: string) {
    useBucketStore.getState().linkTransaction(id, transactionId);
  }

  function handleUnlink(transactionId: string) {
    useBucketStore.getState().unlinkTransaction(id, transactionId);
  }

  // ─── Edit Mode ────────────────────────────────────────────────

  if (editing) {
    return (
      <div className="flex flex-col pb-4 safe-top">
        <div className="h-[60px]" />
        <div className="flex flex-col gap-5 px-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              &larr; Cancel
            </button>
            <h1 className="text-lg font-medium">Edit Bucket</h1>
            <div className="w-12" />
          </div>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-10 rounded-lg border border-border-secondary bg-bg-secondary px-3 text-sm text-text-primary outline-none focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Type
              </span>
              <div className="flex flex-col gap-1.5">
                {BUCKET_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditType(opt.value)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
                      editType === opt.value
                        ? "border-border-brand bg-bg-brand-secondary text-text-primary"
                        : "border-border-secondary text-text-secondary hover:bg-bg-secondary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Emoji
              </span>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEditEmoji(e)}
                    className={`flex size-10 items-center justify-center rounded-lg text-lg transition-colors ${
                      editEmoji === e
                        ? "bg-bg-brand-secondary ring-2 ring-border-brand"
                        : "bg-bg-secondary hover:bg-bg-secondary-hover"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Target */}
            {editType !== "project" && (
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Target Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-tertiary">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border-secondary bg-bg-secondary pl-7 pr-3 text-sm tabular-nums text-text-primary outline-none focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Description
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="resize-none rounded-lg border border-border-secondary bg-bg-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
              />
            </div>
          </div>

          <button
            onClick={saveEdit}
            disabled={!editName.trim()}
            className="w-full rounded-xl bg-text-primary px-4 py-3 text-[13px] font-semibold text-bg-primary transition-all hover:opacity-90 disabled:opacity-40"
          >
            Save Changes
          </button>
        </div>
        <div className="h-8 safe-bottom" />
      </div>
    );
  }

  // ─── Link Transactions Mode ───────────────────────────────────

  if (linking) {
    return (
      <div className="flex flex-col pb-4 safe-top">
        <div className="h-[60px]" />
        <div className="flex flex-col gap-4 px-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setLinking(false); setSearchQuery(""); }}
              className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              &larr; Done
            </button>
            <h1 className="text-lg font-medium">Link Transactions</h1>
            <div className="w-12" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by merchant or description..."
            className="h-10 rounded-lg border border-border-secondary bg-bg-secondary px-3 text-sm text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
          />

          <p className="text-xs text-text-tertiary">
            {unlinkedTransactions.length} transactions available
          </p>

          <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
            {unlinkedTransactions.slice(0, 50).map((txn) => {
              const account = getAccount(txn.accountId);
              return (
                <button
                  key={txn.id}
                  onClick={() => handleLink(txn.id)}
                  className="flex items-center justify-between rounded-lg border border-border-secondary bg-bg-primary px-3 py-2.5 text-left transition-colors hover:bg-bg-secondary"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0">
                      {txn.merchantLogo}
                    </span>
                    <div className="flex flex-col gap-0 min-w-0">
                      <span className="text-sm font-medium truncate text-text-primary">
                        {txn.merchantName}
                      </span>
                      <span className="text-[10px] text-text-tertiary">
                        {formatDate(txn.date)}
                        {account && ` · ${account.name}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-medium tabular-nums text-text-primary">
                      {formatCurrency(txn.amount)}
                    </span>
                    <span className="text-utility-green-600 text-xs">+ Link</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="h-8 safe-bottom" />
      </div>
    );
  }

  // ─── Default Detail View ──────────────────────────────────────

  return (
    <div className="flex flex-col pb-4 safe-top">
      {/* Status bar spacer */}
      <div className="h-[60px]" />

      <div className="flex flex-col gap-5 px-2">
        {/* Back link */}
        <Link
          href="/"
          className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
        >
          &larr; Dashboard
        </Link>

        {/* Bucket header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl leading-none">{bucket.emoji}</span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h1 className="text-lg font-medium truncate">{bucket.name}</h1>
                <Badge variant="secondary" className="w-fit">
                  {formatBucketType(bucket.type)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Button variant="outline" size="xs" onClick={startEdit}>
                Edit
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setConfirmArchive(true)}
              >
                ...
              </Button>
            </div>
          </div>

          {bucket.description && (
            <p className="text-sm text-text-tertiary">{bucket.description}</p>
          )}
        </div>

        {/* Archive confirmation */}
        {confirmArchive && (
          <div className="flex flex-col gap-2 rounded-xl border border-border-error bg-bg-error-secondary p-3">
            <p className="text-sm font-semibold text-text-error-primary">
              What do you want to do?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleArchive}
                className="flex-1 rounded-lg bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-bg-secondary-hover"
              >
                Archive
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-text-error-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmArchive(false)}
                className="flex-1 rounded-lg border border-border-secondary px-3 py-2 text-xs font-semibold text-text-tertiary transition-colors hover:bg-bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Progress section */}
        <section className="flex flex-col gap-1.5">
          <p className="section-label">Progress</p>
          <Card size="sm">
            <CardContent>
              {hasTarget ? (
                <div className="flex flex-col gap-3">
                  <BucketProgress
                    current={bucket.current}
                    target={bucket.target}
                  />
                  {progress > 100 && (
                    <p className="text-xs text-emerald-600">
                      Overfunded by{" "}
                      {formatCurrency(bucket.current - (bucket.target ?? 0))}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-medium tabular-nums">
                    {formatCurrency(bucket.current)}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Total spent &middot; No target set
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Linked Transactions */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <p className="section-label">
              Transactions{" "}
              <span className="text-text-tertiary font-normal">
                ({linkedTransactions.length})
              </span>
            </p>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setLinking(true)}
            >
              + Add
            </Button>
          </div>

          {displayedTransactions.length > 0 ? (
            <div className="flex flex-col gap-1">
              {displayedTransactions.map((txn) => {
                if (!txn) return null;
                const account = getAccount(txn.accountId);
                return (
                  <Card key={txn.id} size="sm">
                    <CardContent>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base leading-none shrink-0">
                            {txn.merchantLogo}
                          </span>
                          <div className="flex flex-col gap-0 min-w-0">
                            <span className="text-sm font-medium truncate">
                              {txn.merchantName}
                            </span>
                            <span className="text-[11px] text-text-tertiary">
                              {formatDate(txn.date)}
                              {account && ` · ${account.name}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-medium tabular-nums">
                            {formatCurrency(txn.amount)}
                          </span>
                          <button
                            onClick={() => handleUnlink(txn.id)}
                            className="size-6 flex items-center justify-center rounded text-[10px] text-text-error-primary hover:bg-bg-secondary transition-colors"
                            title="Unlink transaction"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {hasMore && (
                <p className="text-center text-xs text-text-tertiary py-2">
                  Showing 10 of {linkedTransactions.length} transactions
                </p>
              )}
            </div>
          ) : (
            <Card size="sm">
              <CardContent>
                <p className="text-center text-sm text-text-tertiary py-4">
                  No transactions linked yet.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Metadata */}
        <section className="flex flex-col gap-1.5">
          <p className="section-label">Details</p>
          <div className="flex flex-col gap-2 text-xs text-text-tertiary">
            <div className="flex justify-between">
              <span>Created</span>
              <span className="tabular-nums">
                {new Date(bucket.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span>{bucket.isActive ? "Active" : "Archived"}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom safe area */}
      <div className="h-8 safe-bottom" />
    </div>
  );
}
