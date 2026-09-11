import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { ToastProvider } from '@hive/ui';

export const metadata: Metadata = {
  title: 'Hive POS — Fast-Lane Front-Desk & Tablet Register',
  description: 'Touchscreen-optimized checkout terminal for rapid card, cash, UPI, and loyalty transactions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
