import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { QUESTIONS_COLLECTION } from "../constants";
import {
  updateQuestionSchema,
} from "../validators";

export async function updateQuestion(
  questionId: string,
  input: unknown
) {
  const data = updateQuestionSchema.parse(input);

  await updateDoc(
    doc(db, QUESTIONS_COLLECTION, questionId),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );

  return {
    id: questionId,
    ...data,
  };
}