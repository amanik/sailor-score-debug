"use client";

import { useRef, useEffect } from "react";
import type { Transaction } from "@/data/transactions";

export interface MonthOption {
  readonly key: string;
  readonly label: string;
  readonly shortLabel: string;
}

export function getAvailableMonths(
  transactions: readonly Transaction[]
): readonly MonthOption[] {
  const monthSet = new Set<string>();
  for (const t of transactions) {
    const key = t.date.slice(0, 7); // "2026-02"
    monthSet.add(key);
  }
  return [...monthSet]
    .sort()
    .map((key) => {
      const d = new Date(key + "-15T12:00:00");
      return {
        key,
        label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        shortLabel: d.toLocaleDateString("en-US", { month: "short" }),
      };
    });
}

export function filterByMonth(
  transactions: readonly Transaction[],
  monthKey: string
): readonly Transaction[] {
  return transactions.filter((t) => t.date.startsWith(monthKey));
}

export function MonthPicker({
  months,
  selected,
  onSelect,
}: {
  readonly months: readonly MonthOption[];
  readonly selected: string;
  readonly onSelect: (key: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector("[data-active=true]");
    if (activeEl) {
      activeEl.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, [selected]);

  if (months.length <= 1) return null;

  return (
    <div
      ref={scrollRef}
      className="flex gap-1.5 overflow-x-auto px-1"
      style={{ scrollbarWidth: "none" }}
    >
      {months.map((m) => {
        const isActive = m.key === selected;
        return (
          <button
            key={m.key}
            data-active={isActive}
            onClick={() => onSelect(m.key)}
            className={`shrink-0 rounded-full px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-text-primary text-bg-primary"
                : "bg-bg-secondary text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {m.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
