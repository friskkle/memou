import BackButton from "@/src/components/elements/back";
import { signOutAction } from "@/src/lib/actions/auth";
import { getSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if(!session) {
    redirect('/signin');
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="p-4 flex md:flex-col gap-1">
        <BackButton linkUrl="/journal"/>
        <div onClick={signOutAction} className="flex mt-auto ml-auto p-3 md:p-4 w-fit items-center justify-center
        text-sm md:text-md leading-none font-bold rounded-lg select-none
        shadow-md border border-white/30 bg-white/10 backdrop-blur-md
        hover:bg-white/50 hover:-translate-y-0.5 hover:shadow-lg
        active:bg-white active:translate-y-0.5
        transition duration-200 ease-in-out text-red-600">
          Sign Out
        </div>
      </div>
      <div className="grow md:overflow-y-auto p-3 md:p-4">
        {children}
      </div>
    </div>
  );
}