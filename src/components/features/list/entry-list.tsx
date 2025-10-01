'use client';

import { deleteEntry } from "@/src/lib/actions";
import { Entry } from "@/src/lib/definitions";
import Link from "next/link";
import { usePathname } from "next/navigation";

type listType = Entry[] | null;

export const EntryList = ({ list }: { list: listType }) => {
    const currentPath = usePathname();
    const onDelete = async (id: number) => {
      await deleteEntry(id);
    }
  return (
    (list &&
    <ul className="mt-2 bg-white shadow-sm rounded-lg">
      {list.map((entry) => (
        <li key={entry.id} className="p-1 flex last:mb-0 border-b border-gray-200 last:border-0">
          <Link href={`${currentPath}/${entry.id}`} className="flex flex-row items-center py-2 px-3 font-bold no-underline text-black w-full rounded hover:bg-[#e0e0e06a] transition-all duration-75">
            <span className="flex-2">
              {entry.title}
            </span>
            <span className="border-l text-sm text-gray-500 flex-1 text-right">
              {new Date(entry.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </span>
          </Link>
          <button
            type="button"
            className="ml-2 px-2 text-xs text-red-600 font-bold rounded bg-transparent hover:bg-[#e0e0e06a] transition-all duration-75"
            onClick={async () => {
                if (!window.confirm(`Are you sure you want to delete entry: ${entry.title}?`)) return;
              try {
                await onDelete(entry.id);
                window.location.reload(); // or use redirect/revalidate if you want a smoother UX
              } catch (err) {
                console.error("Failed to delete:", err);
                alert("Something went wrong deleting the entry.");
              }
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>) || <div>No entries found.</div>
  );
};
