export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_PROVIDERS = {
  PAYMOB: "paymob",
  STRIPE: "stripe",
  MANUAL: "manual",
} as const;

export const PAYMENT_TARGET_TYPES = {
  SUBSCRIPTION: "subscription",
  COURSE: "course",
  BUNDLE: "bundle",
  BOOK: "book",
} as const;