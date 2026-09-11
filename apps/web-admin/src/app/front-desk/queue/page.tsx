'use client';

import * as React from 'react';
import {
  Layers,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button, Badge, useToast } from '@hive/ui';

export default function FrontDeskQueuePage() {
  const toast = useToast();

  const [queueItems] = React.useState([
    { token: 'Q-101', name: 'Rahul Verma', service: 'Executive Haircut', chair: 'Station #03', stylist: 'Rajesh Kumar', estWait: '2 mins', status: 'NEXT_IN_LINE' },
    { token: 'Q-102', name: 'Sneha Kapoor', service: 'Hydra-Facial Glow', chair: 'Spa Suite #02', stylist: 'Ananya Roy', estWait: '8 mins', status: 'WAITING' },
    { token: 'Q-103', name: 'Dr. Sunita Rao', service: 'Keratin Blowdry', chair: 'Station #01', stylist: 'Priya Sharma', estWait: '15 mins', status: 'WAITING' },
  ]);

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
            <Layers className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live Floor Queue Board</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Live chair occupancy, estimated wait times, and client queue sequence for Jubilee Hills branch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {queueItems.map((item) => (
          <div
            key={item.token}
            className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-amber-700 font-mono">{item.token}</span>
              <Badge variant={item.status === 'NEXT_IN_LINE' ? 'success' : 'warning'} className="text-[10px]">
                {item.status.replace('_', ' ')}
              </Badge>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
              <p className="text-xs text-slate-500">{item.service}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Stylist:</span>
                <span className="text-slate-800 font-semibold">{item.stylist}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Station:</span>
                <span className="text-amber-700 font-bold">{item.chair}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Est. Wait:</span>
                <span className="text-emerald-700 font-bold">{item.estWait}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs font-bold shadow-xs"
              onClick={() => toast.success(`Calling ${item.name} to ${item.chair}`)}
            >
              Call to Station →
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
