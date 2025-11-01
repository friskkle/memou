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
      className="flex w-fit items-center justify-center font-bold text-center px-4 py-2 rounded-lg
        shadow-md hover:bg-[#dadada9f] hover:-translate-y-0.5 hover:shadow-lg active:bg-[#dadada9f] active:translate-0
        transition duration-200 ease-in-out"
      onClick={handleBack}
    >
      ←
    </button>
  );
}
