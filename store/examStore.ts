import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { QuestionDoc, ExamMode, AttemptAnswer } from "@/types";

interface ExamSession {
  sessionId:   string;
  questions:   QuestionDoc[];
  mode:        ExamMode;
  currentIndex: number;
  answers:     Record<string, AttemptAnswer>;
  startedAt:   number;
  timed:       boolean;
  completed:   boolean;
}

interface ExamStore {
  session:       ExamSession | null;
  startSession:  (questions: QuestionDoc[], mode: ExamMode, timed?: boolean) => void;
  submitAnswer:  (questionId: string, answer: AttemptAnswer) => void;
  nextQuestion:  () => void;
  prevQuestion:  () => void;
  jumpTo:        (index: number) => void;
  finishSession: () => void;
  clearSession:  () => void;
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set) => ({
      session: null,

      startSession: (questions, mode, timed = false) =>
        set({
          session: {
            sessionId:    crypto.randomUUID(),
            questions,
            mode,
            currentIndex: 0,
            answers:      {},
            startedAt:    Date.now(),
            timed,
            completed:    false,
          },
        }),

      submitAnswer: (questionId, answer) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, answers: { ...state.session.answers, [questionId]: answer } }
            : null,
        })),

      nextQuestion: () =>
        set((state) => ({
          session: state.session
            ? { ...state.session, currentIndex: Math.min(state.session.currentIndex + 1, state.session.questions.length - 1) }
            : null,
        })),

      prevQuestion: () =>
        set((state) => ({
          session: state.session
            ? { ...state.session, currentIndex: Math.max(state.session.currentIndex - 1, 0) }
            : null,
        })),

      jumpTo: (index) =>
        set((state) => ({
          session: state.session ? { ...state.session, currentIndex: index } : null,
        })),

      finishSession: () =>
        set((state) => ({
          session: state.session ? { ...state.session, completed: true } : null,
        })),

      clearSession: () => set({ session: null }),
    }),
    {
      name:    "pharmacore-exam-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
