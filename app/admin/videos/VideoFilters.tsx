"use client";

interface VideoFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function VideoFilters({
  search,
  onSearchChange,
}: VideoFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <input
        type="text"
        placeholder="🔍 Search videos..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-80 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-primary-500"
      />
    </div>
  );
}