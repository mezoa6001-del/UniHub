"use client";

import type { ChapterDoc } from "@/types";
import type { QuestionFilters as QuestionFiltersState } from "./types";

type Props = {
  chapters: ChapterDoc[];
  filters: QuestionFiltersState;
  onChange: (filters: QuestionFiltersState) => void;
};

export default function QuestionFilters({
  chapters,
  filters,
  onChange,
}: Props) {
  const setFilter = <K extends keyof QuestionFiltersState>(
    key: K,
    value: QuestionFiltersState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-white/8 bg-navy-card p-4 md:grid-cols-[1fr_220px_180px]">
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Search
        </span>
        <input
          value={filters.search}
          onChange={(event) => setFilter("search", event.target.value)}
          placeholder="Question text, tag, or explanation"
          className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Chapter
        </span>
        <select
          value={filters.chapterId}
          onChange={(event) => setFilter("chapterId", event.target.value)}
          className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
        >
          <option value="">All chapters</option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Difficulty
        </span>
        <select
          value={filters.difficulty}
          onChange={(event) =>
            setFilter(
              "difficulty",
              event.target.value as QuestionFiltersState["difficulty"]
            )
          }
          className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
        >
          <option value="all">All levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
    </div>
  );
}
