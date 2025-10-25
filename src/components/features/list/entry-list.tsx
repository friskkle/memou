import { headers } from "next/headers";
import { Entry } from "@/src/lib/definitions";
import Link from "next/link";
import { DeleteEntryButton } from "./list-buttons";

type listType = Entry[] | null;

export const EntryList = async ({ list }: { list: listType }) => {
    const headersList = await headers();
    const currentPath = (headersList).get('x-url') || '';
  return (
    (list &&
    <ul className="mt-2 bg-white shadow-sm rounded-lg">
      <li className="py-3 px-4 flex border-b border-gray-200 select-none font-semibold">
        <span className="flex-2 text-gray-500">Name</span>
        <span className="flex-1 text-sm text-gray-500 text-right">Last Modified</span>
      </li>
      {list.map((entry) => (
        <li key={entry.id} className="p-1 flex last:mb-0 border-b border-gray-200 last:border-0">
          <Link href={`${entry.journal_id}/${entry.id}`} className="flex flex-row py-2 px-3 font-bold no-underline text-black w-full rounded hover:bg-[#e0e0e06a] transition-all duration-75">
            <span className="flex-2">
              {entry.title}
            </span>
            <span className="flex-1 border-l text-sm text-gray-500 text-right">
              {new Date(entry.last_modified).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </span>
          </Link>
          <DeleteEntryButton entry_id={Number(entry.id)} />
        </li>
      ))}
    </ul>) || <div>No entries found.</div>
  );
};
