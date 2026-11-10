'use client';

import React from 'react';
import Link from 'next/link';
import {
  Satellite,
  Info,
  ShieldCheck,
  Trees,
  Wind,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';

export default function EnvironmentalIntelligencePage() {
  const { selectedCity } = useClimate();

  const ndviBands = [
    {
      range: '0.60 to 0.85',
      label: 'Dense Healthy Forest Canopy',
      example: 'Aarey Forest (0.672), Vetal Tekdi Ridge (0.628)',
      color: 'bg-emerald-600 text-white',
      desc: 'High photosynthetic chlorophyll activity reflecting substantial near-infrared energy.',
    },
    {
      range: '0.35 to 0.59',
      label: 'Moderate Urban Vegetation & Parks',
      example: 'Shivaji Park, Pune University Campus, Bund Garden buffer',
      color: 'bg-emerald-400 text-forest-950',
      desc: 'Scattered trees, public gardens, shrubs, and irrigated lawns.',
    },
    {
      range: '0.15 to 0.34',
      label: 'Sparse Vegetation & Built-Up Urban Fabric',
      example: 'M-East Ward Chembur/Govandi (0.208), Pimpri industrial zone',
      color: 'bg-amber-400 text-charcoal-900',
      desc: 'Dense paved concrete, industrial storage, and roadside weeds with high heat absorption.',
    },
    {
      range: '-1.0 to 0.14',
      label: 'Water Bodies, Barren Soil & Concrete',
      example: 'Arabian Sea coastline, Mula riverbed, road asphalt',
      color: 'bg-slate-400 text-white',
      desc: 'Zero photosynthetic response. Water strongly absorbs NIR wavelengths.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Earth Observation & Scientific Methodology
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              Sentinel-2 &bull; CPCB Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Environmental Intelligence & Satellite Index Explainer
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            How ClimateAI Maharashtra turns raw spectral reflectance into deterministic, explainable climate verification.
          </p>
        </div>

        <Link
          href="/citizen/map"
          className="px-4 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Satellite className="w-3.5 h-3.5 text-emerald-400" />
          <span>View on Geospatial Map</span>
        </Link>
      </div>

      {/* Mandatory Scientific Integrity Warning Card */}
      <div className="card-enterprise p-5 border-amber-300 bg-amber-50/60 shadow-subtle">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-950" />
          </div>
          <div className="text-xs leading-relaxed space-y-1">
            <h2 className="font-bold text-amber-950 text-sm">
              Scientific Integrity Mandate: What Satellite NDVI Actually Measures
            </h2>
            <p className="text-amber-900">
              <strong>1. NDVI measures vegetation greenness, NOT individual tree count.</strong> A dense lawn or seasonal monsoon grass can generate high NDVI without indicating long-term tree canopy expansion.
            </p>
            <p className="text-amber-900">
              <strong>2. NDVI alone cannot verify plantation sapling survival.</strong> Young saplings have minimal canopy footprint during their first 12–24 months. Ground-level multi-temporal audits are mandatory.
            </p>
            <p className="text-amber-900">
              <strong>3. Missing data is not an automatic accusation of failure.</strong> Cloud cover, sensor recalibration, or delayed municipal telemetry result in an <strong>INCONCLUSIVE</strong> outcome, preventing false allegations.
            </p>
          </div>
        </div>
      </div>

      {/* NDVI Calculation Deep-Dive */}
      <div className="card-enterprise p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-forest-950">
              The NDVI Mathematical Formula
            </h3>
            <p className="text-xs text-charcoal-500">
              Calculated deterministically from Copernicus Sentinel-2 Level-2A Bottom-Of-Atmosphere (BOA) Reflectance
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold uppercase">
            10-Metre Spatial Resolution
          </span>
        </div>

        {/* Formula Box */}
        <div className="p-5 rounded-xl bg-charcoal-900 text-white text-center font-mono my-4 shadow-subtle">
          <div className="text-lg sm:text-xl font-bold tracking-wider text-emerald-400">
            NDVI = (NIR - Red) / (NIR + Red)
          </div>
          <div className="text-xs text-charcoal-300 mt-2 font-sans flex items-center justify-center gap-4 flex-wrap">
            <span><strong>Band 8 (NIR):</strong> 842 nm Central Wavelength</span>
            <span>&bull;</span>
            <span><strong>Band 4 (Red):</strong> 665 nm Central Wavelength</span>
          </div>
        </div>

        <p className="text-xs text-charcoal-600 leading-relaxed font-sans mb-6">
          Healthy green leaves strongly absorb red light (using chlorophyll for photosynthesis) and strongly reflect near-infrared radiation (due to internal mesophyll cellular structure). When vegetation is stressed, diseased, or cleared, NIR reflectance plummets while Red reflectance rises.
        </p>

        {/* NDVI Reference Scale */}
        <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider mb-3">
          Vegetation Density Benchmark Scale
        </h4>

        <div className="space-y-2.5">
          {ndviBands.map((band) => (
            <div
              key={band.range}
              className="p-3.5 rounded-lg border border-charcoal-200 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs shrink-0 ${band.color}`}>
                  {band.range}
                </span>
                <div>
                  <span className="font-bold text-charcoal-900 block">{band.label}</span>
                  <span className="text-[11px] text-charcoal-500">{band.desc}</span>
                </div>
              </div>

              <div className="sm:text-right shrink-0 text-[11px] text-emerald-800 font-medium">
                Benchmark: {band.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Sensor Ecosystem Overview */}
      <div className="grid md:grid-cols-2 gap-4">
        
        <div className="card-enterprise p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-forest-950">
                Copernicus Sentinel-2 Constellation
              </h4>
              <span className="text-[11px] text-charcoal-500">European Space Agency (ESA)</span>
            </div>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed mt-2">
            Provides 5-day revisit cycles over Mumbai and Pune. Used for canopy cover indexing, mangrove boundary surveillance, and water body surface extent. Validated through automated scene classification masks (SCL) to remove clouds and shadows.
          </p>
        </div>

        <div className="card-enterprise p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-forest-950">
                Continuous Ambient Air Quality (CAAQMS)
              </h4>
              <span className="text-[11px] text-charcoal-500">CPCB & Maharashtra Pollution Control Board</span>
            </div>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed mt-2">
            Real-time beta-attenuation monitors tracking PM2.5, PM10, NO2, and SO2 across 15 Mumbai stations and 9 Pune stations. Serves as ground-truth corroboration for municipal dust abatement and EV fleet impact.
          </p>
        </div>

      </div>

    </div>
  );
}

