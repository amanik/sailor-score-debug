// Sailor App — Sample Transaction Data
// Based on real Monarch Money patterns for entrepreneur with personal + business accounts

export type AccountType = "personal" | "business";
export type AccountCategory =
  | "checking"
  | "savings"
  | "credit_card"
  | "investment"
  | "hysa"
  | "loan"
  | "line_of_credit";

export interface Account {
  readonly id: string;
  readonly name: string;
  readonly institution: string;
  readonly type: AccountType;
  readonly category: AccountCategory;
  readonly lastFour: string;
  readonly balance: number;
}

export interface Transaction {
  readonly id: string;
  readonly date: string;
  readonly merchantName: string;
  readonly merchantLogo: string;
  readonly rawDescription: string;
  readonly amount: number; // positive = expense, negative = income
  readonly accountId: string;
  readonly category: string;
  readonly subCategory?: string;
  readonly isRecurring: boolean;
  readonly recurringFrequency?: "weekly" | "monthly" | "annual";
  readonly businessBucket?: "high_roi" | "no_roi" | "unsure" | null;
  readonly noRoiReason?: string;
  readonly roiRating?: number;
  readonly roiType?: "time" | "money" | "emotional" | "overhead" | null;
  readonly personalBucket?: "essential" | "meaningful" | "mismatch" | null;
  readonly reviewed: boolean;
  readonly reviewedAt?: string;
  readonly rule?: string;
  readonly isTransfer: boolean;
  readonly linkedTransferId?: string;
  readonly annualProjection?: number;
}

export interface CashFlowSummary {
  readonly cashCollected: number;
  readonly businessExpenses: number;
  readonly personalExpenses: number;
  readonly taxesHeld: number;
  readonly horizonFunds: number;
  readonly estimatedProfit: number;
  readonly avgMonthlyCashCollected: number;
  readonly avgMonthlyBusinessExp: number;
  readonly avgMonthlyPersonalExp: number;
  readonly savingsRate: number;
}

export interface CategoryBreakdown {
  readonly category: string;
  readonly total: number;
  readonly count: number;
  readonly percentage: number;
}

// ─── Accounts ───────────────────────────────────────────────

export const accounts: readonly Account[] = [
  {
    id: "acc_personal_freedom",
    name: "Freedom",
    institution: "Capital One",
    type: "personal",
    category: "credit_card",
    lastFour: "4821",
    balance: -1_842.31,
  },
  {
    id: "acc_personal_amex",
    name: "AMEX Gold",
    institution: "American Express",
    type: "personal",
    category: "credit_card",
    lastFour: "1003",
    balance: -491.2,
  },
  {
    id: "acc_personal_checking",
    name: "Chase Checking",
    institution: "Chase",
    type: "personal",
    category: "checking",
    lastFour: "7234",
    balance: 5_231.87,
  },
  {
    id: "acc_personal_hysa",
    name: "Ally HYSA",
    institution: "Ally",
    type: "personal",
    category: "hysa",
    lastFour: "9012",
    balance: 18_432.5,
  },
  {
    id: "acc_biz_ink",
    name: "Chase Ink",
    institution: "Chase",
    type: "business",
    category: "credit_card",
    lastFour: "5567",
    balance: -1_287.45,
  },
  {
    id: "acc_biz_checking",
    name: "Mercury Checking",
    institution: "Mercury",
    type: "business",
    category: "checking",
    lastFour: "8890",
    balance: 24_567.12,
  },
  {
    id: "acc_biz_stripe",
    name: "Stripe Deposits",
    institution: "Stripe",
    type: "business",
    category: "checking",
    lastFour: "0000",
    balance: 0,
  },
  // Loans / Debt
  {
    id: "acc_biz_loan",
    name: "SBA Loan",
    institution: "Bluevine",
    type: "business",
    category: "loan",
    lastFour: "4410",
    balance: -18_500,
  },
  {
    id: "acc_personal_mortgage",
    name: "Mortgage",
    institution: "Wells Fargo",
    type: "personal",
    category: "loan",
    lastFour: "7721",
    balance: -287_400,
  },
];

// ─── Transactions ───────────────────────────────────────────

export const transactions: readonly Transaction[] = [
  // ── Business Income ──
  {
    id: "txn_001",
    date: "2026-02-24",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER",
    amount: -8_028.86,
    accountId: "acc_biz_checking",
    category: "Stripe Deposits",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  {
    id: "txn_002",
    date: "2026-02-24",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER",
    amount: -1_937.37,
    accountId: "acc_biz_checking",
    category: "Stripe Deposits",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  {
    id: "txn_003",
    date: "2026-02-23",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER",
    amount: -2_533.77,
    accountId: "acc_biz_checking",
    category: "Stripe Deposits",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  // ── Business Expenses (Reviewed) ──
  {
    id: "txn_004",
    date: "2026-02-23",
    merchantName: "GoDaddy",
    merchantLogo: "🌐",
    rawDescription: "GODADDY.COM",
    amount: 22.19,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 266.28,
    businessBucket: "high_roi",
    roiRating: 7,
    roiType: "money",
    reviewed: true,
    reviewedAt: "2026-02-24",
    rule: "Always categorize GoDaddy as Software (High ROI)",
    isTransfer: false,
  },
  {
    id: "txn_005",
    date: "2026-02-20",
    merchantName: "Notion",
    merchantLogo: "📝",
    rawDescription: "NOTION LABS INC",
    amount: 10.0,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 120.0,
    businessBucket: "high_roi",
    roiRating: 9,
    roiType: "time",
    reviewed: true,
    reviewedAt: "2026-02-21",
    rule: "Always categorize Notion as Software (High ROI)",
    isTransfer: false,
  },
  {
    id: "txn_006",
    date: "2026-02-18",
    merchantName: "Facebook Ads",
    merchantLogo: "📢",
    rawDescription: "FACEBOOK ADS 8K2JF9",
    amount: 847.32,
    accountId: "acc_biz_ink",
    category: "Marketing",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 10_167.84,
    businessBucket: "high_roi",
    roiRating: 6,
    roiType: "money",
    reviewed: true,
    reviewedAt: "2026-02-19",
    isTransfer: false,
  },
  {
    id: "txn_007",
    date: "2026-02-15",
    merchantName: "Zoom",
    merchantLogo: "📹",
    rawDescription: "ZOOM.US",
    amount: 14.99,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 179.88,
    businessBucket: "unsure",
    roiRating: 5,
    roiType: "overhead",
    reviewed: true,
    reviewedAt: "2026-02-16",
    isTransfer: false,
  },
  {
    id: "txn_008",
    date: "2026-02-12",
    merchantName: "AWS",
    merchantLogo: "☁️",
    rawDescription: "AMAZON WEB SERVICES",
    amount: 127.43,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 1_529.16,
    businessBucket: "high_roi",
    roiRating: 8,
    roiType: "money",
    reviewed: true,
    reviewedAt: "2026-02-13",
    isTransfer: false,
  },
  {
    id: "txn_009",
    date: "2026-02-23",
    merchantName: "PayPal",
    merchantLogo: "💰",
    rawDescription: "PAYPAL *CONTRACTLABOR",
    amount: 1_500.0,
    accountId: "acc_biz_checking",
    category: "Contract Labor",
    isRecurring: false,
    reviewed: true,
    reviewedAt: "2026-02-24",
    businessBucket: "high_roi",
    roiRating: 7,
    roiType: "time",
    isTransfer: false,
  },
  {
    id: "txn_009b",
    date: "2026-02-10",
    merchantName: "PayPal",
    merchantLogo: "💰",
    rawDescription: "PAYPAL *CONTRACTLABOR",
    amount: 1_200.0,
    accountId: "acc_biz_checking",
    category: "Contract Labor",
    isRecurring: false,
    reviewed: true,
    reviewedAt: "2026-02-11",
    businessBucket: "high_roi",
    roiRating: 8,
    roiType: "time",
    isTransfer: false,
  },
  {
    id: "txn_009c",
    date: "2026-02-05",
    merchantName: "WeWork",
    merchantLogo: "🏢",
    rawDescription: "WEWORK HOT DESK MONTHLY",
    amount: 350.0,
    accountId: "acc_biz_ink",
    category: "Office & Space",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 4_200.0,
    reviewed: true,
    reviewedAt: "2026-02-06",
    businessBucket: "unsure",
    roiRating: 5,
    roiType: "overhead",
    isTransfer: false,
  },
  // ── Personal Expenses (Reviewed) ──
  {
    id: "txn_010",
    date: "2026-02-23",
    merchantName: "Trader Joe's",
    merchantLogo: "🛒",
    rawDescription: "TRADER JOE'S #123",
    amount: 29.47,
    accountId: "acc_personal_freedom",
    category: "Groceries",
    isRecurring: true,
    recurringFrequency: "weekly",
    annualProjection: 1_532.44,
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-24",
    rule: "Always categorize Trader Joe's as Groceries (Essential)",
    isTransfer: false,
  },
  {
    id: "txn_011",
    date: "2026-02-23",
    merchantName: "Uber Eats",
    merchantLogo: "🍔",
    rawDescription: "UBER EATS PENDING",
    amount: 39.98,
    accountId: "acc_personal_freedom",
    category: "Eating Out",
    isRecurring: false,
    personalBucket: "mismatch",
    reviewed: true,
    reviewedAt: "2026-02-24",
    isTransfer: false,
  },
  {
    id: "txn_012",
    date: "2026-02-22",
    merchantName: "Jeni's Splendid Ice Creams",
    merchantLogo: "🍦",
    rawDescription: "JENIS SPLENDID ICE CR",
    amount: 20.47,
    accountId: "acc_personal_freedom",
    category: "Eating Out",
    isRecurring: false,
    personalBucket: "meaningful",
    reviewed: true,
    reviewedAt: "2026-02-23",
    isTransfer: false,
  },
  {
    id: "txn_013",
    date: "2026-02-22",
    merchantName: "KLM Royal Dutch Airlines",
    merchantLogo: "✈️",
    rawDescription: "KLM ROYAL DUTCH AIR",
    amount: 245.6,
    accountId: "acc_personal_amex",
    category: "Travel & Vacation",
    isRecurring: false,
    personalBucket: "meaningful",
    reviewed: true,
    reviewedAt: "2026-02-23",
    isTransfer: false,
  },
  {
    id: "txn_014",
    date: "2026-02-20",
    merchantName: "Netflix",
    merchantLogo: "🎬",
    rawDescription: "NETFLIX.COM",
    amount: 15.49,
    accountId: "acc_personal_freedom",
    category: "Subscriptions",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 185.88,
    personalBucket: "meaningful",
    reviewed: true,
    reviewedAt: "2026-02-21",
    rule: "Always categorize Netflix as Subscriptions (Meaningful)",
    isTransfer: false,
  },
  {
    id: "txn_015",
    date: "2026-02-19",
    merchantName: "Spotify",
    merchantLogo: "🎵",
    rawDescription: "SPOTIFY USA",
    amount: 10.99,
    accountId: "acc_personal_freedom",
    category: "Subscriptions",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 131.88,
    personalBucket: "meaningful",
    reviewed: true,
    reviewedAt: "2026-02-20",
    isTransfer: false,
  },
  {
    id: "txn_016",
    date: "2026-02-18",
    merchantName: "Equinox",
    merchantLogo: "💪",
    rawDescription: "EQUINOX MEMBERSHIP",
    amount: 185.0,
    accountId: "acc_personal_freedom",
    category: "Health & Fitness",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 2_220.0,
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-19",
    rule: "Always categorize Equinox as Health & Fitness (Essential)",
    isTransfer: false,
  },
  // ── Transfers (linked pairs) ──
  {
    id: "txn_017",
    date: "2026-02-23",
    merchantName: "Capital One",
    merchantLogo: "🏦",
    rawDescription: "CAPITAL ONE CREDIT CARD PAYMENT",
    amount: 4_000.0,
    accountId: "acc_personal_checking",
    category: "Credit Card Payment",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_018",
  },
  {
    id: "txn_018",
    date: "2026-02-23",
    merchantName: "Capital One",
    merchantLogo: "🏦",
    rawDescription: "PAYMENT RECEIVED - THANK YOU",
    amount: -4_000.0,
    accountId: "acc_personal_freedom",
    category: "Credit Card Payment",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_017",
  },
  {
    id: "txn_019",
    date: "2026-02-23",
    merchantName: "American Express",
    merchantLogo: "🏦",
    rawDescription: "AMEX CREDIT CARD PAYMENT",
    amount: 127.17,
    accountId: "acc_personal_checking",
    category: "Credit Card Payment",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_020",
  },
  {
    id: "txn_020",
    date: "2026-02-23",
    merchantName: "American Express",
    merchantLogo: "🏦",
    rawDescription: "AMEX PAYMENT RECEIVED",
    amount: -127.17,
    accountId: "acc_personal_amex",
    category: "Credit Card Payment",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_019",
  },
  {
    id: "txn_021",
    date: "2026-02-23",
    merchantName: "Owners Distribution",
    merchantLogo: "💸",
    rawDescription: "OWNERS DISTRIBUTIONS - PAY",
    amount: 7_953.86,
    accountId: "acc_biz_checking",
    category: "Owners Distribution",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_022",
  },
  {
    id: "txn_022",
    date: "2026-02-23",
    merchantName: "Owners Distribution",
    merchantLogo: "💸",
    rawDescription: "OWNERS DISTRIBUTIONS INCOME",
    amount: -7_953.86,
    accountId: "acc_personal_hysa",
    category: "Owners Distribution",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_021",
  },
  // ── UNREVIEWED TRANSACTIONS (for swipe flow demo) ──
  {
    id: "txn_u01",
    date: "2026-02-25",
    merchantName: "Figma",
    merchantLogo: "🎨",
    rawDescription: "FIGMA INC",
    amount: 15.0,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 180.0,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u02",
    date: "2026-02-25",
    merchantName: "ChatGPT",
    merchantLogo: "🤖",
    rawDescription: "OPENAI *CHATGPT PLUS",
    amount: 20.0,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 240.0,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u03",
    date: "2026-02-24",
    merchantName: "Canva",
    merchantLogo: "🖼️",
    rawDescription: "CANVA PTY LTD",
    amount: 12.99,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 155.88,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u04",
    date: "2026-02-24",
    merchantName: "Loom",
    merchantLogo: "📹",
    rawDescription: "LOOM INC",
    amount: 12.5,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 150.0,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u05",
    date: "2026-02-24",
    merchantName: "ConvertKit",
    merchantLogo: "📧",
    rawDescription: "CONVERTKIT LLC",
    amount: 29.0,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 348.0,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u06",
    date: "2026-02-23",
    merchantName: "Google Workspace",
    merchantLogo: "📊",
    rawDescription: "GOOGLE *WORKSPACE",
    amount: 7.2,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 86.4,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u07",
    date: "2026-02-22",
    merchantName: "Calendly",
    merchantLogo: "📅",
    rawDescription: "CALENDLY LLC",
    amount: 8.0,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 96.0,
    reviewed: false,
    isTransfer: false,
  },
  // Personal unreviewed
  {
    id: "txn_u08",
    date: "2026-02-25",
    merchantName: "Whole Foods",
    merchantLogo: "🥑",
    rawDescription: "WHOLE FOODS MKT #10234",
    amount: 67.82,
    accountId: "acc_personal_freedom",
    category: "Groceries",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u09",
    date: "2026-02-25",
    merchantName: "Amazon",
    merchantLogo: "📦",
    rawDescription: "AMZN MKTP US*2K4F9H3",
    amount: 84.26,
    accountId: "acc_personal_freedom",
    category: "Shopping",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u10",
    date: "2026-02-24",
    merchantName: "Mian & Bao",
    merchantLogo: "🍜",
    rawDescription: "MIAN & BAO NYC",
    amount: 83.2,
    accountId: "acc_personal_freedom",
    category: "Eating Out",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u11",
    date: "2026-02-24",
    merchantName: "Shell",
    merchantLogo: "⛽",
    rawDescription: "SHELL OIL 57442",
    amount: 52.31,
    accountId: "acc_personal_freedom",
    category: "Auto & Gas",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u12",
    date: "2026-02-22",
    merchantName: "GEICO",
    merchantLogo: "🚗",
    rawDescription: "GEICO AUTO INSURANCE",
    amount: 148.0,
    accountId: "acc_personal_checking",
    category: "Insurance",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 1_776.0,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u13",
    date: "2026-02-21",
    merchantName: "Target",
    merchantLogo: "🎯",
    rawDescription: "TARGET 00012847",
    amount: 43.17,
    accountId: "acc_personal_freedom",
    category: "Shopping",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_u14",
    date: "2026-02-20",
    merchantName: "Walgreens",
    merchantLogo: "💊",
    rawDescription: "WALGREENS #9821",
    amount: 18.42,
    accountId: "acc_personal_freedom",
    category: "Health",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
];

// ─── Cash Flow Summary ──────────────────────────────────────

export const cashFlowSummary: CashFlowSummary = {
  cashCollected: 12_500,
  businessExpenses: 4_177,
  personalExpenses: 1_043,
  taxesHeld: 4_300,
  horizonFunds: 875,
  estimatedProfit: 2_980,
  avgMonthlyCashCollected: 12_500,
  avgMonthlyBusinessExp: 4_177,
  avgMonthlyPersonalExp: 1_043,
  savingsRate: 23.8,
};

// ─── Helper Functions ───────────────────────────────────────

export function getUnreviewedTransactions(): readonly Transaction[] {
  return transactions.filter((t) => !t.reviewed && !t.isTransfer);
}

export function getBusinessTransactions(): readonly Transaction[] {
  const bizAccountIds = accounts
    .filter((a) => a.type === "business")
    .map((a) => a.id);
  return transactions.filter(
    (t) => bizAccountIds.includes(t.accountId) && !t.isTransfer
  );
}

export function getPersonalTransactions(): readonly Transaction[] {
  const personalAccountIds = accounts
    .filter((a) => a.type === "personal")
    .map((a) => a.id);
  return transactions.filter(
    (t) => personalAccountIds.includes(t.accountId) && !t.isTransfer
  );
}

export function getTransferPairs(): readonly {
  outgoing: Transaction;
  incoming: Transaction;
}[] {
  const transfers = transactions.filter(
    (t) => t.isTransfer && t.linkedTransferId && t.amount > 0
  );
  return transfers.map((outgoing) => {
    const incoming = transactions.find(
      (t) => t.id === outgoing.linkedTransferId
    )!;
    return { outgoing, incoming };
  });
}

export function getRecurringExpenses(): readonly Transaction[] {
  return transactions.filter(
    (t) => t.isRecurring && t.amount > 0 && !t.isTransfer
  );
}

export function getCategoryBreakdown(
  type: AccountType
): readonly CategoryBreakdown[] {
  const accountIds = accounts
    .filter((a) => a.type === type)
    .map((a) => a.id);
  const relevant = transactions.filter(
    (t) =>
      accountIds.includes(t.accountId) &&
      t.amount > 0 &&
      !t.isTransfer
  );
  const total = relevant.reduce((sum, t) => sum + t.amount, 0);

  const grouped = relevant.reduce<Record<string, { total: number; count: number }>>(
    (acc, t) => {
      const existing = acc[t.category] ?? { total: 0, count: 0 };
      return {
        ...acc,
        [t.category]: {
          total: existing.total + t.amount,
          count: existing.count + 1,
        },
      };
    },
    {}
  );

  return Object.entries(grouped)
    .map(([category, data]) => ({
      category,
      total: Math.round(data.total * 100) / 100,
      count: data.count,
      percentage: total > 0 ? Math.round((data.total / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getAccountById(id: string): Account | undefined {
  return accounts.find((a) => a.id === id);
}

export function getUnreviewedByType(type: AccountType): readonly Transaction[] {
  const accountIds = accounts
    .filter((a) => a.type === type)
    .map((a) => a.id);
  return transactions.filter(
    (t) => !t.reviewed && !t.isTransfer && accountIds.includes(t.accountId)
  );
}
