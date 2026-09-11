import Link from 'next/link';
import { Button } from '@hive/ui';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mb-4 shadow-sm">
        <Compass className="h-8 w-8" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Page Not Found</h2>

      <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        The screen you are looking for might have been moved, renamed, or is currently undergoing maintenance.
      </p>

      <div className="mt-6">
        <Link href="/">
          <Button variant="primary" size="sm" leftIcon={<Home className="h-4 w-4" />}>
            Back to Executive Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
