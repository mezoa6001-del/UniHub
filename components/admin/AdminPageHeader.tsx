type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function AdminPageHeader({
  title,
  description,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        {description && (
          <p className="text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}