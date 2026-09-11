import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Hive Salon & Spa — Guest Portal & Online Booking',
  description:
    'Experience world-class luxury salon care. Book appointments, manage memberships, track loyalty rewards, and view receipts seamlessly.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f59e0b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full bg-slate-950 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
