'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  History,
  Download,
  Cpu,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  Hash,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import { generateAuditReportPDF } from '@/lib/utils/pdfExport';
import { ProgressStatus, AuditOutcome, AuditRecord } from '@/lib/types';
import { verifyAuditChain, ChainVerificationResult, GENESIS_HASH } from '@/lib/audit-engine';

export default function AuditHistoryPage() {
  const { audits, commitments, selectedCity } = useClimate();

  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Tamper demonstration state
  const [localAudits, setLocalAudits] = useState<AuditRecord[] | null>(null);
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult | null>(null);
  const [tamperedBlockId, setTamperedBlockId] = useState<string | null>(null);

  const activeAuditsList = localAudits || audits;

  const enrichedAudits = useMemo(() => {
    return activeAuditsList
      .filter((a) => a.cityId === selectedCity.id)
      .map((audit) => {
        const commitment = commitments.find((c) => c.id === audit.commitmentId);
        return {
          ...audit,
          commitmentTitle: commitment?.title || audit.commitmentTitle || audit.commitmentId,
          commitmentSector: commitment?.sector || 'transport',
          commitmentObj: commitment,
        };
      })
      .filter((item) => {
        const matchesSearch =
          item.commitmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.auditHash && item.auditHash.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesOutcome = outcomeFilter === 'all' || item.outcome === outcomeFilter;

        return matchesSearch && matchesOutcome;
      });
  }, [activeAuditsList, commitments, selectedCity.id, searchQuery, outcomeFilter]);

  const handleVerifyLedger = () => {
    const cityAudits = activeAuditsList.filter((a) => a.cityId === selectedCity.id);
    const result = verifyAuditChain(cityAudits);
    setVerificationResult(result);
  };

  const handleSimulateTamper = () => {
    const cityAudits = activeAuditsList.filter((a) => a.cityId === selectedCity.id);
    if (cityAudits.length === 0) return;

    // Pick Ward K-East (aud-mum-05) or the 5th audit and falsify its verified progress
    const targetAudit = cityAudits.find((a) => a.id === 'aud-mum-05') || cityAudits[Math.min(4, cityAudits.length - 1)];
    const modified = activeAuditsList.map((a) => {
      if (a.id === targetAudit.id) {
        return {
          ...a,
          progressPercentage: 48.0, // Falsified progress percentage without updating SHA-256 hash
          reportingOverstatementPercentage: 2.0,
        };
      }
      return a;
    });

    setLocalAudits(modified);
    setTamperedBlockId(targetAudit.id);

    // Run verification immediately to show detection
    const tamperedCityAudits = modified.filter((a) => a.cityId === selectedCity.id);
    const result = verifyAuditChain(tamperedCityAudits);
    setVerificationResult(result);
  };

  const handleRestoreLedger = () => {
    setLocalAudits(null);
    setTamperedBlockId(null);
    const cityAudits = audits.filter((a) => a.cityId === selectedCity.id);
    const result = verifyAuditChain(cityAudits);
    setVerificationResult(result);
  };

  const handleDownloadPdf = (auditItem: any) => {
    if (auditItem.commitmentObj) {
      setDownloadingId(auditItem.id);
      generateAuditReportPDF(auditItem, auditItem.commitmentObj);
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const getProgressBadge = (status: ProgressStatus) => {
    switch (status) {
      case 'ON_TRACK':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            ON TRACK
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            AT RISK
          </span>
        );
      case 'OFF_TRACK':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
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
              Tamper-Evident SHA-256 Verification Ledger
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              {enrichedAudits.length} Audits On Record
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Climate Audit History &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 max-w-3xl">
            Tamper-evident audit trail preserving deterministic reasoning, Earth observation versions, gap calculations, and statutory recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleVerifyLedger}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white shadow-subtle flex items-center gap-1.5 transition-all"
            title="Recompute all SHA-256 blocks from Genesis"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Verify Ledger Integrity</span>
          </button>

          {!tamperedBlockId ? (
            <button
              onClick={handleSimulateTamper}
              disabled={enrichedAudits.length === 0}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 shadow-subtle flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={enrichedAudits.length === 0 ? "Requires existing audit records to simulate tampering" : "Simulate unauthorized alteration of verified progress"}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Tampering</span>
            </button>
          ) : (
            <button
              onClick={handleRestoreLedger}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all"
              title="Restore authentic cryptographic ledger"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restore Authentic Ledger</span>
            </button>
          )}

          <Link
            href="/admin/audit-workspace"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-700 shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-forest-700" />
            <span>New Audit</span>
          </Link>
        </div>
      </div>

      {/* Cryptographic Verification Outcome Alert Banner */}
      {verificationResult && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 shadow-subtle transition-all ${
            verificationResult.isValid
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          {verificationResult.isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm block">
                {verificationResult.isValid
                  ? 'Cryptographic Ledger Status: 100% VALID & INTACT'
                  : 'Cryptographic Ledger Alert: TAMPERING DETECTED!'}
              </span>
              <span className="font-mono text-[11px] font-semibold">
                Verified Blocks: {verificationResult.verifiedCount} / {enrichedAudits.length}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px]">
              {verificationResult.details}
            </p>
            {verificationResult.isValid ? (
              <span className="text-[11px] text-emerald-800 mt-1 block">
                Every audit block matches its canonical SHA-256 payload and chains directly to Genesis Block (00000000...).
              </span>
            ) : (
              <span className="text-[11px] text-rose-800 mt-1 block font-semibold">
                Historical record modification detected. SHA-256 hash chaining immediately exposes any retroactive alteration.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Scientific Transparency Protocol Notice */}
      <div className="p-3.5 rounded-xl border border-charcoal-200 bg-charcoal-50/70 text-xs text-charcoal-700 flex items-start gap-2.5">
        <Hash className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Tamper-Evidence Transparency Notice:</strong> Each audit record is cryptographically linked to the preceding block using genuine FIPS 180-4 SHA-256 digests. Hash chaining provides mathematical <em>tamper evidence</em> (altering any historical figure invalidates the chain), but does not replace external legal governance or physically immutable media. Browser storage is treated as an active demonstrator cache, not an immutable government database.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-surface border border-charcoal-200 shadow-subtle flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by target title, audit hash, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-charcoal-200 bg-background focus:bg-surface focus:outline-none focus:ring-2 focus:ring-forest-800/20 text-charcoal-900 placeholder:text-charcoal-400"
          />
        </div>

        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          aria-label="Filter by Audit Outcome"
          className="px-3 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
        >
          <option value="all">All Outcomes</option>
          <option value="SUPPORTED">Supported</option>
          <option value="PARTIALLY_SUPPORTED">Partially Supported</option>
          <option value="INCONCLUSIVE">Inconclusive</option>
          <option value="POTENTIAL_DISCREPANCY">Potential Discrepancy</option>
        </select>
      </div>

      {/* Audit History Table */}
      <div className="card-enterprise overflow-hidden border border-charcoal-200 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-50/80 border-b border-charcoal-200 text-charcoal-600 font-semibold font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Audit Timestamp & Hash</th>
                <th className="py-3 px-4 min-w-[240px]">Evaluated Commitment</th>
                <th className="py-3 px-3 text-right">Verified</th>
                <th className="py-3 px-3 text-right">Gap %</th>
                <th className="py-3 px-3 text-right">Overstatement</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Audit Outcome</th>
                <th className="py-3 px-3">Quality</th>
                <th className="py-3 px-4 text-center">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 bg-surface">
              {enrichedAudits.length > 0 ? (
                enrichedAudits.map((a, idx) => {
                  const isTampered = a.id === tamperedBlockId;

                  return (
                    <tr
                      key={a.id}
                      className={`transition-colors group ${
                        isTampered
                          ? 'bg-rose-50/80 hover:bg-rose-100/70 border-l-4 border-l-rose-600'
                          : 'hover:bg-charcoal-50/60'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-charcoal-100 text-charcoal-700 font-mono">
                            Block #{a.blockNumber || idx + 1}
                          </span>
                          {isTampered && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 font-mono animate-pulse">
                              TAMPERED
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-charcoal-900 block text-xs">
                          {formatDate(a.auditDate)}
                        </span>
                        <span
                          className="text-[10px] text-charcoal-500 font-mono truncate block max-w-[170px] cursor-help"
                          title={`Block Hash: ${a.auditHash || a.id}\nPrevious Hash: ${a.previousHash || 'Genesis'}`}
                        >
                          {a.auditHash ? `${a.auditHash.substring(0, 18)}...` : a.id}
                        </span>
                      </td>

                    <td className="py-3.5 px-4">
                      {a.commitmentObj ? (
                        <Link
                          href={`/admin/commitments/${a.commitmentObj.id}`}
                          className="font-bold text-forest-950 group-hover:text-emerald-700 transition-colors block text-xs"
                        >
                          {a.commitmentTitle}
                        </Link>
                      ) : (
                        <span className="font-bold text-forest-950 block text-xs">
                          {a.commitmentTitle}
                        </span>
                      )}
                      <span className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                        {a.observationsExaminedCount} independent evidence stream{a.observationsExaminedCount !== 1 ? 's' : ''} examined
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-forest-900">
                      {a.progressPercentage}%
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      <span className={a.gapPercentage > 15 ? 'text-rose-700' : 'text-emerald-700'}>
                        {a.gapPercentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono">
                      <span className={a.reportingOverstatementPercentage > 10 ? 'text-rose-700 font-bold' : 'text-charcoal-600'}>
                        +{a.reportingOverstatementPercentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getProgressBadge(a.progressStatus)}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <StatusBadge status={a.outcome} size="sm" />
                    </td>

                    <td className="py-3.5 px-3 font-mono font-semibold text-charcoal-700">
                      {a.evidenceQualityScore} / 100
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleDownloadPdf(a)}
                          disabled={!a.commitmentObj || downloadingId === a.id}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-charcoal-200 hover:bg-charcoal-100 text-charcoal-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                          title="Generate Official PDF Report"
                        >
                          <Download className="w-3 h-3 text-charcoal-500" />
                          <span>PDF</span>
                        </button>

                        {a.commitmentObj && (
                          <Link
                            href={`/admin/commitments/${a.commitmentObj.id}`}
                            className="p-1 rounded-md border border-charcoal-200 hover:bg-charcoal-100 text-charcoal-600 hover:text-charcoal-900"
                            title="View Full Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
                <tr>
                  <td colSpan={9} className="py-12 px-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center mx-auto mb-3">
                      <History className="w-5 h-5 text-forest-700" />
                    </div>
                    <h4 className="text-sm font-bold text-forest-950 mb-1">
                      No Audit Records Logged for {selectedCity.name}
                    </h4>
                    <p className="text-xs text-charcoal-500 max-w-md mx-auto leading-relaxed mb-4">
                      No statutory audit evaluations have been executed yet for this jurisdiction. Open the Audit Workspace to execute a deterministic evaluation against municipal targets.
                    </p>
                    <Link
                      href="/admin/audit-workspace"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle transition-all"
                    >
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Launch Audit Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

