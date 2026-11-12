'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Satellite,
  Compass,
  Info,
  ExternalLink,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SECTORS } from '@/lib/demo-data';

export default function CitizenTrackerPage() {
  const { cityCommitments, selectedCity, language } = useClimate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredCommitments = useMemo(() => {
    return cityCommitments.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.originalPolicyStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.geographicalCoverage.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === 'all' || c.sector === selectedSector;
      const matchesStatus =
        selectedStatus === 'all' || c.currentAuditStatus === selectedStatus;

      return matchesSearch && matchesSector && matchesStatus;
    });
  }, [cityCommitments, searchQuery, selectedSector, selectedStatus]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/80">
              Citizen Accountability Tracker
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              {filteredCommitments.length} Promises Monitored &bull; Excel Model Parity
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Climate Promise Tracker &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 max-w-3xl">
            Track official promises from the {selectedCity.climateActionPlanName} and inspect what satellites and sensors have verified.
          </p>
        </div>

        <Link
          href="/citizen/assistant"
          className="px-4 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ask AI Assistant</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-surface border border-charcoal-200 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search by promise, locality (e.g., Aarey, Chembur, Swargate)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-charcoal-200 bg-background focus:bg-surface focus:outline-none focus:ring-2 focus:ring-forest-800/20 text-charcoal-900 placeholder:text-charcoal-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              aria-label="Filter by Sector"
              className="px-3 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Sectors</option>
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Verification Status"
              className="px-3 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="SUPPORTED">Verified / Supported</option>
              <option value="PARTIALLY_SUPPORTED">Progress Underway</option>
              <option value="INCONCLUSIVE">Unverified / Data Gap</option>
              <option value="POTENTIAL_DISCREPANCY">Discrepancy / Attention Needed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-4">
        {filteredCommitments.map((commitment) => {
          const overstatementPct = (commitment.reportingOverstatement * 100).toFixed(1);
          const gapPct = (commitment.gapVsPlan * 100).toFixed(1);

          return (
            <div
              key={commitment.id}
              className="card-enterprise p-5 flex flex-col justify-between hover:border-charcoal-300 transition-all space-y-3"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider font-mono">
                    Locality: {commitment.geographicalCoverage}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        commitment.progressStatus === 'ON_TRACK'
                          ? 'bg-emerald-100 text-emerald-800'
                          : commitment.progressStatus === 'AT_RISK'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {commitment.progressStatus.replace('_', ' ')}
                    </span>
                    <StatusBadge status={commitment.currentAuditStatus} size="sm" />
                  </div>
                </div>

                <h2 className="text-base font-bold text-forest-950 mb-2">
                  {commitment.title}
                </h2>

                <div className="bg-charcoal-50 p-3.5 rounded-lg border border-charcoal-200/70 mb-3 text-xs text-charcoal-700 leading-relaxed">
                  <span className="font-bold text-charcoal-900 block mb-0.5 font-mono text-[11px]">
                    What Did The City Promise?
                  </span>
                  &ldquo;{commitment.originalPolicyStatement}&rdquo;
                </div>

                {/* Mathematical Progress Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono bg-background p-3 rounded-lg border border-charcoal-200">
                  <div>
                    <span className="text-charcoal-400 text-[10px] block uppercase">Planned Progress</span>
                    <span className="font-bold text-charcoal-800">
                      {(commitment.plannedProgressToDate * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 text-[10px] block uppercase">City Claimed</span>
                    <span className="font-bold text-charcoal-800">
                      {(commitment.cityReportedProgress * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-forest-700 text-[10px] block uppercase font-bold">Verified Reality</span>
                    <span className="font-bold text-forest-950">
                      {(commitment.verifiedProgress * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 text-[10px] block uppercase">Gap vs Plan</span>
                    <span className={`font-bold ${commitment.gapVsPlan > 0.15 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {gapPct}%
                    </span>
                  </div>
                </div>

                {/* Overstatement Warning if Significant */}
                {commitment.reportingOverstatement > 0.10 && (
                  <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      <strong>High Divergence:</strong> Official reports overstate verified progress by <strong>+{overstatementPct} percentage points</strong>.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-1 border-t border-charcoal-100 text-xs">
                <span className="text-charcoal-500 text-[11px] flex items-center gap-1 font-mono">
                  <Satellite className="w-3.5 h-3.5 text-emerald-700" />
                  Verified via Sentinel-2 & Ground Telemetry
                </span>

                <Link
                  href="/citizen/assistant"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Ask AI Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
