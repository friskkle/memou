'use client';
import { useRouter } from 'next/navigation';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export default function HomeButton() {
  const router = useRouter();

  const handleHome = () => {
    router.push('/journal');
    return;
  }

  return (
    <button
      type="button"
      className="group flex h-10 w-10 px-4 md:h-10 md:w-10 lg:px-6 items-center justify-center rounded-lg select-none
        shadow-md border border-white/30 bg-white/10 backdrop-blur-md
        hover:bg-white/50 hover:-translate-y-0.5 hover:shadow-lg
        active:bg-white active:translate-y-0.5
        transition duration-200 ease-in-out"
      onClick={handleHome}
    >
      <HomeOutlinedIcon fontSize="small" />
    </button>
  );
}
