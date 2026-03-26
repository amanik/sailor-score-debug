/**
 * Category-based Lucide icon mapping for merchant display.
 * Covers both business (SBMS P&L structure) and personal categories.
 */
import {
  Monitor,
  Megaphone,
  Users,
  ShoppingCart,
  Utensils,
  CreditCard,
  Plane,
  Heart,
  ShoppingBag,
  Car,
  Shield,
  ArrowDownCircle,
  Wallet,
  Receipt,
  Building2,
  Pill,
  GraduationCap,
  BookOpen,
  Ticket,
  Calculator,
  Landmark,
  Banknote,
  Coffee,
  Mic,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const categoryIconMap: Record<string, LucideIcon> = {
  // Business expenses
  Software: Monitor,
  Marketing: Megaphone,
  "Contract Labor": Users,
  "Coaching & Training": GraduationCap,
  "Networking & Events": Ticket,
  "Office & Space": Building2,
  Insurance: Shield,
  "Bookkeeping & Accounting": BookOpen,
  "Stripe & Bank Fees": CreditCard,
  Travel: Plane,
  "Meals & Entertainment": Coffee,
  "Debt Payment": Banknote,
  "Estimated Taxes": Landmark,
  "Owners Distribution": Wallet,
  "Credit Card Payment": CreditCard,
  "Savings Transfer": ArrowDownCircle,
  // Personal expenses
  Groceries: ShoppingCart,
  "Eating Out": Utensils,
  Subscriptions: CreditCard,
  "Travel & Vacation": Plane,
  "Health & Fitness": Heart,
  Shopping: ShoppingBag,
  "Auto & Gas": Car,
  Health: Pill,
  // Revenue categories
  "Coaching Revenue": UsersRound,
  "Group Program Revenue": UsersRound,
  "Course Revenue": GraduationCap,
  "Speaking Revenue": Mic,
  // Legacy / fallback
  "Stripe Deposits": ArrowDownCircle,
};

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIconMap[category] ?? Receipt;
}
