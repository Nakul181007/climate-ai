'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trees,
  Bus,
  Sun,
  Droplets,
  Wind,
  Shield,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { SECTORS } from '@/lib/demo-data';
import { useClimate } from '@/lib/context/ClimateContext';
import { SectorType } from '@/lib/types';

export function SectorHealthMatrix() {
  const { cityCommitments, selectedCity } = useClimate();

  const getSectorIcon = (id: SectorType) => {
    switch (id) {
      case 'transport':
        return <Bus className="w-4 h-4 text-emerald-800" />;
      case 'energy-access':
        return <Sun className="w-4 h-4 text-amber-700" />;
      case 'informal-settlements':
        return <Shield className="w-4 h-4 text-rose-700" />;
      case 'urban-greening':
        return <Trees className="w-4 h-4 text-forest-700" />;
      case 'waste-water':
        return <Droplets className="w-4 h-4 text-blue-700" />;
      case 'air-quality':
        return <Wind className="w-4 h-4 text-slate-700" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <div className="card-enterprise p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-forest-950">
            Sectoral Execution & Evidence Verification Matrix
          </h3>
          <p className="text-xs text-charcoal-500">
            Empirical progress and verification status across priority verticals for {selectedCity.name}
          </p>
        </div>
        <Link
          href="/admin/commitments"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          View all commitments
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {SECTORS.map((sector) => {
          const sectorCommitments = cityCommitments.filter(
            (c) => c.sector === sector.id
          );
          const total = sectorCommitments.length;
          if (total === 0) return null;

          const onTrack = sectorCommitments.filter((c) => c.progressStatus === 'ON_TRACK').length;
          const atRisk = sectorCommitments.filter((c) => c.progressStatus === 'AT_RISK').length;
          const offTrack = sectorCommitments.filter((c) => c.progressStatus === 'OFF_TRACK').length;

          // Average verified progress for this sector
          const avgVerifiedPct = Math.round(
            (sectorCommitments.reduce((sum, c) => sum + (c.verifiedProgress || 0), 0) / total) * 100
          );
          const avgPlannedPct = Math.round(
            (sectorCommitments.reduce((sum, c) => sum + (c.plannedProgressToDate || 0), 0) / total) * 100
          );

          return (
            <div
              key={sector.id}
              className="p-3.5 rounded-lg border border-charcoal-200 bg-background hover:bg-surface hover:border-charcoal-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-surface border border-charcoal-200 shrink-0">
                    {getSectorIcon(sector.id)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal-900 leading-none">
                      {sector.name}
                    </h4>
                    <span className="text-[11px] text-charcoal-500 mt-0.5 block line-clamp-1">
                      {sector.primaryIndicator}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1 justify-end font-mono">
                    <span className="text-xs font-bold text-forest-900">{avgVerifiedPct}%</span>
                    <span className="text-[10px] text-charcoal-400">/ {avgPlannedPct}% planned</span>
                  </div>
                  <span className="text-[10px] text-charcoal-400 font-medium">
                    {total} target{total > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Progress bar comparison: Verified vs Planned */}
              <div className="space-y-1 mt-2">
                <div className="h-2 w-full bg-charcoal-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-forest-800 transition-all"
                    style={{ width: `${Math.min(100, avgVerifiedPct)}%` }}
                    title={`Verified: ${avgVerifiedPct}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-500 pt-0.5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {onTrack} On Track
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {atRisk} At Risk
                    </span>
                    <span className="flex items-center gap-1 text-rose-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      {offTrack} Off Track
                    </span>
                  </div>
                  <span className="text-charcoal-400">
                    Gap: {Math.max(0, avgPlannedPct - avgVerifiedPct)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
