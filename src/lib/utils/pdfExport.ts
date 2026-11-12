import { jsPDF } from 'jspdf';
import { AuditRecord, Commitment } from '../types';

export function generateAuditReportPDF(audit: AuditRecord, commitment: Commitment) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(14, 46, 35); // Forest green #0E2E23
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF MAHARASHTRA CLIMATE AUDIT INITIATIVE', 15, 12);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(52, 211, 153); // Emerald accent
  doc.text('ClimateAI Maharashtra — Demonstration Audit Verification Certificate', 15, 20);

  // Prominent Top Demonstration Disclaimer
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.rect(0, 28, 210, 8, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14); // Amber-900
  doc.text('HACKATHON DEMONSTRATION PROTOTYPE — NOT AN OFFICIAL STATUTORY RECORD', 15, 33.5);

  // Document Details & Cryptographic Provenance
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`AUDIT ID: ${audit.id}`, 15, 43);
  doc.text(`DATE GENERATED: ${new Date(audit.auditDate).toLocaleDateString('en-IN')}`, 145, 43);

  let currentY = 48;
  if (typeof audit.blockNumber === 'number' || audit.auditHash) {
    doc.setFontSize(7.5);
    doc.setFont('courier', 'normal');
    doc.setTextColor(71, 85, 105);
    if (typeof audit.blockNumber === 'number') {
      doc.text(`BLOCK #${audit.blockNumber}`, 15, currentY);
      currentY += 4;
    }
    if (audit.auditHash) {
      doc.text(`BLOCK HASH: ${audit.auditHash}`, 15, currentY);
      currentY += 4;
    }
    if (audit.previousHash) {
      doc.text(`PREVIOUS HASH: ${audit.previousHash}`, 15, currentY);
      currentY += 4;
    }
  }

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, currentY, 195, currentY);
  currentY += 6;

  // Commitment Summary
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. EVALUATED COMMITMENT MANDATE', 15, currentY);
  currentY += 6;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Title: ${commitment.title}`, 15, currentY);
  currentY += 5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Responsible Authority: ${commitment.responsibleAuthority}`, 15, currentY);
  currentY += 4.5;
  doc.text(`Geographical Coverage: ${commitment.geographicalCoverage}`, 15, currentY);
  currentY += 4.5;
  doc.text(`Target Requirement: ${commitment.targetValue} ${commitment.targetUnit} (by ${commitment.targetYear})`, 15, currentY);
  currentY += 6;

  // Original Statement Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, currentY, 180, 18, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(51, 65, 85);
  const splitStatement = doc.splitTextToSize(`"${commitment.originalPolicyStatement}"`, 172);
  doc.text(splitStatement, 19, currentY + 5);
  currentY += 24;

  // 2. Audit Outcome & Evidence Quality Score
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. DETERMINISTIC VERIFICATION OUTCOME', 15, currentY);
  currentY += 5;

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
  doc.roundedRect(15, currentY, 80, 9, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`OUTCOME: ${audit.outcome.replace('_', ' ')}`, 19, currentY + 6);

  // Quality Score Chip
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(100, currentY, 95, 9, 2, 2, 'F');
  doc.setTextColor(30, 41, 59);
  doc.text(`EVIDENCE QUALITY SCORE: ${audit.evidenceQualityScore} / 100`, 105, currentY + 6);
  currentY += 14;

  // Citizen Explanation
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Explainable Citizen Synthesis:', 15, currentY);
  currentY += 5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const splitExplanation = doc.splitTextToSize(audit.aiGeneratedCitizenExplanation, 180);
  doc.text(splitExplanation, 15, currentY);
  currentY += splitExplanation.length * 4.5 + 4;

  // 3. Supporting & Contradictory Evidence
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. EMPIRICAL EVIDENCE & SATELLITE PROVENANCE', 15, currentY);
  currentY += 5;

  if (audit.supportingEvidenceSummary.length > 0) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('Corroborating Evidence:', 15, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    audit.supportingEvidenceSummary.forEach((item) => {
      const text = doc.splitTextToSize(`• ${item}`, 175);
      doc.text(text, 17, currentY);
      currentY += text.length * 4.5;
    });
  }

  if (audit.contradictoryEvidenceSummary.length > 0) {
    currentY += 2;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('Contradictions / Discrepancies:', 15, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    audit.contradictoryEvidenceSummary.forEach((item) => {
      const text = doc.splitTextToSize(`• ${item}`, 175);
      doc.text(text, 17, currentY);
      currentY += text.length * 4.5;
    });
  }

  // 4. Recommended Next Actions
  currentY += 4;
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. RECOMMENDED CORRECTIVE ACTIONS', 15, currentY);
  currentY += 5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  audit.recommendedNextActions.forEach((rec, idx) => {
    const text = doc.splitTextToSize(`${idx + 1}. ${rec}`, 175);
    doc.text(text, 17, currentY);
    currentY += text.length * 4.5;
  });

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'SIMULATED DEMONSTRATION DATA — NOT OFFICIAL STATUTORY OBSERVATIONS. Cryptographically verified demonstration certificate.',
    15,
    285
  );

  doc.save(`ClimateAI_Demonstration_Audit_${commitment.id}.pdf`);
}

export const generateAuditPdfReport = generateAuditReportPDF;

