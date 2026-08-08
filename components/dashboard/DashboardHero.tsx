"use client";

import Link from "next/link";
import type { UserDoc, SubscriptionDoc } from "@/types";
import { tsToDate } from "@/lib/utils/formatters";

type Props = {
  profile: UserDoc | null;
  subscription: SubscriptionDoc | null;
};

export default function DashboardHero({
  profile,
  subscription,
}: Props) {
  const firstName =
    profile?.displayName?.split(" ")[0] ?? "Student";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B132B] via-[#13203D] to-[#1A2C4F] p-8">

      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="relative z-10">

        <span className="inline-flex items-center rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-300">
          UniHub
        </span>

        <h1 className="mt-5 text-4xl font-black text-white">
          Welcome back, {firstName} 👋
        </h1>

        <p className="mt-3 max-w-2xl text-slate-300">
          Continue your learning journey and become a master in every module.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <Link
            href="/courses"
            className="rounded-xl bg-gradient-to-r from-primary-500 to-secondary px-6 py-3 font-bold text-white transition hover:scale-[1.02]"
          >
            Continue Learning →
          </Link>

          <Link
            href="/qbank"
            className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
          >
            Quick Exam
          </Link>

        </div>

        <div className="mt-8 flex flex-wrap gap-8">

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Subscription
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              {subscription?.isActive
                ? "Active"
                : "Inactive"}
            </p>

            {subscription?.isActive && subscription.expiresAt && (
              <p className="text-xs text-slate-400">
                Expires{" "}
                {tsToDate(subscription.expiresAt as any)?.toLocaleDateString()}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Questions Solved
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              {(profile?.questionsAnswered ?? 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Total Score
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              {(profile?.totalScore ?? 0).toLocaleString()}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}