import { Metadata } from 'next';
import { HomeClient } from './home-client';

export const metadata: Metadata = {
  title: { absolute: 'Memou | Save and Plan Memories Together' },
  description: 'Memou is a simple collaborative environment to log your memories and thoughts effortlessly with your loved ones. Completely free and secure.',
  keywords: ['memou', 'journal', 'collaborative journaling', 'free journal app', 'memories', 'secure diary', 'date planner'],
  alternates: {
    canonical: 'https://memou.me',
  },
  openGraph: {
    title: 'Memou | Save and Plan Memories Together',
    description: 'A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
    url: 'https://memou.me',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memou | Save and Plan Memories Together',
    description: 'A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
  },
};

export default function Home() {
  return <HomeClient />;
}
