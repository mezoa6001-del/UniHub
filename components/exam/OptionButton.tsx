"use client";
import type { QuestionOption, AttemptAnswer } from "@/types";

interface Props {
  option:      QuestionOption;
  correctId:   string;
  answered?:   AttemptAnswer;
  onSelect:    (id: string) => void;
}

export function OptionButton({ option, correctId, answered, onSelect }: Props) {
  let bg = "transparent", border = "rgba(255,255,255,0.08)", color = "white";
  if (answered) {
    if (option.id === correctId) { bg = "#2FA08418"; border = "#2FA084"; color = "#2FA084"; }
    else if (option.id === answered.selected && answered.selected !== correctId) { bg = "#EF444418"; border = "#EF4444"; color = "#EF4444"; }
  }
  return (
    <button onClick={() => onSelect(option.id)}
      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
      style={{ background: bg, borderColor: border, cursor: answered ? "default" : "pointer" }}>
      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-extrabold border-2"
        style={{ borderColor: border, background: answered ? border + "25" : "rgba(255,255,255,0.06)", color }}>
        {option.id.toUpperCase()}
      </div>
      <span className="text-[14px]" style={{ color, flex: 1 }}>{option.text}</span>
      {answered && option.id === correctId && <span>✅</span>}
      {answered && option.id === answered.selected && answered.selected !== correctId && <span>❌</span>}
    </button>
  );
}
