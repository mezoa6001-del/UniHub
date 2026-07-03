"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/utils/formatters";

const TITLES: Record<string, string> = {
  "/":                "Dashboard",
  "/qbank":           "Question Bank",
  "/flashcards":      "Flashcards",
  "/videos":          "Videos",
  "/analytics":       "Analytics",
  "/leaderboard":     "Leaderboard",
  "/bookmarks":       "Bookmarks",
  "/wrong-questions": "Wrong Questions",
  "/subscription":    "Subscription",
  "/admin":           "Admin Overview",
  "/admin/questions": "Manage Questions",
  "/admin/chapters":  "Manage Chapters",
  "/admin/flashcards":"Manage Flashcards",
  "/admin/videos":    "Manage Videos",
  "/admin/users":     "Manage Users",
};

export function Topbar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const title = Object.entries(TITLES).find(([k]) => pathname === k || pathname.startsWith(k + "/"))?.[1] ?? "Pharma Core";

  return (
    <header className="sticky top-0 z-30 h-[58px] bg-[#0A1628] border-b border-white/7 flex items-center px-6 gap-4">
      <h2 className="text-[16px] font-bold text-white flex-1">{title}</h2>
      <div className="flex items-center gap-3">
        {(profile?.streak ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-500/10 rounded-full px-3 py-1">
            <span className="text-sm">🔥</span>
            <span className="text-[13px] font-bold text-orange-400">{profile?.streak}</span>
          </div>
        )}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-[11px] font-bold text-white">
          {initials(profile?.displayName ?? "PC")}
        </div>
      </div>
    </header>
  );
}
