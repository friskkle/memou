'use client';

import { Journal } from "@/src/lib/definitions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const JournalList = ({ list }: { list: Journal[] }) => {
    const currentPath = usePathname();
  return (
    (list &&
    <ul className="mt-2 bg-white shadow-sm rounded-lg">
      {list.map((journal) => (
        <li key={journal.id} className="p-1 flex last:mb-0 border-b border-gray-200 last:border-0">
          <Link href={`${currentPath}/${journal.id}`} className="flex flex-row items-center py-2 px-3 font-bold no-underline text-black w-full rounded hover:bg-[#e0e0e06a] transition-all duration-75">
            <span className="flex-2">
              {journal.title}
            </span>
            <span className="border-l text-sm text-gray-500 flex-1 text-right">
              {journal.uuid}
            </span>
          </Link>
        </li>
      ))}
    </ul>) || <div>No Journals found.</div>
  );
};
