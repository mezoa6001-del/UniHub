"use client";

import { useMemo, useState } from "react";

import type { Course } from "../types";

export function useCourseFilters(courses: Course[]) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "all" | "draft" | "published"
  >("all");

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        query === "" ||
        course.title.toLowerCase().includes(query) ||
        course.slug.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" || course.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [courses, search, status]);

  return {
    search,
    status,

    setSearch,
    setStatus,

    filteredCourses,
  };
}