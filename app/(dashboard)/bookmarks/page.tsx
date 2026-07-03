"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserBookmarks, removeBookmark, getQuestions } from "@/lib/firebase/firestore";
import { useExamStore } from "@/store/examStore";
import { Badge, EmptyState, Spinner } from "@/components/ui";
import { difficultyColor } from "@/lib/utils/formatters";
import type { BookmarkDoc, QuestionDoc } from "@/types";

export default function BookmarksPage() {
  const router      = useRouter();
  const { profile } = useAuth();
  const startSession = useExamStore((s) => s.startSession);
  const [bookmarks, setBookmarks] = useState<BookmarkDoc[]>([]);
  const [qMap,      setQMap]      = useState<Record<string, QuestionDoc>>({});
  const [loading,   setLoading]   = useState(true);

  const load = useCallback(async () => {
    if (!profile) return;
    const bms = await getUserBookmarks(profile.uid);
    setBookmarks(bms);
    if (bms.length) {
      const all = await getQuestions();
      const map: Record<string, QuestionDoc> = {};
      all.forEach((q) => { map[q.id] = q; });
      setQMap(map);
    }
    setLoading(false);
  }, [profile]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    await removeBookmark(id);
    load();
  };

  const practiceAll = () => {
    const qs = bookmarks.map((b) => qMap[b.questionId]).filter(Boolean) as QuestionDoc[];
    if (!qs.length) return;
    startSession(qs, "bookmarks");
    router.push("/qbank/exam");
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={40} /></div>;

  if (!bookmarks.length) {
    return <EmptyState icon="🔖" title="No bookmarks yet" desc="Tap 'Save' on any exam question to bookmark it for later review" />;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">{bookmarks.length} saved questions</span>
        <button onClick={practiceAll}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm hover:opacity-90">
          Practice All →
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.map((bm) => {
          const q = qMap[bm.questionId];
          return (
            <div key={bm.id} className="bg-navy-card rounded-2xl p-5 border border-white/8">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 flex-wrap">
                  {q?.chapterName && <Badge color="#3B82F6">{q.chapterName}</Badge>}
                  {q?.difficulty  && <Badge color={difficultyColor(q.difficulty)}>{q.difficulty}</Badge>}
                </div>
                <button onClick={() => remove(bm.id)}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors ml-2 shrink-0">
                  ✕ Remove
                </button>
              </div>
              <p className="text-sm text-white leading-relaxed">
                {q?.text ?? `Question ID: ${bm.questionId}`}
              </p>
              {bm.note && (
                <p className="text-xs text-slate-400 mt-3 italic">📝 {bm.note}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
