"use client";

type Props = {
  progress: number;
};

export default function MasteryCard({ progress }: Props) {
  const level =
    progress >= 80
      ? "Advanced"
      : progress >= 50
      ? "Intermediate"
      : "Beginner";

  const emoji =
    progress >= 80
      ? "🥇"
      : progress >= 50
      ? "🥈"
      : "🥉";

  return (
    <div className="rounded-3xl border border-white/10 bg-navy-card p-6">
      <h2 className="text-xl font-bold text-white">
        Mastery
      </h2>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="text-6xl">{emoji}</div>

        <h3 className="mt-4 text-2xl font-black text-white">
          {level}
        </h3>

        <p className="mt-2 text-slate-400">
          Keep studying to unlock the next level.
        </p>

        <div className="mt-6 w-full">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="font-bold text-primary-400">
              {progress}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}