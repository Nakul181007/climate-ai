import { jsPDF } from 'jspdf';
import { AuditRecord, Commitment } from '../types';

export function generateAuditReportPDF(audit: AuditRecord, commitment: Commitment) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(14, 46, 35); // Forest green #0E2E23
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF MAHARASHTRA', 15, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(52, 211, 153); // Emerald accent
  doc.text('ClimateAI Maharashtra — Independent Climate Commitment Audit Report', 15, 22);

  // Document Details Box
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`AUDIT ID: ${audit.id}`, 15, 42);
  doc.text(`DATE GENERATED: ${new Date(audit.auditDate).toLocaleDateString('en-IN')}`, 150, 42);

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 46, 195, 46);

  // Commitment Summary
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. EVALUATED COMMITMENT MANDATE', 15, 54);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Title: ${commitment.title}`, 15, 62);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Responsible Authority: ${commitment.responsibleAuthority}`, 15, 69);
  doc.text(`Geographical Coverage: ${commitment.geographicalCoverage}`, 15, 75);
  doc.text(`Target Requirement: ${commitment.targetValue} ${commitment.targetUnit} (by ${commitment.targetYear})`, 15, 81);

  // Original Statement Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 86, 180, 22, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(51, 65, 85);
  const splitStatement = doc.splitTextToSize(`"${commitment.originalPolicyStatement}"`, 172);
  doc.text(splitStatement, 19, 93);

  // 2. Audit Outcome & Evidence Quality Score
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. DETERMINISTIC VERIFICATION OUTCOME', 15, 120);

  // Outcome Chip
  const outcomeColor =
    audit.outcome === 'SUPPORTED'
      ? [5, 150, 105]
      : audit.outcome === 'PARTIALLY_SUPPORTED'
      ? [217, 119, 6]
      : audit.outcome === 'POTENTIAL_DISCREPANCY'
      ? [220, 38, 38]
      : [100, 116, 139];

  doc.setFillColor(outcomeColor[0], outcomeColor[1], outcomeColor[2]);
  doc.roundedRect(15, 126, 75, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`OUTCOME: ${audit.outcome.replace('_', ' ')}`, 20, 133);

  // Quality Score Chip
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(95, 126, 100, 10, 2, 2, 'F');
  doc.setTextColor(30, 41, 59);
  doc.text(`EVIDENCE QUALITY SCORE: ${audit.evidenceQualityScore} / 100`, 100, 133);

  // AI-Generated Explanation
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Explainable Citizen Synthesis:', 15, 147);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const splitExplanation = doc.splitTextToSize(audit.aiGeneratedCitizenExplanation, 180);
  doc.text(splitExplanation, 15, 154);

  // 3. Supporting & Contradictory Evidence
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. EMPIRICAL EVIDENCE & SATELLITE PROVENANCE', 15, 180);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('Corroborating Evidence:', 15, 188);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  let yOffset = 194;
  audit.supportingEvidenceSummary.forEach((item) => {
    const text = doc.splitTextToSize(`• ${item}`, 175);
    doc.text(text, 17, yOffset);
    yOffset += text.length * 5;
  });

  if (audit.contradictoryEvidenceSummary.length > 0) {
    yOffset += 4;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('Contradictions / Discrepancies:', 15, yOffset);
    yOffset += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    audit.contradictoryEvidenceSummary.forEach((item) => {
      const text = doc.splitTextToSize(`• ${item}`, 175);
      doc.text(text, 17, yOffset);
      yOffset += text.length * 5;
    });
  }

  // 4. Recommended Next Actions
  yOffset += 6;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. RECOMMENDED CORRECTIVE ACTIONS', 15, yOffset);
  yOffset += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  audit.recommendedNextActions.forEach((rec, idx) => {
    const text = doc.splitTextToSize(`${idx + 1}. ${rec}`, 175);
    doc.text(text, 17, yOffset);
    yOffset += text.length * 5;
  });

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'SIMULATED DEMONSTRATION DATA — NOT OFFICIAL OBSERVATIONS. Generated under Scientific Integrity Protocol.',
    15,
    285
  );

  doc.save(`ClimateAI_Audit_Report_${commitment.id}.pdf`);
}

export const generateAuditPdfReport = generateAuditReportPDF;

