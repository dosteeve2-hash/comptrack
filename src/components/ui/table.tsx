import type { ReactNode } from "react";

export function Table({
  columns,
  rows,
  caption,
  className = "",
}: {
  columns: string[];
  rows: Array<Array<string | ReactNode>>;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-[720px] w-full border-separate border-spacing-0 text-left text-sm">
        {caption ? (
          <caption className="mb-3 text-sm font-medium text-slate-400 text-left">
            {caption}
          </caption>
        ) : null}
        <thead className="text-slate-400">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border-b border-white/10 px-4 py-3 font-semibold tracking-[0.02em] text-slate-300"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-slate-200">
          {rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row.join("-")}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-4 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
