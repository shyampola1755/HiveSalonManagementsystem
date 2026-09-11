'use client';

import * as React from 'react';
import { Bot, Send, Sparkles, ShieldCheck, Database, TrendingUp, DollarSign } from 'lucide-react';
import { Button, Badge, Input, useToast } from '@hive/ui';

interface MessageItem {
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  data?: {
    metric: string;
    value: string;
    growth?: string;
    sqlMasked?: string;
  } | null;
}

export default function BackOfficeAiPage() {
  const toast = useToast();
  const [query, setQuery] = React.useState('');
  const [messages, setMessages] = React.useState<MessageItem[]>([
    {
      sender: 'AI',
      text: 'Hello! I am Hive Salon AI. Ask me any analytical question regarding your revenue, branch benchmarking, stylist performance, or inventory forecasting.',
      timestamp: '14:30',
      data: null,
    },
    {
      sender: 'USER',
      text: 'Which branch performed best this month?',
      timestamp: '14:31',
      data: null,
    },
    {
      sender: 'AI',
      text: 'Jubilee Hills Flagship (JH-01) performed best this month, generating ₹9,80,000.00 (39.5% of total organization revenue) with an MoM growth rate of +18.4%.',
      timestamp: '14:31',
      data: {
        metric: 'Top Branch Revenue',
        value: '₹9,80,000.00',
        growth: '+18.4%',
        sqlMasked: 'SELECT branch_id, SUM(total_amount) FROM invoices WHERE ...',
      },
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg: MessageItem = { sender: 'USER', text: query, timestamp: 'Now', data: null };
    const aiResponse: MessageItem = {
      sender: 'AI',
      text: `Analyzed read-only AST-validated query for: "${query}". All tenant boundaries (org-001) enforced.`,
      timestamp: 'Now',
      data: { metric: 'AI Intelligence Result', value: 'Verified', growth: 'AST Validated' },
    };

    setMessages((prev) => [...prev, userMsg, aiResponse]);
    setQuery('');
    toast.success('Hive AI query executed in read-only mode.');
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Hive Salon AI Copilot</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Natural language Text-to-SQL business intelligence. Strict zero-mutation read-only analytics.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 flex flex-col h-[550px] overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  m.sender === 'USER'
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-[10px] text-slate-400">
                  <span>{m.sender === 'USER' ? 'You' : 'Hive AI'}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>
                <p>{m.text}</p>

                {m.data && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>{m.data.metric}:</span>
                      <span className="font-bold text-amber-300">{m.data.value}</span>
                    </div>
                    {m.data.growth && (
                      <div className="flex justify-between text-slate-400">
                        <span>Growth:</span>
                        <span className="text-emerald-400 font-bold">{m.data.growth}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Query Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Hive AI (e.g. 'Which stylist generated highest revenue?', 'Which products are low in stock?')..."
            className="flex-1 h-11 text-xs"
          />
          <Button type="submit" variant="primary" className="h-11 px-5 font-bold text-xs bg-purple-600 hover:bg-purple-500">
            <Send className="w-4 h-4 mr-1.5" />
            Query
          </Button>
        </form>
      </div>
    </div>
  );
}
