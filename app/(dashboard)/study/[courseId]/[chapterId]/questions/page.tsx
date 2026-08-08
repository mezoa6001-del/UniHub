"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getQuestions } from "@/lib/firebase/firestore";
import { useExamStore } from "@/store/examStore";
export default function QuestionsPage() {
  const router = useRouter();
  const { startSession } = useExamStore();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;

  async function handleStartExam() {
  try {
    setLoading(true);

    const questions = await getQuestions(chapterId);

    if (questions.length === 0) {
      alert("No questions available for this chapter.");
      return;
    }

    startSession(
  questions,
  "chapter",
  false
);

    router.push("/qbank/exam");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="rounded-3xl border border-white/10 bg-[#111C33] p-8">
        <p className="text-sm uppercase tracking-widest text-slate-400">
          Chapter Quiz
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Ready to test yourself?
        </h1>

        <p className="mt-4 text-slate-400">
          Complete the quiz for this chapter and track your progress.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-slate-400">
              Questions
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              --
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-slate-400">
              Time
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              --
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-slate-400">
              Passing Score
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              70%
            </p>
          </div>
        </div>

        <button
  onClick={handleStartExam}
  disabled={loading}
  className="mt-8 w-full rounded-2xl bg-primary-500 px-6 py-4 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
>
  {loading ? "Loading..." : "🚀 Start Exam"}
</button>
      </div>
    </main>
  );
}