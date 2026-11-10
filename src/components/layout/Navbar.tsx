'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  Bell,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Languages,
  ExternalLink,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useClimate, Language } from '@/lib/context/ClimateContext';
import { CityId } from '@/lib/types';
import { DemoNotice } from '../common/DemoNotice';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    selectedCityId,
    setSelectedCityId,
    selectedCity,
    allCities,
    currentRole,
    setCurrentRole,
    cityAlerts,
    language,
    setLanguage,
  } = useClimate();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const isCitizenPath = pathname.startsWith('/citizen');

  const handleRoleToggle = (targetRole: 'admin' | 'citizen') => {
    setCurrentRole(targetRole);
    if (targetRole === 'citizen') {
      router.push('/citizen');
    } else {
      router.push('/admin');
    }
  };

  const handleCitySelect = (cityId: CityId) => {
    setSelectedCityId(cityId);
    setIsCityDropdownOpen(false);
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const languageLabels: Record<Language, { label: string; code: string }> = {
    en: { label: 'English', code: 'EN' },
    hi: { label: 'हिंदी (Hindi)', code: 'HI' },
    mr: { label: 'मराठी (Marathi)', code: 'MR' },
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-charcoal-200 shadow-subtle">
      <DemoNotice />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center shadow-subtle group-hover:bg-forest-800 transition-colors">
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
                <p className="text-[11px] text-charcoal-500 font-medium hidden sm:block">
                  From Climate Commitments to Verified Climate Action
                </p>
              </div>
            </Link>
          </div>

          {/* Center Controls: City Selector & Role Switcher */}
          <div className="flex items-center gap-2.5">
            
            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-800 shadow-subtle transition-all"
                aria-label="Select City"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-charcoal-900">{selectedCity.name}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium border border-emerald-200 hidden md:inline">
                  {selectedCity.id === 'mumbai' ? 'Primary Pilot' : 'Regional Hub'}
                </span>
                <ChevronDown className="w-3 h-3 text-charcoal-400 ml-0.5" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-surface border border-charcoal-200 shadow-elevated py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider border-b border-charcoal-100">
                    Select Target Urban Jurisdiction
                  </div>
                  {allCities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCitySelect(c.id)}
                      className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-charcoal-50 transition-colors ${
                        selectedCityId === c.id ? 'bg-forest-50/70' : ''
                      }`}
                    >
                      <div className={`mt-0.5 w-2 h-2 rounded-full ${selectedCityId === c.id ? 'bg-emerald-600' : 'bg-charcoal-300'}`} />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-charcoal-900">{c.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-charcoal-100 text-charcoal-600 font-mono">
                            {c.id === 'mumbai' ? 'MVP Primary Pilot' : 'PCAP 2023'}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">{c.climateActionPlanName}</p>
                      </div>
                    </button>
                  ))}
                  <div className="px-3 pt-2 pb-1 border-t border-charcoal-100 mt-1">
                    <span className="text-[10px] text-charcoal-400">Architecture extends to Nagpur & Nashik</span>
                  </div>
                </div>
              )}
            </div>

            {/* Portal Role Toggle Switcher */}
            <div className="flex items-center bg-charcoal-100/90 p-1 rounded-lg border border-charcoal-200/80">
              <button
                onClick={() => handleRoleToggle('admin')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  !isCitizenPath
                    ? 'bg-surface text-forest-900 shadow-subtle border border-charcoal-200/50'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-forest-700" />
                <span className="hidden sm:inline">Government Portal</span>
                <span className="sm:hidden">Govt</span>
              </button>
              <button
                onClick={() => handleRoleToggle('citizen')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  isCitizenPath
                    ? 'bg-surface text-emerald-800 shadow-subtle border border-charcoal-200/50'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Citizen Portal</span>
                <span className="sm:hidden">Public</span>
              </button>
            </div>
          </div>

          {/* Right Controls: Language Selector, Alerts & User Profile */}
          <div className="flex items-center gap-2">
            
            {/* Multi-language Toggle (English, Hindi, Marathi) */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-700 shadow-subtle transition-all"
                title="Change Platform Language"
              >
                <Languages className="w-3.5 h-3.5 text-charcoal-500" />
                <span className="font-mono text-xs font-bold text-forest-900">
                  {languageLabels[language].code}
                </span>
                <ChevronDown className="w-3 h-3 text-charcoal-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-surface border border-charcoal-200 shadow-elevated py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider border-b border-charcoal-100 mb-1">
                    Language / भाषा
                  </div>
                  {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-charcoal-50 transition-colors ${
                        language === lang ? 'bg-forest-50 text-forest-900 font-bold' : 'text-charcoal-700'
                      }`}
                    >
                      <span>{languageLabels[lang].label}</span>
                      {language === lang && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Early Warning Alerts Bell */}
            <div className="relative">
              <button
                onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                className="relative p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors"
                aria-label="View Alerts"
              >
                <Bell className="w-4 h-4" />
                {cityAlerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface" />
                )}
              </button>

              {isAlertsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-surface border border-charcoal-200 shadow-elevated p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-charcoal-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-charcoal-900">Climate Early Warnings</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
                        {cityAlerts.length} Active
                      </span>
                    </div>
                    <button
                      onClick={() => setIsAlertsOpen(false)}
                      className="text-charcoal-400 hover:text-charcoal-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {cityAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-2.5 rounded-lg border border-charcoal-100 bg-charcoal-50/50 hover:bg-charcoal-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              alert.severity === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {alert.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-charcoal-400">Just now</span>
                        </div>
                        <p className="text-xs font-semibold text-charcoal-900 mt-1">{alert.title}</p>
                        <p className="text-[11px] text-charcoal-600 mt-0.5 leading-snug">{alert.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-charcoal-100 text-center">
                    <Link
                      href="/admin/recommendations"
                      onClick={() => setIsAlertsOpen(false)}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1"
                    >
                      View all early warning mitigation paths
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Chip */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-charcoal-200">
              <div className="w-7 h-7 rounded-full bg-forest-900 text-emerald-300 flex items-center justify-center text-xs font-bold">
                G
              </div>
              <div className="text-left text-xs leading-none">
                <span className="font-semibold text-charcoal-900 block">GoM Officer</span>
                <span className="text-[10px] text-charcoal-500">Env. & Climate Dept</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
