'use client';

import { Journal } from "@/src/lib/definitions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const JournalList = ({ list }: { list: Journal[] }) => {
    const currentPath = usePathname();
  return (
    (list &&
    <ul>
      {list.map((journal) => (
        <li key={journal.id} className="mt-2 p-1 bg-white shadow-sm rounded-lg">
          <Link href={`${currentPath}/${journal.id}`} className="flex flex-row items-center py-1 px-3 font-bold no-underline text-black w-full rounded hover:bg-[#e0e0e06a]">
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
