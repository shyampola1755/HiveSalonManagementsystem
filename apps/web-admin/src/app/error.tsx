'use client';

import * as React from 'react';
import { formatHumanFriendlyError } from '@hive/utilities';
import { Button } from '@hive/ui';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const friendly = formatHumanFriendlyError(error);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mb-4 shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Something didn&rsquo;t go as planned
      </h2>

      <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {friendly.message}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="h-4 w-4" />}
          onClick={() => reset()}
        >
          Try Again
        </Button>
        <a href="/">
          <Button variant="primary" size="sm" leftIcon={<Home className="h-4 w-4" />}>
            Return to Dashboard
          </Button>
        </a>
      </div>
    </div>
  );
}
