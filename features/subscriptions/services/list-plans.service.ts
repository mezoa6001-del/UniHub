import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { PLANS_COLLECTION } from "../constants";

export async function listPlans() {
  const snapshot = await getDocs(
    query(
      collection(db, PLANS_COLLECTION),
      where("deletedAt", "==", null),
      orderBy("sortOrder", "asc")
    )
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}