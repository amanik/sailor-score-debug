"use client";

import { calcSpendingScore, type SpendingScoreResult } from "@/lib/spending-score";
import { scoreSamples, type ScoreSample } from "@/data/spending-score-samples";
import { transactions as seedTransactions, accounts as seedAccounts } from "@/data/transactions";

function ScoreCard({
  title,
  description,
  result,
  expectedScore,
  source,
}: {
  title: string;
  description: string;
  result: SpendingScoreResult;
  expectedScore?: number;
  source?: "synthetic" | "real_pnl";
}) {
  const { total, bandLabel, bandMessage, pillars, completeness } = result;

  return (
    <div className="border border-border-primary rounded-lg p-4 space-y-3">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{title}</h3>
          {source === "real_pnl" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-border-primary text-text-tertiary">
              real data
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl tabular-nums">{total}</span>
          <span className="text-xs text-text-secondary">{bandLabel}</span>
        </div>
      </div>

      <p className="text-xs text-text-secondary">{description}</p>
      <p className="text-xs italic text-text-tertiary">{bandMessage}</p>

      {expectedScore !== undefined && (
        <p className="text-xs text-text-secondary">
          Expected: ~{expectedScore} | Delta: {total - expectedScore}
        </p>
      )}

      {/* Pillar breakdown */}
      <div className="space-y-1.5 pt-2 border-t border-border-primary">
        <PillarRow
          name="Spend / Income"
          weight="40%"
          score={pillars.spendToIncome.score}
          label={pillars.spendToIncome.label}
        />
        <PillarRow
          name="Review Quality"
          weight="20%"
          score={pillars.qualitative.score}
          label={pillars.qualitative.label}
        />
        <PillarRow
          name="Balance / Spend"
          weight="40%"
          score={pillars.balanceRatio.score}
          label={pillars.balanceRatio.label}
        />
      </div>

      {/* Completeness */}
      {!completeness.meetsMinimum && (
        <div className="pt-2 border-t border-border-primary text-xs text-text-secondary space-y-0.5">
          <p className="font-medium">Incomplete:</p>
          {!completeness.hasBusinessAccount && <p>- Missing business account</p>}
          {!completeness.hasPersonalAccount && <p>- Missing personal account</p>}
          {!completeness.hasIncome && <p>- No income this month</p>}
          {completeness.reviewPercentage < 0.5 && (
            <p>
              - Only {Math.round(completeness.reviewPercentage * 100)}% reviewed
              (need 50%)
            </p>
          )}
        </div>
      )}

      {completeness.reviewPercentage < 0.8 && completeness.reviewPercentage >= 0.5 && (
        <p className="text-xs text-text-secondary pt-1">
          Based on {Math.round(completeness.reviewPercentage * 100)}% of
          transactions reviewed.
        </p>
      )}
    </div>
  );
}

function PillarRow({
  name,
  weight,
  score,
  label,
}: {
  name: string;
  weight: string;
  score: number;
  label: string;
}) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <div className="flex items-center gap-1 shrink-0 w-32">
        <span className="text-text-secondary">{name}</span>
        <span className="text-text-tertiary">({weight})</span>
      </div>
      <span className="font-mono tabular-nums shrink-0 w-8 text-right">
        {Math.round(score)}
      </span>
      <span className="text-text-tertiary truncate">{label}</span>
    </div>
  );
}

export default function ScoreDebugPage() {
  const jordanResult = calcSpendingScore({
    transactions: seedTransactions,
    accounts: seedAccounts,
    monthKey: "2026-02",
  });

  const syntheticSamples = scoreSamples.filter((s) => s.source === "synthetic");
  const realSamples = scoreSamples.filter((s) => s.source === "real_pnl");

  const renderSamples = (samples: readonly ScoreSample[]) =>
    samples.map((sample) => {
      const result = calcSpendingScore({
        transactions: sample.transactions,
        accounts: sample.accounts,
        monthKey: sample.monthKey,
      });
      return (
        <ScoreCard
          key={sample.name}
          title={sample.name}
          description={sample.description}
          result={result}
          expectedScore={sample.expectedScore}
          source={sample.source}
        />
      );
    });

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-lg font-medium">Spending Score — Debug</h1>
        <p className="text-xs text-text-secondary mt-1">
          Algorithm validation view. Not for production.
        </p>
      </div>

      {/* Jordan Rivera — live seed data */}
      <div>
        <h2 className="text-sm font-medium text-text-secondary mb-2">
          Live: Jordan Rivera (seed data)
        </h2>
        <ScoreCard
          title="Jordan Rivera"
          description="Business coach, ~$10K/mo revenue, Feb 2026 seed data"
          result={jordanResult}
          expectedScore={89}
        />
      </div>

      {/* Real P&L personas */}
      {realSamples.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-text-secondary mb-2">
            Real Client P&Ls (anonymized from SBMS)
          </h2>
          <div className="space-y-3">{renderSamples(realSamples)}</div>
        </div>
      )}

      {/* Synthetic edge cases */}
      <div>
        <h2 className="text-sm font-medium text-text-secondary mb-2">
          Synthetic Edge Cases
        </h2>
        <div className="space-y-3">{renderSamples(syntheticSamples)}</div>
      </div>
    </div>
  );
}
