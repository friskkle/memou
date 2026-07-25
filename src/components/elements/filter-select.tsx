import { ReactNode } from "react";


export function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="inline-block relative text-xs font-semibold uppercase tracking-[0.08em] text-stone-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 appearance-none block w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-stone-800 outline-none transition focus:border-jbrown focus:bg-white"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute translate-y-1/6 inset-y-0 right-2 flex items-center pr-1 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </label>
  );
}