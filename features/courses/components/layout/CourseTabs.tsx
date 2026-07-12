"use client";

interface CourseTabsProps {
  activeTab:
    | "overview"
    | "chapters"
    | "videos"
    | "questions"
    | "flashcards"
    | "settings";

  onChange: (
    tab:
      | "overview"
      | "chapters"
      | "videos"
      | "questions"
      | "flashcards"
      | "settings"
  ) => void;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "chapters", label: "Chapters" },
  { id: "videos", label: "Videos" },
  { id: "questions", label: "Questions" },
  { id: "flashcards", label: "Flashcards" },
  { id: "settings", label: "Settings" },
] as const;

export function CourseTabs({
  activeTab,
  onChange,
}: CourseTabsProps) {
  return (
    <div className="border-b border-white/10">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "rounded-t-xl px-4 py-3 text-sm font-semibold transition-all",
                active
                  ? "bg-primary-500 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}