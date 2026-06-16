import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/* const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
}); */

export const metadata: Metadata = {
  title: 'Memou',
  description: 'Memou is a simple collaborative environment to log your memories and thoughts effortlessly with your loved ones. Completely free and secure.',
  keywords: ['memou', 'journal', 'collaborative journaling', 'free journal app', 'memories', 'secure diary', 'date planner'],
  openGraph: {
    title: 'Memou | Save and Plan Memories Together',
    description: 'A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
