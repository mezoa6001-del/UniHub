import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { QUESTIONS_COLLECTION } from "../constants";
import {
  createQuestionSchema,
} from "../validators";

export async function createQuestion(
  input: unknown,
  currentUser: CurrentUser
) {
  const data = createQuestionSchema.parse(input);

  const payload = {
    ...data,
    createdBy: currentUser.uid,
    updatedBy: currentUser.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, QUESTIONS_COLLECTION),
    payload
  );

  return {
    id: docRef.id,
    ...data,
  };
}