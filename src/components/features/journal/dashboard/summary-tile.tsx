import type { ReactNode } from 'react';

export function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
          {icon}
        </span>
        <span className="text-2xl font-bold text-stone-900">{value}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-stone-600">{label}</p>
    </div>
  );
}
