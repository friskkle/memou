import { fetchJournalId } from '@/src/lib/journals';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { EditJournalForm } from '@/src/components/features/forms/journal-form';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Memou | Edit Journal',
  description: 'Edit journal name or description. A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
  keywords: ['memou', 'journal', 'collaborative journaling', 'free journal app', 'memories', 'secure diary', 'date planner'],
  openGraph: {
    title: 'Memou | Edit Journal',
    description: 'Edit journal name or description. A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
    type: 'website',
  }
};

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
