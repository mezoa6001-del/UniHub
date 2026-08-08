"use client";

import { useEffect, useState } from "react";

import { getResumeLearning } from "@/lib/learning";
import type { StudyProgressDoc } from "@/types";

export function useResumeLearning(userId?: string) {
  const [resume, setResume] =
    useState<StudyProgressDoc | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!userId) {
    setResume(null);
    setLoading(false);
    return;
  }

  const safeUserId = userId;

  async function load() {
    try {
      setLoading(true);

     const data = await getResumeLearning(userId!);
      setResume(data);
    } finally {
      setLoading(false);
    }
  }

  load();
}, [userId]);

  return {
    resume,
    loading,
  };
}