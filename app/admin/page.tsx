"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getChapters } from "@/lib/firebase/firestore";
import { StatsCard, Spinner } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

import { useState } from "react";

async function getAdminQuestionsCount() {
  const { getQuestions } = await import("@/lib/firebase/firestore");
  const qs = await getQuestions();
  return qs.length;
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { loading, isAdmin } = useAuth();

  const [stats, setStats] = useState({
    chapters: 0,
    questions: 0,
  });

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;

    Promise.all([
      getChapters(),
      getAdminQuestionsCount(),
    ])
      .then(([ch, qCount]) =>
        setStats({
          chapters: ch.length,
          questions: qCount,
        })
      )
      .finally(() => setPageLoading(false));
  }, [isAdmin]);

  if (loading || pageLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={40} />
      </div>
    );
  }

  const cards = [
    { href: "/admin/questions", icon: "📝", label: "Questions", value: stats.questions, color: "#2FA084" },
    { href: "/admin/chapters", icon: "📚", label: "Chapters", value: stats.chapters, color: "#3B82F6" },
    { href: "/admin/flashcards", icon: "⚡", label: "Flashcards", value: "Manage", color: "#8B5CF6" },
    { href: "/admin/videos", icon: "🎥", label: "Videos", value: "Manage", color: "#EF4444" },
    { href: "/admin/users", icon: "👥", label: "Users", value: "Manage", color: "#F59E0B" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-7 border border-white/8">
        <h1 className="text-xl font-extrabold text-white">
          🛡️ Admin Dashboard
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Manage Pharma Core content — by Dr. Mazen Ashraf
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <StatsCard
              icon={c.icon}
              label={c.label}
              value={c.value}
              color={c.color}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}