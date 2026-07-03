"use client";
import { formatTime } from "@/lib/utils/formatters";

export function ExamTimer({ seconds }: { seconds: number }) {
  return (
    <span className="bg-secondary/10 text-secondary text-sm font-bold px-3 py-1 rounded-lg whitespace-nowrap">
      ⏱ {formatTime(seconds)}
    </span>
  );
}
