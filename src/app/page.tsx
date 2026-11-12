'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertOctagon,
  Satellite,
  FileSearch,
  Scale,
  Sparkles,
  BarChart3,
  MapPin,
  ChevronRight,
  Layers,
  FileDown,
} from 'lucide-react';
import { DemoNotice } from '@/components/common/DemoNotice';
import { CITIES } from '@/lib/demo-data';

export default function LandingGatewayPage() {
  const fiveQuestions = [
    {
      step: '01',
      question: 'What did the city promise to achieve?',
      description:
        'AI parses authoritative municipal policy PDFs (MCAP & PCAP) into structured, measurable commitments, target dates, baselines, and legal jurisdictions.',
      icon: FileSearch,
    },
    {
      step: '02',
      question: 'What evidence is available regarding implementation?',
      description:
        'Independent multi-source retrieval gathers Copernicus Sentinel-2 satellite indices, CPCB ambient air telemetry, and municipal depot registries.',
      icon: Satellite,
    },
    {
      step: '03',
      question: 'Does the available evidence support the commitment?',
      description:
        'Deterministic rule matrix cross-evaluates spatial coverage, cloud-masking, and temporal consistency without autonomous AI speculation.',
      icon: Scale,
    },
    {
      step: '04',
      question: 'What implementation gaps or uncertainties exist?',
      description:
        'Transparent audits highlight data voids, unmonitored wards, and discrepancies between self-reported outputs and empirical observations.',
      icon: AlertTriangle,
    },
    {
      step: '05',
      question: 'What should the city do next?',
      description:
        'Evidence-grounded ranking engine recommends high-impact corrective interventions, cost tiers, and what-if simulation models.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col text-charcoal-900">
      <DemoNotice />

      {/* Top Header */}
      <header className="border-b border-charcoal-200 bg-surface/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center shadow-subtle">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-forest-950 font-sans">
                  ClimateAI
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Maharashtra
                </span>
              </div>
              <p className="text-[11px] text-charcoal-500 font-medium">
                Government of Maharashtra Climate Commitment Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/citizen"
              className="px-3.5 py-1.5 text-xs font-semibold text-charcoal-700 hover:text-charcoal-950 rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 shadow-subtle transition-all"
            >
              Public Citizen Portal
            </Link>
            <Link
              href="/admin"
              className="px-4 py-1.5 text-xs font-bold text-white bg-forest-900 hover:bg-forest-800 rounded-lg shadow-subtle flex items-center gap-1.5 transition-all"
            >
              Government Portal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            International Hackathon Prototype &bull; Mumbai & Pune Urban Corridor
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-forest-950 leading-[1.15]">
            From Climate Commitments to{' '}
            <span className="text-emerald-700 underline decoration-emerald-300 decoration-4 underline-offset-8">
              Verified Climate Action.
            </span>
          </h1>
          <p className="mt-6 text-lg text-charcoal-600 leading-relaxed font-normal">
            An enterprise-grade climate intelligence platform connecting municipal climate action plans with independent Earth observation satellite data, ground-level sensor telemetry, and explainable deterministic audit verification.
          </p>

          {/* Quick CTA Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="px-5 py-2.5 text-xs font-bold text-white bg-forest-900 hover:bg-forest-850 rounded-xl shadow-subtle flex items-center gap-2 transition-all hover:scale-102"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Launch Government Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/citizen"
              className="px-5 py-2.5 text-xs font-bold text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-300 rounded-xl shadow-subtle flex items-center gap-2 transition-all hover:scale-102"
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Explore Citizen Tracker</span>
            </Link>

            <a
              href="/api/download"
              download="ClimateAI_Maharashtra_Complete_Platform_Walkthrough.pdf"
              className="px-4 py-2.5 text-xs font-bold text-charcoal-700 bg-surface hover:bg-charcoal-50 border border-charcoal-200 rounded-xl shadow-subtle flex items-center gap-2 transition-all hover:scale-102"
            >
              <FileDown className="w-4 h-4 text-forest-700" />
              <span>Download Platform Walkthrough PDF</span>
            </a>
          </div>
        </div>

        {/* Dual Role Gateway Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          
          {/* Government Administrator Portal */}
          <div className="card-enterprise p-6 sm:p-8 flex flex-col justify-between border-forest-200/60 bg-gradient-to-br from-surface to-forest-50/30">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest-900 text-emerald-400 flex items-center justify-center mb-6 shadow-subtle">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                  Role: Municipal Administrators & Auditors
                </span>
              </div>
              <h2 className="text-2xl font-bold text-forest-950 mb-3">
                Government & Administrator Portal
              </h2>
              <p className="text-sm text-charcoal-600 mb-6 leading-relaxed">
                Comprehensive command centre to ingest climate policy PDFs, audit municipal implementation using Sentinel-2 NDVI satellite telemetry, inspect evidence quality provenance, and run what-if investment scenarios.
              </p>

              <div className="space-y-2.5 text-xs text-charcoal-700 mb-8 border-t border-charcoal-100 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated policy PDF commitment extraction via Gemini 3.8 Flash</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Deterministic audit engine with multi-source evidence scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ranked intervention engine & What-If scenario budget modeller</span>
                </div>
              </div>
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-forest-900 text-white font-semibold text-sm hover:bg-forest-800 transition-colors shadow-subtle group"
            >
              <span>Enter Government Command Centre</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Citizen Accountability Portal */}
          <div className="card-enterprise p-6 sm:p-8 flex flex-col justify-between border-emerald-200/60 bg-gradient-to-br from-surface to-emerald-50/30">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-6 shadow-subtle">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Role: Citizens & Public Stakeholders
                </span>
              </div>
              <h2 className="text-2xl font-bold text-forest-950 mb-3">
                Citizen Accountability Portal
              </h2>
              <p className="text-sm text-charcoal-600 mb-6 leading-relaxed">
                Democratised climate accountability translating technical Earth observation metrics into accessible, plain-language insights with interactive GIS maps and retrieval-grounded AI assistant.
              </p>

              <div className="space-y-2.5 text-xs text-charcoal-700 mb-8 border-t border-charcoal-100 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Plain-language commitment tracker for Mumbai & Pune</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive OpenStreetMap geospatial layer with NDVI vegetation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Evidence-grounded AI Climate Assistant with traceable citations</span>
                </div>
              </div>
            </div>

            <Link
              href="/citizen"
              className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-subtle group"
            >
              <span>Explore Public Citizen Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* The 5 Questions Operational Framework */}
      <section className="py-16 bg-surface border-y border-charcoal-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              System Architecture & Methodology
            </span>
            <h2 className="text-3xl font-extrabold text-forest-950 mt-3 tracking-tight">
              Answering the Five Critical Climate Questions
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              Every feature across ClimateAI Maharashtra is engineered to close the loop between administrative pledges and real-world environmental change.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {fiveQuestions.map((q) => {
              const Icon = q.icon;
              return (
                <div
                  key={q.step}
                  className="p-5 rounded-xl border border-charcoal-200 bg-background hover:bg-surface hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {q.step}
                      </span>
                      <Icon className="w-5 h-5 text-forest-700" />
                    </div>
                    <h3 className="font-bold text-sm text-forest-950 mb-2 leading-snug">
                      {q.question}
                    </h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                      {q.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pilot Cities Spotlight */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Jurisdictions Under Active Verification
            </span>
            <h2 className="text-2xl font-bold text-forest-950 mt-1">
              Initial Pilot Hubs: Mumbai & Pune
            </h2>
          </div>
          <p className="text-xs text-charcoal-500 max-w-md">
            Built on a modular multi-tenant architecture designed to scale across all 28 municipal corporations of Maharashtra.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {CITIES.map((city) => (
            <div
              key={city.id}
              className="card-enterprise p-6 border-charcoal-200 hover:border-emerald-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xl font-bold text-forest-950">{city.name}</h3>
                  </div>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    {city.climateActionPlanName}
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-forest-900 text-emerald-300 font-semibold">
                  NetZero {city.targetNetZeroYear}
                </span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
                {city.description}
              </p>
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-charcoal-100 text-xs">
                <div>
                  <span className="text-charcoal-400 block text-[10px]">Area</span>
                  <span className="font-semibold text-charcoal-800">{city.areaKm2} km²</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px]">Population</span>
                  <span className="font-semibold text-charcoal-800">{city.population}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px]">Baseline</span>
                  <span className="font-semibold text-charcoal-800">{city.baselineYear}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-charcoal-200 bg-surface py-8 text-xs text-charcoal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-charcoal-800">ClimateAI Maharashtra</span>
            <span>&bull; Hackathon Prototype Edition 2026</span>
          </div>
          <div className="text-center sm:text-right text-[11px]">
            Strict adherence to Scientific Integrity Protocol &bull; Deterministic Auditing &bull; Gemini 3.8 Flash
          </div>
        </div>
      </footer>
    </div>
  );
}

