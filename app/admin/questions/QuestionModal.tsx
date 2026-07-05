"use client";

import { useState } from "react";
import type { ChapterDoc, QuestionDoc } from "@/types";
import type { QuestionForm } from "./types";

type Props = {
  mode: "add" | "edit";
  initial: QuestionDoc | QuestionForm;
  chapters: ChapterDoc[];
  onClose: () => void;
  onSave: (form: QuestionForm) => Promise<void>;
};

function toForm(initial: QuestionDoc | QuestionForm): QuestionForm {
  return {
    chapterId: initial.chapterId ?? "",
    chapterName: initial.chapterName ?? "",
    text: initial.text ?? "",
    explanation: initial.explanation ?? "",
    difficulty: initial.difficulty ?? "medium",
    type: "single",
    options: ["a", "b", "c", "d"].map((id) => {
      const option = initial.options?.find((item) => item.id === id);
      return { id, text: option?.text ?? "" };
    }),
    correctAnswer:
      typeof initial.correctAnswer === "string"
        ? initial.correctAnswer
        : initial.correctAnswer?.[0] ?? "a",
    references: [...(initial.references ?? [])],
    tags: [...(initial.tags ?? [])],
    source: initial.source,
    year: initial.year,
  };
}

export default function QuestionModal({
  mode,
  initial,
  chapters,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<QuestionForm>(() => toForm(initial));
  const [tagsText, setTagsText] = useState(() =>
    (initial.tags ?? []).join(", ")
  );
  const [referencesText, setReferencesText] = useState(() =>
    (initial.references ?? []).join(", ")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof QuestionForm>(
    key: K,
    value: QuestionForm[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setOption = (index: number, value: string) => {
    setForm((current) => {
      const options = [...current.options];
      options[index] = { ...options[index], text: value };
      return { ...current, options };
    });
  };

  const splitList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const validate = () => {
    if (!form.chapterId) return "Select a chapter";
    if (!form.text.trim()) return "Question text is required";
    if (form.options.some((option) => !option.text.trim())) {
      return "All four options are required";
    }
    if (!form.options.some((option) => option.id === form.correctAnswer)) {
      return "Choose a valid correct answer";
    }
    return "";
  };

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        ...form,
        text: form.text.trim(),
        explanation: form.explanation.trim(),
        tags: splitList(tagsText),
        references: splitList(referencesText),
        options: form.options.map((option) => ({
          ...option,
          text: option.text.trim(),
        })),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onClick={(event) =>
        event.target === event.currentTarget && !saving && onClose()
      }
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/8 bg-navy-card">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h3 className="font-bold text-white">
            {mode === "add" ? "Add Question" : "Edit Question"}
          </h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-xl leading-none text-slate-400 hover:text-white disabled:opacity-50"
          >
            x
          </button>
        </div>

        <div className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Chapter
            </span>
            <select
              value={form.chapterId}
              onChange={(event) => set("chapterId", event.target.value)}
              className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
            >
              <option value="">Select chapter</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Question Text
            </span>
            <textarea
              value={form.text}
              onChange={(event) => set("text", event.target.value)}
              rows={4}
              className="w-full resize-y rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            {form.options.map((option, index) => (
              <label key={option.id} className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Option {option.id.toUpperCase()}
                </span>
                <input
                  value={option.text}
                  onChange={(event) =>
                    setOption(index, event.target.value)
                  }
                  className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Correct Answer
              </span>
              <select
                value={form.correctAnswer}
                onChange={(event) =>
                  set("correctAnswer", event.target.value)
                }
                className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
              >
                {form.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.id.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Difficulty
              </span>
              <select
                value={form.difficulty}
                onChange={(event) =>
                  set(
                    "difficulty",
                    event.target.value as QuestionForm["difficulty"]
                  )
                }
                className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Explanation
            </span>
            <textarea
              value={form.explanation}
              onChange={(event) => set("explanation", event.target.value)}
              rows={3}
              className="w-full resize-y rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tags
              </span>
              <input
                value={tagsText}
                onChange={(event) => setTagsText(event.target.value)}
                placeholder="Comma separated"
                className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                References
              </span>
              <input
                value={referencesText}
                onChange={(event) =>
                  setReferencesText(event.target.value)
                }
                placeholder="Comma separated"
                className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-white/12 py-3 text-sm font-semibold text-slate-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="flex-[2] rounded-xl bg-gradient-to-r from-primary-500 to-secondary py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : mode === "add"
                  ? "Create Question"
                  : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
