/**
 * Shared formatting utilities for the Sailor app.
 */

export function formatCurrency(amount: number): string {
  return `$${Math.round(Math.abs(amount)).toLocaleString()}`;
}

export function formatCurrencyPrecise(amount: number): string {
  return `$${Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatSignedCurrency(amount: number): string {
  const prefix = amount >= 0 ? "+" : "-";
  return `${prefix}${formatCurrency(amount)}`;
}
