export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#1A2940] flex items-center justify-center p-4">
      {children}
    </div>
  );
}
