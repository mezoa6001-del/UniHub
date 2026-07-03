"use client";
import { Badge } from "@/components/ui";
import { difficultyColor } from "@/lib/utils/formatters";
import type { QuestionDoc } from "@/types";

interface Props {
  question:   QuestionDoc;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

export function QuestionCard({ question, bookmarked, onToggleBookmark }: Props) {
  return (
    <div className="bg-navy-card rounded-2xl p-7 border border-white/8">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex gap-2 flex-wrap">
          {question.chapterName && <Badge color="#3B82F6">{question.chapterName}</Badge>}
          {question.difficulty  && <Badge color={difficultyColor(question.difficulty)}>{question.difficulty}</Badge>}
        </div>
        <button onClick={onToggleBookmark}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
          style={{
            background:  bookmarked ? "#2FA084" : "transparent",
            borderColor: bookmarked ? "#2FA084" : "rgba(255,255,255,0.15)",
            color:       bookmarked ? "#fff" : "#7A99BB",
          }}>
          {bookmarked ? "🔖 Saved" : "🔖 Save"}
        </button>
      </div>
      <p className="text-[15px] leading-relaxed text-white font-medium">{question.text}</p>
    </div>
  );
}
