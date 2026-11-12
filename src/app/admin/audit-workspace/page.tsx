'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertOctagon,
  Download,
  Satellite,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Sparkles,
  Info,
  RefreshCw,
  Loader2,
  Languages,
} from 'lucide-react';
import { useClimate, Language } from '@/lib/context/ClimateContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Commitment, Observation, AuditRecord, ProgressStatus } from '@/lib/types';
import { DEMO_OBSERVATIONS } from '@/lib/demo-data';
import { generateAuditReportPDF } from '@/lib/utils/pdfExport';
import { formatDate } from '@/lib/utils';
import { CopyHashButton } from '@/components/common/CopyHashButton';

function AuditWorkspaceContent() {
  const searchParams = useSearchParams();
  const initialCommitmentId = searchParams?.get('commitment') || '';

  const { cityCommitments, selectedCity, executeAudit, audits, language } = useClimate();

  const [selectedCommitmentId, setSelectedCommitmentId] = useState<string>(
    initialCommitmentId || (cityCommitments[0]?.id ?? '')
  );
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [currentAudit, setCurrentAudit] = useState<AuditRecord | null>(null);
  const [showProvenanceDrawer, setShowProvenanceDrawer] = useState<boolean>(false);
  const [activeLangTab, setActiveLangTab] = useState<Language>(language);

  // Sync when city changes
  useEffect(() => {
    if (cityCommitments.length > 0) {
      const match = cityCommitments.find((c) => c.id === selectedCommitmentId);
      if (!match) {
        setSelectedCommitmentId(cityCommitments[0].id);
      }
    }
  }, [cityCommitments, selectedCommitmentId]);

  const activeCommitment = cityCommitments.find(
    (c) => c.id === selectedCommitmentId
  ) || cityCommitments[0];

  const activeObservations = DEMO_OBSERVATIONS.filter(
    (o) => o.commitmentId === selectedCommitmentId
  );

  // Load existing audit if already conducted
  useEffect(() => {
    if (selectedCommitmentId) {
      const existing = audits.find((a) => a.commitmentId === selectedCommitmentId);
      if (existing) {
        setCurrentAudit(existing);
      } else {
        setCurrentAudit(null);
      }
    }
  }, [selectedCommitmentId, audits]);

  const handleRunAudit = async () => {
    if (!activeCommitment) return;
    setIsAuditing(true);

    try {
      // Simulate realistic multi-source sensor fetching & cross-matching
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const resAudit = executeAudit(activeCommitment.id);
      setCurrentAudit(resAudit);
    } catch (err) {
      console.error('Failed to run audit:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleExportPdf = () => {
    if (currentAudit && activeCommitment) {
      generateAuditReportPDF(currentAudit, activeCommitment);
    }
  };

  const getExplanation = () => {
    if (!currentAudit) return '';
    if (activeLangTab === 'hi' && currentAudit.aiExplanationHi) return currentAudit.aiExplanationHi;
    if (activeLangTab === 'mr' && currentAudit.aiExplanationMr) return currentAudit.aiExplanationMr;
    return currentAudit.aiGeneratedCitizenExplanation;
  };

  const getProgressBadge = (status: ProgressStatus) => {
    switch (status) {
      case 'ON_TRACK':
        return (
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            PROGRESS: ON TRACK
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            PROGRESS: AT RISK
          </span>
        );
      case 'OFF_TRACK':
        return (
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            PROGRESS: OFF TRACK
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/80">
              Deterministic Climate Audit Engine v2.4
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              Scientific Integrity Matrix &bull; Excel Model Parity
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Climate Audit Verification Workspace &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 max-w-3xl">
            Cross-evaluate municipal statutory claims against independent Copernicus Sentinel-2 satellite data and CPCB telemetry using deterministic mathematical verification.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {currentAudit && (
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-700 shadow-subtle flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-charcoal-500" />
              <span>Export PDF Report</span>
            </button>
          )}

          <Link
            href="/admin/audit-history"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-700 shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Audit History Trail</span>
          </Link>
        </div>
      </div>

      {/* Target Selector Toolbar */}
      <div className="p-4 rounded-xl bg-surface border border-charcoal-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <label htmlFor="commitment-select" className="text-xs font-bold text-charcoal-700 shrink-0">
            Target Commitment:
          </label>
          <select
            id="commitment-select"
            value={selectedCommitmentId}
            onChange={(e) => setSelectedCommitmentId(e.target.value)}
            className="w-full md:max-w-xl px-3 py-2 text-xs font-bold rounded-lg border border-charcoal-300 bg-background text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
          >
            {cityCommitments.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} (Target: {c.targetYear} &bull; {c.currentAuditStatus})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="px-5 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          {isAuditing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Cross-Evaluating Evidence Streams...</span>
            </>
          ) : (
            <>
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Execute Climate Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Evaluated Target Metadata Card */}
      {activeCommitment && (
        <div className="card-enterprise p-5 bg-gradient-to-br from-surface to-charcoal-50/50 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-700">
                Target: {activeCommitment.targetYear}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                Sector: {activeCommitment.sector.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-charcoal-400">
                {activeCommitment.id}
              </span>
            </div>

            <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Extracted: {activeCommitment.extractionConfidence}% Confidence
            </span>
          </div>

          <h2 className="text-lg font-bold text-forest-950">
            {activeCommitment.title}
          </h2>

          <p className="text-xs text-charcoal-700 italic bg-surface p-3 rounded-lg border border-charcoal-200 font-serif leading-relaxed">
            &ldquo;{activeCommitment.originalPolicyStatement}&rdquo;
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div>
              <span className="text-charcoal-400 text-[10px] block uppercase font-mono">Authority</span>
              <span className="font-semibold text-charcoal-900">{activeCommitment.responsibleAuthority}</span>
            </div>
            <div>
              <span className="text-charcoal-400 text-[10px] block uppercase font-mono">Jurisdiction</span>
              <span className="font-semibold text-charcoal-900">{activeCommitment.geographicalCoverage}</span>
            </div>
            <div>
              <span className="text-charcoal-400 text-[10px] block uppercase font-mono">Mandate Target</span>
              <span className="font-bold text-forest-900 font-mono">
                {activeCommitment.targetValue} {activeCommitment.targetUnit}
              </span>
            </div>
            <div>
              <span className="text-charcoal-400 text-[10px] block uppercase font-mono">Source Page</span>
              <span className="font-semibold text-charcoal-900 font-mono">
                {activeCommitment.documentName} (p. {activeCommitment.sourcePageNumber})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mathematical Parity Breakdown Banner */}
      {activeCommitment && (
        <div className="card-enterprise p-4 bg-background border-charcoal-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 font-mono">
              Excel Model Scoring Engine: Planned vs. Observed Telemetry
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
              Source Agreement: {activeCommitment.sourceAgreement}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-surface border border-charcoal-200">
              <span className="text-charcoal-400 text-[10px] block uppercase">Planned To Date</span>
              <span className="text-base font-bold text-charcoal-800">
                {(activeCommitment.plannedProgressToDate * 100).toFixed(0)}%
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-charcoal-200">
              <span className="text-charcoal-400 text-[10px] block uppercase">City Claimed</span>
              <span className="text-base font-bold text-charcoal-800">
                {(activeCommitment.cityReportedProgress * 100).toFixed(0)}%
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-charcoal-200">
              <span className="text-charcoal-400 text-[10px] block uppercase">Verified (Avg)</span>
              <span className="text-base font-bold text-forest-900">
                {(activeCommitment.verifiedProgress * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-charcoal-200">
              <span className="text-charcoal-400 text-[10px] block uppercase">Overstatement</span>
              <span
                className={`text-base font-bold ${
                  activeCommitment.reportingOverstatement > 0.10
                    ? 'text-rose-700'
                    : 'text-charcoal-800'
                }`}
              >
                +{ (activeCommitment.reportingOverstatement * 100).toFixed(1) } pp
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-charcoal-200">
              <span className="text-charcoal-400 text-[10px] block uppercase">Gap vs Plan</span>
              <span
                className={`text-base font-bold ${
                  activeCommitment.gapVsPlan > 0.15
                    ? 'text-rose-700'
                    : activeCommitment.gapVsPlan > 0.05
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {(activeCommitment.gapVsPlan * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Audit Results Card */}
      {currentAudit && (
        <div className="card-enterprise p-6 border-charcoal-300 bg-surface shadow-elevated space-y-5 animate-in fade-in duration-300">
          
          {/* Header Outcome Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 font-mono">
                  Deterministic Audit Determination &bull; Hash:
                </span>
                <span
                  className="text-[11px] font-mono text-charcoal-800 font-bold truncate max-w-[200px]"
                  title={currentAudit.auditHash}
                >
                  {currentAudit.auditHash ? `${currentAudit.auditHash.substring(0, 18)}...` : '0x992b41f'}
                </span>
                {currentAudit.auditHash && currentAudit.auditHash.startsWith('sha256:') && (
                  <CopyHashButton hash={currentAudit.auditHash} label="Copy audit block hash" />
                )}
              </div>
              {currentAudit.previousHash && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-charcoal-500 mb-1">
                  <span className="text-charcoal-400">Previous Hash:</span>
                  <span className="truncate max-w-[160px]" title={currentAudit.previousHash}>
                    {currentAudit.previousHash.substring(0, 16)}...
                  </span>
                  <CopyHashButton hash={currentAudit.previousHash} label="Copy previous hash" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                {getProgressBadge(currentAudit.progressStatus)}
                <StatusBadge status={currentAudit.outcome} size="lg" />
                <span className="text-xs font-mono text-charcoal-500">
                  Audited: {formatDate(currentAudit.auditDate)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-charcoal-50 p-3 rounded-xl border border-charcoal-200">
              <div className="text-right">
                <span className="text-[10px] text-charcoal-400 uppercase tracking-wider font-semibold block">
                  Evidence Quality
                </span>
                <span className="text-2xl font-mono font-extrabold text-forest-950">
                  {currentAudit.evidenceQualityScore} <span className="text-xs text-charcoal-400">/ 100</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-forest-900 text-emerald-400 flex items-center justify-center font-bold font-mono text-xs">
                {currentAudit.observationsExaminedCount} Obs
              </div>
            </div>
          </div>

          {/* Tri-Lingual AI-Generated Citizen Synthesis */}
          <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-200 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-forest-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Citizen-Friendly Grounded Synthesis</span>
              </div>

              {/* Language Pills */}
              <div className="flex items-center gap-1 bg-surface p-0.5 rounded-md border border-charcoal-200">
                {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLangTab(lang)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all ${
                      activeLangTab === lang
                        ? 'bg-forest-900 text-white'
                        : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-forest-950 leading-relaxed font-medium">
              {getExplanation()}
            </p>
          </div>

          {/* Evidence Grid: Corroborating vs Contradictory */}
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Corroborating Evidence */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Corroborating Evidence ({currentAudit.supportingEvidenceSummary.length})</span>
              </div>
              <ul className="space-y-1.5 text-xs text-charcoal-700 list-disc list-inside">
                {currentAudit.supportingEvidenceSummary.map((item, idx) => (
                  <li key={idx} className="leading-snug">{item}</li>
                ))}
              </ul>
            </div>

            {/* Contradictory Evidence or Data Gaps */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wide">
                <AlertOctagon className="w-4 h-4 text-rose-700" />
                <span>Contradictions & Discrepancies ({currentAudit.contradictoryEvidenceSummary.length})</span>
              </div>
              {currentAudit.contradictoryEvidenceSummary.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-charcoal-700 list-disc list-inside">
                  {currentAudit.contradictoryEvidenceSummary.map((item, idx) => (
                    <li key={idx} className="leading-snug">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-charcoal-500 italic">
                  No contradictory signals identified. Empirical telemetry matches the declared trajectory.
                </p>
              )}
            </div>

          </div>

          {/* Deterministic Rules Applied */}
          <div className="p-4 rounded-xl border border-charcoal-200 bg-surface space-y-2">
            <span className="text-xs font-bold text-charcoal-900 uppercase tracking-wider block font-mono">
              Transparent Audit Rules Matrix Evaluated:
            </span>
            <div className="space-y-1 font-mono text-[11px] text-charcoal-600">
              {currentAudit.deterministicAuditRulesApplied.map((rule, idx) => (
                <div key={idx} className="p-2 rounded bg-charcoal-50 border border-charcoal-100 flex items-start gap-2">
                  <span className="text-forest-700 font-bold shrink-0">RULE_0{idx + 1}:</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Actions */}
          <div className="p-4 rounded-xl border border-charcoal-200 bg-surface space-y-2">
            <span className="text-xs font-bold text-charcoal-900 uppercase tracking-wider block font-mono">
              Evidence-Grounded Recommended Actions:
            </span>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {currentAudit.recommendedNextActions.map((action, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-charcoal-200 bg-background flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-forest-900 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-charcoal-800 font-medium leading-snug">{action}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function AuditWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="card-enterprise p-12 text-center text-xs text-charcoal-500 font-mono">
          Loading Climate Audit Engine...
        </div>
      }
    >
      <AuditWorkspaceContent />
    </Suspense>
  );
}
