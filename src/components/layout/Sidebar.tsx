'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ListCheck,
  Cpu,
  TrendingUp,
  Sliders,
  Map,
  Compass,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Satellite,
  BarChart3,
  History,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, selectedCity, stats } = useClimate();

  const isCitizen = pathname.startsWith('/citizen');

  const adminNav: NavItem[] = [
    {
      name: 'Executive Overview',
      href: '/admin',
      icon: LayoutDashboard,
      description: 'Portfolio command centre & sector health',
    },
    {
      name: 'Commitment Directory',
      href: '/admin/commitments',
      icon: ListCheck,
      badge: `${stats.totalCommitments}`,
      description: 'Filter, sort & inspect targets',
    },
    {
      name: 'Policy Intelligence',
      href: '/admin/policies',
      icon: FileText,
      badge: 'PDF / AI',
      description: 'Upload & extract municipal climate plans',
    },
    {
      name: 'Evidence Explorer',
      href: '/admin/evidence',
      icon: Database,
      badge: 'Multi-Source',
      description: 'Satellite, sensor & municipal streams',
    },
    {
      name: 'Climate Audits',
      href: '/admin/audit-workspace',
      icon: Cpu,
      badge: 'Engine',
      description: 'Deterministic evidence verification',
    },
    {
      name: 'Audit History',
      href: '/admin/audit-history',
      icon: History,
      description: 'Immutable trail & report generation',
    },
    {
      name: 'Recommendation Engine',
      href: '/admin/recommendations',
      icon: TrendingUp,
      description: 'Ranked high-ROI interventions',
    },
    {
      name: 'What-If Simulator',
      href: '/admin/simulator',
      icon: Sliders,
      badge: 'Excel Model',
      description: 'Scenario levers & cost projection',
    },
    {
      name: 'Interactive GIS Map',
      href: '/admin/map',
      icon: Map,
      badge: 'Sentinel-2',
      description: 'Spatial layers & observation telemetry',
    },
  ];

  const citizenNav: NavItem[] = [
    {
      name: 'City Overview',
      href: '/citizen',
      icon: Compass,
      description: 'Accessible climate accountability',
    },
    {
      name: 'Commitment Tracker',
      href: '/citizen/tracker',
      icon: ListCheck,
      badge: `${stats.totalCommitments}`,
      description: 'Promises vs independent observations',
    },
    {
      name: 'Environmental Insights',
      href: '/citizen/environment',
      icon: Satellite,
      description: 'Plain-language satellite & sensor facts',
    },
    {
      name: 'Explore Map',
      href: '/citizen/map',
      icon: Map,
      badge: 'Interactive',
      description: 'Locality GIS & environmental layers',
    },
    {
      name: 'Ask ClimateAI',
      href: '/citizen/assistant',
      icon: MessageSquare,
      badge: 'Cited RAG',
      description: 'Evidence-grounded Q&A with citations',
    },
  ];

  const navigation = isCitizen ? citizenNav : adminNav;

  return (
    <aside className="w-64 lg:w-72 bg-surface border-r border-charcoal-200 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      <div className="p-4 space-y-5">
        
        {/* City Status Card */}
        <div className="p-3.5 rounded-xl bg-forest-900 text-white shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-300 mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Pilot Jurisdiction
            </span>
            <span className="text-[10px] bg-forest-800 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
              NetZero {selectedCity.targetNetZeroYear}
            </span>
          </div>
          <h3 className="text-base font-bold tracking-tight text-white">{selectedCity.name}</h3>
          <p className="text-xs text-forest-200 line-clamp-1 mt-0.5 font-medium">
            {selectedCity.climateActionPlanName}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-forest-800/80 text-[11px]">
            <div>
              <span className="text-forest-300 block">Baseline</span>
              <span className="font-semibold text-white">{selectedCity.baselineYear}</span>
            </div>
            <div>
              <span className="text-forest-300 block">Audited Goals</span>
              <span className="font-semibold text-white">
                {stats.auditsCompleted} / {stats.totalCommitments}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">
            {isCitizen ? 'Citizen Exploration Portal' : 'Government Intelligence Portal'}
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === '/admin' || item.href === '/citizen'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forest-50 text-forest-950 font-bold border border-forest-200/80 shadow-subtle'
                      : 'text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-forest-800'
                          : 'text-charcoal-400 group-hover:text-charcoal-700'
                      }`}
                    />
                    <div className="truncate">
                      <span className="block truncate">{item.name}</span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 font-medium ${
                        isActive
                          ? 'bg-forest-200/70 text-forest-900'
                          : 'bg-charcoal-100 text-charcoal-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Portal Switcher Banner */}
        <div className="pt-2">
          <Link
            href={isCitizen ? '/admin' : '/citizen'}
            className="flex items-center justify-between p-2.5 rounded-lg border border-charcoal-200 bg-charcoal-50 hover:bg-charcoal-100 text-charcoal-700 transition-all text-xs font-medium"
          >
            <span>{isCitizen ? 'Switch to Government Portal' : 'Switch to Citizen Portal'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-charcoal-500" />
          </Link>
        </div>

      </div>

      {/* Footer Info: Scientific Methodology Note */}
      <div className="p-3.5 border-t border-charcoal-200 bg-charcoal-50/50">
        <div className="flex items-start gap-2 text-[11px] text-charcoal-500 leading-snug">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-charcoal-800 block">Deterministic Engine v2.4</span>
            Mathematical parity with Excel model & Copernicus Earth Observation.
          </div>
        </div>
      </div>
    </aside>
  );
}
