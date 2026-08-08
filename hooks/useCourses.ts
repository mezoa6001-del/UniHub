"use client";

import { useEffect, useState } from "react";

import type { CourseDoc } from "@/types";
import { getCourses } from "@/lib/firebase/firestore";

export function useCourses() {
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getCourses();

        if (!mounted) return;

        setCourses(data);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    courses,
    loading,
  };
}