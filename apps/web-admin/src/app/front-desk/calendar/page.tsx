'use client';

import * as React from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button, Badge, useToast } from '@hive/ui';

export default function FrontDeskCalendarPage() {
  const toast = useToast();

  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];
  const stylists = ['Priya Sharma (Station 1)', 'Rajesh Kumar (Station 3)', 'Ananya Roy (Spa Suite 2)', 'Vikram Malhotra (Station 2)'];

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
              <Calendar className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Multi-Stylist Floor Calendar</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thursday, September 10, 2026 • Real-time schedule by stylist chair.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-bold text-slate-900 px-2">Today</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header Row with Stylists */}
          <div className="grid grid-cols-5 border-b border-slate-200 p-3 bg-slate-50/80 text-xs font-bold">
            <div className="text-slate-500">Time Slot</div>
            {stylists.map((s, idx) => (
              <div key={idx} className="text-amber-800 truncate">{s}</div>
            ))}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-100 text-xs font-mono">
            {timeSlots.map((time, idx) => (
              <div key={idx} className="grid grid-cols-5 p-3 items-center hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-semibold">{time}</span>
                {idx === 2 ? (
                  <div className="col-span-1 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold font-sans shadow-xs">
                    Priya Sharma (Balayage)
                  </div>
                ) : idx === 4 ? (
                  <div className="col-span-1 p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-bold font-sans shadow-xs">
                    Rahul Verma (Cut)
                  </div>
                ) : (
                  <div className="text-slate-400 text-[11px] font-sans">Available</div>
                )}
                <div className="text-slate-400 text-[11px] font-sans">Available</div>
                <div className="text-slate-400 text-[11px] font-sans">Available</div>
                <div className="text-slate-400 text-[11px] font-sans">Available</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
