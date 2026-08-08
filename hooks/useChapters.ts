"use client";

import { useEffect, useState } from "react";

import { getChapters } from "@/lib/firebase/firestore";
import type { ChapterDoc } from "@/types";

export function useChapters() {
  const [chapters, setChapters] = useState<ChapterDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const data = await getChapters();

        if (!mounted) return;

        setChapters(data);
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
    chapters,
    loading,
  };
}