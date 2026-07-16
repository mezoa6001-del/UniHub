import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { COURSES_COLLECTION } from "../constants";
import { updateCourseSchema } from "../validators/update-course.schema";

export async function updateCourse(
  courseId: string,
  input: unknown,
  currentUser: CurrentUser
) {
  const data = updateCourseSchema.parse(input);

  const payload = {
    ...data,
    updatedBy: currentUser.uid,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(
    doc(db, COURSES_COLLECTION, courseId),
    payload
  );
}