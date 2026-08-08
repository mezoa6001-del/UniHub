"use client";

import { useCallback, useEffect, useState } from "react";

import { getDashboardData } from "../services";
import type { DashboardData } from "../types";

const emptyDashboardData: DashboardData = {
  counts: {
    courses: 0,
    chapters: 0,
    videos: 0,
    questions: 0,
    flashcards: 0,
    users: 0,
  },
  recentActivity: [],
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(emptyDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setData(await getDashboardData());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load the dashboard."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, isLoading, reload };
}
