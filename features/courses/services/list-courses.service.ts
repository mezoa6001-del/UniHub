import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { COURSES_COLLECTION } from "../constants";
import type { Course } from "../types";

export async function listCourses(): Promise<Course[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COURSES_COLLECTION),
      orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,

      title: data.title ?? "",
      slug: data.slug ?? "",
      description: data.description ?? "",

      thumbnailUrl: data.thumbnailUrl ?? "",

      ownerId: data.ownerId ?? "",
      instructorIds: data.instructorIds ?? [],

      status: data.status ?? "draft",

      createdBy: data.createdBy ?? "",
      updatedBy: data.updatedBy ?? "",

      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
      deletedAt: data.deletedAt ?? null,
    };
  });
}