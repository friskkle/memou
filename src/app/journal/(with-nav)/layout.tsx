import BackButton from "@/src/components/elements/back";
import { JournalNav } from "@/src/components/features/journal/journal-nav";
import { signOutAction } from "@/src/lib/actions/auth";
import { getSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if(!session) {
    redirect('/signin');
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="p-4 flex flex-row items-center justify-between
        gap-2 border-b border-white/20 bg-white/10 backdrop-blur-md md:border-b-0 md:bg-transparent md:backdrop-blur-none 
        md:flex-col md:items-stretch md:justify-start md:gap-3 md:w-fit lg:w-52">
        <BackButton />
        <JournalNav />
        <div
          onClick={signOutAction}
          className="group flex mt-auto h-10 w-10 md:h-10 md:w-10 lg:w-full lg:px-4 items-center justify-center lg:justify-start rounded-lg select-none cursor-pointer
            shadow-md border border-red-200/30 bg-red-500/10 backdrop-blur-md
            hover:bg-red-500/20 hover:-translate-y-0.5 hover:shadow-lg
            active:bg-red-500/30 active:translate-y-0.5
            transition duration-200 ease-in-out text-red-600"
        >
          <LogoutOutlinedIcon fontSize="small" />
          <span className="hidden lg:inline ml-2 text-sm font-semibold">Sign Out</span>
        </div>
      </div>
      <div className="grow md:overflow-y-auto p-3 md:p-4">
        {children}
      </div>
    </div>
  );
}
