"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/transactions";
import { Flame } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────

/** Get ISO week number for a date */
function getISOWeek(date: Date): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

/** Get Monday of the ISO week containing this date */
function getWeekStart(date: Date): Date {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

/** Format a week label like "Mar 17" */
function formatWeekLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Unique key for a week: "2026-W13" */
function weekKey(date: Date): string {
  return `${date.getFullYear()}-W${String(getISOWeek(date)).padStart(2, "0")}`;
}

// ─── Types ──────────────────────────────────────────────────

interface WeekData {
  readonly key: string;
  readonly label: string;
  readonly start: Date;
  readonly reviewCount: number;
  readonly isCurrent: boolean;
}

// ─── Component ──────────────────────────────────────────────

const WEEKS_TO_SHOW = 8;

export function WeekStreak() {
  const transactions = useTransactionStore((s) => s.transactions);

  const { weeks, currentStreak, longestStreak } = useMemo(() => {
    const now = new Date();
    const currentWeekStart = getWeekStart(now);

    // Build set of weeks that had reviews
    const reviewedWeeks = new Set<string>();
    for (const t of transactions) {
      if (t.reviewedAt) {
        const reviewDate = new Date(t.reviewedAt + "T12:00:00");
        reviewedWeeks.add(weekKey(reviewDate));
      }
    }

    // Generate last N weeks
    const weekList: WeekData[] = [];
    for (let i = WEEKS_TO_SHOW - 1; i >= 0; i--) {
      const start = new Date(currentWeekStart.getTime());
      start.setDate(start.getDate() - i * 7);
      const key = weekKey(start);
      const isCurrent = i === 0;

      // Count reviews in this week
      const weekEnd = new Date(start.getTime());
      weekEnd.setDate(weekEnd.getDate() + 7);
      const reviewCount = transactions.filter((t) => {
        if (!t.reviewedAt) return false;
        const d = new Date(t.reviewedAt + "T12:00:00");
        return d >= start && d < weekEnd;
      }).length;

      weekList.push({
        key,
        label: formatWeekLabel(start),
        start,
        reviewCount,
        isCurrent,
      });
    }

    // Calculate streaks (counting backward from current week)
    let streak = 0;
    for (let i = weekList.length - 1; i >= 0; i--) {
      const w = weekList[i];
      if (w.isCurrent) {
        // Current week counts if reviewed, but don't break streak if not yet
        if (w.reviewCount > 0) streak++;
        continue;
      }
      if (w.reviewCount > 0) {
        streak++;
      } else {
        break;
      }
    }

    // Longest streak across all weeks
    let longest = 0;
    let current = 0;
    for (const w of weekList) {
      if (w.reviewCount > 0) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }

    return { weeks: weekList, currentStreak: streak, longestStreak: longest };
  }, [transactions]);

  const hasAnyReviews = weeks.some((w) => w.reviewCount > 0);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3.5 shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame
            className={`size-4 ${currentStreak > 0 ? "text-text-primary" : "text-text-quaternary"}`}
            strokeWidth={currentStreak > 0 ? 2.2 : 1.8}
          />
          <p className="text-[13px] font-semibold text-text-primary">
            {currentStreak > 0
              ? `${currentStreak} week streak`
              : "Start your streak"}
          </p>
        </div>
        {hasAnyReviews && longestStreak > currentStreak && (
          <p className="text-[10px] text-text-quaternary tabular-nums">
            Best: {longestStreak}w
          </p>
        )}
      </div>

      {/* Week dots */}
      <div className="flex items-end justify-between gap-1">
        {weeks.map((w) => {
          const isCompleted = w.reviewCount > 0;
          const intensity =
            w.reviewCount >= 20
              ? "bg-text-primary"
              : w.reviewCount >= 10
                ? "bg-text-secondary"
                : w.reviewCount >= 1
                  ? "bg-text-tertiary"
                  : "bg-bg-secondary";

          return (
            <div key={w.key} className="flex flex-1 flex-col items-center gap-1.5">
              {/* Bar showing review volume */}
              <div className="flex flex-col items-center gap-0.5">
                {isCompleted && (
                  <p className="text-[8px] font-semibold text-text-quaternary tabular-nums">
                    {w.reviewCount}
                  </p>
                )}
                <div
                  className={`w-full max-w-[28px] rounded-sm transition-all duration-300 ${intensity} ${
                    w.isCurrent && !isCompleted
                      ? "ring-1 ring-text-quaternary ring-offset-1 ring-offset-bg-primary"
                      : ""
                  }`}
                  style={{
                    height: isCompleted
                      ? `${Math.min(4 + w.reviewCount * 0.8, 24)}px`
                      : "4px",
                  }}
                />
              </div>
              {/* Week label */}
              <p
                className={`text-[8px] tabular-nums ${
                  w.isCurrent
                    ? "font-semibold text-text-primary"
                    : "text-text-quaternary"
                }`}
              >
                {w.isCurrent ? "Now" : w.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Motivation line */}
      {!hasAnyReviews && (
        <p className="text-[11px] text-text-tertiary">
          Complete your first weekly review to start building a streak.
        </p>
      )}
      {currentStreak >= 4 && (
        <p className="text-[11px] text-text-tertiary">
          A month of consistency. Your money story is getting clearer every week.
        </p>
      )}
    </div>
  );
}
