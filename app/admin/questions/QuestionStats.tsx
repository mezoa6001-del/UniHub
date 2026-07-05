"use client";

import type { QuestionDoc } from "@/types";

type Props = {
  questions: QuestionDoc[];
  visibleCount: number;
};

export default function QuestionStats({
  questions,
  visibleCount,
}: Props) {
  const easy = questions.filter((q) => q.difficulty === "easy").length;
  const medium = questions.filter((q) => q.difficulty === "medium").length;
  const hard = questions.filter((q) => q.difficulty === "hard").length;

  const stats = [
    { label: "Total", value: questions.length, color: "text-white" },
    { label: "Showing", value: visibleCount, color: "text-blue-400" },
    { label: "Easy", value: easy, color: "text-emerald-400" },
    { label: "Medium", value: medium, color: "text-yellow-400" },
    { label: "Hard", value: hard, color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/8 bg-navy-card p-4"
        >
          <div className={`text-2xl font-extrabold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
