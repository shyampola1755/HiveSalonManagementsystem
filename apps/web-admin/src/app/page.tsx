'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem('hive_session');
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          if (session.activePortal === 'FRONT_DESK') {
            router.replace('/front-desk/dashboard');
            return;
          } else {
            router.replace('/back-office/dashboard');
            return;
          }
        } catch {
          // If parse fails, navigate to login
        }
      }
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50 text-slate-700 font-sans">
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
          H
        </div>
        <span className="text-xs font-mono text-slate-500">Loading Hive Salon Workspace...</span>
      </div>
    </div>
  );
}
