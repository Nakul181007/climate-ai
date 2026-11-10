'use client';

import React, { useEffect, useState } from 'react';
import { useClimate } from '@/lib/context/ClimateContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectorType, EnvironmentalIndicatorType } from '@/lib/types';
import {
  Layers,
  MapPin,
  Satellite,
  Info,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MapMarkerData {
  id: string;
  name: string;
  cityId: 'mumbai' | 'pune';
  coords: [number, number];
  sector: SectorType;
  indicator: EnvironmentalIndicatorType;
  primaryValue: string;
  status: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'INCONCLUSIVE' | 'POTENTIAL_DISCREPANCY';
  commitmentTitle: string;
  source: string;
  observationDate: string;
  notes: string;
  isSimulated: boolean;
}

const LOCALITY_MARKERS: MapMarkerData[] = [
  {
    id: 'loc-mum-aarey',
    name: 'Aarey Forest Buffer Corridor',
    cityId: 'mumbai',
    coords: [19.145, 72.885],
    sector: 'urban-greening',
    indicator: 'NDVI_VEGETATION',
    primaryValue: 'NDVI 0.672 (Target: 0.65)',
    status: 'SUPPORTED',
    commitmentTitle: 'Aarey Forest Buffer Ecological Preservation',
    source: 'Copernicus Sentinel-2 Level-2A',
    observationDate: '2024-10-12',
    notes: 'Zero net loss confirmed across 81,200 grid cells over 2022-2024 baseline.',
    isSimulated: true,
  },
  {
    id: 'loc-mum-meast',
    name: 'M-East Ward (Govandi & Chembur)',
    cityId: 'mumbai',
    coords: [19.055, 72.925],
    sector: 'urban-greening',
    indicator: 'NDVI_VEGETATION',
    primaryValue: 'NDVI 0.208 (-5.4% drop)',
    status: 'POTENTIAL_DISCREPANCY',
    commitmentTitle: 'Urban Green Canopy Expansion in M-East Ward',
    source: 'Sentinel-2 BOA vs Municipal Nursery Records',
    observationDate: '2024-09-24',
    notes: 'Satellite imagery shows greenness decline contradicting claimed 45,000 nursery saplings.',
    isSimulated: true,
  },
  {
    id: 'loc-mum-best',
    name: 'BEST Central Fleet Operations Depot',
    cityId: 'mumbai',
    coords: [19.0178, 72.8478],
    sector: 'transport',
    indicator: 'EV_FLEET_RATIO',
    primaryValue: '46.8% Electric (1,460 e-buses)',
    status: 'PARTIALLY_SUPPORTED',
    commitmentTitle: '100% Electrification of BEST Municipal Bus Fleet',
    source: 'BEST Telemetry & Smart Card Logs',
    observationDate: '2024-10-31',
    notes: 'Impressive induction pace, but grid transformer bottlenecks delay 100% 2026 goal.',
    isSimulated: true,
  },
  {
    id: 'loc-mum-bkc',
    name: 'BKC Distributed Commercial Rooftops',
    cityId: 'mumbai',
    coords: [19.0657, 72.8686],
    sector: 'energy-access',
    indicator: 'ROOFTOP_SOLAR_MW',
    primaryValue: '42 MW verified / 500 MW target',
    status: 'INCONCLUSIVE',
    commitmentTitle: '500 MW Municipal & Commercial Rooftop Solar PV',
    source: 'MEDA Registry & DISCOM Net-Metering',
    observationDate: '2024-10-05',
    notes: 'Decentralized private commercial solar feeds remain fragmented without API sync.',
    isSimulated: true,
  },
  {
    id: 'loc-pune-river',
    name: 'Mula-Mutha Riverfront Confluence (Bund Garden)',
    cityId: 'pune',
    coords: [18.5362, 73.8795],
    sector: 'waste-water',
    indicator: 'WATERBODY_RESTORED_KM',
    primaryValue: '18 km restored / 44 km target',
    status: 'PARTIALLY_SUPPORTED',
    commitmentTitle: 'Mula-Mutha Riverfront 44km Ecological Buffer Restoration',
    source: 'PMC Engineering Logs & Sentinel-2 Water Mask',
    observationDate: '2024-10-20',
    notes: 'Work underway, but civil concrete revetment requires transition to nature-based bioengineering.',
    isSimulated: true,
  },
  {
    id: 'loc-pune-pmpml',
    name: 'PMPML Central Swargate & Bhekrai Nagar Depots',
    cityId: 'pune',
    coords: [18.5018, 73.858],
    sector: 'transport',
    indicator: 'EV_FLEET_RATIO',
    primaryValue: '52.4% Electric (1,020 e-buses)',
    status: 'SUPPORTED',
    commitmentTitle: '50% Electric Fleet Transition for PMPML City Transit',
    source: 'PMPML AVL Telematics Registry',
    observationDate: '2024-10-25',
    notes: 'Exceeded 50% milestone ahead of 2025 schedule with 1,020 verified e-buses.',
    isSimulated: true,
  },
  {
    id: 'loc-pune-tekdi',
    name: 'Baner-Pashan-Vetal Ridge Biodiversity Corridor',
    cityId: 'pune',
    coords: [18.528, 73.818],
    sector: 'urban-greening',
    indicator: 'NDVI_VEGETATION',
    primaryValue: 'Mean NDVI 0.628 (Target: 0.60)',
    status: 'SUPPORTED',
    commitmentTitle: 'Urban Hill Tekdi Biodiversity Corridor Protection',
    source: 'Sentinel-2 Level-2A Multi-Spectral',
    observationDate: '2024-10-08',
    notes: 'Native post-monsoon vegetation regeneration sustained across 1,240 hectares.',
    isSimulated: true,
  },
];

export function ClimateMap() {
  const { selectedCity, selectedCityId } = useClimate();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [baseLayer, setBaseLayer] = useState<'osm' | 'satellite' | 'topo'>('osm');
  const [activeLocality, setActiveLocality] = useState<MapMarkerData | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Dynamically load leaflet on client
    let mapInstance: any = null;

    const initMap = async () => {
      if (typeof window === 'undefined') return;

      const L = (await import('leaflet')).default;

      // Fix standard marker icons in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const container = document.getElementById('climate-leaflet-container');
      if (!container) return;

      // Clear any previous map instance if already initialized
      (container as any)._leaflet_id = null;

      const cityCoords: [number, number] =
        selectedCityId === 'mumbai' ? [19.076, 72.8777] : [18.5204, 73.8567];
      const zoom = selectedCityId === 'mumbai' ? 11 : 12;

      mapInstance = L.map('climate-leaflet-container', {
        center: cityCoords,
        zoom: zoom,
        scrollWheelZoom: true,
      });

      // Dynamic 100% Free Open Basemap Layer (Zero API key required)
      let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      let tileOptions: any = {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      };

      if (baseLayer === 'satellite') {
        tileUrl =
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        tileOptions = {
          attribution:
            '&copy; <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a> &bull; Sentinel-2 Satellite Surveillance',
          maxZoom: 18,
        };
      } else if (baseLayer === 'topo') {
        tileUrl =
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
        tileOptions = {
          attribution:
            '&copy; <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a> World Topographic',
          maxZoom: 18,
        };
      }

      L.tileLayer(tileUrl, tileOptions).addTo(mapInstance);

      // Add markers for current city
      const markers = LOCALITY_MARKERS.filter(
        (m) =>
          m.cityId === selectedCityId &&
          (selectedSector === 'all' || m.sector === selectedSector)
      );

      markers.forEach((marker) => {
        const markerColor =
          marker.status === 'SUPPORTED'
            ? '#059669'
            : marker.status === 'PARTIALLY_SUPPORTED'
            ? '#D97706'
            : marker.status === 'POTENTIAL_DISCREPANCY'
            ? '#DC2626'
            : '#64748B';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="
            background-color: ${markerColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const leafletMarker = L.marker(marker.coords, { icon: customIcon }).addTo(
          mapInstance
        );

        leafletMarker.on('click', () => {
          setActiveLocality(marker);
        });

        leafletMarker.bindTooltip(
          `<strong>${marker.name}</strong><br/>${marker.primaryValue}`,
          { direction: 'top', offset: [0, -10] }
        );
      });

      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [selectedCityId, selectedSector, baseLayer]);

  return (
    <div className="space-y-4">
      {/* Map Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-charcoal-200">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-charcoal-800">
              Sector:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { id: 'all', label: 'All' },
                { id: 'urban-greening', label: 'Greening' },
                { id: 'mobility', label: 'Mobility' },
                { id: 'renewable-energy', label: 'Energy' },
                { id: 'waste-water', label: 'Water' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSector(s.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    selectedSector === s.id
                      ? 'bg-forest-900 text-white font-bold'
                      : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-3 border-l border-charcoal-200">
            <Layers className="w-3.5 h-3.5 text-forest-700" />
            <span className="text-xs font-bold text-charcoal-800">
              Layer:
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: 'osm', label: '🗺️ OpenStreetMap' },
                { id: 'satellite', label: '🛰️ Satellite' },
                { id: 'topo', label: '🏔️ Topo' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setBaseLayer(l.id as any)}
                  className={`px-2 py-0.5 text-xs rounded-md transition-all ${
                    baseLayer === l.id
                      ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                      : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-charcoal-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Supported</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Partial</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Discrepancy</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Inconclusive</span>
          </span>
        </div>
      </div>

      {/* Map Canvas and Locality Inspector Panel */}
      <div className="grid lg:grid-cols-12 gap-4">
        
        {/* Leaflet Canvas (8 cols) */}
        <div className="lg:col-span-8 card-enterprise p-2 overflow-hidden h-[540px] relative">
          <div id="climate-leaflet-container" className="h-full w-full rounded-lg" />
          
          <div className="absolute bottom-4 left-4 z-[400] bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-charcoal-200 shadow-subtle text-[11px] text-charcoal-700 flex items-center gap-2">
            <Satellite className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {baseLayer === 'satellite'
                ? 'Copernicus Sentinel-2 & Esri Earth Observation Satellite Layer'
                : baseLayer === 'topo'
                ? 'Esri World Topographic Terrain Model'
                : 'OpenStreetMap Public Geospatial Vector Layer'}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Zero API Key Required
            </span>
          </div>
        </div>

        {/* Selected Locality Details Panel (4 cols) */}
        <div className="lg:col-span-4 card-enterprise p-5 flex flex-col justify-between h-[540px] overflow-y-auto">
          {activeLocality ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    Locality Inspection
                  </span>
                  <h3 className="text-base font-bold text-forest-950 mt-0.5">
                    {activeLocality.name}
                  </h3>
                </div>
                <StatusBadge status={activeLocality.status} size="sm" />
              </div>

              <div className="p-3 rounded-lg bg-forest-50/60 border border-forest-200">
                <span className="text-[10px] font-semibold text-forest-800 uppercase tracking-wide block">
                  Associated Climate Commitment
                </span>
                <p className="text-xs font-bold text-forest-950 mt-1">
                  {activeLocality.commitmentTitle}
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-charcoal-400 block text-[11px]">Primary Observation Value</span>
                  <span className="font-mono font-bold text-charcoal-900 text-sm">
                    {activeLocality.primaryValue}
                  </span>
                </div>

                <div>
                  <span className="text-charcoal-400 block text-[11px]">Evidence Source</span>
                  <span className="font-medium text-charcoal-800">
                    {activeLocality.source}
                  </span>
                </div>

                <div>
                  <span className="text-charcoal-400 block text-[11px]">Collection Date</span>
                  <span className="font-mono text-charcoal-700">
                    {activeLocality.observationDate}
                  </span>
                </div>

                <div className="pt-2 border-t border-charcoal-100">
                  <span className="text-charcoal-400 block text-[11px] mb-1">Audit Findings</span>
                  <p className="text-xs text-charcoal-700 leading-relaxed bg-charcoal-50 p-2.5 rounded-lg border border-charcoal-100">
                    {activeLocality.notes}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono text-charcoal-400 block">
                  Coordinates: {activeLocality.coords[0].toFixed(4)}°N, {activeLocality.coords[1].toFixed(4)}°E
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-charcoal-400">
              <MapPin className="w-10 h-10 text-charcoal-300 mb-3" />
              <h4 className="text-sm font-bold text-charcoal-800">
                Select an Observation Marker
              </h4>
              <p className="text-xs text-charcoal-500 mt-1 max-w-xs">
                Click any colored pin on the map to inspect its verified environmental observations, Sentinel-2 NDVI telemetry, and audit reasoning.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-charcoal-100 text-[10px] text-charcoal-400 flex items-center justify-between">
            <span>OpenStreetMap Verified Geospatial Layer</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold uppercase">
              Demonstration Mode
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

