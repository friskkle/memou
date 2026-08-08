import { fetchJournalId } from '@/src/lib/journals';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { EditJournalForm } from '@/src/components/features/forms/journal-form';
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ journal_id: string }>;
}): Promise<Metadata> {
  const { journal_id } = await props.params;

  try {
    const journal = await fetchJournalId(journal_id, '');
    const journalName = journal.title || 'Journal';
    return {
      title: `Edit ${journalName}`,
      description: `Edit the name or description of the ${journalName} journal.`,
      alternates: {
        canonical: `https://memou.me/journal/${journal_id}/edit`,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {
      title: 'Edit Journal',
      robots: { index: false, follow: false },
    };
  }
}

const EditJournalPage = async ({
  params,
}: {
  params: Promise<{ journal_id: string }>;
}) => {
  const session = await getSession();
  if (!session) {
    redirect('/signin');
  }

  const { journal_id } = await params;
  const journal = await fetchJournalId(journal_id, session.user.id);
  if(journal) {
    if(journal.uuid !== session.user.id) {
      redirect('/journal');
    }
  }
  return (
    <main style={{ padding: 24 }}>
      <header style={{ maxWidth: 720, margin: '0 auto 24px' }}>
        <h1 className="font-bold" style={{ margin: 0 }}>
          Edit Journal
        </h1>
      </header>

      <EditJournalForm journal={journal} />
    </main>
  );
};

export default EditJournalPage;
