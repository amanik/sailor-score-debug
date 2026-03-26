/**
 * Shared constants used across multiple components.
 */

export const bucketOptions = {
  business: [
    { value: "high_roi", label: "High ROI" },
    { value: "no_roi", label: "No ROI" },
    { value: "unsure", label: "Unsure" },
  ],
  personal: [
    { value: "essential", label: "Essential" },
    { value: "meaningful", label: "Meaningful" },
    { value: "mismatch", label: "Mismatch" },
  ],
} as const;

export const CATEGORIES = [
  "Software",
  "Marketing",
  "Contract Labor",
  "Groceries",
  "Eating Out",
  "Subscriptions",
  "Travel & Vacation",
  "Health & Fitness",
  "Shopping",
  "Auto & Gas",
  "Insurance",
  "Health",
  "Stripe Deposits",
  "Owners Distribution",
  "Office & Space",
] as const;
