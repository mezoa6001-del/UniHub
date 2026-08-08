"use client";

type Props = {
  solved: number;
  accuracy: number;
  wrong: number;
  streak: number;
};

export default function AnalyticsCard({
  solved,
  accuracy,
  wrong,
  streak,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-navy-card p-6">
      <h2 className="text-xl font-bold text-white">
        Analytics
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <Metric
          label="Solved"
          value={solved}
        />

        <Metric
          label="Accuracy"
          value={`${accuracy}%`}
        />

        <Metric
          label="Wrong"
          value={wrong}
        />

        <Metric
          label="Streak"
          value={`${streak} days`}
        />

      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 text-center">
      <div className="text-3xl font-black text-white">
        {value}
      </div>

      <div className="mt-2 text-xs uppercase tracking-widest text-slate-400">
        {label}
      </div>
    </div>
  );
}