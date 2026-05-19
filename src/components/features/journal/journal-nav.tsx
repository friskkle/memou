'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';

const navItems = [
  {
    label: 'Dashboard',
    suffix: '',
    icon: DashboardOutlinedIcon,
  },
  {
    label: 'Entries',
    suffix: '/entries',
    icon: EditNoteOutlinedIcon,
  },
  {
    label: 'Date Ideas',
    suffix: '/dates',
    icon: LocalActivityOutlinedIcon,
  },
] as const;

export function JournalNav() {
  const pathname = usePathname();
  const match = pathname.match(/^\/journal\/(\d+)/);

  if (!match) {
    return null;
  }

  const journalId = match[1];
  const basePath = `/journal/${journalId}`;

  return (
    <nav className="flex gap-1 mt-3 overflow-x-auto rounded-lg border border-white/40 bg-white/20 p-1 shadow-sm backdrop-blur-md md:flex-col">
      {navItems.map((item) => {
        const href = `${basePath}${item.suffix}`;
        const isActive = item.suffix ? pathname.startsWith(href) : pathname === basePath;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex min-w-fit items-center justify-start gap-2 rounded-md px-3 py-2 text-sm font-semibold no-underline transition ${
              isActive
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:bg-white/60 hover:text-stone-900'
            }`}
          >
            <Icon fontSize="small" />
            <span className="md:hidden lg:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
