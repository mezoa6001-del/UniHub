"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // انتظر تحميل الـ profile
    if (!profile) return;

    if (!isAdmin) {
      router.replace("/");
    }
  }, [user, profile, loading, isAdmin, router]);

  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#0A1628]">
      <Sidebar />
      <div className="ml-[230px] flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}