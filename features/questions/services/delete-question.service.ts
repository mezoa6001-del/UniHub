import {
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { QUESTIONS_COLLECTION } from "../constants";

export async function deleteQuestion(
  questionId: string
) {
  await deleteDoc(
    doc(db, QUESTIONS_COLLECTION, questionId)
  );
}