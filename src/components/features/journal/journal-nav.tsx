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
    <nav className="flex items-center gap-1 h-10 md:h-auto md:w-10 md:mt-3 lg:w-full rounded-lg border border-white/40 bg-white/20 p-1 shadow-md backdrop-blur-md md:flex-col md:gap-1.5 md:p-1">
      {navItems.map((item) => {
        const href = `${basePath}${item.suffix}`;
        const isActive = item.suffix ? pathname.startsWith(href) : pathname === basePath;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex h-8 w-8 md:h-8 md:w-8 lg:h-10 lg:w-full items-center justify-center lg:justify-start gap-2 rounded-md px-0 lg:px-4 text-sm font-semibold no-underline transition ${
              isActive
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:bg-white/60 hover:text-stone-900'
            }`}
          >
            <Icon fontSize="small" />
            <span className="hidden lg:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
