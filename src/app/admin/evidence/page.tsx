'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Satellite,
  Activity,
  Database,
  Building,
  GraduationCap,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';
import { DEMO_OBSERVATIONS } from '@/lib/demo-data';
import { useClimate } from '@/lib/context/ClimateContext';
import { SourceType, EnvironmentalIndicatorType } from '@/lib/types';

export default function EvidenceExplorerPage() {
  const { selectedCity, commitments } = useClimate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  const [selectedIndicator, setSelectedIndicator] = useState<string>('all');
  const [minReliability, setMinReliability] = useState<number>(0);

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'SATELLITE_SENTINEL_2':
        return <Satellite className="w-4 h-4 text-emerald-700" />;
      case 'GROUND_SENSOR_CPCB':
        return <Activity className="w-4 h-4 text-blue-700" />;
      case 'MUNICIPAL_OPERATIONAL_DATA':
        return <Building className="w-4 h-4 text-purple-700" />;
      case 'INDEPENDENT_RESEARCH_STUDY':
        return <GraduationCap className="w-4 h-4 text-amber-700" />;
      default:
        return <Database className="w-4 h-4 text-charcoal-700" />;
    }
  };

  const getSourceTypeLabel = (type: SourceType) => {
    switch (type) {
      case 'SATELLITE_SENTINEL_2':
        return 'Earth Observation (Copernicus Sentinel)';
      case 'GROUND_SENSOR_CPCB':
        return 'Ground Telemetry (CPCB / CAAQMS)';
      case 'MUNICIPAL_OPERATIONAL_DATA':
        return 'Municipal Operational Data';
      case 'INDEPENDENT_RESEARCH_STUDY':
        return 'Independent Academic / Drone Survey';
      default:
        return 'Raw Sensor Feed';
    }
  };

  const filteredObservations = useMemo(() => {
    return DEMO_OBSERVATIONS.filter((obs) => {
      const matchesSearch =
        obs.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obs.geographicArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obs.methodology.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedSourceType === 'all' || obs.sourceType === selectedSourceType;
      const matchesIndicator =
        selectedIndicator === 'all' || obs.indicator === selectedIndicator;
      const matchesReliability = obs.reliabilityScore >= minReliability;

      return matchesSearch && matchesType && matchesIndicator && matchesReliability;
    });
  }, [searchQuery, selectedSourceType, selectedIndicator, minReliability]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/80">
              Earth Observation & Ground Telemetry
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              {filteredObservations.length} Verified Evidence Streams
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Multi-Source Evidence Explorer &bull; {selectedCity.name}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 max-w-3xl">
            Independent environmental telemetry streams powering the climate audit engine. Inspect raw data provenance, spectral indices, cloud cover masking, and measurement limitations.
          </p>
        </div>

        <Link
          href="/admin/map"
          className="px-3.5 py-2 text-xs font-bold rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>View on Geospatial Map</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-surface border border-charcoal-200 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search evidence by sensor, locality (e.g. Andheri, Wadala), or methodology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-charcoal-200 bg-background focus:bg-surface focus:outline-none focus:ring-2 focus:ring-forest-800/20 text-charcoal-900 placeholder:text-charcoal-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Source Type Filter */}
            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              aria-label="Filter by Source Type"
              className="px-2.5 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Source Streams</option>
              <option value="SATELLITE_SENTINEL_2">Satellite (Sentinel-2 / 5P)</option>
              <option value="GROUND_SENSOR_CPCB">Ground Sensors (CPCB / MPCB)</option>
              <option value="MUNICIPAL_OPERATIONAL_DATA">Municipal Operational Logs</option>
              <option value="INDEPENDENT_RESEARCH_STUDY">Independent UAV Surveys</option>
            </select>

            {/* Indicator Filter */}
            <select
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
              aria-label="Filter by Environmental Indicator"
              className="px-2.5 py-2 text-xs rounded-lg border border-charcoal-200 bg-surface text-charcoal-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Indicators</option>
              <option value="EV_FLEET_RATIO">EV Bus Ratio / Fleet GPS</option>
              <option value="NDVI_VEGETATION">NDVI Vegetation Greenness</option>
              <option value="STORMWATER_DRAINAGE_PCT">Stormwater Nullah Discharge</option>
              <option value="ROOFTOP_SOLAR_MW">Rooftop Solar PV</option>
              <option value="CLEAN_COOKING_ACCESS_PCT">Clean Cooking Transition</option>
            </select>

            {/* Min Reliability Filter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-charcoal-200 bg-surface text-xs text-charcoal-700">
              <span className="text-[11px] text-charcoal-400">Min Rel:</span>
              <span className="font-mono font-bold text-forest-900">{minReliability}%</span>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minReliability}
                onChange={(e) => setMinReliability(Number(e.target.value))}
                className="w-16 accent-forest-800 cursor-pointer"
                aria-label="Minimum Reliability Score"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Scientific Integrity Principles Banner */}
      <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block">Scientific Integrity Protocol:</span>
          1. NDVI measures aggregate vegetation greenness, not individual tree counts. 
          2. Satellite observations require explicit capture dates, cloud-cover validation (&lt; 10%), and ground calibration. 
          3. Absence of telemetry indicates data insufficiency (INCONCLUSIVE), never failure.
        </div>
      </div>

      {/* Evidence Stream Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredObservations.map((obs) => {
          const linkedCommitment = commitments.find((c) => c.id === obs.commitmentId);

          return (
            <div
              key={obs.id}
              className="card-enterprise p-5 flex flex-col justify-between hover:border-charcoal-300 transition-all space-y-3"
            >
              <div>
                
                {/* Source Badge & Reliability */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-forest-50 border border-forest-200 shrink-0">
                      {getSourceIcon(obs.sourceType)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-500 font-mono block">
                        {getSourceTypeLabel(obs.sourceType)}
                      </span>
                      <h3 className="text-sm font-bold text-forest-950 leading-snug">
                        {obs.sourceName}
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    {obs.reliabilityScore}% Reliability
                  </span>
                </div>

                {/* Measurement Highlight */}
                <div className="p-3 rounded-lg bg-background border border-charcoal-200 my-2.5 flex items-center justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-charcoal-400 uppercase block">Empirical Reading</span>
                    <span className="text-base font-extrabold text-forest-950">
                      {obs.measuredValue} <span className="text-xs font-semibold text-charcoal-600">{obs.unit}</span>
                    </span>
                  </div>

                  <div className="text-right text-[11px] text-charcoal-500">
                    <span className="block">Date: {obs.collectionDate}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Spatial Coverage: {obs.coveragePercent}%
                    </span>
                  </div>
                </div>

                {/* Methodology */}
                <p className="text-xs text-charcoal-600 leading-relaxed font-sans line-clamp-3">
                  <strong>Methodology:</strong> {obs.methodology}
                </p>

                {/* Satellite Quality Indices (If Applicable) */}
                {(obs.cloudCoverPercent !== undefined || obs.validPixelPercent !== undefined) && (
                  <div className="flex items-center gap-3 text-[11px] font-mono text-charcoal-500 bg-charcoal-50 p-2 rounded-md mt-2">
                    {obs.cloudCoverPercent !== undefined && (
                      <span>Cloud Cover: <strong className="text-charcoal-800">{obs.cloudCoverPercent}%</strong></span>
                    )}
                    {obs.validPixelPercent !== undefined && (
                      <span>Valid Pixels: <strong className="text-charcoal-800">{obs.validPixelPercent}%</strong></span>
                    )}
                  </div>
                )}

                {/* Limitations */}
                {obs.limitations.length > 0 && (
                  <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-md border border-amber-200/60 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Limitation:</strong> {obs.limitations[0]}</span>
                  </div>
                )}
              </div>

              {/* Footer: Linked Commitment & Coordinates */}
              <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-charcoal-500 truncate max-w-[280px]">
                  <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                  <span className="truncate">{obs.geographicArea}</span>
                </div>

                {linkedCommitment && (
                  <Link
                    href={`/admin/commitments/${linkedCommitment.id}`}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 shrink-0"
                  >
                    <span>View Target</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

