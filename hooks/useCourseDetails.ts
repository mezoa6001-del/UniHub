"use client";

import { useEffect, useState } from "react";

import {
  getCourseById,
  getChaptersByCourse,
} from "@/lib/firebase/firestore";

import type {
  ChapterDoc,
  CourseDoc,
} from "@/types";

type UseCourseDetailsResult = {
  course: CourseDoc | null;
  chapters: ChapterDoc[];
  loading: boolean;
};

export function useCourseDetails(
  courseId: string
): UseCourseDetailsResult {
  const [course, setCourse] = useState<CourseDoc | null>(null);
  const [chapters, setChapters] = useState<ChapterDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);

      const [courseData, chapterData] = await Promise.all([
        getCourseById(courseId),
        getChaptersByCourse(courseId),
      ]);

      setCourse(courseData);
      setChapters(chapterData);

      setLoading(false);
    }

    load();
  }, [courseId]);

  return {
    course,
    chapters,
    loading,
  };
}