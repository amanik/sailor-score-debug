import Papa from "papaparse";
import type { Transaction, Account, AccountType, AccountCategory } from "@/data/transactions";
import type { Bucket, BucketType } from "@/data/buckets";

interface ParseResult<T> {
  readonly data: readonly T[];
  readonly errors: readonly string[];
}

// ─── Transaction CSV Parser ──────────────────────────────────

const REQUIRED_TXN_FIELDS = ["id", "date", "merchantName", "amount", "accountId", "category"] as const;

function parseBool(val: string | undefined): boolean {
  if (!val) return false;
  return val.toLowerCase() === "true" || val === "1";
}

function parseOptionalNumber(val: string | undefined): number | undefined {
  if (!val || val.trim() === "") return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

function parseOptionalString(val: string | undefined): string | undefined {
  if (!val || val.trim() === "") return undefined;
  return val.trim();
}

export function parseTransactionsCsv(csvString: string): ParseResult<Transaction> {
  const parsed = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const errors: string[] = [];

  // Check for parse-level errors
  for (const err of parsed.errors) {
    errors.push(`Row ${err.row ?? "?"}: ${err.message}`);
  }

  const data: Transaction[] = [];

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const rowNum = i + 2; // 1-indexed + header

    // Validate required fields
    const missing = REQUIRED_TXN_FIELDS.filter(
      (f) => !row[f] || row[f].trim() === ""
    );
    if (missing.length > 0) {
      errors.push(`Row ${rowNum}: Missing required fields: ${missing.join(", ")}`);
      continue;
    }

    const amount = Number(row.amount);
    if (isNaN(amount)) {
      errors.push(`Row ${rowNum}: Invalid amount "${row.amount}"`);
      continue;
    }

    data.push({
      id: row.id.trim(),
      date: row.date.trim(),
      merchantName: row.merchantName.trim(),
      merchantLogo: row.merchantLogo?.trim() || "💳",
      rawDescription: row.rawDescription?.trim() || row.merchantName.trim(),
      amount,
      accountId: row.accountId.trim(),
      category: row.category.trim(),
      subCategory: parseOptionalString(row.subCategory),
      isRecurring: parseBool(row.isRecurring),
      recurringFrequency: parseOptionalString(row.recurringFrequency) as
        | "weekly"
        | "monthly"
        | "annual"
        | undefined,
      businessBucket: (parseOptionalString(row.businessBucket) as Transaction["businessBucket"]) ?? undefined,
      roiRating: parseOptionalNumber(row.roiRating),
      roiType: (parseOptionalString(row.roiType) as Transaction["roiType"]) ?? undefined,
      personalBucket: (parseOptionalString(row.personalBucket) as Transaction["personalBucket"]) ?? undefined,
      reviewed: parseBool(row.reviewed),
      reviewedAt: parseOptionalString(row.reviewedAt),
      rule: parseOptionalString(row.rule),
      isTransfer: parseBool(row.isTransfer),
      linkedTransferId: parseOptionalString(row.linkedTransferId),
      annualProjection: parseOptionalNumber(row.annualProjection),
    });
  }

  return { data, errors };
}

// ─── Buckets CSV Parser ──────────────────────────────────────

const REQUIRED_BUCKET_FIELDS = ["id", "name", "type", "emoji", "createdAt"] as const;
const VALID_BUCKET_TYPES: readonly string[] = ["project", "sinking_fund", "savings_goal"];

export function parseBucketsCsv(csvString: string): ParseResult<Bucket> {
  const parsed = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const errors: string[] = [];

  for (const err of parsed.errors) {
    errors.push(`Row ${err.row ?? "?"}: ${err.message}`);
  }

  const data: Bucket[] = [];

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const rowNum = i + 2;

    const missing = REQUIRED_BUCKET_FIELDS.filter(
      (f) => !row[f] || row[f].trim() === ""
    );
    if (missing.length > 0) {
      errors.push(`Row ${rowNum}: Missing required fields: ${missing.join(", ")}`);
      continue;
    }

    if (!VALID_BUCKET_TYPES.includes(row.type.trim())) {
      errors.push(
        `Row ${rowNum}: Invalid bucket type "${row.type}". Must be: ${VALID_BUCKET_TYPES.join(", ")}`
      );
      continue;
    }

    const current = Number(row.current ?? "0");
    if (isNaN(current)) {
      errors.push(`Row ${rowNum}: Invalid current amount "${row.current}"`);
      continue;
    }

    const target = parseOptionalNumber(row.target);

    // Parse transactionIds from comma-separated string
    const transactionIds: string[] = row.transactionIds
      ? row.transactionIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    data.push({
      id: row.id.trim(),
      name: row.name.trim(),
      type: row.type.trim() as BucketType,
      emoji: row.emoji.trim(),
      target,
      current,
      transactionIds,
      createdAt: row.createdAt.trim(),
      description: parseOptionalString(row.description),
      isActive: row.isActive ? parseBool(row.isActive) : true,
    });
  }

  return { data, errors };
}

// ─── Accounts CSV Parser ─────────────────────────────────────

const REQUIRED_ACCOUNT_FIELDS = ["id", "name", "institution", "type", "category", "lastFour", "balance"] as const;
const VALID_ACCOUNT_TYPES: readonly string[] = ["personal", "business"];
const VALID_ACCOUNT_CATEGORIES: readonly string[] = [
  "checking",
  "savings",
  "credit_card",
  "investment",
  "hysa",
];

export function parseAccountsCsv(csvString: string): ParseResult<Account> {
  const parsed = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const errors: string[] = [];

  for (const err of parsed.errors) {
    errors.push(`Row ${err.row ?? "?"}: ${err.message}`);
  }

  const data: Account[] = [];

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const rowNum = i + 2;

    const missing = REQUIRED_ACCOUNT_FIELDS.filter(
      (f) => !row[f] || row[f].trim() === ""
    );
    if (missing.length > 0) {
      errors.push(`Row ${rowNum}: Missing required fields: ${missing.join(", ")}`);
      continue;
    }

    if (!VALID_ACCOUNT_TYPES.includes(row.type.trim())) {
      errors.push(
        `Row ${rowNum}: Invalid account type "${row.type}". Must be: ${VALID_ACCOUNT_TYPES.join(", ")}`
      );
      continue;
    }

    if (!VALID_ACCOUNT_CATEGORIES.includes(row.category.trim())) {
      errors.push(
        `Row ${rowNum}: Invalid category "${row.category}". Must be: ${VALID_ACCOUNT_CATEGORIES.join(", ")}`
      );
      continue;
    }

    const balance = Number(row.balance);
    if (isNaN(balance)) {
      errors.push(`Row ${rowNum}: Invalid balance "${row.balance}"`);
      continue;
    }

    data.push({
      id: row.id.trim(),
      name: row.name.trim(),
      institution: row.institution.trim(),
      type: row.type.trim() as AccountType,
      category: row.category.trim() as AccountCategory,
      lastFour: row.lastFour.trim(),
      balance,
    });
  }

  return { data, errors };
}
