'use client';

import { Entry } from "@/src/lib/definitions";
import Link from "next/link";
import { usePathname } from "next/navigation";

type listType = Entry[] | null;

export const List = ({ list }: { list: listType }) => {
    const currentPath = usePathname();
  return (
    (list && <ul>
      {list.map((entry) => (
        <li key={entry.id} className="mb-2 p-2 border rounded">
          <Link href={`${currentPath}/${entry.id}`} className="font-bold">
            {entry.title}
          </Link>
        </li>
      ))}
    </ul>) || <div>No entries found.</div>
  );
};
