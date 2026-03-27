import { fetchJournalId } from '@/src/lib/journals';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { EditJournalForm } from '@/src/components/features/forms/journal-form';

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
