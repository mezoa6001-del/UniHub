import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type { CurrentUser } from "@/features/shared/types";

import { PLANS_COLLECTION } from "../constants";

export async function deletePlan(
  planId: string,
  currentUser: CurrentUser
) {
  await updateDoc(doc(db, PLANS_COLLECTION, planId), {
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid,
    isActive: false,
  });
}