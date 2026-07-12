"use client";

import { useState } from "react";

import type { CurrentUser } from "@/features/shared/types/auth.types";

import { createCourse } from "../services";
import type { CreateCourseInput } from "../validators/create-course.schema";

export function useCreateCourse(currentUser: CurrentUser) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(data: CreateCourseInput) {
    setIsLoading(true);
    setError(null);

    try {
      console.group("🚀 Create Course");

      console.log("Current User:", currentUser);
      console.log("Form Data:", data);

      const course = await createCourse(data, currentUser);

      console.log("Firestore Result:", course);

      console.groupEnd();

      return course;
    } catch (err) {
      console.groupEnd();

      console.error("❌ Failed to create course", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to create course.";

      setError(message);

      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    submit,
    isLoading,
    error,
  };
}