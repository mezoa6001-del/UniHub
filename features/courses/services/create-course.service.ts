import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { COURSES_COLLECTION } from "../constants";
import { createCourseSchema } from "../validators/create-course.schema";

export async function createCourse(
  input: unknown,
  currentUser: CurrentUser
) {
  const data = createCourseSchema.parse(input);

  const courseData = {
    title: data.title.trim(),
    slug: data.slug.trim().toLowerCase(),
    description: data.description.trim(),

    thumbnailUrl: data.thumbnailUrl ?? "",

    ownerId: currentUser.uid,

    instructorIds:
      data.instructorIds.length > 0
        ? data.instructorIds
        : [currentUser.uid],

    status: data.status,

    createdBy: currentUser.uid,
    updatedBy: currentUser.uid,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    deletedAt: null,
  };

  console.group("📚 Firestore Create Course");
  console.log("Collection:", COURSES_COLLECTION);
  console.log("Payload:", courseData);

  const docRef = await addDoc(
    collection(db, COURSES_COLLECTION),
    courseData
  );

  console.log("Document ID:", docRef.id);
  console.groupEnd();

  return {
    id: docRef.id,
    slug: courseData.slug,
  };
}