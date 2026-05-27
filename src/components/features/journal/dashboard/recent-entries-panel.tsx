import Link from 'next/link';
import type { Entry } from '@/src/lib/definitions';

export function RecentEntriesPanel({
  journalId,
  entries,
}: {
  journalId: string;
  entries: Entry[];
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-stone-900">Recent Entries</h2>
        <Link
          href={`/journal/${journalId}/entries`}
          className="text-sm font-semibold text-[#9A654B] no-underline hover:underline"
        >
          View all
        </Link>
      </div>
      {entries.length > 0 ? (
        <ul className="divide-y divide-stone-100">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/journal/${journalId}/entries/${entry.id}`}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-3 text-stone-900 no-underline transition hover:bg-stone-50"
              >
                <span className="min-w-0 truncate font-semibold">{entry.title || 'Untitled'}</span>
                <span className="shrink-0 text-xs text-stone-500">
                  {new Date(entry.last_modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
          No entries yet.
        </div>
      )}
    </div>
  );
}
