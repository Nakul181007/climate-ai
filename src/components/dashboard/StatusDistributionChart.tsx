'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useClimate } from '@/lib/context/ClimateContext';

export function StatusDistributionChart() {
  const { stats } = useClimate();
  const [activeTab, setActiveTab] = useState<'progress' | 'audit'>('progress');

  const progressData = [
    {
      name: 'On Track (Gap <= 5%)',
      value: stats.onTrack,
      color: '#059669',
      bgColor: 'bg-emerald-500',
    },
    {
      name: 'At Risk (Gap 5% - 15%)',
      value: stats.atRisk,
      color: '#D97706',
      bgColor: 'bg-amber-500',
    },
    {
      name: 'Off Track (Gap > 15%)',
      value: stats.offTrack,
      color: '#DC2626',
      bgColor: 'bg-rose-500',
    },
  ].filter((item) => item.value > 0);

  const auditData = [
    {
      name: 'Supported',
      value: stats.supported,
      color: '#059669',
      bgColor: 'bg-emerald-500',
    },
    {
      name: 'Partially Supported',
      value: stats.partiallySupported,
      color: '#D97706',
      bgColor: 'bg-amber-500',
    },
    {
      name: 'Inconclusive (No data)',
      value: stats.inconclusive,
      color: '#64748B',
      bgColor: 'bg-slate-400',
    },
    {
      name: 'Potential Discrepancy',
      value: stats.potentialDiscrepancy,
      color: '#DC2626',
      bgColor: 'bg-rose-500',
    },
  ].filter((item) => item.value > 0);

  const data = activeTab === 'progress' ? progressData : auditData;
  const total = stats.totalCommitments || 1;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = Math.round((item.value / total) * 100);
      return (
        <div className="bg-surface p-2.5 rounded-lg border border-charcoal-200 shadow-elevated text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-bold text-charcoal-900">{item.name}</span>
          </div>
          <p className="text-charcoal-600 font-mono">
            {item.value} Target{item.value > 1 ? 's' : ''} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-enterprise p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-forest-950">
              {activeTab === 'progress' ? 'Implementation Trajectory' : 'Evidence Audit Outcome'}
            </h3>
            <p className="text-xs text-charcoal-500">
              {activeTab === 'progress'
                ? 'Gap vs. statutory target (Excel methodology)'
                : 'Scientific corroboration vs. self-reported claims'}
            </p>
          </div>

          {/* Toggle pill */}
          <div className="flex items-center bg-charcoal-100 p-0.5 rounded-lg border border-charcoal-200 text-[10px] font-semibold">
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-2 py-1 rounded-md transition-all ${
                activeTab === 'progress'
                  ? 'bg-surface text-forest-900 shadow-subtle font-bold'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-2 py-1 rounded-md transition-all ${
                activeTab === 'audit'
                  ? 'bg-surface text-forest-900 shadow-subtle font-bold'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Audit
            </button>
          </div>
        </div>
      </div>

      <div className="h-48 w-full my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-charcoal-100">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${item.bgColor} shrink-0`} />
            <span className="text-charcoal-600 truncate text-[11px]">{item.name.split(' (')[0]}</span>
            <span className="font-mono font-bold text-charcoal-900 ml-auto text-[11px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
