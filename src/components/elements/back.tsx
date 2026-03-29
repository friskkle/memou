'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
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
    className="flex px-4 md:pb-3 md:pt-2 w-fit items-center justify-center text-xl md:text-2xl leading-none font-bold rounded-lg
        shadow-md border border-white/30 bg-white/10 backdrop-blur-md
        hover:bg-white/50 hover:-translate-y-0.5 hover:shadow-lg
        active:bg-white active:translate-0
        transition duration-200 ease-in-out"
      onClick={handleBack}
    >
      ←
    </button>
  );
}
