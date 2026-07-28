import type { Timestamp } from "firebase/firestore";

import type {
  ActivatableEntity,
  BaseEntity,
  SortableEntity,
} from "@/features/shared/types";

import { PLAN_INTERVALS } from "../constants/plan.constants";

import { SUBSCRIPTION_STATUS } from "../constants/subscription.constants";

import {
  PAYMENT_PROVIDERS,
  PAYMENT_STATUS,
  PAYMENT_TARGET_TYPES,
} from "../constants/payment.constants";

export type PlanInterval =
  (typeof PLAN_INTERVALS)[keyof typeof PLAN_INTERVALS];

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export type PaymentProvider =
  (typeof PAYMENT_PROVIDERS)[keyof typeof PAYMENT_PROVIDERS];

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type PaymentTargetType =
  (typeof PAYMENT_TARGET_TYPES)[keyof typeof PAYMENT_TARGET_TYPES];

export interface PlanAccess {
  allCourses: boolean;
  courseIds: string[];
}

export interface Plan
  extends BaseEntity,
    ActivatableEntity,
    SortableEntity {
  title: string;
  description?: string;
  price: number;
  currency: string;
  interval: PlanInterval;
  durationDays: number;
  access: PlanAccess;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Subscription extends BaseEntity {
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startsAt: Timestamp;
  expiresAt: Timestamp;
  autoRenew: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaymentTarget {
  type: PaymentTargetType;
  targetId: string;
}

export interface Payment extends BaseEntity {
  userId: string;
  target: PaymentTarget;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;

  transactionId?: string;
  paymentReference?: string;
  metadata?: Record<string, unknown>;

  paidAt?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}