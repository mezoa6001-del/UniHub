import { z } from "zod";

import {
  PLAN_INTERVALS,
  SUBSCRIPTION_STATUS,
} from "../constants";

/* ============================================================================
 * Plan Access
 * ========================================================================== */

export const planAccessSchema = z.object({
  allCourses: z.boolean(),

  courseIds: z.array(z.string().trim()).default([]),
});

/* ============================================================================
 * Create Plan
 * ========================================================================== */

export const createPlanSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),

  price: z
    .number({
      invalid_type_error: "Price must be a number.",
    })
    .min(0),

  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a 3-letter ISO code.")
    .transform((value) => value.toUpperCase()),

  interval: z.enum([
    PLAN_INTERVALS.MONTHLY,
    PLAN_INTERVALS.TERM,
    PLAN_INTERVALS.YEARLY,
    PLAN_INTERVALS.LIFETIME,
  ]),

  durationDays: z
    .number({
      invalid_type_error: "Duration must be a number.",
    })
    .int()
    .min(1),

  access: planAccessSchema,

  isActive: z.boolean().default(true),

  sortOrder: z.number().int().min(0).default(0),
});

/* ============================================================================
 * Update Plan
 * ========================================================================== */

export const updatePlanSchema = createPlanSchema.partial();

/* ============================================================================
 * Create Subscription
 * ========================================================================== */

export const createSubscriptionSchema = z.object({
  userId: z.string().trim().min(1),

  planId: z.string().trim().min(1),

  status: z
    .enum([
      SUBSCRIPTION_STATUS.PENDING,
      SUBSCRIPTION_STATUS.ACTIVE,
      SUBSCRIPTION_STATUS.EXPIRED,
      SUBSCRIPTION_STATUS.CANCELLED,
    ])
    .default(SUBSCRIPTION_STATUS.PENDING),

  autoRenew: z.boolean().default(false),
});

/* ============================================================================
 * Types
 * ========================================================================== */

export type CreatePlanInput = z.input<typeof createPlanSchema>;
export type CreatePlanData = z.output<typeof createPlanSchema>;

export type UpdatePlanInput = z.input<typeof updatePlanSchema>;
export type UpdatePlanData = z.output<typeof updatePlanSchema>;

export type CreateSubscriptionInput = z.input<
  typeof createSubscriptionSchema
>;
export type CreateSubscriptionData = z.output<
  typeof createSubscriptionSchema
>;