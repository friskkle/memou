import BackButton from '@/src/components/elements/back';
import { AuthForm } from '@/src/components/features/forms/auth-form';
import { getSession } from '@/src/lib/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Memou account to access your collaborative journals and memories.',
  keywords: ['memou', 'signin', 'journal', 'memories', 'secure diary'],
  alternates: {
    canonical: 'https://memou.me/signin',
  },
  openGraph: {
    title: 'Sign in to Memou',
    description: 'Sign in to your Memou account to access your collaborative journals and memories.',
    url: 'https://memou.me/signin',
    type: 'website',
  },
};

export default async function Signin() {
  const session = await getSession();
  if (session) {
    redirect('/journal');
  }
  return (
    <div className="flex-1 font-sans grid grid-rows-[20px_1fr_20px] gap-16">
      <main className="flex flex-col gap-8 p-4">
        <div>
          <BackButton />
        </div>
        <div className="flex flex-col gap-8 items-center">
          <h1 className="font-serif text-3xl font-medium text-center">
            Enter your account to begin
          </h1>
          <AuthForm />
        </div>
      </main>
    </div>
  );
}
