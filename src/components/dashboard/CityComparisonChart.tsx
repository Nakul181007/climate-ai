'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CITIES } from '@/lib/demo-data';
import { useClimate } from '@/lib/context/ClimateContext';

export function CityComparisonChart() {
  const { commitments } = useClimate();

  const mumbaiCommitments = commitments.filter((c) => c.cityId === 'mumbai');
  const puneCommitments = commitments.filter((c) => c.cityId === 'pune');

  const data = [
    {
      category: 'Total Commitments',
      Mumbai: mumbaiCommitments.length,
      Pune: puneCommitments.length,
    },
    {
      category: 'Audits Completed',
      Mumbai: mumbaiCommitments.filter((c) => c.currentAuditStatus !== 'PENDING_AUDIT').length,
      Pune: puneCommitments.filter((c) => c.currentAuditStatus !== 'PENDING_AUDIT').length,
    },
    {
      category: 'Supported / Verified',
      Mumbai: mumbaiCommitments.filter((c) => c.currentAuditStatus === 'SUPPORTED').length,
      Pune: puneCommitments.filter((c) => c.currentAuditStatus === 'SUPPORTED').length,
    },
    {
      category: 'Gaps / Inconclusive',
      Mumbai: mumbaiCommitments.filter(
        (c) =>
          c.currentAuditStatus === 'POTENTIAL_DISCREPANCY' ||
          c.currentAuditStatus === 'INCONCLUSIVE'
      ).length,
      Pune: puneCommitments.filter(
        (c) =>
          c.currentAuditStatus === 'POTENTIAL_DISCREPANCY' ||
          c.currentAuditStatus === 'INCONCLUSIVE'
      ).length,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-2.5 rounded-lg border border-charcoal-200 shadow-elevated text-xs">
          <p className="font-bold text-charcoal-900 mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`entry-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-charcoal-600">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-charcoal-900">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-enterprise p-5 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-forest-950">
            Jurisdictional Comparison: Mumbai vs Pune
          </h3>
          <p className="text-xs text-charcoal-500">
            Cross-city climate audit capacity and evidence convergence
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-900" />
            <span className="text-charcoal-700 font-medium">Mumbai</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-charcoal-700 font-medium">Pune</span>
          </span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Mumbai" fill="#0E2E23" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pune" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between text-[11px] text-charcoal-500">
        <span>Both cities integrated under Maharashtra State Climate Cell standard</span>
        <span className="font-mono text-[10px]">Method: ISO 14064 & Copernicus</span>
      </div>
    </div>
  );
}

