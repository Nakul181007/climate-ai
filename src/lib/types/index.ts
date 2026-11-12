export type CityId = 'mumbai' | 'pune';

export interface City {
  id: CityId;
  name: string;
  state: string;
  tagline: string;
  areaKm2: number;
  population: string;
  climateActionPlanName: string;
  baselineYear: number;
  targetNetZeroYear: number;
  lat: number;
  lng: number;
  zoom: number;
  description: string;
}

export type SectorType =
  | 'transport'
  | 'energy-access'
  | 'informal-settlements'
  | 'urban-greening'
  | 'waste-water'
  | 'air-quality';

export interface SectorInfo {
  id: SectorType;
  name: string;
  iconName: string;
  description: string;
  primaryIndicator: string;
}

export type EnvironmentalIndicatorType =
  | 'NDVI_VEGETATION'
  | 'TREE_CANOPY_COVER'
  | 'EV_FLEET_RATIO'
  | 'ROOFTOP_SOLAR_MW'
  | 'PM25_ANNUAL_MEAN'
  | 'WATERBODY_RESTORED_KM'
  | 'CLEAN_COOKING_ACCESS_PCT'
  | 'STORMWATER_DRAINAGE_PCT'
  | 'DECENTRALIZED_WASTE_TPD';

export type ProgressStatus = 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';

export type AuditOutcome =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'INCONCLUSIVE'
  | 'POTENTIAL_DISCREPANCY';

export type SourceAgreement =
  | 'CORROBORATED'
  | 'CONFLICTING'
  | 'INSUFFICIENT_EVIDENCE'
  | 'NOT_COMPARABLE';

export type CommitmentReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PolicyDocument {
  id: string;
  title: string;
  cityId: CityId;
  issuingAuthority: string;
  publicationYear: number;
  fileName: string;
  fileSizeMb: number;
  totalPages: number;
  status: 'PROCESSED' | 'EXTRACTING' | 'READY_FOR_AUDIT';
  extractedCommitmentsCount: number;
  approvedCommitmentsCount: number;
  executiveSummary: string;
  uploadDate: string;
}

export interface Commitment {
  id: string;
  policyId: string;
  cityId: CityId;
  title: string;
  originalPolicyStatement: string;
  documentName: string;
  sourcePageNumber: number;
  responsibleAuthority: string;
  sector: SectorType;
  geographicalCoverage: string;
  indicator: EnvironmentalIndicatorType;
  targetValue: number;
  targetUnit: string;
  baselineValue?: number;
  baselineYear?: number;
  targetYear: number;
  
  // Excel Mathematical Scoring System
  plannedProgressToDate: number;      // e.g. 0.30 (30%)
  cityReportedProgress: number;       // e.g. 0.14 (14%)
  satelliteObservedProgress?: number; // e.g. 0.06 (6%)
  sensorObservedProgress?: number;    // e.g. 0.07 (7%)
  verifiedProgress: number;           // average of empirical satellite & sensor
  reportingOverstatement: number;     // cityReported - verifiedProgress
  gapVsPlan: number;                  // plannedProgress - verifiedProgress
  progressStatus: ProgressStatus;     // ON_TRACK (<=0.05), AT_RISK (0.05-0.15), OFF_TRACK (>0.15)
  sourceAgreement: SourceAgreement;   // CORROBORATED, CONFLICTING, INSUFFICIENT_EVIDENCE, NOT_COMPARABLE

  missingInformationNotes?: string[];
  extractionConfidence: number; // 0 - 100
  reviewStatus: CommitmentReviewStatus;
  currentAuditStatus: AuditOutcome | 'PENDING_AUDIT';
  lastAuditDate?: string;
  latestEvidenceQualityScore?: number; // 0 - 100
  lastObservationDate?: string;
}

export type SourceType =
  | 'SATELLITE_SENTINEL_2'
  | 'GROUND_SENSOR_CPCB'
  | 'MUNICIPAL_OPERATIONAL_DATA'
  | 'INDEPENDENT_RESEARCH_STUDY'
  | 'GIS_SURVEY';

export interface Observation {
  id: string;
  commitmentId: string;
  indicator: EnvironmentalIndicatorType;
  sourceName: string;
  sourceType: SourceType;
  collectionDate: string;
  geographicArea: string;
  localityCoordinates?: [number, number];
  measuredValue: number;
  unit: string;
  methodology: string;
  reliabilityScore: number; // 0 - 100
  cloudCoverPercent?: number;
  validPixelPercent?: number;
  coveragePercent: number; // 0 - 100
  limitations: string[];
  externalReferenceUrl?: string;
  isSimulated: boolean;
}

export interface AuditProvenanceRecord {
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  observationDate: string;
  sampleCount: number;
  coverageArea: string;
  reliabilityWeight: number; // 0 - 1.0
  notes: string;
}

export interface AuditRecord {
  id: string;
  commitmentId: string;
  commitmentTitle?: string;
  cityId: CityId;
  auditDate: string;
  outcome: AuditOutcome;
  progressStatus: ProgressStatus;
  sourceAgreement: SourceAgreement;
  evidenceQualityScore: number; // 0 - 100
  progressPercentage: number;   // verified progress percentage
  plannedProgressPercentage: number;
  reportingOverstatementPercentage: number;
  gapPercentage: number;
  observationsExaminedCount: number;
  supportingObservationsCount: number;
  contradictoryObservationsCount: number;
  provenance: AuditProvenanceRecord[];
  supportingEvidenceSummary: string[];
  contradictoryEvidenceSummary: string[];
  missingEvidenceNotes: string[];
  deterministicAuditRulesApplied: string[];
  confidenceLimitations: string[];
  aiGeneratedCitizenExplanation: string;
  aiExplanationHi?: string; // Hindi explanation
  aiExplanationMr?: string; // Marathi explanation
  recommendedNextActions: string[];
  auditedBy: string;
  auditHash?: string;
  previousHash?: string;
  blockNumber?: number;
  isSimulated: boolean;
}

export interface Recommendation {
  id: string;
  commitmentId: string;
  cityId: CityId;
  sector: SectorType;
  title: string;
  climateImpactRank: number; // 1 = highest
  climateImpactScore: number; // 0 - 100
  feasibilityScore: number; // 0 - 100
  estimatedCostTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CAPITAL_INTENSIVE';
  estimatedCostInrCrores: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  compositeScore: number; // 0 - 100 weighted
  rationale: string;
  implementationPrerequisites: string[];
  expectedCarbonOffsetTonsPerYear?: number;
  isHypotheticalSimulation: boolean;
}

export interface EarlyWarningAlert {
  id: string;
  cityId: CityId;
  commitmentId?: string;
  type:
    | 'DEADLINE_APPROACHING'
    | 'MISSING_EVIDENCE'
    | 'OUTDATED_MEASUREMENT'
    | 'POTENTIAL_DISCREPANCY';
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  timestamp: string;
  actionRoute?: string;
  isSimulated: boolean;
}

export interface WhatIfModelConfig {
  baselineReductionAchieved: number;     // 6%
  additionalElectricBuses: number;       // 200
  additionalCorridors: number;           // 3
  reductionPerBusPctPoints: number;      // 0.035
  reductionPerCorridorPctPoints: number; // 1.6
  busCostInrCrore: number;               // 1.2
  corridorCostInrCrore: number;          // 45
  targetReductionPct: number;            // 30%
}

export interface WhatIfModelResult {
  projectedReductionPct: number; // 17.8%
  estimatedCostInrCrore: number; // 375 Cr
  targetShortfallPctPoints: number; // 12.2%
  targetAchieved: boolean; // false
}
