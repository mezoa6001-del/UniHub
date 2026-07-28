import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { PLANS_COLLECTION } from "../constants";

export async function getPlan(planId: string) {
  const snapshot = await getDoc(
    doc(db, PLANS_COLLECTION, planId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}