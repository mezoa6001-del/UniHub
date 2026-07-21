import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { QUESTIONS_COLLECTION } from "../constants";
import type { Question } from "../types";

export async function listQuestions(
  chapterId: string
): Promise<Question[]> {
  const q = query(
    collection(db, QUESTIONS_COLLECTION),
    where("chapterId", "==", chapterId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Question[];
}