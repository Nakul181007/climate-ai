'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Coins,
  Cpu,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import { DEMO_RECOMMENDATIONS, SECTORS } from '@/lib/demo-data';

export default function RecommendationsPage() {
  const { selectedCity, selectedCityId } = useClimate();
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  const recommendations = DEMO_RECOMMENDATIONS.filter(
    (r) =>
      r.cityId === selectedCityId &&
      (sectorFilter === 'all' || r.sector === sectorFilter)
  ).sort((a, b) => a.climateImpactRank - b.climateImpactRank);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Evidence-to-Action Decision Matrix
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              Multi-Criteria Ranking
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Ranked Climate Interventions &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Prioritized corrective engineering interventions derived deterministically from audit findings and empirical data gaps.
          </p>
        </div>

        <Link
          href="/admin/simulator"
          className="px-4 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Launch Scenario Simulator</span>
        </Link>
      </div>

      {/* Methodology Explainer Card */}
      <div className="card-enterprise p-4 bg-charcoal-50/70 border-charcoal-200 text-xs text-charcoal-700 leading-relaxed">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-charcoal-900 block mb-0.5">
              Transparent Multi-Criteria Ranking Formulation:
            </span>
            Composite Score is calculated deterministically as:
            <span className="font-mono text-emerald-900 font-bold ml-1">
              [Impact (35%) + Feasibility (25%) + Cost Tier (20%) + Urgency (20%)]
            </span>.
            Estimates are explicitly flagged as <strong>HYPOTHETICAL SIMULATIONS</strong> in strict compliance with the Scientific Integrity Protocol.
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-charcoal-200">
        <Filter className="w-4 h-4 text-charcoal-500 ml-2" />
        <span className="text-xs font-bold text-charcoal-800 mr-2">Filter Sector:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSectorFilter('all')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              sectorFilter === 'all'
                ? 'bg-forest-900 text-white font-bold'
                : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
            }`}
          >
            All Sectors
          </button>
          {SECTORS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSectorFilter(s.id)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                sectorFilter === s.id
                  ? 'bg-forest-900 text-white font-bold'
                  : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="card-enterprise p-5 flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-forest-900 text-emerald-300 flex items-center justify-center text-xs font-bold font-mono">
                      #{rec.climateImpactRank}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                      Composite Score: {rec.compositeScore}/100
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        rec.urgency === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Urgency: {rec.urgency}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-600 font-semibold uppercase">
                    SIMULATION ESTIMATE
                  </span>
                </div>

                <h3 className="text-base font-bold text-forest-950 mb-2">
                  {rec.title}
                </h3>

                {/* Audit Evidence Rationale */}
                <div className="p-3.5 rounded-lg bg-charcoal-50 border border-charcoal-200/80 mb-3 text-xs text-charcoal-700 leading-relaxed font-sans">
                  <span className="font-bold text-charcoal-900 block mb-0.5 uppercase text-[11px] tracking-wider">
                    Audit Evidence Traceability Rationale:
                  </span>
                  {rec.rationale}
                </div>

                {/* Prerequisites */}
                <div className="mb-3 space-y-1">
                  <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                    Key Implementation Prerequisites:
                  </span>
                  <ul className="grid sm:grid-cols-2 gap-1.5 text-xs text-charcoal-700">
                    {rec.implementationPrerequisites.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-charcoal-100 text-charcoal-600">
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Estimated Capital Required</span>
                    <span className="font-bold text-charcoal-900 font-mono">
                      ₹{rec.estimatedCostInrCrores} Crores ({rec.estimatedCostTier})
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Projected Carbon Offset</span>
                    <span className="font-bold text-emerald-800 font-mono">
                      ~{rec.expectedCarbonOffsetTonsPerYear} Tons CO2 / yr
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Climate Impact Score</span>
                    <span className="font-bold text-charcoal-900 font-mono">{rec.climateImpactScore} / 100</span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Feasibility Score</span>
                    <span className="font-bold text-charcoal-900 font-mono">{rec.feasibilityScore} / 100</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-charcoal-100 text-xs">
                <span className="text-charcoal-400 text-[11px]">
                  Associated Target ID: {rec.commitmentId}
                </span>

                <Link
                  href={`/admin/simulator`}
                  className="font-bold text-forest-900 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span>Model in What-If Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="card-enterprise p-12 text-center text-charcoal-500">
            <h3 className="text-sm font-bold text-charcoal-800">
              No recommendations found for this sector filter.
            </h3>
          </div>
        )}
      </div>

    </div>
  );
}

