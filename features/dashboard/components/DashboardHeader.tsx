interface DashboardHeaderProps {
  title: string;
  description: string;
}

export function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <header>
      <p className="text-sm font-semibold text-primary-400">Learning dashboard</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
        {description}
      </p>
    </header>
  );
}
