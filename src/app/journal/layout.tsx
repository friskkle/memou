import BackButton from "@/src/components/elements/back";
import { signOutAction } from "@/src/lib/actions/auth";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if(!session) {
    redirect('/signin');
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-cream">
      <div className="p-4 flex md:flex-col gap-1">
        <BackButton />
        <div onClick={signOutAction} className="mt-auto ml-auto w-fit p-3 select-none text-sm font-bold rounded-lg
        shadow-md hover:bg-[#dadada9f] hover:-translate-y-0.5 hover:shadow-lg active:bg-[#dadada9f] active:translate-0
        transition duration-200 ease-in-out text-red-600">
          Sign Out
        </div>
      </div>
      <div className="grow md:px-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}