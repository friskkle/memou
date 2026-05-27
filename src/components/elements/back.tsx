'use client';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackButton({ linkUrl }: { linkUrl?: string }) {
  const router = useRouter();

  const handleBack = () => {
    // if a specific link was given, go there
    if (linkUrl) {
      router.push(linkUrl);
      return;
    }
    // Go up one step in the route
    if (typeof window !== 'undefined') {
      const segments = window.location.pathname.split('/');
      if (segments.length > 2) {
        const upOne = segments.slice(0, -1).join('/') || '/';
        router.push(upOne);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <button
      type="button"
      className="group flex h-10 w-10 px-4 md:h-10 md:w-10 lg:px-6 items-center justify-center rounded-lg select-none
        shadow-md border border-white/30 bg-white/10 backdrop-blur-md
        hover:bg-white/50 hover:-translate-y-0.5 hover:shadow-lg
        active:bg-white active:translate-y-0.5
        transition duration-200 ease-in-out"
      onClick={handleBack}
    >
      <ArrowBackIcon fontSize="small" />
    </button>
  );
}
