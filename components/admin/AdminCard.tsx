type Props = {
  children: React.ReactNode;
};

export default function AdminCard({ children }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111C2D] p-6 shadow-sm">
      {children}
    </div>
  );
}