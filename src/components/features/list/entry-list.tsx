'use client';

import { Entry } from "@/src/lib/definitions";
import Link from "next/link";
import { usePathname } from "next/navigation";

type listType = Entry[] | null;

export const EntryList = ({ list }: { list: listType }) => {
    const currentPath = usePathname();
  return (
    (list &&
    <ul>
      {list.map((entry) => (
        <li key={entry.id} className="mt-2 p-1 bg-white shadow-sm rounded-lg">
          <Link href={`${currentPath}/${entry.id}`} className="flex flex-row items-center py-1 px-3 font-bold no-underline text-black w-full rounded hover:bg-[#e0e0e06a]">
            <span className="flex-2">
              {entry.title}
            </span>
            <span className="border-l text-sm text-gray-500 flex-1 text-right">
              {new Date(entry.created_date).toLocaleDateString()}
            </span>
          </Link>
        </li>
      ))}
    </ul>) || <div>No entries found.</div>
  );
};
