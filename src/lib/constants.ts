/**
 * Shared constants used across multiple components.
 * Categories based on real P&L structures from SBMS community.
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
  // Business expense categories (from real SBMS P&Ls)
  "Software",
  "Marketing",
  "Contract Labor",
  "Coaching & Training",
  "Networking & Events",
  "Office & Space",
  "Insurance",
  "Bookkeeping & Accounting",
  "Stripe & Bank Fees",
  "Travel",
  "Meals & Entertainment",
  "Debt Payment",
  "Estimated Taxes",
  "Owners Distribution",
  // Personal expense categories
  "Groceries",
  "Eating Out",
  "Subscriptions",
  "Travel & Vacation",
  "Health & Fitness",
  "Shopping",
  "Auto & Gas",
  "Health",
  // Revenue categories
  "Coaching Revenue",
  "Group Program Revenue",
  "Course Revenue",
  "Speaking Revenue",
] as const;
