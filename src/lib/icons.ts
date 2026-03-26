/**
 * Category-based Lucide icon mapping for merchant display.
 * Replaces all decorative emoji with semantic icons.
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
  type LucideIcon,
} from "lucide-react";

const categoryIconMap: Record<string, LucideIcon> = {
  Software: Monitor,
  Marketing: Megaphone,
  "Contract Labor": Users,
  Groceries: ShoppingCart,
  "Eating Out": Utensils,
  Subscriptions: CreditCard,
  "Travel & Vacation": Plane,
  "Health & Fitness": Heart,
  Shopping: ShoppingBag,
  "Auto & Gas": Car,
  Insurance: Shield,
  "Stripe Deposits": ArrowDownCircle,
  "Owners Distribution": Wallet,
  "Office & Space": Building2,
  "Credit Card Payment": CreditCard,
  Health: Pill,
};

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIconMap[category] ?? Receipt;
}
