"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserWrongQuestions, resolveWrongQuestion, getQuestions } from "@/lib/firebase/firestore";
import { useExamStore } from "@/store/examStore";
import { Badge, EmptyState, Spinner } from "@/components/ui";
import { difficultyColor } from "@/lib/utils/formatters";
import type { WrongQuestionDoc, QuestionDoc } from "@/types";

export default function WrongQuestionsPage() {
  const router       = useRouter();
  const { profile }  = useAuth();
  const startSession = useExamStore((s) => s.startSession);
  const [wrongs,  setWrongs]  = useState<WrongQuestionDoc[]>([]);
  const [qMap,    setQMap]    = useState<Record<string, QuestionDoc>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!profile) return;
    const wqs = await getUserWrongQuestions(profile.uid);
    setWrongs(wqs);
    if (wqs.length) {
      const all = await getQuestions();
      const map: Record<string, QuestionDoc> = {};
      all.forEach((q) => { map[q.id] = q; });
      setQMap(map);
    }
    setLoading(false);
  }, [profile]);

  useEffect(() => { load(); }, [load]);

  const resolve = async (id: string) => {
    await resolveWrongQuestion(id);
    load();
  };

  const retryAll = () => {
    const qs = wrongs.map((w) => qMap[w.questionId]).filter(Boolean) as QuestionDoc[];
    if (!qs.length) return;
    startSession(qs, "wrong_review");
    router.push("/qbank/exam");
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={40} /></div>;

  if (!wrongs.length) {
    return (
      <EmptyState icon="🎉" title="No wrong questions!"
        desc="Questions you get wrong in exams appear here automatically for targeted review" />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 rounded-2xl border border-red-500/20"
        style={{ background: "#EF444410" }}>
        <div>
          <p className="font-bold text-red-400 text-sm">{wrongs.length} Questions Need Review</p>
          <p className="text-xs text-slate-400 mt-0.5">Practice these to strengthen your weak areas</p>
        </div>
        <button onClick={retryAll}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors">
          Retry All
        </button>
      </div>

      <div className="space-y-3">
        {wrongs.map((wq) => {
          const q = qMap[wq.questionId];
          return (
            <div key={wq.id} className="bg-navy-card rounded-2xl p-5 border-l-4 border border-white/5"
              style={{ borderLeftColor: "#EF4444" }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 flex-wrap">
                  {q?.chapterName && <Badge color="#EF4444">{q.chapterName}</Badge>}
                  {q?.difficulty  && <Badge color={difficultyColor(q.difficulty)}>{q.difficulty}</Badge>}
                  <Badge color="#F59E0B">Wrong {wq.wrongCount}×</Badge>
                </div>
                <button onClick={() => resolve(wq.id)}
                  className="text-xs text-primary-400 hover:text-primary-300 border border-primary-500/20 px-3 py-1 rounded-lg transition-colors shrink-0 ml-2">
                  ✓ Resolve
                </button>
              </div>
              <p className="text-sm text-white leading-relaxed mb-3">
                {q?.text ?? `Question ID: ${wq.questionId}`}
              </p>
              {q?.correctAnswer && (
                <div className="bg-primary-500/10 rounded-xl px-4 py-2.5 text-xs text-primary-400 font-medium">
                  ✅ Correct answer: {
                    q.options?.find((o) => o.id === q.correctAnswer)?.text ?? String(q.correctAnswer)
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
