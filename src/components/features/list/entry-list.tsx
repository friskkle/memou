'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Entry } from "@/src/lib/definitions";
import Link from "next/link";
import { EntryActionMenu } from "./list-buttons";

type listType = Entry[] | null;
type SortKey = 'name' | 'created' | 'modified';
type SortDir = 'asc' | 'desc';

const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#374151' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }}>
    {dir === 'asc'
      ? <path d="m5 15 7-7 7 7"/>
      : <path d="m5 9 7 7 7-7"/>
    }
  </svg>
);

export const EntryList = ({ list }: { list: listType }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const sortKey = (searchParams.get('sort') as SortKey) || 'modified';
  const sortDir = (searchParams.get('dir') as SortDir) || 'desc';

  const handleSort = (key: SortKey) => {
    const params = new URLSearchParams(searchParams);
    let newDir: SortDir = 'asc';
    if (sortKey === key) {
      newDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      newDir = key === 'name' ? 'asc' : 'desc';
    }
    params.set('sort', key);
    params.set('dir', newDir);
    params.set('page', '1'); // Reset to page 1 on sort change
    replace(`${pathname}?${params.toString()}`);
  };

  const sorted = list;

  return (
    (sorted &&
    <ul className="mt-2 bg-white shadow-sm rounded-lg">
      <li className="text-sm md:text-base py-3 px-4 flex border-b border-gray-200 select-none font-semibold">
        <span
          className="flex-1 md:flex-3 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => handleSort('name')}
        >
          Name
          <SortIcon active={sortKey === 'name'} dir={sortKey === 'name' ? sortDir : 'asc'} />
        </span>
        <span
          className="flex-1 border-l pr-2 border-gray-200 text-gray-500 text-right cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => handleSort('created')}
        >
          Created Date
          <SortIcon active={sortKey === 'created'} dir={sortKey === 'created' ? sortDir : 'desc'} />
        </span>
        <span
          className="flex-1 border-l pr-2 border-gray-200 text-gray-500 text-right cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => handleSort('modified')}
        >
          Last Modified
          <SortIcon active={sortKey === 'modified'} dir={sortKey === 'modified' ? sortDir : 'desc'} />
        </span>
      </li>
      {sorted.map((entry) => (
        <li key={entry.id} className="text-sm md:text-base p-1 flex last:mb-0 border-b border-gray-200 last:border-0 items-center">
          <Link href={`/journal/${entry.journal_id}/entries/${entry.id}`} className="flex-1 min-w-0 flex flex-row py-2 px-3 font-bold no-underline text-black rounded hover:bg-[#e0e0e06a] transition-all duration-75">
            <span className="flex-1 md:flex-3 overflow-hidden text-ellipsis whitespace-nowrap">
              {entry.title}
            </span>
            <span className="flex-1 text-xs md:text-sm text-gray-500 text-right pr-2">
              {new Date(entry.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </span>
            <span className="flex-1 text-xs md:text-sm text-gray-500 text-right pr-2">
              {new Date(entry.last_modified).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </span>
          </Link>
          <div className="pr-2 shrink-0">
            <EntryActionMenu entry_id={Number(entry.id)} />
          </div>
        </li>
      ))}
    </ul>) || <div>No entries found, click new entry to begin writing.</div>
  );
};
