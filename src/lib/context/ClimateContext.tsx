'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  CityId,
  City,
  Commitment,
  PolicyDocument,
  AuditRecord,
  EarlyWarningAlert,
  AuditOutcome,
  ProgressStatus,
} from '../types';
import {
  CITIES,
  DEMO_POLICIES,
  DEMO_COMMITMENTS,
  DEMO_AUDITS,
  DEMO_ALERTS,
  DEMO_OBSERVATIONS,
} from '../demo-data';
import { evaluateDeterministicAudit } from '../audit-engine';

export type Language = 'en' | 'hi' | 'mr';

interface ClimateStats {
  totalCommitments: number;
  auditsCompleted: number;
  
  // Dual-axis: Audit Outcome
  supported: number;
  partiallySupported: number;
  inconclusive: number;
  potentialDiscrepancy: number;
  pendingAudit: number;

  // Dual-axis: Progress Status (Excel Methodology)
  onTrack: number;
  atRisk: number;
  offTrack: number;

  // Excel Aggregate Scores
  avgReportingOverstatementPct: number;
  overallVerifiedScorePct: number;
}

interface ClimateContextType {
  selectedCityId: CityId;
  setSelectedCityId: (cityId: CityId) => void;
  selectedCity: City;
  allCities: City[];
  currentRole: 'admin' | 'citizen';
  setCurrentRole: (role: 'admin' | 'citizen') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  commitments: Commitment[];
  cityCommitments: Commitment[];
  policies: PolicyDocument[];
  cityPolicies: PolicyDocument[];
  audits: AuditRecord[];
  alerts: EarlyWarningAlert[];
  cityAlerts: EarlyWarningAlert[];
  approveCommitment: (id: string) => void;
  rejectCommitment: (id: string) => void;
  addCommitment: (commitment: Commitment) => void;
  addPolicy: (policy: PolicyDocument) => void;
  executeAudit: (commitmentId: string) => AuditRecord;
  stats: ClimateStats;
}

const ClimateContext = createContext<ClimateContextType | undefined>(undefined);

export function ClimateProvider({ children }: { children: React.ReactNode }) {
  const [selectedCityId, setSelectedCityId] = useState<CityId>('mumbai');
  const [currentRole, setCurrentRole] = useState<'admin' | 'citizen'>('admin');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('en');

  const [policies, setPolicies] = useState<PolicyDocument[]>(DEMO_POLICIES);
  const [commitments, setCommitments] = useState<Commitment[]>(DEMO_COMMITMENTS);
  const [audits, setAudits] = useState<AuditRecord[]>(DEMO_AUDITS);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(DEMO_ALERTS);

  const selectedCity = useMemo(() => {
    return CITIES.find((c) => c.id === selectedCityId) || CITIES[0];
  }, [selectedCityId]);

  const cityCommitments = useMemo(() => {
    return commitments.filter((c) => c.cityId === selectedCityId);
  }, [commitments, selectedCityId]);

  const cityPolicies = useMemo(() => {
    return policies.filter((p) => p.cityId === selectedCityId);
  }, [policies, selectedCityId]);

  const cityAlerts = useMemo(() => {
    return alerts.filter((a) => a.cityId === selectedCityId);
  }, [alerts, selectedCityId]);

  const stats = useMemo<ClimateStats>(() => {
    const list = cityCommitments;
    const totalCommitments = list.length;

    // Audit Outcomes
    const supported = list.filter((c) => c.currentAuditStatus === 'SUPPORTED').length;
    const partiallySupported = list.filter((c) => c.currentAuditStatus === 'PARTIALLY_SUPPORTED').length;
    const inconclusive = list.filter((c) => c.currentAuditStatus === 'INCONCLUSIVE').length;
    const potentialDiscrepancy = list.filter((c) => c.currentAuditStatus === 'POTENTIAL_DISCREPANCY').length;
    const pendingAudit = list.filter((c) => c.currentAuditStatus === 'PENDING_AUDIT').length;
    const auditsCompleted = supported + partiallySupported + inconclusive + potentialDiscrepancy;

    // Progress Statuses (Excel)
    const onTrack = list.filter((c) => c.progressStatus === 'ON_TRACK').length;
    const atRisk = list.filter((c) => c.progressStatus === 'AT_RISK').length;
    const offTrack = list.filter((c) => c.progressStatus === 'OFF_TRACK').length;

    // Mathematical Aggregates from Excel model
    let totalOverstatement = 0;
    let totalRatio = 0;
    let countWithScores = 0;

    list.forEach((c) => {
      if (typeof c.reportingOverstatement === 'number') {
        totalOverstatement += c.reportingOverstatement;
        if (c.plannedProgressToDate > 0) {
          totalRatio += c.verifiedProgress / c.plannedProgressToDate;
        }
        countWithScores += 1;
      }
    });

    const avgReportingOverstatementPct =
      countWithScores > 0 ? Number(((totalOverstatement / countWithScores) * 100).toFixed(1)) : 11.0;
    const overallVerifiedScorePct =
      countWithScores > 0 ? Number(((totalRatio / countWithScores) * 100).toFixed(1)) : 60.7;

    return {
      totalCommitments,
      auditsCompleted,
      supported,
      partiallySupported,
      inconclusive,
      potentialDiscrepancy,
      pendingAudit,
      onTrack,
      atRisk,
      offTrack,
      avgReportingOverstatementPct,
      overallVerifiedScorePct,
    };
  }, [cityCommitments]);

  const approveCommitment = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, reviewStatus: 'APPROVED' as const } : c
      )
    );
  };

  const rejectCommitment = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, reviewStatus: 'REJECTED' as const } : c
      )
    );
  };

  const addCommitment = (newCommitment: Commitment) => {
    setCommitments((prev) => [newCommitment, ...prev]);
  };

  const addPolicy = (newPolicy: PolicyDocument) => {
    setPolicies((prev) => [newPolicy, ...prev]);
  };

  const executeAudit = (commitmentId: string): AuditRecord => {
    const targetCommitment = commitments.find((c) => c.id === commitmentId);
    if (!targetCommitment) {
      throw new Error(`Commitment with ID ${commitmentId} not found.`);
    }

    const relevantObservations = DEMO_OBSERVATIONS.filter(
      (o) => o.commitmentId === commitmentId
    );

    const auditResult = evaluateDeterministicAudit({
      commitment: targetCommitment,
      observations: relevantObservations,
      cityId: targetCommitment.cityId,
    });

    // Update commitments state with new audit status and progress
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === commitmentId
          ? {
              ...c,
              currentAuditStatus: auditResult.outcome,
              progressStatus: auditResult.progressStatus,
              lastAuditDate: auditResult.auditDate,
              latestEvidenceQualityScore: auditResult.evidenceQualityScore,
            }
          : c
      )
    );

    // Save or update audit in audits list
    setAudits((prev) => {
      const filtered = prev.filter((a) => a.commitmentId !== commitmentId);
      return [auditResult, ...filtered];
    });

    return auditResult;
  };

  return (
    <ClimateContext.Provider
      value={{
        selectedCityId,
        setSelectedCityId,
        selectedCity,
        allCities: CITIES,
        currentRole,
        setCurrentRole,
        isDemoMode,
        setIsDemoMode,
        language,
        setLanguage,
        commitments,
        cityCommitments,
        policies,
        cityPolicies,
        audits,
        alerts,
        cityAlerts,
        approveCommitment,
        rejectCommitment,
        addCommitment,
        addPolicy,
        executeAudit,
        stats,
      }}
    >
      {children}
    </ClimateContext.Provider>
  );
}

export function useClimate() {
  const context = useContext(ClimateContext);
  if (!context) {
    throw new Error('useClimate must be used within a ClimateProvider');
  }
  return context;
}
