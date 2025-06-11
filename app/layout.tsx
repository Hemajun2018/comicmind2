import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StagewiseToolbar } from '@/components/StagewiseToolbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ComicMind - Turn Text into Comic Mind Maps with AI',
  description: 'Transform your ideas into beautiful comic-style mind maps with AI. Create engaging visual representations of your thoughts with hand-drawn illustrations and creative styles.',
  keywords: 'mind map, AI, comic, visualization, brainstorming, creative thinking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <StagewiseToolbar />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}