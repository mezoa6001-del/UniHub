type Props = {
  children: React.ReactNode;
};

export default function AdminToolbar({ children }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {children}
    </div>
  );
}