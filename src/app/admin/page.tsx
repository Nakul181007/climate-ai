'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertOctagon,
  FileText,
  Cpu,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  Layers,
  Download,
  AlertCircle,
  ExternalLink,
  Satellite,
  Database,
  Sliders,
  Scale,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import { StatusDistributionChart } from '@/components/dashboard/StatusDistributionChart';
import { SectorHealthMatrix } from '@/components/dashboard/SectorHealthMatrix';
import { RecentActivityTimeline } from '@/components/dashboard/RecentActivityTimeline';

export default function AdminDashboardPage() {
  const { selectedCity, stats, cityAlerts, cityCommitments } = useClimate();

  const criticalAlert = cityAlerts.find((a) => a.severity === 'CRITICAL');
  const highAlert = cityAlerts.find((a) => a.severity === 'HIGH');

  const highestOverstatement = useMemo(() => {
    return [...cityCommitments]
      .filter((c) => typeof c.reportingOverstatement === 'number' && c.reportingOverstatement > 0)
      .sort((a, b) => b.reportingOverstatement - a.reportingOverstatement)[0];
  }, [cityCommitments]);

  return (
    <div className="space-y-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/80">
              Government Executive Command
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              Empirical Portfolio Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
            Climate Accountability Portfolio &bull; {selectedCity.name}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-3xl leading-relaxed">
            Empirical cross-verification of {selectedCity.climateActionPlanName} statutory targets using calibrated Copernicus Sentinel-2 Earth observation, CPCB telemetry, and municipal demonstration records.
          </p>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/policies"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-800 shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-forest-700" />
            <span>Ingest Policy PDF</span>
          </Link>

          <Link
            href="/admin/audit-workspace"
            className="px-4 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Critical Early Warning Alert Bar */}
      {criticalAlert && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-800 shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                  Critical Discrepancy Detected:
                </span>
                <span className="text-xs font-semibold text-rose-800">
                  {criticalAlert.title}
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5 leading-snug">
                {criticalAlert.message}
              </p>
            </div>
          </div>

          <Link
            href={criticalAlert.actionRoute || '/admin/audit-workspace'}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-700 hover:bg-rose-800 text-white shrink-0 flex items-center gap-1 shadow-subtle transition-all"
          >
            <span>Review Audit Evidence</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Bespoke Executive Portfolio Strip (Mathematical Parity with Excel Model) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Metric 1: Overall Verified Progress (Excel Sheet5 cell C15) */}
        <div className="lg:col-span-4 card-enterprise p-5 flex flex-col justify-between border-l-4 border-l-forest-800">
          <div>
            <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold mb-2">
              <span>Overall Verified Score</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-forest-50 text-forest-900 rounded border border-forest-200">
                Avg Verified / Planned
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-forest-950 font-mono tracking-tight">
                {stats.overallVerifiedScorePct}%
              </span>
              <span className="text-xs text-charcoal-500 font-medium">
                across {stats.totalCommitments} pilot targets
              </span>
            </div>
            <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
              Derived from empirical Earth observation indices and continuous sensor feeds across Transport, Energy, and Settlements.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-charcoal-100">
            <div className="flex items-center justify-between text-xs font-mono text-charcoal-500 mb-1">
              <span>Trajectory Fulfillment</span>
              <span className="font-bold text-forest-900">{stats.overallVerifiedScorePct}% / 100%</span>
            </div>
            <div className="w-full bg-charcoal-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-forest-800 h-full rounded-full transition-all"
                style={{ width: `${stats.overallVerifiedScorePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Average Reporting Overstatement (Excel Sheet5 cell C14) */}
        <div className="lg:col-span-4 card-enterprise p-5 flex flex-col justify-between border-l-4 border-l-amber-600">
          <div>
            <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold mb-2">
              <span>Average Reporting Overstatement</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-50 text-amber-900 rounded border border-amber-200">
                Self-Reported vs. Verified
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-amber-800 font-mono tracking-tight">
                +{stats.avgReportingOverstatementPct} pp
              </span>
              <span className="text-xs text-amber-700 font-medium">
                divergence index
              </span>
            </div>
            <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
              Municipal self-reports claim an average of {stats.avgReportingOverstatementPct} percentage points higher progress than confirmed by independent sensors.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-charcoal-100 text-xs text-charcoal-500 flex items-center justify-between">
            <span className="truncate">
              {highestOverstatement
                ? `Highest in: ${highestOverstatement.title.length > 28 ? highestOverstatement.title.substring(0, 26) + '...' : highestOverstatement.title} (+${(highestOverstatement.reportingOverstatement * 100).toFixed(1)} pp)`
                : 'No divergence reported'}
            </span>
            <Link
              href="/admin/commitments"
              className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-0.5 shrink-0"
            >
              Examine
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Dual-Axis Portfolio Health Summary */}
        <div className="lg:col-span-4 card-enterprise p-5 flex flex-col justify-between border-l-4 border-l-emerald-700">
          <div>
            <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold mb-2">
              <span>Implementation Status Matrix</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200">
                Excel Thresholds
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                <span className="text-xl font-bold font-mono text-emerald-800 block">
                  {stats.onTrack}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">
                  On Track
                </span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200">
                <span className="text-xl font-bold font-mono text-amber-800 block">
                  {stats.atRisk}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700">
                  At Risk
                </span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50/60 border border-rose-200">
                <span className="text-xl font-bold font-mono text-rose-800 block">
                  {stats.offTrack}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-700">
                  Off Track
                </span>
              </div>
            </div>

            <p className="text-[11px] text-charcoal-500 mt-3 leading-snug">
              Thresholds: On Track (Gap &le; 5%), At Risk (5% &lt; Gap &le; 15%), Off Track (Gap &gt; 15%).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs">
            <span className="text-charcoal-500">Audits verified:</span>
            <span className="font-bold text-forest-900 font-mono">
              {stats.auditsCompleted} of {stats.totalCommitments} targets
            </span>
          </div>
        </div>

      </div>

      {/* Main Analytical Section: Sector Matrix & Verification Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SectorHealthMatrix />
        </div>
        <div className="lg:col-span-4">
          <StatusDistributionChart />
        </div>
      </div>

      {/* Cross-Cutting Modules: What-If CTA & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* What-If Simulator Spotlight */}
        <div className="lg:col-span-7 card-enterprise p-6 bg-gradient-to-br from-surface to-charcoal-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                Decision Support Simulator
              </span>
              <span className="text-xs font-mono text-charcoal-400">
                Interactive Levers
              </span>
            </div>
            <h3 className="text-lg font-bold text-forest-950">
              Run What-If Scenarios on Transport & Energy Targets
            </h3>
            <p className="text-xs text-charcoal-600 mt-1.5 leading-relaxed max-w-xl">
              Model real-world policy levers such as inducting 200 electric buses or building 3 dedicated bus corridors. Calculate projected emissions reduction, capital expenditure, and target shortfall in real time.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-surface border border-charcoal-200">
                <span className="text-charcoal-400 text-[10px] block uppercase">Current Baseline</span>
                <span className="text-sm font-bold text-charcoal-900">6.0% Achieved</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface border border-charcoal-200">
                <span className="text-charcoal-400 text-[10px] block uppercase">Target Horizon</span>
                <span className="text-sm font-bold text-charcoal-900">30.0% by 2030</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface border border-charcoal-200">
                <span className="text-charcoal-400 text-[10px] block uppercase">Illustrative Gap</span>
                <span className="text-sm font-bold text-rose-700">12.2 pp Shortfall</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-charcoal-200 flex items-center justify-between">
            <span className="text-xs text-charcoal-500">
              Preserves exact Excel model coefficients & assumptions
            </span>
            <Link
              href="/admin/simulator"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open What-If Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-5">
          <RecentActivityTimeline />
        </div>

      </div>

    </div>
  );
}
