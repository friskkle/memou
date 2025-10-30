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
      <div className="p-4 flex flex-col">
        <BackButton />
        <div onClick={signOutAction} className="mt-auto p-3 text-sm font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-red-600">
          Sign Out
        </div>
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}