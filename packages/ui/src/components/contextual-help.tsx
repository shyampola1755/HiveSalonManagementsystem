'use client';

import * as React from 'react';
import { HelpCircle, BookOpen, Sparkles, Keyboard, ExternalLink, ArrowRight } from 'lucide-react';
import { Drawer } from './drawer';
import { Button } from './button';
import { Card, CardContent } from './card';

export interface HelpStep {
  title: string;
  description: string;
}

export interface ShortcutItem {
  keyCombo: string;
  description: string;
}

export interface ContextualHelpData {
  title: string;
  category?: string;
  whatIsThis: string;
  howItWorks: HelpStep[];
  proTips?: string[];
  shortcuts?: ShortcutItem[];
  relatedDocsLink?: string;
}

export interface ContextualHelpProps {
  isOpen: boolean;
  onClose: () => void;
  data: ContextualHelpData;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({ isOpen, onClose, data }) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="lg"
      title={
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <span>{data.title} Guide</span>
        </div>
      }
      description={data.category || 'Contextual Screen Guide & Best Practices'}
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-slate-400">Hive Knowledge Base</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Got it, close
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-left">
        {/* Section 1: What is this? */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <BookOpen className="h-4 w-4" />
            <span>What is this?</span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {data.whatIsThis}
          </div>
        </div>

        {/* Section 2: How does this work? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>How does this work?</span>
          </div>

          <div className="space-y-2.5">
            {data.howItWorks.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800/80 p-3 bg-white dark:bg-slate-900"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Pro Tips */}
        {data.proTips && data.proTips.length > 0 && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 p-4 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">💡 Pro Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
              {data.proTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 4: Keyboard Shortcuts */}
        {data.shortcuts && data.shortcuts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Keyboard className="h-4 w-4 text-slate-400" />
              <span>Keyboard Shortcuts</span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {data.shortcuts.map((sc, idx) => (
                <div key={idx} className="flex items-center justify-between px-3.5 py-2 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{sc.description}</span>
                  <kbd className="rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                    {sc.keyCombo}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
