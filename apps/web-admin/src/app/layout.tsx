import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdminShell } from '../components/admin-shell';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Hive Salon — Centralized Multi-Branch Salon, Spa & Aesthetic ERP',
  description:
    'Premium multi-branch management platform for luxury salons, aesthetic clinics, day spas, and personal care chains.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full bg-slate-50 text-slate-900 antialiased`}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
