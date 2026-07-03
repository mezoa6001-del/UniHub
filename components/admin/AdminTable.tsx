type Column = {
  key: string;
  label: string;
  width?: string;
};

type Props<T> = {
  columns: Column[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
};

export default function AdminTable<T>({
  columns,
  data,
  renderRow,
}: Props<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111C2D]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#162338]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className="px-5 py-4 text-left text-xs uppercase tracking-wider text-slate-400 font-bold"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>{data.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
}