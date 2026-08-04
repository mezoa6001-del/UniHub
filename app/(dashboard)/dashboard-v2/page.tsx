"use client";

import DashboardHero from "@/components/dashboard/DashboardHero";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardV2() {
  const { profile, sub } = useAuth();

  return (
    <div className="space-y-8">
      <DashboardHero
        profile={profile}
        subscription={sub}
      />
    </div>
  );
}