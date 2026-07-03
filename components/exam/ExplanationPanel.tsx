"use client";
import type { QuestionDoc, AttemptAnswer } from "@/types";

interface Props {
  question: QuestionDoc;
  answered: AttemptAnswer;
}

export function ExplanationPanel({ question, answered }: Props) {
  if (!question.explanation) return null;
  return (
    <div className="bg-navy-card rounded-2xl p-6 border border-white/8 animate-fade-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: answered.correct ? "#2FA08420" : "#EF444420" }}>
          {answered.correct ? "✅" : "❌"}
        </div>
        <span className="font-bold text-[15px]" style={{ color: answered.correct ? "#2FA084" : "#EF4444" }}>
          {answered.correct ? "Correct!" : "Incorrect — see explanation below"}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{question.explanation}</p>
      {question.references?.length > 0 && (
        <div className="mt-4 p-3 bg-white/3 rounded-xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">References</p>
          {question.references.map((r, i) => (
            <p key={i} className="text-xs text-blue-400">📖 {r}</p>
          ))}
        </div>
      )}
    </div>
  );
}
