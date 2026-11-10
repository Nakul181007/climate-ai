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
  CloudRain,
  Flame,
  Trees,
  Wind,
  Sparkles,
  Droplets,
  Thermometer,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
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

export type ClimaticEffectType =
  | 'none'
  | 'monsoon_rain'
  | 'heat_island'
  | 'ndvi_canopy'
  | 'air_plume';

export interface ClimaticZone {
  id: string;
  name: string;
  cityId: 'mumbai' | 'pune';
  type: 'monsoon_rain' | 'heat_island' | 'ndvi_canopy' | 'air_plume';
  coords: [number, number];
  radiusMeters: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LUSH';
  metricTitle: string;
  metricValue: string;
  anomalyDelta: string;
  description: string;
  impactAlert: string;
  recommendedMitigation: string;
  color: string;
  fillOpacity: number;
  pulseIconEmoji: string;
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

const CLIMATIC_ZONES: ClimaticZone[] = [
  // MUMBAI RAIN & MONSOON CLOUD RADAR
  {
    id: 'clim-mum-rain-1',
    name: 'Mithi River Basin & Kalina Inundation Funnel',
    cityId: 'mumbai',
    type: 'monsoon_rain',
    coords: [19.0728, 72.871],
    radiusMeters: 3400,
    severity: 'CRITICAL',
    metricTitle: 'Doppler Radar Precipitation Rate',
    metricValue: '78 mm/hr (Heavy Stormfront)',
    anomalyDelta: '+210% vs Seasonal Mean',
    description:
      'High-density convective monsoon cloud cell over central Mithi discharge basin. 85% impervious pavement impedance triggers immediate stormwater surge.',
    impactAlert: 'Flash Inundation Alert: Kurla, Kalina, and CST Road arterial bottlenecks.',
    recommendedMitigation: 'Activate stormwater sluice gates at Mahim Causeway and clear detention bio-basins.',
    color: '#2563EB',
    fillOpacity: 0.35,
    pulseIconEmoji: '🌧️',
  },
  {
    id: 'clim-mum-rain-2',
    name: 'Hindmata & Parel Low-Lying Storm Depression',
    cityId: 'mumbai',
    type: 'monsoon_rain',
    coords: [19.006, 72.842],
    radiusMeters: 2600,
    severity: 'HIGH',
    metricTitle: 'Radar Reflectivity Index',
    metricValue: '54 dBZ (High Runoff Velocity)',
    anomalyDelta: '+140% vs Baseline',
    description:
      'Natural topographical depression receiving concentrated localized cloudburst. High-capacity underground stormwater holding tanks operating at 88% capacity.',
    impactAlert: 'Traffic divergence advisory for Dr. B.A. Road & Parel TT junction.',
    recommendedMitigation: 'Deploy mobile dewatering pumps and route discharge into Dadar storm trunk line.',
    color: '#3B82F6',
    fillOpacity: 0.32,
    pulseIconEmoji: '⛈️',
  },
  {
    id: 'clim-mum-rain-3',
    name: 'Thane Creek Maritime Convergence Front',
    cityId: 'mumbai',
    type: 'monsoon_rain',
    coords: [19.12, 72.97],
    radiusMeters: 4200,
    severity: 'MODERATE',
    metricTitle: 'Cloud Radar Reflectivity',
    metricValue: '38 mm/hr (Sustained Maritime Band)',
    anomalyDelta: '+65% Coastal Moisture',
    description:
      'Moisture-laden maritime windward front sweeping across eastern suburban wetlands toward Vikhroli mangrove buffer.',
    impactAlert: 'Moderate surface accumulation in low-lying dockland sidings.',
    recommendedMitigation: 'Monitor tidal gate timing with high-tide peak at 14:30 hrs.',
    color: '#60A5FA',
    fillOpacity: 0.28,
    pulseIconEmoji: '🌦️',
  },

  // MUMBAI URBAN HEAT ISLAND & THERMAL ANOMALIES
  {
    id: 'clim-mum-heat-1',
    name: 'Dharavi-Sion Impervious Thermal Sump',
    cityId: 'mumbai',
    type: 'heat_island',
    coords: [19.04, 72.855],
    radiusMeters: 2800,
    severity: 'CRITICAL',
    metricTitle: 'Land Surface Temperature (LST)',
    metricValue: '42.8°C (+7.6°C Thermal Anomaly)',
    anomalyDelta: '+7.6°C above Urban Baseline',
    description:
      'Severe microclimatic urban heat island driven by corrugated tin roofs, zero canopy shade (<4%), and concentrated anthropogenic heat rejection.',
    impactAlert: 'High heat stroke hazard for informal workers and elderly residents.',
    recommendedMitigation: 'Rapid deployment of white high-albedo roof paint and public shade misting kiosks.',
    color: '#DC2626',
    fillOpacity: 0.42,
    pulseIconEmoji: '🔥',
  },
  {
    id: 'clim-mum-heat-2',
    name: 'Govandi & Deonar Thermal Radiance Pocket',
    cityId: 'mumbai',
    type: 'heat_island',
    coords: [19.06, 72.93],
    radiusMeters: 3100,
    severity: 'CRITICAL',
    metricTitle: 'Thermal Infrared Radiance',
    metricValue: '44.3°C (+9.1°C Heat Sink)',
    anomalyDelta: '+9.1°C Peak Heat Sink',
    description:
      'Deonar landfill surface methane oxidation combined with low-albedo asphalt yards creates Mumbai’s most severe surface thermal hotspot.',
    impactAlert: 'Elevated tropospheric ozone and thermal stress index exceeding 48°C.',
    recommendedMitigation: 'Establish a 50m green vegetative buffer strip and active landfill capping.',
    color: '#EF4444',
    fillOpacity: 0.45,
    pulseIconEmoji: '🌡️',
  },
  {
    id: 'clim-mum-heat-3',
    name: 'BKC Commercial Concrete & Glass Cavern',
    cityId: 'mumbai',
    type: 'heat_island',
    coords: [19.065, 72.868],
    radiusMeters: 2000,
    severity: 'HIGH',
    metricTitle: 'Microclimate Heat Stress Index',
    metricValue: '39.9°C (+4.7°C Anomaly)',
    anomalyDelta: '+4.7°C Heat Trap',
    description:
      'Extensive glass facades and multi-lane vehicular corridors reflect and trap radiant energy with dense HVAC condensation heat output.',
    impactAlert: 'Pedestrian thermal discomfort during 11:00 to 16:00 window.',
    recommendedMitigation: 'Mandate vegetative green facades and permeable cool pavements across office plazas.',
    color: '#F97316',
    fillOpacity: 0.36,
    pulseIconEmoji: '☀️',
  },

  // MUMBAI VEGETATION COOLING CANOPY
  {
    id: 'clim-mum-ndvi-1',
    name: 'Sanjay Gandhi National Park & Aarey Rainforest Lung',
    cityId: 'mumbai',
    type: 'ndvi_canopy',
    coords: [19.18, 72.9],
    radiusMeters: 5500,
    severity: 'LUSH',
    metricTitle: 'Copernicus Sentinel-2 Mean NDVI',
    metricValue: 'NDVI 0.76 (-5.2°C Cooling Buffer)',
    anomalyDelta: '-5.2°C Natural Air Conditioning',
    description:
      'Dense tropical dry-deciduous canopy acting as the primary biological carbon sink and temperature moderator for northern Mumbai.',
    impactAlert: 'Vital ecological defense against suburban microclimate desertification.',
    recommendedMitigation: 'Enforce strict 500m eco-sensitive buffer zone surveillance with zero encroachment.',
    color: '#059669',
    fillOpacity: 0.38,
    pulseIconEmoji: '🌳',
  },
  {
    id: 'clim-mum-ndvi-2',
    name: 'Mahim Nature Park & Tidal Mangrove Buffer',
    cityId: 'mumbai',
    type: 'ndvi_canopy',
    coords: [19.05, 72.86],
    radiusMeters: 1700,
    severity: 'LUSH',
    metricTitle: 'Wetland Canopy Biomass Index',
    metricValue: 'NDVI 0.65 (-3.4°C Microclimate Buffer)',
    anomalyDelta: '-3.4°C Estuarine Cooling',
    description:
      'Thriving Avicennia marina mangrove stands along the Mithi estuary dampening highway heat and filtering suburban runoff.',
    impactAlert: 'High resilience value for coastal storm surge protection.',
    recommendedMitigation: 'Maintain continuous water-quality telemetry to safeguard root aeration.',
    color: '#10B981',
    fillOpacity: 0.35,
    pulseIconEmoji: '🌿',
  },

  // MUMBAI AIR QUALITY DISPERSION
  {
    id: 'clim-mum-air-1',
    name: 'Wadala Logistics & Eastern Harbor Plume',
    cityId: 'mumbai',
    type: 'air_plume',
    coords: [19.015, 72.87],
    radiusMeters: 2900,
    severity: 'HIGH',
    metricTitle: 'Particulate Matter Dispersion (PM2.5)',
    metricValue: '172 µg/m³ (Severe Non-Attainment)',
    anomalyDelta: '3.4x WHO Safety Guideline',
    description:
      'High-volume diesel freight transit, port container loading, and winter temperature inversions concentrate fine particulate matter.',
    impactAlert: 'Severe respiratory risk alert for residents of Antop Hill and Wadala East.',
    recommendedMitigation: 'Mandate shore-to-ship electric power and transition heavy drayage trucks to LNG/electric.',
    color: '#7C3AED',
    fillOpacity: 0.38,
    pulseIconEmoji: '💨',
  },

  // PUNE CLIMATIC ZONES
  {
    id: 'clim-pune-rain-1',
    name: 'Mula-Mutha Confluence Monsoon Floodplain',
    cityId: 'pune',
    type: 'monsoon_rain',
    coords: [18.536, 73.88],
    radiusMeters: 3200,
    severity: 'HIGH',
    metricTitle: 'River Basin Runoff Radar',
    metricValue: '64 mm/hr (Surge Flow)',
    anomalyDelta: '+180% vs Normal',
    description:
      'Upstream dam gate discharges combine with intense localized monsoon downpours, inundating low-lying Bund Garden riverbanks.',
    impactAlert: 'Low-lying riverfront promenade immersion warning.',
    recommendedMitigation: 'Automate flood forecasting sirens synchronized with Khadakwasla dam telemetry.',
    color: '#2563EB',
    fillOpacity: 0.35,
    pulseIconEmoji: '🌧️',
  },
  {
    id: 'clim-pune-heat-1',
    name: 'Hadapsar & Bhosari Industrial Thermal Sump',
    cityId: 'pune',
    type: 'heat_island',
    coords: [18.505, 73.93],
    radiusMeters: 3600,
    severity: 'HIGH',
    metricTitle: 'Land Surface Thermal Radiance',
    metricValue: '41.5°C (+6.1°C Heat Anomaly)',
    anomalyDelta: '+6.1°C Thermal Delta',
    description:
      'Heavy manufacturing corrugated sheds and bare asphalt container parking generate extensive industrial surface heat.',
    impactAlert: 'Shift-worker thermal dehydration risk in uninsulated workshops.',
    recommendedMitigation: 'Mandate industrial rooftop solar canopies to shade roof decks.',
    color: '#EA580C',
    fillOpacity: 0.38,
    pulseIconEmoji: '🔥',
  },
  {
    id: 'clim-pune-ndvi-1',
    name: 'Baner-Pashan-Vetal Ridge Biodiversity Corridor',
    cityId: 'pune',
    type: 'ndvi_canopy',
    coords: [18.528, 73.818],
    radiusMeters: 3400,
    severity: 'LUSH',
    metricTitle: 'Tekdi Ridge Canopy Index',
    metricValue: 'NDVI 0.68 (-4.1°C Microclimate Cooler)',
    anomalyDelta: '-4.1°C Bioclimatic Buffer',
    description:
      'Continuous scrub and broadleaf ridge acting as western Pune’s primary thermal buffer and natural groundwater recharge zone.',
    impactAlert: 'Critical natural sponge buffering urban sprawl heat.',
    recommendedMitigation: 'Restrict non-forest constructions along the ridge contours.',
    color: '#059669',
    fillOpacity: 0.38,
    pulseIconEmoji: '🌳',
  },
];

export function ClimateMap() {
  const { selectedCity, selectedCityId } = useClimate();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [baseLayer, setBaseLayer] = useState<'osm' | 'satellite' | 'topo'>('osm');
  const [climaticEffect, setClimaticEffect] = useState<ClimaticEffectType>('monsoon_rain');
  const [activeLocality, setActiveLocality] = useState<MapMarkerData | null>(null);
  const [activeClimaticZone, setActiveClimaticZone] = useState<ClimaticZone | null>(null);
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

      // Render Climatic Overlay Circles & Center Halo Markers
      if (climaticEffect !== 'none') {
        const activeZones = CLIMATIC_ZONES.filter(
          (z) => z.cityId === selectedCityId && z.type === climaticEffect
        );

        activeZones.forEach((zone) => {
          // Semi-transparent atmospheric circle
          const circle = L.circle(zone.coords, {
            radius: zone.radiusMeters,
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: zone.fillOpacity,
            weight: 2,
            dashArray: zone.type === 'monsoon_rain' ? '6, 8' : undefined,
          }).addTo(mapInstance);

          circle.on('click', () => {
            setActiveClimaticZone(zone);
            setActiveLocality(null);
          });

          circle.bindTooltip(
            `<strong>${zone.pulseIconEmoji} ${zone.name}</strong><br/><span style="color:${zone.color};font-weight:bold;">${zone.metricValue}</span>`,
            { direction: 'top', offset: [0, -10] }
          );

          // Animated pulse center icon
          const pulseIcon = L.divIcon({
            className: 'climatic-pulse-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
                <div class="animate-climate-halo" style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: ${zone.color}; opacity: 0.6;"></div>
                <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background-color: ${zone.color}; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">
                  <span>${zone.pulseIconEmoji}</span>
                </div>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const centerMarker = L.marker(zone.coords, { icon: pulseIcon }).addTo(
            mapInstance
          );

          centerMarker.on('click', () => {
            setActiveClimaticZone(zone);
            setActiveLocality(null);
          });
        });
      }

      // Add statutory locality markers for current city
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
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 2.5px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 5px; height: 5px; background-color: white; border-radius: 50%;"></div>
          </div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const leafletMarker = L.marker(marker.coords, { icon: customIcon }).addTo(
          mapInstance
        );

        leafletMarker.on('click', () => {
          setActiveLocality(marker);
          setActiveClimaticZone(null);
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
  }, [selectedCityId, selectedSector, baseLayer, climaticEffect]);

  return (
    <div className="space-y-4">
      {/* 1. CLIMATIC ATMOSPHERE & WEATHER RADAR SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl bg-forest-950 text-white shadow-sm border border-forest-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Climatic Atmosphere Layer:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              {
                id: 'monsoon_rain',
                label: '🌧️ Monsoon Cloud & Rain Radar',
                color: 'bg-blue-600',
              },
              {
                id: 'heat_island',
                label: '🌡️ Urban Heat Island & Hotspots',
                color: 'bg-rose-600',
              },
              {
                id: 'ndvi_canopy',
                label: '🍃 Forest Canopy & Cooling Sinks',
                color: 'bg-emerald-600',
              },
              {
                id: 'air_plume',
                label: '💨 PM2.5 Aerosol Plumes',
                color: 'bg-purple-600',
              },
              {
                id: 'none',
                label: 'Off (Standard View)',
                color: 'bg-charcoal-700',
              },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setClimaticEffect(btn.id as ClimaticEffectType);
                  setActiveClimaticZone(null);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                  climaticEffect === btn.id
                    ? `${btn.color} text-white shadow-md ring-1 ring-white/30 scale-102`
                    : 'bg-forest-900/90 text-emerald-100 hover:bg-forest-800 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {climaticEffect !== 'none' && (
          <div className="flex items-center gap-2 text-[11px] text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono">Live Weather Telemetry Active</span>
          </div>
        )}
      </div>

      {/* 2. BASEMAP & SECTOR FILTER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-charcoal-200">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sector Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-charcoal-800">
              Sector:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { id: 'all', label: 'All' },
                { id: 'urban-greening', label: 'Greening' },
                { id: 'transport', label: 'Transport' },
                { id: 'energy-access', label: 'Energy' },
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

          {/* Basemap Switcher */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-charcoal-200">
            <Layers className="w-3.5 h-3.5 text-forest-700" />
            <span className="text-xs font-bold text-charcoal-800">
              Basemap:
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
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
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

        {/* Legend */}
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

      {/* 3. MAP CANVAS AND DETAIL INSPECTOR */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Leaflet Canvas (8 cols) */}
        <div className="lg:col-span-8 card-enterprise p-2 overflow-hidden h-[560px] relative">
          <div id="climate-leaflet-container" className="h-full w-full rounded-lg" />

          {/* FLOATING ATMOSPHERIC ALERT BANNER */}
          {climaticEffect === 'monsoon_rain' && (
            <div className="absolute top-4 left-4 right-4 z-[400] bg-blue-950/92 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-blue-600/70 shadow-lg text-xs text-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CloudRain className="w-4 h-4 text-blue-400 animate-bounce" />
                <div>
                  <span className="font-bold text-white">Monsoon Doppler Radar:</span>{' '}
                  <span className="text-blue-200">
                    Convective Stormfront over Central Mithi Basin (78 mm/hr) &bull; Flood Runoff Funnel Tracked
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-blue-800/90 text-blue-100 px-2 py-0.5 rounded font-mono font-bold hidden sm:inline-block">
                85% Cloud Cover &bull; Inundation Alert
              </span>
            </div>
          )}

          {climaticEffect === 'heat_island' && (
            <div className="absolute top-4 left-4 right-4 z-[400] bg-rose-950/92 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-rose-600/70 shadow-lg text-xs text-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <div>
                  <span className="font-bold text-white">Land Surface Temperature (LST):</span>{' '}
                  <span className="text-rose-200">
                    Extreme Thermal Anomaly (+9.1°C Peak) in Deonar, Govandi & Dharavi Impervious Sinks
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-rose-800/90 text-rose-100 px-2 py-0.5 rounded font-mono font-bold hidden sm:inline-block">
                44.3°C Surface Heat Peak
              </span>
            </div>
          )}

          {climaticEffect === 'ndvi_canopy' && (
            <div className="absolute top-4 left-4 right-4 z-[400] bg-emerald-950/92 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-emerald-600/70 shadow-lg text-xs text-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Trees className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-white">Copernicus Sentinel-2 Canopy:</span>{' '}
                  <span className="text-emerald-200">
                    0.76 Peak NDVI in Sanjay Gandhi National Park (-5.2°C Biological Cooling Lung)
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-800/90 text-emerald-100 px-2 py-0.5 rounded font-mono font-bold hidden sm:inline-block">
                Natural Climate Buffer
              </span>
            </div>
          )}

          {climaticEffect === 'air_plume' && (
            <div className="absolute top-4 left-4 right-4 z-[400] bg-purple-950/92 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-purple-600/70 shadow-lg text-xs text-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="font-bold text-white">Aerosol Dispersion Plume:</span>{' '}
                  <span className="text-purple-200">
                    Eastern Harbor Freight Corridor (172 µg/m³ PM2.5) with Winter Thermal Inversion
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-purple-800/90 text-purple-100 px-2 py-0.5 rounded font-mono font-bold hidden sm:inline-block">
                Severe Non-Attainment
              </span>
            </div>
          )}

          {/* Bottom Bar Info */}
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

        {/* Selected Locality or Climatic Zone Details Panel (4 cols) */}
        <div className="lg:col-span-4 card-enterprise p-5 flex flex-col justify-between h-[560px] overflow-y-auto">
          {activeClimaticZone ? (
            /* CLIMATIC PHENOMENON INSPECTOR */
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    Climatic Phenomenon Inspection
                  </span>
                  <h3 className="text-base font-extrabold text-forest-950 mt-0.5 flex items-center gap-1.5">
                    <span>{activeClimaticZone.pulseIconEmoji}</span>
                    <span>{activeClimaticZone.name}</span>
                  </h3>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white shadow-xs"
                  style={{ backgroundColor: activeClimaticZone.color }}
                >
                  {activeClimaticZone.severity}
                </span>
              </div>

              {/* Main Metric Spotlight */}
              <div
                className="p-3.5 rounded-xl border text-white shadow-sm"
                style={{ backgroundColor: activeClimaticZone.color }}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">
                  {activeClimaticZone.metricTitle}
                </span>
                <span className="text-xl font-black block mt-0.5 font-mono">
                  {activeClimaticZone.metricValue}
                </span>
                <span className="text-[11px] mt-1 block opacity-90 font-medium">
                  Anomaly: {activeClimaticZone.anomalyDelta}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-charcoal-400 block text-[11px] font-semibold mb-1">
                    Atmospheric Cause & Terrain Dynamics
                  </span>
                  <p className="text-xs text-charcoal-700 leading-relaxed bg-charcoal-50 p-2.5 rounded-lg border border-charcoal-100">
                    {activeClimaticZone.description}
                  </p>
                </div>

                <div>
                  <span className="text-rose-700 font-bold block text-[11px] mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Public Vulnerability Alert</span>
                  </span>
                  <p className="text-xs text-rose-900 bg-rose-50 p-2.5 rounded-lg border border-rose-200 leading-relaxed font-medium">
                    {activeClimaticZone.impactAlert}
                  </p>
                </div>

                <div>
                  <span className="text-emerald-800 font-bold block text-[11px] mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recommended Municipal Intervention</span>
                  </span>
                  <p className="text-xs text-emerald-950 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 leading-relaxed">
                    {activeClimaticZone.recommendedMitigation}
                  </p>
                </div>

                <div className="pt-2 border-t border-charcoal-100 flex items-center justify-between text-[10px] font-mono text-charcoal-400">
                  <span>
                    Radius: {(activeClimaticZone.radiusMeters / 1000).toFixed(1)} km
                  </span>
                  <span>
                    {activeClimaticZone.coords[0].toFixed(3)}°N,{' '}
                    {activeClimaticZone.coords[1].toFixed(3)}°E
                  </span>
                </div>
              </div>
            </div>
          ) : activeLocality ? (
            /* STATUTORY LOCALITY INSPECTOR */
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
            /* EMPTY STATE INSTRUCTION */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-charcoal-400">
              <MapPin className="w-10 h-10 text-charcoal-300 mb-3" />
              <h4 className="text-sm font-bold text-charcoal-800">
                Explore Climatic & Observation Layers
              </h4>
              <p className="text-xs text-charcoal-500 mt-1 max-w-xs leading-relaxed">
                Click any colored locality pin or pulsing weather zone on the map to inspect live Doppler rain radars, urban heat anomalies, or canopy cooling buffers.
              </p>
              <div className="mt-4 flex flex-col gap-1.5 text-[11px] text-charcoal-600 bg-charcoal-50 p-3 rounded-lg border border-charcoal-100 w-full text-left">
                <span className="font-bold text-charcoal-800">Active Atmospheric Layers:</span>
                <span className="flex items-center gap-1.5">
                  <span>🌧️</span> <span>Monsoon Cloud Radar (78 mm/hr)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>🌡️</span> <span>Heat Island LST (44.3°C Peak)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>🍃</span> <span>Sentinel-2 NDVI Canopy (0.76 Index)</span>
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-charcoal-100 text-[10px] text-charcoal-400 flex items-center justify-between">
            <span>OpenStreetMap & Copernicus Remote Sensing</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold uppercase">
              Live Atmosphere
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
