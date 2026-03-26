"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { BucketType } from "@/data/buckets";
import { useBucketStore } from "@/stores/buckets";

const BUCKET_TYPE_OPTIONS: readonly {
  readonly value: BucketType;
  readonly label: string;
  readonly description: string;
}[] = [
  {
    value: "project",
    label: "Project",
    description: "Track spending and ROI for a specific initiative.",
  },
  {
    value: "sinking_fund",
    label: "Sinking Fund",
    description: "Save toward a predictable upcoming expense.",
  },
  {
    value: "savings_goal",
    label: "Savings Goal",
    description: "Build toward a long-term financial target.",
  },
];

const EMOJI_OPTIONS = [
  "🎨", "📢", "🏛️", "💻", "🛟", "🖥️",
  "🚀", "📊", "🎯", "💡", "🔧", "📦",
  "🏠", "✈️", "🎓", "💰", "🛡️", "📱",
];

export default function NewBucketPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<BucketType>("project");
  const [emoji, setEmoji] = useState("🎯");
  const [target, setTarget] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(false);

  const isValid = name.trim().length > 0;

  function handleCreate() {
    if (!isValid || saving) return;
    setSaving(true);
    const newBucket = {
      id: `bucket_${crypto.randomUUID()}`,
      name: name.trim(),
      type,
      emoji,
      target: target ? Number(target) : undefined,
      current: 0,
      transactionIds: [] as string[],
      createdAt: new Date().toISOString().split("T")[0],
      description: description.trim() || undefined,
      isActive: true,
    };
    setTimeout(() => {
      useBucketStore.getState().addBucket(newBucket);
      setSaving(false);
      setCreated(true);
      setTimeout(() => router.push(`/buckets/${newBucket.id}`), 600);
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
        <h1 className="text-lg font-bold text-text-primary">Create Bucket</h1>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <p className="mb-6 text-sm text-text-tertiary">
          Group transactions into a project, sinking fund, or savings goal.
        </p>

        <div className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="bucket-name"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
            >
              Name
            </label>
            <input
              id="bucket-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="h-10 rounded-lg border border-border-secondary bg-bg-secondary px-3 text-sm text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
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
                  onClick={() => setType(opt.value)}
                  className={`flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    type === opt.value
                      ? "border-border-brand bg-bg-brand-secondary"
                      : "border-border-secondary hover:bg-bg-secondary"
                  }`}
                >
                  <span className="text-sm font-medium text-text-primary">
                    {opt.label}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {opt.description}
                  </span>
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
                  onClick={() => setEmoji(e)}
                  className={`flex size-10 items-center justify-center rounded-lg text-lg transition-colors ${
                    emoji === e
                      ? "bg-bg-brand-secondary ring-2 ring-border-brand"
                      : "bg-bg-secondary hover:bg-bg-secondary-hover"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Target Amount */}
          {type !== "project" && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="bucket-target"
                className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
              >
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-tertiary">
                  $
                </span>
                <input
                  id="bucket-target"
                  type="number"
                  min="0"
                  step="1"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="0"
                  className="h-10 w-full rounded-lg border border-border-secondary bg-bg-secondary pl-7 pr-3 text-sm tabular-nums text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="bucket-desc"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
            >
              Description
            </label>
            <textarea
              id="bucket-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this bucket..."
              rows={3}
              className="resize-none rounded-lg border border-border-secondary bg-bg-secondary px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-quaternary focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
            />
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
            Ignore
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
            {created ? "Created!" : saving ? "Creating..." : "Create Bucket"}
          </button>
        </div>
      </div>
    </div>
  );
}
