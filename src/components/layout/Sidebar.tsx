'use client';

import React, { useEffect, useRef, useCallback } from 'react';
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
  X,
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
  const {
    currentRole,
    selectedCity,
    selectedCityId,
    setSelectedCityId,
    allCities,
    stats,
    isMobileNavOpen,
    setIsMobileNavOpen,
  } = useClimate();

  const isCitizen = pathname.startsWith('/citizen');

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close drawer and restore focus to trigger button
  const closeDrawerAndRestoreFocus = useCallback(() => {
    setIsMobileNavOpen(false);

    const restoreFocus = () => {
      const hamburger = document.querySelector<HTMLButtonElement>(
        'button[aria-controls="mobile-navigation-drawer"]'
      );
      if (
        previousFocusRef.current &&
        previousFocusRef.current !== document.body &&
        typeof previousFocusRef.current.focus === 'function' &&
        document.body.contains(previousFocusRef.current)
      ) {
        previousFocusRef.current.focus();
      } else if (hamburger) {
        hamburger.focus();
      }
    };

    restoreFocus();
    requestAnimationFrame(restoreFocus);
    setTimeout(restoreFocus, 50);
  }, [setIsMobileNavOpen]);

  // Auto-close drawer when route changes (without stealing focus back to hamburger)
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname, setIsMobileNavOpen]);

  // Initial focus management when drawer opens
  useEffect(() => {
    if (isMobileNavOpen) {
      if (
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
      ) {
        previousFocusRef.current = document.activeElement;
      } else {
        previousFocusRef.current = document.querySelector<HTMLButtonElement>(
          'button[aria-controls="mobile-navigation-drawer"]'
        );
      }
      closeButtonRef.current?.focus();
      const rafId = requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [isMobileNavOpen]);

  // Focus trapping and Escape handling
  useEffect(() => {
    if (!isMobileNavOpen) return;

    const getFocusableElements = (): HTMLElement[] => {
      if (!drawerRef.current) return [];
      const selector =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(selector)
      ).filter((el) => {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawerAndRestoreFocus();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements();
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];
        const isFocusableInside = focusables.includes(document.activeElement as HTMLElement);

        if (!isFocusableInside) {
          e.preventDefault();
          if (e.shiftKey) {
            lastElement.focus();
          } else {
            firstElement.focus();
          }
          return;
        }

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileNavOpen, closeDrawerAndRestoreFocus]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileNavOpen]);

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
      description: 'Tamper-evident trail & report generation',
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

  const renderNavLinks = (onItemClick?: () => void) => (
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
            onClick={onItemClick}
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
  );

  const renderCityCard = () => (
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
  );

  const renderPortalSwitcher = (onItemClick?: () => void) => (
    <div className="pt-2">
      <Link
        href={isCitizen ? '/admin' : '/citizen'}
        onClick={onItemClick}
        className="flex items-center justify-between p-2.5 rounded-lg border border-charcoal-200 bg-charcoal-50 hover:bg-charcoal-100 text-charcoal-700 transition-all text-xs font-medium"
      >
        <span>{isCitizen ? 'Switch to Government Portal' : 'Switch to Citizen Portal'}</span>
        <ExternalLink className="w-3.5 h-3.5 text-charcoal-500" />
      </Link>
    </div>
  );

  const renderFooterNote = () => (
    <div className="p-3.5 border-t border-charcoal-200 bg-charcoal-50/50">
      <div className="flex items-start gap-2 text-[11px] text-charcoal-500 leading-snug">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-charcoal-800 block">Deterministic Engine v2.4</span>
          Mathematical parity with Excel model & Copernicus Earth Observation.
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Visible on lg and above) */}
      <aside className="hidden lg:flex w-64 lg:w-72 bg-surface border-r border-charcoal-200 flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
        <div className="p-4 space-y-5">
          {renderCityCard()}

          <div className="space-y-1">
            <div className="px-2 pb-1 text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">
              {isCitizen ? 'Citizen Exploration Portal' : 'Government Intelligence Portal'}
            </div>
            {renderNavLinks()}
          </div>

          {renderPortalSwitcher()}
        </div>

        {renderFooterNote()}
      </aside>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 lg:hidden transition-opacity animate-in fade-in duration-200"
          onClick={closeDrawerAndRestoreFocus}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel (Slides in from left) */}
      {isMobileNavOpen && (
        <div
          ref={drawerRef}
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-y-0 left-0 w-72 sm:w-80 max-w-[85vw] bg-surface z-50 shadow-elevated flex flex-col justify-between overflow-y-auto lg:hidden animate-in slide-in-from-left duration-200"
        >
          {/* Mobile Drawer Header */}
          <div className="p-4 pb-3 border-b border-charcoal-200 flex items-center justify-between shrink-0 bg-surface sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center text-emerald-400 shadow-subtle shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-forest-950 block leading-tight">
                  ClimateAI Maharashtra
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold font-mono border border-emerald-200">
                  {isCitizen ? 'Citizen Portal' : 'Government Portal'}
                </span>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDrawerAndRestoreFocus}
              className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-800"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Drawer Body */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Quick City Switcher within Mobile Drawer */}
            <div className="p-1.5 rounded-lg bg-charcoal-100 border border-charcoal-200 flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-charcoal-500 uppercase px-1.5">
                City:
              </span>
              {allCities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCityId(c.id)}
                  className={`flex-1 py-1 px-2 text-xs font-semibold rounded transition-all text-center ${
                    selectedCityId === c.id
                      ? 'bg-forest-900 text-white shadow-subtle'
                      : 'text-charcoal-600 hover:text-charcoal-950 hover:bg-surface'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {renderCityCard()}

            <div className="space-y-1">
              <div className="px-2 pb-1 text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">
                {isCitizen ? 'Citizen Exploration Portal' : 'Government Intelligence Portal'}
              </div>
              {renderNavLinks(() => setIsMobileNavOpen(false))}
            </div>

            {renderPortalSwitcher(() => setIsMobileNavOpen(false))}
          </div>

          {/* Drawer Footer Note */}
          {renderFooterNote()}
        </div>
      )}
    </>
  );
}
