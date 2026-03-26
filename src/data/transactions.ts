// Sailor App — Sample Transaction Data
// Persona: Jordan Rivera, Business Coach & Consultant
// Revenue: ~$120K/yr from 1:1 coaching, group programs, courses, speaking
// Based on real P&L patterns from Gina Knox's SBMS community

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
  readonly meaningRating?: number;
  readonly meaningCategory?: string;
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
// Modeled after service-based solopreneur with separate biz/personal
// Median $45K debt from survey data

export const accounts: readonly Account[] = [
  // Personal
  {
    id: "acc_personal_checking",
    name: "Chase Checking",
    institution: "Chase",
    type: "personal",
    category: "checking",
    lastFour: "7234",
    balance: 4_831.47,
  },
  {
    id: "acc_personal_freedom",
    name: "Freedom Unlimited",
    institution: "Capital One",
    type: "personal",
    category: "credit_card",
    lastFour: "4821",
    balance: -2_147.63,
  },
  {
    id: "acc_personal_amex",
    name: "AMEX Gold",
    institution: "American Express",
    type: "personal",
    category: "credit_card",
    lastFour: "1003",
    balance: -891.20,
  },
  {
    id: "acc_personal_hysa",
    name: "Ally HYSA",
    institution: "Ally",
    type: "personal",
    category: "hysa",
    lastFour: "9012",
    balance: 12_340.00,
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
  // Business
  {
    id: "acc_biz_checking",
    name: "Mercury Checking",
    institution: "Mercury",
    type: "business",
    category: "checking",
    lastFour: "8890",
    balance: 18_234.56,
  },
  {
    id: "acc_biz_ink",
    name: "Chase Ink",
    institution: "Chase",
    type: "business",
    category: "credit_card",
    lastFour: "5567",
    balance: -1_642.89,
  },
  {
    id: "acc_biz_savings",
    name: "Mercury Savings",
    institution: "Mercury",
    type: "business",
    category: "savings",
    lastFour: "8891",
    balance: 8_500.00,
  },
  {
    id: "acc_biz_loan",
    name: "SBA Loan",
    institution: "Bluevine",
    type: "business",
    category: "loan",
    lastFour: "4410",
    balance: -22_000,
  },
];

// ─── Transactions ───────────────────────────────────────────
// February 2026 — one month of data for weekly review
// Jordan Rivera: Business Coach & Consultant, ~$10K/month revenue
// Revenue streams: 1:1 coaching, group program, digital course, speaking

export const transactions: readonly Transaction[] = [
  // ═══════════════════════════════════════════════════════════
  // BUSINESS INCOME — lumpy, client-based
  // ═══════════════════════════════════════════════════════════
  {
    id: "txn_inc_01",
    date: "2026-02-03",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER - 1:1 COACHING",
    amount: -3_200.00,
    accountId: "acc_biz_checking",
    category: "Coaching Revenue",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  {
    id: "txn_inc_02",
    date: "2026-02-10",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER - GROUP PROGRAM",
    amount: -2_400.00,
    accountId: "acc_biz_checking",
    category: "Group Program Revenue",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  {
    id: "txn_inc_03",
    date: "2026-02-14",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER - COURSE SALES",
    amount: -1_847.00,
    accountId: "acc_biz_checking",
    category: "Course Revenue",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  {
    id: "txn_inc_04",
    date: "2026-02-20",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER - 1:1 COACHING",
    amount: -1_600.00,
    accountId: "acc_biz_checking",
    category: "Coaching Revenue",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  {
    id: "txn_inc_05",
    date: "2026-02-24",
    merchantName: "PayPal",
    merchantLogo: "💰",
    rawDescription: "PAYPAL TRANSFER - SPEAKING FEE",
    amount: -1_500.00,
    accountId: "acc_biz_checking",
    category: "Speaking Revenue",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  // Small Stripe deposits (course drip)
  {
    id: "txn_inc_06",
    date: "2026-02-07",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER - COURSE SALES",
    amount: -297.00,
    accountId: "acc_biz_checking",
    category: "Course Revenue",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },
  {
    id: "txn_inc_07",
    date: "2026-02-18",
    merchantName: "Stripe",
    merchantLogo: "💳",
    rawDescription: "STRIPE TRANSFER - COURSE SALES",
    amount: -594.00,
    accountId: "acc_biz_checking",
    category: "Course Revenue",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },

  // ═══════════════════════════════════════════════════════════
  // BUSINESS EXPENSES — REVIEWED
  // ═══════════════════════════════════════════════════════════

  // -- Software (subscription-heavy, real tools from P&L data) --
  {
    id: "txn_biz_01",
    date: "2026-02-03",
    merchantName: "Kajabi",
    merchantLogo: "📊",
    rawDescription: "KAJABI INC",
    amount: 149.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 1_788.00,
    businessBucket: "high_roi",
    roiRating: 9,
    roiType: "money",
    reviewed: true,
    reviewedAt: "2026-02-04",
    rule: "Kajabi hosts courses + group program — direct revenue driver",
    isTransfer: false,
  },
  {
    id: "txn_biz_02",
    date: "2026-02-03",
    merchantName: "Zoom",
    merchantLogo: "📹",
    rawDescription: "ZOOM.US",
    amount: 14.99,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 179.88,
    businessBucket: "high_roi",
    roiRating: 8,
    roiType: "time",
    reviewed: true,
    reviewedAt: "2026-02-04",
    isTransfer: false,
  },
  {
    id: "txn_biz_03",
    date: "2026-02-08",
    merchantName: "ConvertKit",
    merchantLogo: "📧",
    rawDescription: "CONVERTKIT LLC",
    amount: 59.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 708.00,
    businessBucket: "high_roi",
    roiRating: 7,
    roiType: "money",
    reviewed: true,
    reviewedAt: "2026-02-09",
    rule: "Email list = #1 revenue driver for course launches",
    isTransfer: false,
  },
  {
    id: "txn_biz_04",
    date: "2026-02-14",
    merchantName: "ChatGPT",
    merchantLogo: "🤖",
    rawDescription: "OPENAI *CHATGPT PLUS",
    amount: 20.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 240.00,
    businessBucket: "high_roi",
    roiRating: 8,
    roiType: "time",
    reviewed: true,
    reviewedAt: "2026-02-15",
    isTransfer: false,
  },
  {
    id: "txn_biz_05",
    date: "2026-02-14",
    merchantName: "Calendly",
    merchantLogo: "📅",
    rawDescription: "CALENDLY LLC",
    amount: 12.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 144.00,
    businessBucket: "unsure",
    roiRating: 5,
    roiType: "overhead",
    reviewed: true,
    reviewedAt: "2026-02-15",
    isTransfer: false,
  },
  {
    id: "txn_biz_06",
    date: "2026-02-21",
    merchantName: "Canva",
    merchantLogo: "🖼️",
    rawDescription: "CANVA PTY LTD",
    amount: 12.99,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 155.88,
    businessBucket: "unsure",
    roiRating: 4,
    roiType: "overhead",
    reviewed: true,
    reviewedAt: "2026-02-22",
    isTransfer: false,
  },
  {
    id: "txn_biz_07",
    date: "2026-02-21",
    merchantName: "Google Workspace",
    merchantLogo: "📊",
    rawDescription: "GOOGLE *WORKSPACE",
    amount: 7.20,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 86.40,
    businessBucket: "high_roi",
    roiRating: 7,
    roiType: "overhead",
    reviewed: true,
    reviewedAt: "2026-02-22",
    isTransfer: false,
  },
  {
    id: "txn_biz_08",
    date: "2026-02-25",
    merchantName: "Dubsado",
    merchantLogo: "📋",
    rawDescription: "DUBSADO LLC",
    amount: 20.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 240.00,
    businessBucket: "high_roi",
    roiRating: 7,
    roiType: "time",
    reviewed: true,
    reviewedAt: "2026-02-26",
    isTransfer: false,
  },

  // -- Stripe & Bank Fees --
  {
    id: "txn_biz_09",
    date: "2026-02-28",
    merchantName: "Stripe Fees",
    merchantLogo: "💳",
    rawDescription: "STRIPE PROCESSING FEES FEB",
    amount: 312.47,
    accountId: "acc_biz_checking",
    category: "Stripe & Bank Fees",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 3_749.64,
    businessBucket: "high_roi",
    roiRating: 6,
    roiType: "overhead",
    reviewed: true,
    reviewedAt: "2026-02-28",
    rule: "Cost of doing business — Stripe fees track with revenue",
    isTransfer: false,
  },
  {
    id: "txn_biz_10",
    date: "2026-02-15",
    merchantName: "Mercury",
    merchantLogo: "🏦",
    rawDescription: "MERCURY BANK MONTHLY FEE",
    amount: 0,
    accountId: "acc_biz_checking",
    category: "Stripe & Bank Fees",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: false,
  },

  // -- Marketing --
  {
    id: "txn_biz_11",
    date: "2026-02-05",
    merchantName: "Facebook Ads",
    merchantLogo: "📢",
    rawDescription: "FACEBOOK ADS 8K2JF9",
    amount: 425.00,
    accountId: "acc_biz_ink",
    category: "Marketing",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 5_100.00,
    businessBucket: "high_roi",
    roiRating: 6,
    roiType: "money",
    reviewed: true,
    reviewedAt: "2026-02-06",
    isTransfer: false,
  },
  {
    id: "txn_biz_12",
    date: "2026-02-12",
    merchantName: "Flodesk",
    merchantLogo: "✉️",
    rawDescription: "FLODESK INC",
    amount: 38.00,
    accountId: "acc_biz_ink",
    category: "Marketing",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 456.00,
    businessBucket: "no_roi",
    noRoiReason: "Duplicate tool",
    reviewed: true,
    reviewedAt: "2026-02-13",
    rule: "Already using ConvertKit — Flodesk is redundant",
    isTransfer: false,
  },

  // -- Contract Labor --
  {
    id: "txn_biz_13",
    date: "2026-02-10",
    merchantName: "PayPal",
    merchantLogo: "💰",
    rawDescription: "PAYPAL *VA SERVICES",
    amount: 800.00,
    accountId: "acc_biz_checking",
    category: "Contract Labor",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 9_600.00,
    businessBucket: "high_roi",
    roiRating: 9,
    roiType: "time",
    reviewed: true,
    reviewedAt: "2026-02-11",
    rule: "VA handles scheduling, inbox, social — frees 15 hrs/week",
    isTransfer: false,
  },
  {
    id: "txn_biz_14",
    date: "2026-02-18",
    merchantName: "PayPal",
    merchantLogo: "💰",
    rawDescription: "PAYPAL *PODCAST EDITOR",
    amount: 250.00,
    accountId: "acc_biz_checking",
    category: "Contract Labor",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 3_000.00,
    businessBucket: "unsure",
    roiRating: 5,
    roiType: "time",
    reviewed: true,
    reviewedAt: "2026-02-19",
    isTransfer: false,
  },

  // -- Coaching & Professional Development --
  {
    id: "txn_biz_15",
    date: "2026-02-01",
    merchantName: "SBMS",
    merchantLogo: "🎓",
    rawDescription: "SBMS COACHING PROGRAM",
    amount: 450.00,
    accountId: "acc_biz_ink",
    category: "Coaching & Training",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 5_400.00,
    businessBucket: "high_roi",
    roiRating: 10,
    roiType: "money",
    reviewed: true,
    reviewedAt: "2026-02-02",
    rule: "Gina's program — directly grew revenue 40% last year",
    isTransfer: false,
  },
  {
    id: "txn_biz_16",
    date: "2026-02-15",
    merchantName: "Amazon",
    merchantLogo: "📦",
    rawDescription: "AMZN MKTP US*BOOKS",
    amount: 47.82,
    accountId: "acc_biz_ink",
    category: "Coaching & Training",
    isRecurring: false,
    businessBucket: "high_roi",
    roiRating: 6,
    roiType: "emotional",
    reviewed: true,
    reviewedAt: "2026-02-16",
    isTransfer: false,
  },

  // -- Insurance --
  {
    id: "txn_biz_17",
    date: "2026-02-01",
    merchantName: "Hiscox",
    merchantLogo: "🛡️",
    rawDescription: "HISCOX BUSINESS LIABILITY",
    amount: 89.00,
    accountId: "acc_biz_checking",
    category: "Insurance",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 1_068.00,
    businessBucket: "high_roi",
    roiRating: 6,
    roiType: "overhead",
    reviewed: true,
    reviewedAt: "2026-02-02",
    isTransfer: false,
  },

  // -- Office & Space --
  {
    id: "txn_biz_18",
    date: "2026-02-05",
    merchantName: "WeWork",
    merchantLogo: "🏢",
    rawDescription: "WEWORK HOT DESK MONTHLY",
    amount: 350.00,
    accountId: "acc_biz_ink",
    category: "Office & Space",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 4_200.00,
    businessBucket: "no_roi",
    noRoiReason: "Can work from home",
    reviewed: true,
    reviewedAt: "2026-02-06",
    isTransfer: false,
  },

  // -- Networking & Events --
  {
    id: "txn_biz_19",
    date: "2026-02-08",
    merchantName: "Eventbrite",
    merchantLogo: "🎟️",
    rawDescription: "EVENTBRITE *COACH CONF 2026",
    amount: 397.00,
    accountId: "acc_biz_ink",
    category: "Networking & Events",
    isRecurring: false,
    businessBucket: "high_roi",
    roiRating: 7,
    roiType: "emotional",
    reviewed: true,
    reviewedAt: "2026-02-09",
    isTransfer: false,
  },

  // -- Bookkeeping --
  {
    id: "txn_biz_20",
    date: "2026-02-15",
    merchantName: "QuickBooks",
    merchantLogo: "📗",
    rawDescription: "INTUIT *QBOOKS ONLINE",
    amount: 55.00,
    accountId: "acc_biz_ink",
    category: "Bookkeeping & Accounting",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 660.00,
    businessBucket: "unsure",
    roiRating: 4,
    roiType: "overhead",
    reviewed: true,
    reviewedAt: "2026-02-16",
    isTransfer: false,
  },

  // -- No ROI expenses --
  {
    id: "txn_biz_21",
    date: "2026-02-10",
    merchantName: "Shutterstock",
    merchantLogo: "📷",
    rawDescription: "SHUTTERSTOCK IMAGES",
    amount: 29.00,
    accountId: "acc_biz_ink",
    category: "Marketing",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 348.00,
    businessBucket: "no_roi",
    noRoiReason: "Canva has free images",
    reviewed: true,
    reviewedAt: "2026-02-11",
    isTransfer: false,
  },
  {
    id: "txn_biz_22",
    date: "2026-02-20",
    merchantName: "Loom",
    merchantLogo: "📹",
    rawDescription: "LOOM INC",
    amount: 12.50,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 150.00,
    businessBucket: "no_roi",
    noRoiReason: "Barely use it",
    reviewed: true,
    reviewedAt: "2026-02-21",
    isTransfer: false,
  },
  {
    id: "txn_biz_23",
    date: "2026-02-22",
    merchantName: "Grammarly",
    merchantLogo: "✏️",
    rawDescription: "GRAMMARLY INC",
    amount: 12.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 144.00,
    businessBucket: "no_roi",
    noRoiReason: "ChatGPT does this now",
    reviewed: true,
    reviewedAt: "2026-02-23",
    isTransfer: false,
  },

  // -- Personal purchase on business card (common pattern from P&L data) --
  {
    id: "txn_biz_24",
    date: "2026-02-09",
    merchantName: "Target",
    merchantLogo: "🎯",
    rawDescription: "TARGET 00012847",
    amount: 34.67,
    accountId: "acc_biz_ink",
    category: "Owners Distribution",
    isRecurring: false,
    reviewed: true,
    reviewedAt: "2026-02-10",
    rule: "Personal purchase on business card — track as owner's distribution",
    isTransfer: false,
  },
  {
    id: "txn_biz_25",
    date: "2026-02-17",
    merchantName: "Starbucks",
    merchantLogo: "☕",
    rawDescription: "STARBUCKS STORE #14872",
    amount: 6.45,
    accountId: "acc_biz_ink",
    category: "Owners Distribution",
    isRecurring: false,
    reviewed: true,
    reviewedAt: "2026-02-18",
    isTransfer: false,
  },

  // -- Debt Payment --
  {
    id: "txn_biz_26",
    date: "2026-02-01",
    merchantName: "Bluevine",
    merchantLogo: "🏦",
    rawDescription: "BLUEVINE SBA LOAN PAYMENT",
    amount: 485.00,
    accountId: "acc_biz_checking",
    category: "Debt Payment",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 5_820.00,
    reviewed: true,
    isTransfer: false,
  },

  // -- Estimated Tax Payment --
  {
    id: "txn_biz_27",
    date: "2026-02-15",
    merchantName: "IRS",
    merchantLogo: "🏛️",
    rawDescription: "IRS USATAXPYMT Q4 EST",
    amount: 2_800.00,
    accountId: "acc_biz_checking",
    category: "Estimated Taxes",
    isRecurring: false,
    reviewed: true,
    isTransfer: false,
  },

  // ═══════════════════════════════════════════════════════════
  // TRANSFERS
  // ═══════════════════════════════════════════════════════════

  // Owner's distribution (biz → personal)
  {
    id: "txn_xfer_01",
    date: "2026-02-23",
    merchantName: "Owners Distribution",
    merchantLogo: "💸",
    rawDescription: "OWNERS DISTRIBUTIONS - PAY",
    amount: 4_500.00,
    accountId: "acc_biz_checking",
    category: "Owners Distribution",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_xfer_02",
  },
  {
    id: "txn_xfer_02",
    date: "2026-02-23",
    merchantName: "Owners Distribution",
    merchantLogo: "💸",
    rawDescription: "MERCURY TRANSFER DEPOSIT",
    amount: -4_500.00,
    accountId: "acc_personal_checking",
    category: "Owners Distribution",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_xfer_01",
  },
  // Credit card payments
  {
    id: "txn_xfer_03",
    date: "2026-02-23",
    merchantName: "Capital One",
    merchantLogo: "🏦",
    rawDescription: "CAPITAL ONE CC PAYMENT",
    amount: 2_000.00,
    accountId: "acc_personal_checking",
    category: "Credit Card Payment",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_xfer_04",
  },
  {
    id: "txn_xfer_04",
    date: "2026-02-23",
    merchantName: "Capital One",
    merchantLogo: "🏦",
    rawDescription: "PAYMENT RECEIVED - THANK YOU",
    amount: -2_000.00,
    accountId: "acc_personal_freedom",
    category: "Credit Card Payment",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_xfer_03",
  },
  // Biz tax savings transfer
  {
    id: "txn_xfer_05",
    date: "2026-02-15",
    merchantName: "Mercury Transfer",
    merchantLogo: "🏦",
    rawDescription: "TRANSFER TO TAX SAVINGS",
    amount: 1_200.00,
    accountId: "acc_biz_checking",
    category: "Savings Transfer",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_xfer_06",
  },
  {
    id: "txn_xfer_06",
    date: "2026-02-15",
    merchantName: "Mercury Transfer",
    merchantLogo: "🏦",
    rawDescription: "TRANSFER FROM CHECKING",
    amount: -1_200.00,
    accountId: "acc_biz_savings",
    category: "Savings Transfer",
    isRecurring: true,
    recurringFrequency: "monthly",
    reviewed: true,
    isTransfer: true,
    linkedTransferId: "txn_xfer_05",
  },

  // ═══════════════════════════════════════════════════════════
  // PERSONAL EXPENSES — REVIEWED
  // ═══════════════════════════════════════════════════════════

  // -- Essential --
  {
    id: "txn_per_01",
    date: "2026-02-02",
    merchantName: "Trader Joe's",
    merchantLogo: "🛒",
    rawDescription: "TRADER JOE'S #123",
    amount: 87.43,
    accountId: "acc_personal_freedom",
    category: "Groceries",
    isRecurring: true,
    recurringFrequency: "weekly",
    annualProjection: 4_546.36,
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-03",
    rule: "Always categorize Trader Joe's as Groceries (Essential)",
    isTransfer: false,
  },
  {
    id: "txn_per_02",
    date: "2026-02-09",
    merchantName: "Trader Joe's",
    merchantLogo: "🛒",
    rawDescription: "TRADER JOE'S #123",
    amount: 62.18,
    accountId: "acc_personal_freedom",
    category: "Groceries",
    isRecurring: true,
    recurringFrequency: "weekly",
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-10",
    isTransfer: false,
  },
  {
    id: "txn_per_03",
    date: "2026-02-16",
    merchantName: "Costco",
    merchantLogo: "🛒",
    rawDescription: "COSTCO WHOLESALE #234",
    amount: 143.67,
    accountId: "acc_personal_freedom",
    category: "Groceries",
    isRecurring: false,
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-17",
    isTransfer: false,
  },
  {
    id: "txn_per_04",
    date: "2026-02-01",
    merchantName: "GEICO",
    merchantLogo: "🚗",
    rawDescription: "GEICO AUTO INSURANCE",
    amount: 148.00,
    accountId: "acc_personal_checking",
    category: "Insurance",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 1_776.00,
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-02",
    isTransfer: false,
  },
  {
    id: "txn_per_05",
    date: "2026-02-05",
    merchantName: "Shell",
    merchantLogo: "⛽",
    rawDescription: "SHELL OIL 57442",
    amount: 52.31,
    accountId: "acc_personal_freedom",
    category: "Auto & Gas",
    isRecurring: false,
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-06",
    isTransfer: false,
  },
  {
    id: "txn_per_06",
    date: "2026-02-19",
    merchantName: "Shell",
    merchantLogo: "⛽",
    rawDescription: "SHELL OIL 57442",
    amount: 48.76,
    accountId: "acc_personal_freedom",
    category: "Auto & Gas",
    isRecurring: false,
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-20",
    isTransfer: false,
  },
  {
    id: "txn_per_07",
    date: "2026-02-10",
    merchantName: "CVS Pharmacy",
    merchantLogo: "💊",
    rawDescription: "CVS/PHARMACY #04821",
    amount: 24.99,
    accountId: "acc_personal_freedom",
    category: "Health",
    isRecurring: false,
    personalBucket: "essential",
    reviewed: true,
    reviewedAt: "2026-02-11",
    isTransfer: false,
  },

  // -- Meaningful --
  {
    id: "txn_per_08",
    date: "2026-02-01",
    merchantName: "Orange Theory",
    merchantLogo: "💪",
    rawDescription: "ORANGETHEORY FITNESS",
    amount: 169.00,
    accountId: "acc_personal_freedom",
    category: "Health & Fitness",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 2_028.00,
    personalBucket: "meaningful",
    meaningRating: 9,
    meaningCategory: "Vitality & Health",
    reviewed: true,
    reviewedAt: "2026-02-02",
    rule: "OTF = non-negotiable. Physical health drives business energy.",
    isTransfer: false,
  },
  {
    id: "txn_per_09",
    date: "2026-02-14",
    merchantName: "Sugarfish",
    merchantLogo: "🍣",
    rawDescription: "SUGARFISH BY SUSHI NOZAWA",
    amount: 127.00,
    accountId: "acc_personal_amex",
    category: "Eating Out",
    isRecurring: false,
    personalBucket: "meaningful",
    meaningRating: 8,
    meaningCategory: "Connection",
    reviewed: true,
    reviewedAt: "2026-02-15",
    isTransfer: false,
  },
  {
    id: "txn_per_10",
    date: "2026-02-08",
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
    meaningRating: 6,
    meaningCategory: "Growth & Learning",
    reviewed: true,
    reviewedAt: "2026-02-09",
    isTransfer: false,
  },
  {
    id: "txn_per_11",
    date: "2026-02-08",
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
    meaningRating: 7,
    meaningCategory: "Vitality & Health",
    reviewed: true,
    reviewedAt: "2026-02-09",
    isTransfer: false,
  },
  {
    id: "txn_per_12",
    date: "2026-02-22",
    merchantName: "Southwest Airlines",
    merchantLogo: "✈️",
    rawDescription: "SOUTHWEST AIR 526-2720000",
    amount: 312.00,
    accountId: "acc_personal_amex",
    category: "Travel & Vacation",
    isRecurring: false,
    personalBucket: "meaningful",
    meaningRating: 9,
    meaningCategory: "Connection",
    reviewed: true,
    reviewedAt: "2026-02-23",
    isTransfer: false,
  },
  {
    id: "txn_per_13",
    date: "2026-02-12",
    merchantName: "Audible",
    merchantLogo: "🎧",
    rawDescription: "AUDIBLE US*MH4KR2",
    amount: 14.95,
    accountId: "acc_personal_freedom",
    category: "Subscriptions",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 179.40,
    personalBucket: "meaningful",
    meaningRating: 8,
    meaningCategory: "Growth & Learning",
    reviewed: true,
    reviewedAt: "2026-02-13",
    isTransfer: false,
  },

  // -- Mismatch --
  {
    id: "txn_per_14",
    date: "2026-02-11",
    merchantName: "Uber Eats",
    merchantLogo: "🍔",
    rawDescription: "UBER EATS PENDING",
    amount: 42.87,
    accountId: "acc_personal_freedom",
    category: "Eating Out",
    isRecurring: false,
    personalBucket: "mismatch",
    reviewed: true,
    reviewedAt: "2026-02-12",
    isTransfer: false,
  },
  {
    id: "txn_per_15",
    date: "2026-02-18",
    merchantName: "Uber Eats",
    merchantLogo: "🍔",
    rawDescription: "UBER EATS PENDING",
    amount: 38.54,
    accountId: "acc_personal_freedom",
    category: "Eating Out",
    isRecurring: false,
    personalBucket: "mismatch",
    reviewed: true,
    reviewedAt: "2026-02-19",
    isTransfer: false,
  },
  {
    id: "txn_per_16",
    date: "2026-02-06",
    merchantName: "Amazon",
    merchantLogo: "📦",
    rawDescription: "AMZN MKTP US*2K4F9H3",
    amount: 67.82,
    accountId: "acc_personal_freedom",
    category: "Shopping",
    isRecurring: false,
    personalBucket: "mismatch",
    reviewed: true,
    reviewedAt: "2026-02-07",
    isTransfer: false,
  },
  {
    id: "txn_per_17",
    date: "2026-02-20",
    merchantName: "Amazon",
    merchantLogo: "📦",
    rawDescription: "AMZN MKTP US*7H2KR9",
    amount: 43.21,
    accountId: "acc_personal_freedom",
    category: "Shopping",
    isRecurring: false,
    personalBucket: "mismatch",
    reviewed: true,
    reviewedAt: "2026-02-21",
    isTransfer: false,
  },
  {
    id: "txn_per_18",
    date: "2026-02-25",
    merchantName: "Sephora",
    merchantLogo: "💄",
    rawDescription: "SEPHORA.COM",
    amount: 89.00,
    accountId: "acc_personal_freedom",
    category: "Shopping",
    isRecurring: false,
    personalBucket: "mismatch",
    reviewed: true,
    reviewedAt: "2026-02-26",
    isTransfer: false,
  },

  // ═══════════════════════════════════════════════════════════
  // UNREVIEWED — Business (for swipe flow demo)
  // ═══════════════════════════════════════════════════════════
  {
    id: "txn_ubiz_01",
    date: "2026-02-26",
    merchantName: "Figma",
    merchantLogo: "🎨",
    rawDescription: "FIGMA INC",
    amount: 15.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 180.00,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_02",
    date: "2026-02-26",
    merchantName: "Notion",
    merchantLogo: "📝",
    rawDescription: "NOTION LABS INC",
    amount: 10.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 120.00,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_03",
    date: "2026-02-26",
    merchantName: "Squarespace",
    merchantLogo: "🌐",
    rawDescription: "SQUARESPACE INC",
    amount: 23.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 276.00,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_04",
    date: "2026-02-25",
    merchantName: "Riverside.fm",
    merchantLogo: "🎙️",
    rawDescription: "RIVERSIDE.FM INC",
    amount: 24.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 288.00,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_05",
    date: "2026-02-25",
    merchantName: "Honeybook",
    merchantLogo: "📋",
    rawDescription: "HONEYBOOK INC",
    amount: 16.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 192.00,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_06",
    date: "2026-02-24",
    merchantName: "Instagram Ads",
    merchantLogo: "📢",
    rawDescription: "INSTAGRAM ADS 4K2MR7",
    amount: 175.00,
    accountId: "acc_biz_ink",
    category: "Marketing",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_07",
    date: "2026-02-24",
    merchantName: "Vistaprint",
    merchantLogo: "🖨️",
    rawDescription: "VISTAPRINT.COM",
    amount: 89.47,
    accountId: "acc_biz_ink",
    category: "Marketing",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_08",
    date: "2026-02-22",
    merchantName: "Focusmate",
    merchantLogo: "⏱️",
    rawDescription: "FOCUSMATE INC",
    amount: 9.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 108.00,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_09",
    date: "2026-02-20",
    merchantName: "Hey.com",
    merchantLogo: "📧",
    rawDescription: "BASECAMP LLC HEY",
    amount: 11.00,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 132.00,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_10",
    date: "2026-02-18",
    merchantName: "Starbucks",
    merchantLogo: "☕",
    rawDescription: "STARBUCKS STORE #14872",
    amount: 5.75,
    accountId: "acc_biz_ink",
    category: "Meals & Entertainment",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_11",
    date: "2026-02-17",
    merchantName: "Microsoft",
    merchantLogo: "💻",
    rawDescription: "MICROSOFT *365",
    amount: 6.99,
    accountId: "acc_biz_ink",
    category: "Software",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 83.88,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_ubiz_12",
    date: "2026-02-15",
    merchantName: "Uber",
    merchantLogo: "🚗",
    rawDescription: "UBER BV TRIP",
    amount: 34.50,
    accountId: "acc_biz_ink",
    category: "Travel",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },

  // ═══════════════════════════════════════════════════════════
  // UNREVIEWED — Personal (for swipe flow demo)
  // ═══════════════════════════════════════════════════════════
  {
    id: "txn_uper_01",
    date: "2026-02-26",
    merchantName: "Whole Foods",
    merchantLogo: "🥑",
    rawDescription: "WHOLE FOODS MKT #10234",
    amount: 94.32,
    accountId: "acc_personal_freedom",
    category: "Groceries",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_uper_02",
    date: "2026-02-26",
    merchantName: "DoorDash",
    merchantLogo: "🍔",
    rawDescription: "DOORDASH *CHIPOTLE",
    amount: 28.43,
    accountId: "acc_personal_freedom",
    category: "Eating Out",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_uper_03",
    date: "2026-02-25",
    merchantName: "Zara",
    merchantLogo: "👗",
    rawDescription: "ZARA USA INC",
    amount: 127.80,
    accountId: "acc_personal_freedom",
    category: "Shopping",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_uper_04",
    date: "2026-02-25",
    merchantName: "Sweetgreen",
    merchantLogo: "🥗",
    rawDescription: "SWEETGREEN #042",
    amount: 16.82,
    accountId: "acc_personal_freedom",
    category: "Eating Out",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_uper_05",
    date: "2026-02-24",
    merchantName: "Peloton",
    merchantLogo: "🚴",
    rawDescription: "ONEPELOTON.COM",
    amount: 44.00,
    accountId: "acc_personal_freedom",
    category: "Health & Fitness",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 528.00,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_uper_06",
    date: "2026-02-23",
    merchantName: "Hulu",
    merchantLogo: "📺",
    rawDescription: "HULU *LIVE TV",
    amount: 17.99,
    accountId: "acc_personal_freedom",
    category: "Subscriptions",
    isRecurring: true,
    recurringFrequency: "monthly",
    annualProjection: 215.88,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_uper_07",
    date: "2026-02-22",
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
  {
    id: "txn_uper_08",
    date: "2026-02-21",
    merchantName: "HomeGoods",
    merchantLogo: "🏠",
    rawDescription: "HOMEGOODS #0472",
    amount: 63.14,
    accountId: "acc_personal_freedom",
    category: "Shopping",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_uper_09",
    date: "2026-02-20",
    merchantName: "Trader Joe's",
    merchantLogo: "🛒",
    rawDescription: "TRADER JOE'S #123",
    amount: 71.23,
    accountId: "acc_personal_freedom",
    category: "Groceries",
    isRecurring: true,
    recurringFrequency: "weekly",
    reviewed: false,
    isTransfer: false,
  },
  {
    id: "txn_uper_10",
    date: "2026-02-19",
    merchantName: "BP Gas",
    merchantLogo: "⛽",
    rawDescription: "BP#4827103",
    amount: 45.67,
    accountId: "acc_personal_freedom",
    category: "Auto & Gas",
    isRecurring: false,
    reviewed: false,
    isTransfer: false,
  },
];

// ─── Cash Flow Summary ──────────────────────────────────────
// Feb 2026: $11,438 collected, ~$5,300 biz expenses, ~$2,100 personal

export const cashFlowSummary: CashFlowSummary = {
  cashCollected: 11_438,
  businessExpenses: 5_342,
  personalExpenses: 2_107,
  taxesHeld: 2_800,
  horizonFunds: 1_200,
  estimatedProfit: 3_189,
  avgMonthlyCashCollected: 10_200,
  avgMonthlyBusinessExp: 4_800,
  avgMonthlyPersonalExp: 1_950,
  savingsRate: 22.4,
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
