export const dynamic = "force-dynamic";

import React from "react";
import { fetchJournals } from "@/src/lib/journals";
import { PrimaryButton } from "@/src/components/elements/primary-button";
import { JournalList } from "@/src/components/features/list/journal-list";
import { getSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SearchInput } from "@/src/components/ui/search-input";

const Journals = async (props: {
  searchParams?: Promise<{
    query?: string;
  }>
}): Promise<React.ReactElement> => {
  const session = await getSession();
  if(!session) {
    redirect('/signin');
  }

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  const journals = await fetchJournals(session.user.id, query);
  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 mt-2 relative">
      <span className="flex flex-row justify-between items-center mb-4">
        <p className="text-3xl font-bold">Journals</p>
        <Link href="/journal/new">
          <PrimaryButton size="small">New Journal</PrimaryButton>
        </Link>
      </span>
      <SearchInput placeholder="Search journal by name..." />
      <JournalList list={journals} />
    </div>
  );
};

export default Journals;
