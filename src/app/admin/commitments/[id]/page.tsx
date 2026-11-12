'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Cpu,
  FileText,
  Building,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertOctagon,
  Satellite,
  Clock,
  Download,
  Languages,
  Check,
} from 'lucide-react';
import { useClimate, Language } from '@/lib/context/ClimateContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_OBSERVATIONS } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import { generateAuditPdfReport } from '@/lib/utils/pdfExport';

export default function CommitmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { commitments, audits, selectedCity, language, setLanguage } = useClimate();
  const [selectedLangTab, setSelectedLangTab] = useState<Language>(language);

  const commitmentId = params?.id as string;
  const commitment = commitments.find((c) => c.id === commitmentId);
  const audit = audits.find((a) => a.commitmentId === commitmentId);
  const observations = DEMO_OBSERVATIONS.filter(
    (o) => o.commitmentId === commitmentId
  );

  if (!commitment) {
    return (
      <div className="card-enterprise p-12 text-center max-w-md mx-auto my-12">
        <h2 className="text-base font-bold text-charcoal-900 mb-2">
          Commitment Record Not Found
        </h2>
        <p className="text-xs text-charcoal-500 mb-4">
          The requested climate target could not be located in the current database registry.
        </p>
        <Link
          href="/admin/commitments"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-forest-900 text-white"
        >
          Return to Commitment Directory
        </Link>
      </div>
    );
  }

  const handleExportPdf = () => {
    if (audit) {
      generateAuditPdfReport(audit, commitment);
    }
  };

  const getExplanation = () => {
    if (!audit) return commitment.missingInformationNotes?.join(' ') || 'No audit summary generated yet.';
    if (selectedLangTab === 'hi' && audit.aiExplanationHi) return audit.aiExplanationHi;
    if (selectedLangTab === 'mr' && audit.aiExplanationMr) return audit.aiExplanationMr;
    return audit.aiGeneratedCitizenExplanation;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-200">
        <Link
          href="/admin/commitments"
          className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Commitment Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          {audit && (
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-700 shadow-subtle flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-charcoal-500" />
              <span>Export PDF Report</span>
            </button>
          )}

          <Link
            href={`/admin/audit-workspace?commitment=${commitment.id}`}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Audit Workspace</span>
          </Link>
        </div>
      </div>

      {/* Main Header Dossier Card */}
      <div className="card-enterprise p-6 bg-gradient-to-br from-surface to-forest-50/20 border-charcoal-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                commitment.progressStatus === 'ON_TRACK'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : commitment.progressStatus === 'AT_RISK'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              PROGRESS: {commitment.progressStatus.replace('_', ' ')}
            </span>
            <StatusBadge status={commitment.currentAuditStatus} size="md" />
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-700">
              Target Year: {commitment.targetYear}
            </span>
          </div>

          <span className="text-xs font-mono text-charcoal-400">
            ID: {commitment.id}
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight mb-3">
          {commitment.title}
        </h1>

        {/* Verbatim Policy Statement */}
        <div className="bg-surface p-4 rounded-xl border border-charcoal-200 shadow-subtle text-xs text-charcoal-800 leading-relaxed font-sans mb-4">
          <div className="flex items-center justify-between text-charcoal-400 text-[11px] mb-1 font-mono">
            <span>VERBATIM POLICY MANDATE (EXTRACTED VIA GEMINI VISION)</span>
            <span>Document Page {commitment.sourcePageNumber}</span>
          </div>
          <p className="italic font-serif text-sm text-charcoal-900 leading-normal">
            &ldquo;{commitment.originalPolicyStatement}&rdquo;
          </p>
        </div>

        {/* Authority and Provenance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-charcoal-100 text-xs">
          <div>
            <span className="text-charcoal-400 block text-[11px]">Responsible Authority</span>
            <span className="font-bold text-charcoal-900">{commitment.responsibleAuthority}</span>
          </div>
          <div>
            <span className="text-charcoal-400 block text-[11px]">Source Policy Document</span>
            <span className="font-semibold text-charcoal-800 truncate block">{commitment.documentName}</span>
          </div>
          <div>
            <span className="text-charcoal-400 block text-[11px]">Geographic Coverage</span>
            <span className="font-semibold text-charcoal-800">{commitment.geographicalCoverage}</span>
          </div>
          <div>
            <span className="text-charcoal-400 block text-[11px]">AI Extraction Confidence</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3" />
              {commitment.extractionConfidence}% Verified
            </span>
          </div>
        </div>
      </div>

      {/* Excel Mathematical Parity Breakdown Strip */}
      <div className="card-enterprise p-5 bg-surface border-charcoal-200 shadow-subtle">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 font-mono mb-3">
          Excel Mathematical Model & Gap Evaluation
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-charcoal-50 border border-charcoal-200">
            <span className="text-charcoal-400 text-[10px] block uppercase">Planned To Date</span>
            <span className="text-lg font-extrabold text-charcoal-900 block mt-0.5">
              {(commitment.plannedProgressToDate * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-charcoal-500">Statutory schedule</span>
          </div>

          <div className="p-3 rounded-lg bg-charcoal-50 border border-charcoal-200">
            <span className="text-charcoal-400 text-[10px] block uppercase">City-Reported</span>
            <span className="text-lg font-extrabold text-charcoal-900 block mt-0.5">
              {(commitment.cityReportedProgress * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-charcoal-500">Self-reported claim</span>
          </div>

          <div className="p-3 rounded-lg bg-forest-50 border border-forest-200">
            <span className="text-forest-700 text-[10px] block uppercase font-bold">Verified (Avg)</span>
            <span className="text-lg font-extrabold text-forest-950 block mt-0.5">
              {(commitment.verifiedProgress * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-forest-600">Satellite + Sensor avg</span>
          </div>

          <div className="p-3 rounded-lg bg-charcoal-50 border border-charcoal-200">
            <span className="text-charcoal-400 text-[10px] block uppercase">Overstatement</span>
            <span
              className={`text-lg font-extrabold block mt-0.5 ${
                commitment.reportingOverstatement > 0.10
                  ? 'text-rose-700'
                  : commitment.reportingOverstatement > 0.02
                  ? 'text-amber-700'
                  : 'text-charcoal-800'
              }`}
            >
              +{ (commitment.reportingOverstatement * 100).toFixed(1) } pp
            </span>
            <span className="text-[10px] text-charcoal-500">City &minus; Verified</span>
          </div>

          <div className="p-3 rounded-lg bg-charcoal-50 border border-charcoal-200">
            <span className="text-charcoal-400 text-[10px] block uppercase">Gap vs Plan</span>
            <span
              className={`text-lg font-extrabold block mt-0.5 ${
                commitment.gapVsPlan > 0.15
                  ? 'text-rose-700'
                  : commitment.gapVsPlan > 0.05
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              }`}
            >
              {(commitment.gapVsPlan * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-charcoal-500">Planned &minus; Verified</span>
          </div>
        </div>
      </div>

      {/* Multi-Source Environmental Evidence */}
      <div className="card-enterprise p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-forest-950">
              Multi-Source Ground & Earth Observation Evidence ({observations.length})
            </h3>
            <p className="text-xs text-charcoal-500">
              Independent satellite and sensor evidence gathered for this commitment
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
            Agreement: {commitment.sourceAgreement}
          </span>
        </div>

        {observations.length > 0 ? (
          <div className="space-y-3">
            {observations.map((obs) => (
              <div
                key={obs.id}
                className="p-3.5 rounded-xl border border-charcoal-200 bg-background hover:bg-surface transition-colors space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-xs text-charcoal-900">{obs.sourceName}</span>
                      <span className="text-[10px] text-charcoal-400 block font-mono">
                        {obs.geographicArea} &bull; Lat/Lng: {obs.localityCoordinates?.join(', ') || 'Ward Area'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Observed: {obs.measuredValue} {obs.unit}
                  </span>
                </div>

                <p className="text-xs text-charcoal-600 leading-relaxed font-sans">
                  <strong>Methodology:</strong> {obs.methodology}
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-charcoal-500 pt-2 border-t border-charcoal-100">
                  <span>
                    Collected: {obs.collectionDate} &bull; Reliability: {obs.reliabilityScore}%
                    {obs.cloudCoverPercent !== undefined && ` &bull; Cloud: ${obs.cloudCoverPercent}%`}
                    {obs.validPixelPercent !== undefined && ` &bull; Valid Pixels: ${obs.validPixelPercent}%`}
                  </span>
                  {obs.limitations.length > 0 && (
                    <span className="text-amber-800 font-medium">
                      Notice: {obs.limitations[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-charcoal-50 text-center text-xs text-charcoal-500">
            No raw observation telemetry records attached. Run the audit workspace to retrieve Copernicus & sensor telemetry.
          </div>
        )}
      </div>

      {/* Latest Audit Result & Multi-Lingual Citizen Explanations */}
      {audit && (
        <div className="card-enterprise p-5 border-charcoal-300">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 font-mono">
                Latest Formal Audit Run &bull; Hash: {audit.auditHash || '0x49a7e02'}
              </span>
              <h3 className="text-base font-bold text-forest-950 mt-0.5">
                Audit Outcome: {audit.outcome.replace('_', ' ')}
              </h3>
            </div>
            <StatusBadge status={audit.outcome} size="md" />
          </div>

          {/* Tri-lingual Citizen Explanation Card */}
          <div className="p-4 rounded-xl bg-charcoal-50 border border-charcoal-200/80 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-charcoal-800 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                AI-Generated Citizen Insight
              </span>

              {/* Language Pills */}
              <div className="flex items-center gap-1 bg-surface p-0.5 rounded-md border border-charcoal-200">
                {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLangTab(lang)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all ${
                      selectedLangTab === lang
                        ? 'bg-forest-900 text-white'
                        : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-charcoal-800 leading-relaxed">
              {getExplanation()}
            </p>
          </div>

          {/* Findings & Recommended Next Actions */}
          <div className="grid md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <span className="font-bold text-emerald-800 block mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Corroborating Evidence:
              </span>
              <ul className="space-y-1 text-charcoal-600 list-disc list-inside">
                {audit.supportingEvidenceSummary.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-rose-800 block mb-1.5 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                Identified Discrepancies & Gaps:
              </span>
              <ul className="space-y-1 text-charcoal-600 list-disc list-inside">
                {audit.contradictoryEvidenceSummary.length > 0 ? (
                  audit.contradictoryEvidenceSummary.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))
                ) : (
                  <li className="text-charcoal-400">No major contradictory records identified.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Recommended Next Actions */}
          {audit.recommendedNextActions && audit.recommendedNextActions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-charcoal-200 text-xs">
              <span className="font-bold text-forest-950 block mb-1.5">
                Recommended Policy Interventions:
              </span>
              <ul className="space-y-1 text-charcoal-700 list-disc list-inside">
                {audit.recommendedNextActions.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
