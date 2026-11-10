'use client';

import React from 'react';
import Link from 'next/link';
import { ClimateMap } from '@/components/map/ClimateMap';
import { useClimate } from '@/lib/context/ClimateContext';
import { MapPin, Satellite, ShieldCheck, Database, ArrowRight } from 'lucide-react';

export default function AdminGeospatialMapPage() {
  const { selectedCity } = useClimate();

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/80">
              Government GIS Command Layer
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              OpenStreetMap &bull; Copernicus Sentinel-2 Level-2A &bull; CPCB Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Geospatial Climate Surveillance &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 max-w-3xl">
            Interactive GIS layer mapping empirical observation stations, ward-level vegetative greenness, transit electrification corridors, and stormwater discharge points.
          </p>
        </div>

        <Link
          href="/admin/evidence"
          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-800 shadow-subtle flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Database className="w-3.5 h-3.5 text-forest-700" />
          <span>Inspect Raw Evidence Streams</span>
        </Link>
      </div>

      {/* Main Map Component */}
      <ClimateMap />

    </div>
  );
}

