'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Loader2,
  Plus,
  Layers,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import { Commitment, PolicyDocument, SectorType, EnvironmentalIndicatorType } from '@/lib/types';
import { ExtractedCommitmentPayload } from '@/lib/ai/gemini';
import { SECTORS } from '@/lib/demo-data';

export default function PolicyIntelligencePage() {
  const { selectedCity, selectedCityId, cityPolicies, addCommitment, addPolicy } =
    useClimate();

  const [isExtracting, setIsExtracting] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [extractedStaging, setExtractedStaging] = useState<
    (ExtractedCommitmentPayload & { id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' })[]
  >([]);
  const [modelMeta, setModelMeta] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [selectedSample, setSelectedSample] = useState<string>('mcap');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractionNotice, setExtractionNotice] = useState<string | null>(null);
  const [extractionStats, setExtractionStats] = useState<{
    pages: number;
    chars: number;
    sizeMb: number;
  } | null>(null);

  // Sample Policy Scenarios
  const sampleDocuments = [
    {
      id: 'mcap',
      title: 'Mumbai Climate Action Plan (MCAP 2022) — Chapter 4: Sustainable Mobility & Greening',
      pages: 248,
      size: '14.8 MB',
      authority: 'Brihanmumbai Municipal Corporation (BMC)',
      cityId: 'mumbai',
      sampleText: 'The Brihanmumbai Municipal Corporation shall maintain bi-weekly Sentinel satellite radiometric surveillance across 5,400 hectares of tidal wetlands in Thane Creek, and install floating and rooftop solar photovoltaic arrays across BMC water filtration facilities to reach 150 MW by 2027.',
    },
    {
      id: 'pcap',
      title: 'Pune Climate Action Plan (PCAP 2023) — Mula-Mutha River Basin & PMPML Clean Transit',
      pages: 196,
      size: '11.2 MB',
      authority: 'Pune Municipal Corporation (PMC)',
      cityId: 'pune',
      sampleText: 'Pune Municipal Corporation shall establish 20 operational bio-methanation plants treating 100 tonnes per day of segregated municipal organic waste, preventing landfill methane emissions by 2026, and restore 44 km of riparian buffer along the Mula-Mutha confluence.',
    },
  ];

  const handleFileUpload = async (file: File) => {
    setIsExtracting(true);
    setExtractionError(null);
    setExtractionNotice(null);
    setActiveStep(2);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('cityId', selectedCityId);

      setActiveStep(3);
      const res = await fetch('/api/policies/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setExtractionError(data.error || 'Failed to extract text from the uploaded document.');
        setExtractedStaging([]);
        setActiveStep(1);
        return;
      }

      setExtractionStats({
        pages: data.pageCount || 1,
        chars: data.extractedCharacters || 0,
        sizeMb: data.fileSizeMb || 0,
      });

      if (data.extractionNotice) {
        setExtractionNotice(data.extractionNotice);
      }

      if (data.extractedCommitments && data.extractedCommitments.length > 0) {
        const stagedWithIds = data.extractedCommitments.map(
          (c: ExtractedCommitmentPayload, index: number) => ({
            ...c,
            id: `ext-${Date.now()}-${index}`,
            status: 'PENDING' as const,
          })
        );
        setExtractedStaging(stagedWithIds);
        setModelMeta(data.modelUsed || 'Gemini 3.8 Flash');
        setActiveStep(4);
      } else {
        setExtractedStaging([]);
        setActiveStep(2);
      }
    } catch (err: any) {
      console.error('Failed to upload and extract document:', err);
      setExtractionError(`Network error while uploading: ${err.message || 'Server did not respond'}`);
      setActiveStep(1);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRunExtraction = async (docName: string, textSample?: string) => {
    setIsExtracting(true);
    setExtractionError(null);
    setExtractionNotice(null);
    setActiveStep(2);
    setUploadedFileName(docName);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setActiveStep(3);

      const res = await fetch('/api/policies/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: docName,
          documentText: textSample || 'Official statutory climate policy mandate text.',
          cityId: selectedCityId,
        }),
      });

      const data = await res.json();
      if (data.success && data.extractedCommitments) {
        const stagedWithIds = data.extractedCommitments.map(
          (c: ExtractedCommitmentPayload, index: number) => ({
            ...c,
            id: `ext-${Date.now()}-${index}`,
            status: 'PENDING' as const,
          })
        );
        setExtractedStaging(stagedWithIds);
        setModelMeta(data.modelUsed || 'Demonstration Extractor');
        setActiveStep(4);
      } else if (data.extractionNotice) {
        setExtractionNotice(data.extractionNotice);
        setExtractedStaging([]);
      }
    } catch (err) {
      console.error('Failed to extract policy text:', err);
      setExtractionError('Failed to complete policy extraction.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApproveCommitment = (stagedId: string) => {
    const item = extractedStaging.find((s) => s.id === stagedId);
    if (!item) return;

    const newCommitment: Commitment = {
      id: `com-appr-${Date.now()}`,
      policyId: selectedCityId === 'mumbai' ? 'pol-mumbai-mcap' : 'pol-pune-pcap',
      cityId: selectedCityId,
      title: item.title,
      originalPolicyStatement: item.originalPolicyStatement,
      documentName: uploadedFileName || 'Policy_Document_2024.pdf',
      sourcePageNumber: item.sourcePageNumber,
      responsibleAuthority: item.responsibleAuthority,
      sector: item.sector,
      geographicalCoverage: item.geographicalCoverage,
      indicator: item.indicator,
      targetValue: item.targetValue,
      targetUnit: item.targetUnit,
      baselineValue: item.baselineValue,
      baselineYear: item.baselineYear,
      targetYear: item.targetYear,
      missingInformationNotes: item.missingInformationNotes || [],
      extractionConfidence: item.extractionConfidence,
      plannedProgressToDate: 0.25,
      cityReportedProgress: 0.0,
      verifiedProgress: 0.0,
      reportingOverstatement: 0.0,
      gapVsPlan: 0.25,
      progressStatus: 'OFF_TRACK',
      sourceAgreement: 'INSUFFICIENT_EVIDENCE',
      reviewStatus: 'APPROVED',
      currentAuditStatus: 'PENDING_AUDIT',
    };

    addCommitment(newCommitment);

    // Update staging list
    setExtractedStaging((prev) =>
      prev.map((s) => (s.id === stagedId ? { ...s, status: 'APPROVED' } : s))
    );
  };

  const handleRejectCommitment = (stagedId: string) => {
    setExtractedStaging((prev) =>
      prev.map((s) => (s.id === stagedId ? { ...s, status: 'REJECTED' } : s))
    );
  };

  const handleApproveAll = () => {
    extractedStaging
      .filter((s) => s.status === 'PENDING')
      .forEach((s) => handleApproveCommitment(s.id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Policy Intelligence Centre
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              PDF Ingestion &bull; Gemini Extraction
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Climate Policy Document Ingestion &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Extract statutory climate commitments, measurable indicators, and compliance timelines from official municipal PDF documents.
          </p>
        </div>

        <Link
          href="/admin/commitments"
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-700 shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View Commitments Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { step: 1, label: 'Upload Policy PDF' },
          { step: 2, label: 'Page Extraction' },
          { step: 3, label: 'Gemini Analysis' },
          { step: 4, label: 'Review & Approve' },
        ].map((s) => (
          <div
            key={s.step}
            className={`p-3 rounded-lg border text-center transition-all ${
              activeStep >= s.step
                ? 'bg-forest-900 text-white border-forest-800 font-bold shadow-subtle'
                : 'bg-surface text-charcoal-400 border-charcoal-200'
            }`}
          >
            <span className="block text-[10px] font-mono opacity-80">
              Step 0{s.step}
            </span>
            <span className="truncate block mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Ingestion & Upload Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Upload Zone (7 cols) */}
        <div className="lg:col-span-7 card-enterprise p-6 space-y-4">
          <h2 className="text-sm font-bold text-forest-950">
            Upload Statutory Policy Document
          </h2>
          <p className="text-xs text-charcoal-500">
            Supported formats: PDF (up to 50MB). Preserves original page numbers and legal mandates.
          </p>

          <div className="border-2 border-dashed border-charcoal-200 hover:border-emerald-500 rounded-xl p-8 text-center transition-colors bg-background flex flex-col items-center justify-center">
            <UploadCloud className="w-10 h-10 text-emerald-700 mb-3" />
            <span className="text-xs font-bold text-charcoal-800">
              Drag and drop your official Climate Policy PDF here
            </span>
            <span className="text-[11px] text-charcoal-500 mt-1">
              or click below to load a pre-configured municipal plan
            </span>

            <input
              type="file"
              accept=".pdf,.txt"
              id="policy-file-input"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />

            <label
              htmlFor="policy-file-input"
              className="mt-4 px-4 py-2 rounded-lg bg-surface border border-charcoal-200 hover:bg-charcoal-50 text-xs font-semibold text-charcoal-800 shadow-subtle cursor-pointer"
            >
              Select PDF / TXT File from Computer
            </label>
          </div>

          {/* Extraction Error Notice */}
          {extractionError && (
            <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-950">Document Text Extraction Incomplete:</strong>
                {extractionError}
              </div>
            </div>
          )}

          {/* Extraction Notice (Empty or No Targets Found) */}
          {extractionNotice && (
            <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-950">Extraction Finding:</strong>
                {extractionNotice}
              </div>
            </div>
          )}

          {/* Extraction Stats Banner */}
          {extractionStats && !extractionError && (
            <div className="p-3 rounded-lg bg-charcoal-50 border border-charcoal-200 text-xs font-mono text-charcoal-700 flex items-center justify-between">
              <span>Pages Parsed: <strong>{extractionStats.pages}</strong></span>
              <span>Characters Extracted: <strong>{extractionStats.chars.toLocaleString()}</strong></span>
              <span>File Size: <strong>{extractionStats.sizeMb} MB</strong></span>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-charcoal-500 pt-2 border-t border-charcoal-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Extracted text undergoes strict schema validation against the Maharashtra Climate Framework.</span>
          </div>
        </div>

        {/* Hackathon Sample Documents Quick Loader (5 cols) */}
        <div className="lg:col-span-5 card-enterprise p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-forest-950">
                International Hackathon Samples
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold uppercase font-mono">
                Instant Ingest
              </span>
            </div>
            <p className="text-xs text-charcoal-500 mb-4 leading-relaxed">
              Use pre-loaded municipal policies to demonstrate live AI extraction without requiring external PDF uploads.
            </p>

            <div className="space-y-3">
              {sampleDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedSample(doc.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedSample === doc.id
                      ? 'border-forest-800 bg-forest-50/60 shadow-subtle'
                      : 'border-charcoal-200 bg-surface hover:bg-charcoal-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-charcoal-900">
                    <span className="truncate pr-2">{doc.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-charcoal-500 mt-2 font-mono">
                    <span>{doc.authority}</span>
                    <span>{doc.pages} Pages &bull; {doc.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              const sample = sampleDocuments.find((s) => s.id === selectedSample);
              if (sample) handleRunExtraction(sample.title, sample.sampleText);
            }}
            disabled={isExtracting}
            className="mt-5 w-full py-2.5 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-subtle flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Analysing with Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Extract Commitments with AI</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Extracted Staging & Human Approval Table */}
      {extractedStaging.length > 0 && (
        <div className="card-enterprise p-6 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-forest-950">
                  Staged Commitments for Review & Approval
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-forest-100 text-forest-900 font-semibold">
                  {extractedStaging.filter((s) => s.status === 'APPROVED').length} / {extractedStaging.length} Approved
                </span>
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Model: <strong>{modelMeta}</strong> &bull; Review, edit and approve commitments before committing to the statutory registry.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApproveAll}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-subtle flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve All Extracted</span>
              </button>
            </div>
          </div>

          {/* Staged Items List */}
          <div className="space-y-4">
            {extractedStaging.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.status === 'APPROVED'
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : item.status === 'REJECTED'
                    ? 'bg-rose-50/40 border-rose-200 opacity-60'
                    : 'bg-surface border-charcoal-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-800 font-semibold">
                      Page {item.sourcePageNumber}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                      Sector: {item.sector}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Confidence: {item.extractionConfidence}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApproveCommitment(item.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-subtle"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectCommitment(item.id)}
                          className="px-3 py-1 rounded-lg bg-surface border border-charcoal-200 hover:bg-charcoal-100 text-charcoal-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    {item.status === 'APPROVED' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Added to Official Registry
                      </span>
                    )}
                    {item.status === 'REJECTED' && (
                      <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        Discarded
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-charcoal-900 mb-1.5">
                  {item.title}
                </h4>

                <div className="bg-charcoal-50 p-3 rounded-lg border border-charcoal-200/70 text-xs text-charcoal-700 leading-relaxed font-sans mb-3">
                  <span className="font-bold text-charcoal-900 block mb-0.5">
                    Quoted Text from Document:
                  </span>
                  "{item.originalPolicyStatement}"
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-charcoal-600 pt-2 border-t border-charcoal-100">
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Responsible Authority</span>
                    <span className="font-semibold text-charcoal-900">{item.responsibleAuthority}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Coverage</span>
                    <span className="font-semibold text-charcoal-900">{item.geographicalCoverage}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Target Requirement</span>
                    <span className="font-semibold text-forest-800 font-mono">
                      {item.targetValue} {item.targetUnit} (by {item.targetYear})
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Baseline</span>
                    <span className="font-semibold text-charcoal-800 font-mono">
                      {item.baselineValue !== undefined ? `${item.baselineValue} (${item.baselineYear})` : 'Unspecified'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-forest-50 rounded-lg border border-forest-200 flex items-center justify-between text-xs text-forest-900">
            <span>Approved commitments are immediately available in the <strong>Commitment Directory</strong> and can be evaluated inside the <strong>Audit Workspace</strong>.</span>
            <Link
              href="/admin/commitments"
              className="font-bold text-forest-950 underline underline-offset-4 flex items-center gap-1 shrink-0 ml-2"
            >
              Open Directory
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

