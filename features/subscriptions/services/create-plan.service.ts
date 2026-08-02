import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type { CurrentUser } from "@/features/shared/types";

import { PLANS_COLLECTION } from "../constants";
import {
  createPlanSchema,
  type CreatePlanInput,
} from "../schemas";

export async function createPlan(
  input: CreatePlanInput,
  currentUser: CurrentUser
) {
  const data = createPlanSchema.parse(input);

  const planData = {
    title: data.title.trim(),
    description: data.description?.trim() ?? "",
    price: data.price,
    currency: data.currency,
    interval: data.interval,
    durationDays: data.durationDays,
    access: data.access,
    isActive: data.isActive,
    sortOrder: data.sortOrder,

    createdBy: currentUser.uid,
    updatedBy: currentUser.uid,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    deletedAt: null,
  };

  const docRef = await addDoc(
    collection(db, PLANS_COLLECTION),
    planData
  );

  return {
    id: docRef.id,
  };
}