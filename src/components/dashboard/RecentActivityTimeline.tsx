'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, FileCheck, Clock, ExternalLink } from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';

export function RecentActivityTimeline() {
  const { audits, commitments, selectedCityId } = useClimate();

  const cityAudits = audits.filter((a) => a.cityId === selectedCityId);

  return (
    <div className="card-enterprise p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-forest-950">
            Recent Audit & Verification Activity
          </h3>
          <p className="text-xs text-charcoal-500">
            Traceable timeline of multi-source environmental evidence runs
          </p>
        </div>
        <Link
          href="/admin/audit-workspace"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          Open Audit Workspace
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-charcoal-100">
        {cityAudits.map((audit) => {
          const commitment = commitments.find((c) => c.id === audit.commitmentId);

          return (
            <div key={audit.id} className="py-3.5 first:pt-0 last:pb-0 group">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={audit.outcome} size="sm" />
                  <span className="text-[11px] font-mono text-charcoal-400">
                    Score: {audit.evidenceQualityScore}/100
                  </span>
                </div>
                <span className="text-[11px] text-charcoal-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(audit.auditDate)}
                </span>
              </div>

              <h4 className="text-xs font-bold text-charcoal-900 group-hover:text-forest-800 transition-colors">
                {commitment?.title || 'Climate Target Verification'}
              </h4>

              <p className="text-[11px] text-charcoal-600 line-clamp-2 mt-1 leading-snug">
                {audit.aiGeneratedCitizenExplanation}
              </p>

              <div className="flex items-center justify-between mt-2 pt-1 text-[11px]">
                <span className="text-charcoal-500 truncate max-w-[240px]">
                  Auth: {commitment?.responsibleAuthority}
                </span>
                <Link
                  href={`/admin/audit-workspace?commitment=${audit.commitmentId}`}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  Inspect Evidence
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

