'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ListCheck,
  Cpu,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Building,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SECTORS } from '@/lib/demo-data';
import { SectorType, ProgressStatus, AuditOutcome } from '@/lib/types';

export default function CommitmentDirectoryPage() {
  const { cityCommitments, selectedCity } = useClimate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedProgressStatus, setSelectedProgressStatus] = useState<string>('all');
  const [selectedAuditStatus, setSelectedAuditStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'gap' | 'overstatement' | 'year' | 'title'>('gap');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredCommitments = useMemo(() => {
    return cityCommitments
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.originalPolicyStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.responsibleAuthority.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSector = selectedSector === 'all' || c.sector === selectedSector;
        const matchesProgress =
          selectedProgressStatus === 'all' || c.progressStatus === selectedProgressStatus;
        const matchesAudit =
          selectedAuditStatus === 'all' || c.currentAuditStatus === selectedAuditStatus;
        const matchesYear =
          selectedYear === 'all' || c.targetYear.toString() === selectedYear;

        return matchesSearch && matchesSector && matchesProgress && matchesAudit && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === 'gap') {
          return (b.gapVsPlan || 0) - (a.gapVsPlan || 0);
        }
        if (sortBy === 'overstatement') {
          return (b.reportingOverstatement || 0) - (a.reportingOverstatement || 0);
        }
        if (sortBy === 'year') {
          return a.targetYear - b.targetYear;
        }
        return a.title.localeCompare(b.title);
      });
  }, [
    cityCommitments,
    searchQuery,
    selectedSector,
    selectedProgressStatus,
    selectedAuditStatus,
    selectedYear,
    sortBy,
  ]);

  const getProgressStatusBadge = (status: ProgressStatus) => {
    switch (status) {
      case 'ON_TRACK':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            ON TRACK
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            AT RISK
          </span>
        );
      case 'OFF_TRACK':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            OFF TRACK
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/80">
              Statutory Commitments Register
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              {filteredCommitments.length} Active Targets &bull; Excel Model Parity
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Climate Commitment Directory &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 max-w-2xl">
            Detailed tracking comparing planned targets, municipal claims, and independently verified satellite and sensor telemetry.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-charcoal-100 p-0.5 rounded-lg border border-charcoal-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-surface text-forest-900 shadow-subtle'
                  : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
              title="Table View (Data Rich)"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'cards'
                  ? 'bg-surface text-forest-900 shadow-subtle'
                  : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
              title="Card View (Editorial)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/admin/policies"
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ingest Policy PDF</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-surface border border-charcoal-200 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search by commitment title, policy text, or authority..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-charcoal-200 bg-background focus:bg-surface focus:outline-none focus:ring-2 focus:ring-forest-800/20 text-charcoal-900 placeholder:text-charcoal-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Sector Select */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              aria-label="Filter by Sector"
              className="px-2.5 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Sectors</option>
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Progress Status Select (Excel) */}
            <select
              value={selectedProgressStatus}
              onChange={(e) => setSelectedProgressStatus(e.target.value)}
              aria-label="Filter by Progress Status"
              className="px-2.5 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Progress</option>
              <option value="ON_TRACK">On Track</option>
              <option value="AT_RISK">At Risk</option>
              <option value="OFF_TRACK">Off Track</option>
            </select>

            {/* Audit Status Select */}
            <select
              value={selectedAuditStatus}
              onChange={(e) => setSelectedAuditStatus(e.target.value)}
              aria-label="Filter by Audit Outcome"
              className="px-2.5 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Audit Outcomes</option>
              <option value="SUPPORTED">Supported</option>
              <option value="PARTIALLY_SUPPORTED">Partially Supported</option>
              <option value="INCONCLUSIVE">Inconclusive</option>
              <option value="POTENTIAL_DISCREPANCY">Potential Discrepancy</option>
              <option value="PENDING_AUDIT">Pending Audit</option>
            </select>

            {/* Target Year Select */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="Filter by Target Year"
              className="px-2.5 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Target Years</option>
              <option value="2025">Target: 2025</option>
              <option value="2026">Target: 2026</option>
              <option value="2027">Target: 2027</option>
              <option value="2030">Target: 2030</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort Commitments"
              className="px-2.5 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="gap">Sort: Implementation Gap &darr;</option>
              <option value="overstatement">Sort: Overstatement &darr;</option>
              <option value="year">Sort: Target Year</option>
              <option value="title">Sort: Alphabetical</option>
            </select>

          </div>
        </div>
      </div>

      {/* Mode A: Data-Rich Analytical Table */}
      {viewMode === 'table' ? (
        <div className="card-enterprise overflow-hidden border border-charcoal-200 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-50/80 border-b border-charcoal-200 text-charcoal-600 font-semibold font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 min-w-[260px]">Commitment Target</th>
                  <th className="py-3 px-3">Sector</th>
                  <th className="py-3 px-3 text-right">Planned</th>
                  <th className="py-3 px-3 text-right">City-Reported</th>
                  <th className="py-3 px-3 text-right">Verified (Obs.)</th>
                  <th className="py-3 px-3 text-right">Overstatement</th>
                  <th className="py-3 px-3 text-right">Gap vs Plan</th>
                  <th className="py-3 px-3">Progress Status</th>
                  <th className="py-3 px-3">Audit Corroboration</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 bg-surface">
                {filteredCommitments.length > 0 ? (
                  filteredCommitments.map((c) => {
                    const sectorObj = SECTORS.find((s) => s.id === c.sector);
                    const overstatementPct = (c.reportingOverstatement * 100).toFixed(1);
                    const gapPct = (c.gapVsPlan * 100).toFixed(1);

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-charcoal-50/60 transition-colors group"
                      >
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/admin/commitments/${c.id}`}
                            className="font-bold text-forest-950 group-hover:text-emerald-700 transition-colors block text-xs"
                          >
                            {c.title}
                          </Link>
                          <span className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                            {c.responsibleAuthority}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200 whitespace-nowrap">
                            {sectorObj?.name || c.sector}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-medium text-charcoal-700">
                          {(c.plannedProgressToDate * 100).toFixed(0)}%
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-charcoal-900">
                          {(c.cityReportedProgress * 100).toFixed(0)}%
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-forest-900">
                          {(c.verifiedProgress * 100).toFixed(1)}%
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span
                            className={`font-semibold ${
                              c.reportingOverstatement > 0.10
                                ? 'text-rose-700 font-bold'
                                : c.reportingOverstatement > 0.02
                                ? 'text-amber-700'
                                : 'text-charcoal-600'
                            }`}
                          >
                            {c.reportingOverstatement > 0 ? `+${overstatementPct} pp` : `${overstatementPct} pp`}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span
                            className={`font-bold ${
                              c.gapVsPlan > 0.15
                                ? 'text-rose-700'
                                : c.gapVsPlan > 0.05
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {gapPct}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {getProgressStatusBadge(c.progressStatus)}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <StatusBadge status={c.currentAuditStatus} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link
                              href={`/admin/commitments/${c.id}`}
                              className="p-1.5 rounded-lg border border-charcoal-200 hover:bg-charcoal-100 text-charcoal-600 hover:text-charcoal-900 transition-colors"
                              title="Inspect Full Evidence"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href="/admin/audit-workspace"
                              className="px-2 py-1 rounded bg-forest-900 hover:bg-forest-800 text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <Cpu className="w-3 h-3 text-emerald-400" />
                              <span>Audit</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-charcoal-500">
                      No commitments match the specified search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : filteredCommitments.length === 0 ? (
        <div className="card-enterprise p-12 text-center text-charcoal-500">
          <p className="text-sm font-semibold">No commitments match the specified search and filter criteria.</p>
        </div>
      ) : (
        /* Mode B: Editorial Card View */
        <div className="space-y-4">
          {filteredCommitments.map((commitment) => {
            const sectorObj = SECTORS.find((s) => s.id === commitment.sector);
            const overstatementPct = (commitment.reportingOverstatement * 100).toFixed(1);
            const gapPct = (commitment.gapVsPlan * 100).toFixed(1);

            return (
              <div
                key={commitment.id}
                className="card-enterprise p-5 flex flex-col justify-between hover:border-charcoal-300 transition-all space-y-4"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getProgressStatusBadge(commitment.progressStatus)}
                      <StatusBadge status={commitment.currentAuditStatus} size="sm" />
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-700">
                        Target: {commitment.targetYear}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                        {sectorObj?.name || commitment.sector}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-charcoal-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        AI Extraction: {commitment.extractionConfidence}%
                      </span>
                      <span>&bull;</span>
                      <span>Page {commitment.sourcePageNumber}</span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/commitments/${commitment.id}`}
                    className="text-base font-bold text-forest-950 hover:text-emerald-700 transition-colors block mb-1.5"
                  >
                    {commitment.title}
                  </Link>

                  <p className="text-xs text-charcoal-600 leading-relaxed italic bg-charcoal-50/70 p-2.5 rounded-lg border border-charcoal-100 mb-3">
                    &ldquo;{commitment.originalPolicyStatement}&rdquo;
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-background p-3 rounded-lg border border-charcoal-200">
                    <div>
                      <span className="text-charcoal-400 text-[10px] block uppercase">Planned Progress</span>
                      <span className="font-bold text-charcoal-800">
                        {(commitment.plannedProgressToDate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-charcoal-400 text-[10px] block uppercase">City Claimed</span>
                      <span className="font-bold text-charcoal-900">
                        {(commitment.cityReportedProgress * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-charcoal-400 text-[10px] block uppercase">Verified (Obs.)</span>
                      <span className="font-bold text-forest-900">
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
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-charcoal-100 text-xs">
                  <span className="text-[11px] text-charcoal-500 font-medium">
                    Auth: {commitment.responsibleAuthority}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/commitments/${commitment.id}`}
                      className="px-3 py-1.5 rounded-lg border border-charcoal-200 hover:bg-charcoal-50 text-charcoal-800 font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
