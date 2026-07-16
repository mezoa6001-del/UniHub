import {
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { COURSES_COLLECTION } from "../constants";

export async function deleteCourse(
  courseId: string,
  currentUser: CurrentUser
) {
  if (!currentUser.uid) {
    throw new Error("Unauthorized.");
  }

  await deleteDoc(
    doc(db, COURSES_COLLECTION, courseId)
  );
}