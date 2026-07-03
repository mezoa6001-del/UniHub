type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function AdminSearch({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full md:w-80 px-4 py-3 rounded-xl
      bg-[#111C2D]
      border border-slate-700
      text-white
      placeholder:text-slate-500
      outline-none
      focus:border-[#2FA084]
      transition"
    />
  );
}