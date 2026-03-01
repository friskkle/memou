export const dynamic = "force-dynamic";

import React from "react";
import { fetchJournals } from "@/src/lib/journals";
import { PrimaryButton } from "@/src/components/elements/primary-button";
import { JournalList } from "@/src/components/features/list/journal-list";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const Journals = async (): Promise<React.ReactElement> => {
  const session = await auth.api.getSession({ // find a way if we can remove this and just use the session in layout for user id
    headers: await headers()
  });
  if(!session) {
    redirect('/signin');
  }
  const journals = await fetchJournals(session.user.id);
  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 mt-2 relative">
      <span className="flex flex-row justify-between items-center mb-4">
        <p className="text-3xl font-bold">Journals</p>
        <Link href="/journal/new">
          <PrimaryButton size="small">New Journal</PrimaryButton>
        </Link>
      </span>
      <JournalList list={journals} />
    </div>
  );
};

export default Journals;
