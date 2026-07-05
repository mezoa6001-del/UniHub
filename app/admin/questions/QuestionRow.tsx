"use client";

import type { QuestionDoc } from "@/types";

type Props = {
  question: QuestionDoc;
  onEdit: (question: QuestionDoc) => void;
  onDelete: (question: QuestionDoc) => void;
};

export default function QuestionRow({
  question,
  onEdit,
  onDelete,
}: Props) {
  const difficultyColors = {
    easy: "bg-emerald-500/20 text-emerald-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    hard: "bg-red-500/20 text-red-400",
  };

  return (
    <tr className="border-t border-slate-800 hover:bg-white/5 transition">
      <td className="px-4 py-4">
        <input type="checkbox" />
      </td>

      <td className="px-4 py-4">
        <p className="text-white line-clamp-2 font-medium">
          {question.text}
        </p>
      </td>

      <td className="px-4 py-4">
        <span className="text-slate-300">
          {question.chapterName}
        </span>
      </td>

      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            difficultyColors[question.difficulty]
          }`}
        >
          {question.difficulty}
        </span>
      </td>

      <td className="px-4 py-4 text-right space-x-2">
        <button
          onClick={() => onEdit(question)}
          className="rounded-lg border border-blue-500/30 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(question)}
          className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
