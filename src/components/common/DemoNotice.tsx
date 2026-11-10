'use client';

import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';

export function DemoNotice() {
  const { isDemoMode } = useClimate();

  if (!isDemoMode) return null;

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="font-semibold uppercase tracking-wider text-[11px] bg-amber-200/70 text-amber-950 px-1.5 py-0.5 rounded">
          Hackathon Demonstration Mode
        </span>
        <span className="text-amber-800">
          <strong>SIMULATED DEMONSTRATION DATA — NOT OFFICIAL OBSERVATIONS.</strong> Sentinel-2 and municipal telemetry values are realistic synthetic scenarios calibrated for the hackathon prototype.
        </span>
      </div>
      <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-amber-700 shrink-0">
        <Info className="w-3.5 h-3.5" />
        <span>Scientific Integrity Protocol Active</span>
      </div>
    </div>
  );
}

