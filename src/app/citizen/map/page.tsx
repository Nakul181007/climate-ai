'use client';

import React from 'react';
import { ClimateMap } from '@/components/map/ClimateMap';
import { useClimate } from '@/lib/context/ClimateContext';
import { MapPin, Satellite, ShieldCheck } from 'lucide-react';

export default function GeospatialMapPage() {
  const { selectedCity } = useClimate();

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Geospatial Intelligence Engine
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              OpenStreetMap + Sentinel-2
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Interactive Climate Observation Map &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Explore physical observation points, ward canopy densities, public transit depots, and river corridors under active audit surveillance.
          </p>
        </div>
      </div>

      {/* Main Map Component */}
      <ClimateMap />

    </div>
  );
}

