'use client';

import React from 'react';
import { LucideIcon, HelpCircle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  explanation: string;
  dataSource: string;
  icon: LucideIcon;
  variant?: 'default' | 'emerald' | 'amber' | 'slate' | 'rose';
  trend?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  explanation,
  dataSource,
  icon: Icon,
  variant = 'default',
  trend,
}: KpiCardProps) {
  const variantStyles = {
    default: {
      border: 'border-charcoal-200',
      iconBg: 'bg-forest-50 text-forest-800',
      valueColor: 'text-forest-950',
    },
    emerald: {
      border: 'border-emerald-200 bg-emerald-50/20',
      iconBg: 'bg-emerald-100 text-emerald-800',
      valueColor: 'text-emerald-900',
    },
    amber: {
      border: 'border-amber-200 bg-amber-50/20',
      iconBg: 'bg-amber-100 text-amber-800',
      valueColor: 'text-amber-900',
    },
    slate: {
      border: 'border-slate-200 bg-slate-50/30',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-800',
    },
    rose: {
      border: 'border-rose-200 bg-rose-50/20',
      iconBg: 'bg-rose-100 text-rose-800',
      valueColor: 'text-rose-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`card-enterprise p-5 flex flex-col justify-between ${style.border} group relative`}
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-semibold text-charcoal-500 tracking-tight">
            {title}
          </span>
          <div className={`p-2 rounded-lg ${style.iconBg} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold tracking-tight font-mono ${style.valueColor}`}>
            {value}
          </span>
          {trend && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-charcoal-600 mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-charcoal-100 space-y-1">
        <p className="text-[11px] text-charcoal-500 leading-tight">
          {explanation}
        </p>
        <div className="flex items-center justify-between text-[10px] text-charcoal-400 font-mono pt-1">
          <span className="truncate max-w-[170px]">Src: {dataSource}</span>
          <span className="text-[9px] uppercase px-1 py-0.2 bg-charcoal-100 rounded text-charcoal-600">
            Simulated
          </span>
        </div>
      </div>
    </div>
  );
}

