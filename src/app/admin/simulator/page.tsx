'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sliders,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Coins,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Bus,
  Layers,
  Flame,
  Check,
  XCircle,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import {
  INITIAL_WHAT_IF_CONFIG,
  calculateWhatIfModel,
} from '@/lib/demo-data';
import { WhatIfModelConfig } from '@/lib/types';

export default function ClimateSimulatorPage() {
  const { selectedCity } = useClimate();

  const [config, setConfig] = useState<WhatIfModelConfig>(INITIAL_WHAT_IF_CONFIG);

  const modelResult = useMemo(() => {
    return calculateWhatIfModel(config);
  }, [config]);

  const handleReset = () => {
    setConfig(INITIAL_WHAT_IF_CONFIG);
  };

  const handleApplyScenario = (preset: 'excel_default' | 'target_achieved' | 'budget_constrained') => {
    if (preset === 'excel_default') {
      setConfig(INITIAL_WHAT_IF_CONFIG);
    } else if (preset === 'target_achieved') {
      setConfig({
        ...INITIAL_WHAT_IF_CONFIG,
        additionalElectricBuses: 450, // 450 * 0.035 = 15.75%
        additionalCorridors: 6,       // 6 * 1.6 = 9.6%
        // Total: 6% + 15.75% + 9.6% = 31.35% (Meets 30% target!)
      });
    } else if (preset === 'budget_constrained') {
      setConfig({
        ...INITIAL_WHAT_IF_CONFIG,
        additionalElectricBuses: 100, // 100 * 0.035 = 3.5%
        additionalCorridors: 2,       // 2 * 1.6 = 3.2%
        // Total: 6% + 3.5% + 3.2% = 12.7%
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/80">
              Interactive Decision Support
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              Excel Model Worksheet Parity &bull; Transport Decarbonization
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            What-If Scenario Simulator &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 max-w-3xl">
            Simulate policy interventions on municipal fleet electrification and dedicated bus corridors. Instantaneously project emission reductions, capital expenditure, and compliance shortfalls against the 30% statutory target.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-700 shadow-subtle flex items-center gap-1.5 transition-all"
            title="Reset to Excel Initial Baseline"
          >
            <RefreshCw className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </div>

      {/* Scientific & Model Integrity Disclaimer */}
      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>ILLUSTRATIVE DEMONSTRATION DATA — NOT OFFICIAL BUDGET ESTIMATES:</strong> Model coefficients (0.035 pct pts per e-bus, 1.6 pct pts per corridor, INR 1.2 Cr/bus, INR 45 Cr/corridor) preserve the illustrative assumptions documented in the Climate Tracker Prototype Plan Excel workbook.
        </div>
      </div>

      {/* Preset Scenario Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        <span className="text-xs text-charcoal-500 font-medium mr-1">Scenario Presets:</span>
        <button
          onClick={() => handleApplyScenario('excel_default')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            config.additionalElectricBuses === 200 && config.additionalCorridors === 3
              ? 'bg-forest-900 text-white border-forest-900 shadow-subtle'
              : 'bg-surface text-charcoal-700 border-charcoal-200 hover:bg-charcoal-50'
          }`}
        >
          Excel Baseline (200 Buses, 3 Corridors)
        </button>

        <button
          onClick={() => handleApplyScenario('target_achieved')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            config.additionalElectricBuses === 450 && config.additionalCorridors === 6
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-subtle'
              : 'bg-surface text-charcoal-700 border-charcoal-200 hover:bg-charcoal-50'
          }`}
        >
          Target Fulfillment Scenario (450 Buses, 6 Corridors &rarr; 31.4%)
        </button>

        <button
          onClick={() => handleApplyScenario('budget_constrained')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            config.additionalElectricBuses === 100 && config.additionalCorridors === 2
              ? 'bg-charcoal-800 text-white border-charcoal-800 shadow-subtle'
              : 'bg-surface text-charcoal-700 border-charcoal-200 hover:bg-charcoal-50'
          }`}
        >
          Budget-Constrained (100 Buses, 2 Corridors &rarr; 12.7%)
        </button>
      </div>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Levers */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Lever 1: Electric Buses */}
          <div className="card-enterprise p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-forest-950">
                    Additional Electric Buses (Lever 1)
                  </h3>
                  <span className="text-[11px] text-charcoal-500 block">
                    Procurement & deployment across BEST suburban feeder networks
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono text-forest-950">
                  {config.additionalElectricBuses}
                </span>
                <span className="text-xs text-charcoal-500 font-medium ml-1">buses</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="600"
              step="20"
              value={config.additionalElectricBuses}
              onChange={(e) =>
                setConfig({
                  ...config,
                  additionalElectricBuses: Number(e.target.value),
                })
              }
              className="w-full accent-forest-900 cursor-pointer h-2 bg-charcoal-200 rounded-lg"
              aria-label="Additional Electric Buses"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-500 pt-1 border-t border-charcoal-100">
              <span>Unit Impact: +{config.reductionPerBusPctPoints}% pts / bus</span>
              <span>Unit Cost: INR {config.busCostInrCrore} Cr / bus</span>
              <span className="font-bold text-forest-900">
                Subtotal: INR {(config.additionalElectricBuses * config.busCostInrCrore).toFixed(1)} Cr
              </span>
            </div>
          </div>

          {/* Lever 2: Bus Lane Corridors */}
          <div className="card-enterprise p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-forest-950">
                    Dedicated Bus Lane Corridors (Lever 2)
                  </h3>
                  <span className="text-[11px] text-charcoal-500 block">
                    Physically demarcated bus rapid transit corridors along Western & Eastern Express Highways
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono text-forest-950">
                  {config.additionalCorridors}
                </span>
                <span className="text-xs text-charcoal-500 font-medium ml-1">corridors</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={config.additionalCorridors}
              onChange={(e) =>
                setConfig({
                  ...config,
                  additionalCorridors: Number(e.target.value),
                })
              }
              className="w-full accent-forest-900 cursor-pointer h-2 bg-charcoal-200 rounded-lg"
              aria-label="Dedicated Bus Lane Corridors"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-500 pt-1 border-t border-charcoal-100">
              <span>Unit Impact: +{config.reductionPerCorridorPctPoints}% pts / corridor</span>
              <span>Unit Cost: INR {config.corridorCostInrCrore} Cr / corridor</span>
              <span className="font-bold text-forest-900">
                Subtotal: INR {(config.additionalCorridors * config.corridorCostInrCrore).toFixed(1)} Cr
              </span>
            </div>
          </div>

          {/* Model Assumptions Table (Exact from Excel Sheet6) */}
          <div className="card-enterprise p-5 bg-charcoal-50/60 border-charcoal-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-600 font-mono mb-2">
              Model Assumption Parameters (Excel Sheet6)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-surface border border-charcoal-200">
                <span className="text-[10px] text-charcoal-400 block">Baseline Reduction Achieved</span>
                <span className="font-bold text-charcoal-800">{config.baselineReductionAchieved}%</span>
              </div>
              <div className="p-2 rounded bg-surface border border-charcoal-200">
                <span className="text-[10px] text-charcoal-400 block">Target Statutory Reduction</span>
                <span className="font-bold text-charcoal-800">{config.targetReductionPct}%</span>
              </div>
              <div className="p-2 rounded bg-surface border border-charcoal-200">
                <span className="text-[10px] text-charcoal-400 block">Target Horizon</span>
                <span className="font-bold text-charcoal-800">By 2030</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Projected Outcomes & Impact Scorecard */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Outcome Scorecard */}
          <div className="card-enterprise p-6 bg-surface border-charcoal-200 shadow-elevated space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
              <h3 className="text-sm font-bold text-forest-950 uppercase tracking-wide font-mono">
                Simulation Scorecard
              </h3>
              <span
                className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  modelResult.targetAchieved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {modelResult.targetAchieved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Target Achieved: YES
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Target Achieved: NO
                  </>
                )}
              </span>
            </div>

            {/* Projected Reduction Display */}
            <div>
              <div className="flex items-center justify-between text-xs text-charcoal-500 mb-1">
                <span>Projected Emissions Reduction by 2030</span>
                <span className="font-mono font-bold text-charcoal-700">
                  Target: {config.targetReductionPct}%
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-mono tracking-tight text-forest-950">
                  {modelResult.projectedReductionPct}%
                </span>
                <span className="text-xs text-charcoal-500 font-medium">
                  {modelResult.targetAchieved ? 'Surpasses goal' : `Shortfall: ${modelResult.targetShortfallPctPoints}% pts`}
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-charcoal-200 h-3 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full transition-all duration-300 ${
                    modelResult.targetAchieved ? 'bg-emerald-600' : 'bg-forest-800'
                  }`}
                  style={{ width: `${Math.min(100, (modelResult.projectedReductionPct / config.targetReductionPct) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cost Breakdown Box */}
            <div className="p-4 rounded-xl bg-charcoal-50 border border-charcoal-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  Total Estimated Capital Cost
                </span>
                <span className="text-xs font-mono font-bold text-charcoal-500">
                  INR Crores
                </span>
              </div>

              <div className="text-3xl font-extrabold font-mono text-forest-950">
                INR {modelResult.estimatedCostInrCrore} <span className="text-base font-bold text-charcoal-600">Crore</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-charcoal-200/80 text-[11px] font-mono text-charcoal-600">
                <div>
                  <span className="text-charcoal-400 block">Bus Fleet Cost:</span>
                  <span className="font-bold text-charcoal-900">
                    INR {(config.additionalElectricBuses * config.busCostInrCrore).toFixed(1)} Cr
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-400 block">Corridor Infra Cost:</span>
                  <span className="font-bold text-charcoal-900">
                    INR {(config.additionalCorridors * config.corridorCostInrCrore).toFixed(1)} Cr
                  </span>
                </div>
              </div>
            </div>

            {/* Calculation Traceability Explainer */}
            <div className="text-xs text-charcoal-600 space-y-1.5 pt-2 border-t border-charcoal-100 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Baseline achieved:</span>
                <strong>{config.baselineReductionAchieved}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Bus fleet contribution:</span>
                <strong>+{(config.additionalElectricBuses * config.reductionPerBusPctPoints).toFixed(2)}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Corridor contribution:</span>
                <strong>+{(config.additionalCorridors * config.reductionPerCorridorPctPoints).toFixed(2)}%</strong>
              </div>
              <div className="flex justify-between text-forest-950 font-bold pt-1 border-t border-charcoal-200">
                <span>Net Projected Output:</span>
                <span>{modelResult.projectedReductionPct}%</span>
              </div>
            </div>

            <Link
              href="/admin/recommendations"
              className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center justify-center gap-1.5 transition-all text-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Review Ranked Interventions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
