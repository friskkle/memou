'use client';

import { useState } from 'react';
import { Journal } from "@/src/lib/definitions";
import Link from "next/link";
import { JournalActionMenu } from "./list-buttons";

type SortKey = 'name' | 'creator';
type SortDir = 'asc' | 'desc';

export const JournalList = ({ list }: { list: Journal[] }) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...list].sort((a, b) => {
    const valA = sortKey === 'name' ? (a.title || '') : a.creator_name;
    const valB = sortKey === 'name' ? (b.title || '') : b.creator_name;
    const cmp = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
    return sortDir === 'asc' ? cmp : -cmp;
  });

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

  return (
    (list &&
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
          className="flex-1 pr-2 border-l border-gray-200 text-gray-500 text-right cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => handleSort('creator')}
        >
          Creator
          <SortIcon active={sortKey === 'creator'} dir={sortKey === 'creator' ? sortDir : 'asc'} />
        </span>
        <span className="flex-1 pr-4 border-l border-gray-200 text-gray-500 text-right">
          Shared With
        </span>
      </li>
      {sorted.map((journal) => (
        <li key={journal.id} className="text-sm md:text-base p-1 flex last:mb-0 border-b border-gray-200 last:border-0 items-center">
          <Link href={`/journal/${journal.id}`} className="flex flex-row items-center py-2 px-3 font-bold no-underline text-black w-full rounded hover:bg-[#e0e0e06a] transition-all duration-75">
            <span className="flex-1 md:flex-3 flex items-center gap-2">
              {journal.title}
            </span>
            <span className="flex-1 text-sm font-normal text-gray-500 text-right pr-2">
              {journal.creator_name}
            </span>
            <span className="flex-1 text-sm font-normal text-gray-500 text-right pr-2">
              {journal.shared_with_names.length > 0 && (
                <CollaboratorBadge names={journal.shared_with_names.map((user) => user.name)} />
              )}
            </span>
          </Link>
          <div className="pr-2">
            <JournalActionMenu journal_id={Number(journal.id)} />
          </div>
        </li>
      ))}
    </ul>) || <div>No Journals found.</div>
  );
};

function CollaboratorBadge({ names }: { names: string[] }) {
  const displayName = names[0];
  const remaining = names.length - 1;

  return (
    <span className="collaborator-badge">
      <span className="collaborator-trail">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        {displayName}{remaining > 0 ? ` +${remaining}` : ''}
      </span>
      <span className="collaborator-tooltip">
        <span className="collaborator-tooltip-title">Shared with:</span>
        {names.map((name, i) => (
          <span key={i} className="collaborator-tooltip-name">{name}</span>
        ))}
      </span>

      <style>{`
        .collaborator-badge {
          position: relative;
          margin-left: auto;
          flex-shrink: 0;
        }
        .collaborator-trail {
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          background: #f3f4f6;
          border-radius: 9999px;
          padding: 2px 10px;
          white-space: nowrap;
          cursor: default;
        }
        .collaborator-tooltip {
          display: flex;
          flex-direction: column;
          gap: 2px;
          position: absolute;
          right: 0;
          top: calc(100% + 6px);
          background: #1f2937;
          color: #f9fafb;
          font-size: 0.75rem;
          font-weight: 400;
          padding: 8px 12px;
          border-radius: 8px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 50;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-4px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          transition-delay: 0s;
        }
        .collaborator-badge:hover .collaborator-tooltip {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
          transition-delay: 0.4s;
        }
        .collaborator-tooltip-title {
          font-weight: 600;
          color: #9ca3af;
          margin-bottom: 2px;
        }
        .collaborator-tooltip-name {
          color: #f9fafb;
        }
      `}</style>
    </span>
  );
}
