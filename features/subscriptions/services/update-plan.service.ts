import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type { CurrentUser } from "@/features/shared/types";

import { PLANS_COLLECTION } from "../constants";
import {
  createPlanSchema,
  type CreatePlanInput,
} from "../schemas";

export async function updatePlan(
  planId: string,
  input: CreatePlanInput,
  currentUser: CurrentUser
) {
  const data = createPlanSchema.parse(input);

  await updateDoc(doc(db, PLANS_COLLECTION, planId), {
    title: data.title.trim(),
    description: data.description?.trim() ?? "",
    price: data.price,
    currency: data.currency,
    interval: data.interval,
    durationDays: data.durationDays,
    access: data.access,
    isActive: data.isActive,
    sortOrder: data.sortOrder,

    updatedBy: currentUser.uid,
    updatedAt: serverTimestamp(),
  });
}