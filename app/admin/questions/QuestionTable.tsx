"use client";

import { EmptyState } from "@/components/ui";
import type { QuestionDoc } from "@/types";
import QuestionRow from "./QuestionRow";

type Props = {
  questions: QuestionDoc[];
  onEdit: (question: QuestionDoc) => void;
  onDelete: (question: QuestionDoc) => void;
};

export default function QuestionTable({
  questions,
  onEdit,
  onDelete,
}: Props) {
  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/8 bg-navy-card">
        <EmptyState
          icon="?"
          title="No matching questions"
          desc="Adjust the filters to show more results"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111C2D]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#162338]">
            <tr>
              <th className="w-12 px-4 py-4">
                <input type="checkbox" />
              </th>

              <th className="px-4 py-4 text-left text-xs uppercase text-slate-400">
                Question
              </th>

              <th className="px-4 py-4 text-left text-xs uppercase text-slate-400">
                Chapter
              </th>

              <th className="px-4 py-4 text-left text-xs uppercase text-slate-400">
                Difficulty
              </th>

              <th className="px-4 py-4 text-right text-xs uppercase text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {questions.map((question) => (
              <QuestionRow
                key={question.id}
                question={question}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
