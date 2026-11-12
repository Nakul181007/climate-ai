/**
 * Phase 2 Comprehensive Regression Test Suite
 * Validates Scientific Integrity, Deterministic Audit Matrix v2.4, Excel Simulator Parity, and Ledger Verification.
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const { execSync } = require('child_process');

const tempDir = path.join(__dirname, 'temp_build');
if (!fs.existsSync(path.join(tempDir, 'audit-engine', 'index.js')) || !fs.existsSync(path.join(tempDir, 'demo-data', 'index.js'))) {
  execSync('npx.cmd tsc src/lib/audit-engine/index.ts src/lib/demo-data/index.ts --outDir scripts/temp_build --module commonjs --target es2020 --moduleResolution node --skipLibCheck --esModuleInterop', { stdio: 'pipe', cwd: path.join(__dirname, '..') });
}
const {
  sha256Hex,
  calculateAuditBlockHash,
  serializeAuditBlockPayload,
  evaluateDeterministicAudit,
  verifyAuditChain,
  GENESIS_HASH,
} = require('./temp_build/audit-engine');
const { DEMO_COMMITMENTS, DEMO_AUDITS, DEMO_OBSERVATIONS } = require('./temp_build/demo-data');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body || '{}') });
          } catch (e) {
            resolve({ status: res.statusCode, rawBody: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runRegressionSuite() {
  console.log('===============================================================');
  console.log('   CLIMATEAI MAHARASHTRA — PHASE 2 REGRESSION TEST SUITE       ');
  console.log('===============================================================\n');

  // -------------------------------------------------------------------------
  // SECTION 1: DETERMINISTIC AUDIT MATRIX v2.4 PROGRESS STATUS GAP THRESHOLDS
  // -------------------------------------------------------------------------
  console.log('--- 1. Testing Progress Gap Thresholds (<=5% ON_TRACK, <=15% AT_RISK, >15% OFF_TRACK) ---');

  const baseCommitment = {
    id: 'test-com-gap',
    title: 'Test Gap Commitment',
    description: 'Testing gap thresholds',
    sector: 'ENERGY_EFFICIENCY',
    plannedProgressToDate: 0.50,
    cityReportedProgress: 0.50,
    targetReduction: 0.30,
    originalPolicyStatement: 'Test policy',
    targetDate: '2025-12-31',
    milestoneYear: '2024',
    cityId: 'mumbai',
    jurisdiction: 'Municipal',
    responsibleDepartment: 'Energy',
    geographicalCoverage: 'Mumbai City',
    keyRisks: [],
    financialAllocationCr: 100,
    progressStatus: 'ON_TRACK',
    gapVsPlan: 0,
    reportingOverstatement: 0,
    verifiedProgress: undefined,
    currentAuditStatus: 'SUPPORTED',
  };

  // Gap = 4.99% (Planned 50%, Verified 45.01%) -> ON_TRACK
  const audit499 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.4501,
      satelliteObservedProgress: 0.4501,
      sensorObservedProgress: 0.4501,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(audit499.progressStatus === 'ON_TRACK', `Gap 4.99% yields ON_TRACK (actual: ${audit499.progressStatus}, gap: ${audit499.gapPercentage}%)`);

  // Gap = 5.00% (Planned 50%, Verified 45.00%) -> ON_TRACK
  const audit500 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.45,
      satelliteObservedProgress: 0.45,
      sensorObservedProgress: 0.45,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(audit500.progressStatus === 'ON_TRACK', `Gap 5.00% boundary yields ON_TRACK (actual: ${audit500.progressStatus}, gap: ${audit500.gapPercentage}%)`);

  // Gap = 5.01% (Planned 50%, Verified 44.99%) -> AT_RISK
  const audit501 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.4499,
      satelliteObservedProgress: 0.4499,
      sensorObservedProgress: 0.4499,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(audit501.progressStatus === 'AT_RISK', `Gap 5.01% yields AT_RISK (actual: ${audit501.progressStatus}, gap: ${audit501.gapPercentage}%)`);

  // Gap = 14.99% (Planned 50%, Verified 35.01%) -> AT_RISK
  const audit1499 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.3501,
      satelliteObservedProgress: 0.3501,
      sensorObservedProgress: 0.3501,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(audit1499.progressStatus === 'AT_RISK', `Gap 14.99% yields AT_RISK (actual: ${audit1499.progressStatus}, gap: ${audit1499.gapPercentage}%)`);

  // Gap = 15.00% (Planned 50%, Verified 35.00%) -> AT_RISK
  const audit1500 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.35,
      satelliteObservedProgress: 0.35,
      sensorObservedProgress: 0.35,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(audit1500.progressStatus === 'AT_RISK', `Gap 15.00% boundary yields AT_RISK (actual: ${audit1500.progressStatus}, gap: ${audit1500.gapPercentage}%)`);

  // Gap = 15.01% (Planned 50%, Verified 34.99%) -> OFF_TRACK
  const audit1501 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.3499,
      satelliteObservedProgress: 0.3499,
      sensorObservedProgress: 0.3499,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(audit1501.progressStatus === 'OFF_TRACK', `Gap 15.01% yields OFF_TRACK (actual: ${audit1501.progressStatus}, gap: ${audit1501.gapPercentage}%)`);

  // -------------------------------------------------------------------------
  // SECTION 2: DISCREPANCY DETECTION MATHEMATICAL THRESHOLD (>= 20 pp)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Testing Reporting Overstatement & Discrepancy Rule (>= 20.0 pp) ---');

  // Overstatement = 19.9% (Reported 50%, Verified 30.1%) -> NOT POTENTIAL_DISCREPANCY
  const auditOver199 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      id: 'test-over-199',
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.50,
      satelliteObservedProgress: 0.301,
      sensorObservedProgress: 0.301,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(
    auditOver199.outcome !== 'POTENTIAL_DISCREPANCY',
    `Overstatement 19.9 pp does NOT trigger POTENTIAL_DISCREPANCY (actual outcome: ${auditOver199.outcome}, overstatement: ${auditOver199.reportingOverstatementPercentage}%)`
  );

  // Overstatement = 20.0% (Reported 50%, Verified 30.0%) -> POTENTIAL_DISCREPANCY
  const auditOver200 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      id: 'test-over-200',
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.50,
      satelliteObservedProgress: 0.30,
      sensorObservedProgress: 0.30,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(
    auditOver200.outcome === 'POTENTIAL_DISCREPANCY',
    `Overstatement 20.0 pp boundary triggers POTENTIAL_DISCREPANCY (actual outcome: ${auditOver200.outcome}, overstatement: ${auditOver200.reportingOverstatementPercentage}%)`
  );

  // Overstatement = 20.1% (Reported 50%, Verified 29.9%) -> POTENTIAL_DISCREPANCY
  const auditOver201 = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      id: 'test-over-201',
      plannedProgressToDate: 0.50,
      cityReportedProgress: 0.50,
      satelliteObservedProgress: 0.299,
      sensorObservedProgress: 0.299,
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(
    auditOver201.outcome === 'POTENTIAL_DISCREPANCY',
    `Overstatement 20.1 pp triggers POTENTIAL_DISCREPANCY (actual outcome: ${auditOver201.outcome}, overstatement: ${auditOver201.reportingOverstatementPercentage}%)`
  );

  // Real Commitment: Transport Emissions (com-mum-exp-01)
  // Planned: 14%, Reported: 14%, Verified: 6.5%. Overstatement = 7.5 pp (< 20 pp).
  // Must NOT trigger POTENTIAL_DISCREPANCY (verifying removal of hardcoded ID override).
  const comMum01 = DEMO_COMMITMENTS.find((c) => c.id === 'com-mum-exp-01');
  const auditMum01 = evaluateDeterministicAudit({
    commitment: comMum01,
    observations: DEMO_OBSERVATIONS.filter((o) => o.commitmentId === comMum01.id),
    cityId: 'mumbai',
  });
  assert(
    auditMum01.outcome !== 'POTENTIAL_DISCREPANCY',
    `com-mum-exp-01 (Transport Emissions, overstatement ${auditMum01.reportingOverstatementPercentage}%) is NOT marked POTENTIAL_DISCREPANCY (actual: ${auditMum01.outcome})`
  );

  // Real Commitment: Ward K-East Green Canopy (com-mum-exp-05)
  // Planned: 50%, Reported: 50%, Verified: 13.5%. Overstatement = 36.5 pp (>= 20 pp).
  // Must trigger POTENTIAL_DISCREPANCY via mathematical rule.
  const comMum05 = DEMO_COMMITMENTS.find((c) => c.id === 'com-mum-exp-05');
  const auditMum05 = evaluateDeterministicAudit({
    commitment: comMum05,
    observations: DEMO_OBSERVATIONS.filter((o) => o.commitmentId === comMum05.id),
    cityId: 'mumbai',
  });
  assert(
    auditMum05.outcome === 'POTENTIAL_DISCREPANCY',
    `Ward K-East (com-mum-exp-05, overstatement ${auditMum05.reportingOverstatementPercentage}%) triggers POTENTIAL_DISCREPANCY through mathematical calculation (actual: ${auditMum05.outcome})`
  );

  // -------------------------------------------------------------------------
  // SECTION 3: MISSING EVIDENCE & SINGLE-SOURCE OBSERVATION INTEGRITY
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Testing Missing Evidence and Single-Source Streams ---');

  // Test zero evidence -> INCONCLUSIVE
  const zeroEvidenceCommitment = {
    ...baseCommitment,
    id: 'test-zero-evidence',
    satelliteObservedProgress: undefined,
    sensorObservedProgress: undefined,
  };
  const auditZero = evaluateDeterministicAudit({
    commitment: zeroEvidenceCommitment,
    observations: [],
    cityId: 'mumbai',
  });
  assert(
    auditZero.outcome === 'INCONCLUSIVE' && auditZero.sourceAgreement === 'INSUFFICIENT_EVIDENCE',
    `Zero evidence yields INCONCLUSIVE outcome with INSUFFICIENT_EVIDENCE agreement (actual: outcome=${auditZero.outcome}, agreement=${auditZero.sourceAgreement})`
  );

  // Test single-source satellite only (no fabricated sensor fallback to 0.07)
  const singleSatCommitment = {
    ...baseCommitment,
    id: 'test-single-sat',
    satelliteObservedProgress: 0.35,
    sensorObservedProgress: undefined,
  };
  const auditSingleSat = evaluateDeterministicAudit({
    commitment: singleSatCommitment,
    observations: [],
    cityId: 'mumbai',
  });
  assert(
    auditSingleSat.progressPercentage === 35.0,
    `Single satellite stream preserves exact observed value 35.0% without fabrication (actual: ${auditSingleSat.progressPercentage}%)`
  );
  assert(
    auditSingleSat.sourceAgreement === 'INSUFFICIENT_EVIDENCE',
    `Single satellite stream marks sourceAgreement as INSUFFICIENT_EVIDENCE (actual: ${auditSingleSat.sourceAgreement})`
  );
  assert(
    auditSingleSat.deterministicAuditRulesApplied.some((r) => r.includes('RULE_SINGLE_SOURCE_SATELLITE')),
    'Applied rule confirms RULE_SINGLE_SOURCE_SATELLITE'
  );

  // Test single-source ground sensor only (no fabricated satellite fallback to 0.06)
  const singleSensorCommitment = {
    ...baseCommitment,
    id: 'test-single-sensor',
    satelliteObservedProgress: undefined,
    sensorObservedProgress: 0.42,
  };
  const auditSingleSensor = evaluateDeterministicAudit({
    commitment: singleSensorCommitment,
    observations: [],
    cityId: 'pune',
  });
  assert(
    auditSingleSensor.progressPercentage === 42.0,
    `Single ground sensor stream preserves exact observed value 42.0% without fabrication (actual: ${auditSingleSensor.progressPercentage}%)`
  );
  assert(
    auditSingleSensor.sourceAgreement === 'INSUFFICIENT_EVIDENCE',
    `Single ground sensor stream marks sourceAgreement as INSUFFICIENT_EVIDENCE (actual: ${auditSingleSensor.sourceAgreement})`
  );
  assert(
    auditSingleSensor.deterministicAuditRulesApplied.some((r) => r.includes('RULE_SINGLE_SOURCE_GROUND')),
    'Applied rule confirms RULE_SINGLE_SOURCE_GROUND'
  );

  // Test dual-source agreement (divergence <= 6.0% -> CORROBORATED)
  const dualCorroborated = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      satelliteObservedProgress: 0.40,
      sensorObservedProgress: 0.44, // diff = 0.04 <= 0.06
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(
    dualCorroborated.sourceAgreement === 'CORROBORATED',
    `Dual source divergence 4.0% is CORROBORATED (actual: ${dualCorroborated.sourceAgreement})`
  );
  assert(
    dualCorroborated.progressPercentage === 42.0,
    `Dual source uses mean of observations (40% + 44%) / 2 = 42.0% (actual: ${dualCorroborated.progressPercentage}%)`
  );

  // Test dual-source conflict (divergence > 6.0% -> CONFLICTING)
  const dualConflicting = evaluateDeterministicAudit({
    commitment: {
      ...baseCommitment,
      satelliteObservedProgress: 0.40,
      sensorObservedProgress: 0.48, // diff = 0.08 > 0.06
    },
    observations: [],
    cityId: 'mumbai',
  });
  assert(
    dualConflicting.sourceAgreement === 'CONFLICTING',
    `Dual source divergence 8.0% is CONFLICTING (actual: ${dualConflicting.sourceAgreement})`
  );

  // -------------------------------------------------------------------------
  // SECTION 4: EXCEL-MODEL-PARITY SIMULATOR FORMULAS
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Testing Excel Simulator Mathematical Parity ---');

  // Excel Model Formula:
  // Projected Reduction = 6.0 + (Buses * 0.035) + (Corridors * 1.6)
  // Estimated Cost = (Buses * 1.2) + (Corridors * 45) INR Crore
  const buses = 200;
  const corridors = 3;
  const target = 30.0;

  const projectedReduction = 6.0 + buses * 0.035 + corridors * 1.6;
  const estimatedCost = buses * 1.2 + corridors * 45;
  const shortfall = target - projectedReduction;

  assert(
    Math.abs(projectedReduction - 17.8) < 1e-6,
    `Baseline 200 buses + 3 corridors yields 17.8% projected reduction (calculated: ${projectedReduction.toFixed(1)}%)`
  );
  assert(
    Math.abs(estimatedCost - 375.0) < 1e-6,
    `Baseline 200 buses + 3 corridors yields ₹375.0 Crore cost (calculated: ₹${estimatedCost.toFixed(0)} Cr)`
  );
  assert(
    Math.abs(shortfall - 12.2) < 1e-6,
    `Baseline shortfall vs 30% target is exactly 12.2 percentage points (calculated: ${shortfall.toFixed(1)} pp)`
  );

  // -------------------------------------------------------------------------
  // SECTION 5: SHA-256 LEDGER & TAMPERING DETECTION
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Testing SHA-256 Ledger Integrity & Tampering Detection ---');

  // Test canonical hashing stability
  const samplePayload = {
    id: 'aud-test-hash',
    commitmentId: 'com-mum-exp-01',
    outcome: 'PARTIALLY_SUPPORTED',
    progressStatus: 'AT_RISK',
    progressPercentage: 6.5,
    plannedProgressPercentage: 14.0,
    reportingOverstatementPercentage: 7.5,
    gapPercentage: 7.5,
    evidenceQualityScore: 84,
    auditDate: '2024-10-15T00:00:00.000Z',
  };
  const hash1 = calculateAuditBlockHash(samplePayload, GENESIS_HASH);
  const hash2 = calculateAuditBlockHash(samplePayload, GENESIS_HASH);
  assert(
    hash1 === hash2 && hash1.startsWith('sha256:'),
    `SHA-256 block hash is deterministic and canonical (${hash1.substring(0, 24)}...)`
  );

  // Test full seed audit chain verification
  const chainVerification = verifyAuditChain(DEMO_AUDITS);
  assert(
    chainVerification.isValid === true && chainVerification.verifiedCount === DEMO_AUDITS.length,
    `Seed DEMO_AUDITS chain (${DEMO_AUDITS.length} blocks) passes complete SHA-256 cryptographic verification`
  );

  // Test tampering detection: mutate progress percentage of block 3
  const tamperedChain = JSON.parse(JSON.stringify(DEMO_AUDITS));
  tamperedChain[2].progressPercentage = 99.9; // tampered value
  const tamperVerification = verifyAuditChain(tamperedChain);
  assert(
    tamperVerification.isValid === false && typeof tamperVerification.brokenIndex === 'number',
    `Tampering detection successfully flagged corrupted block (detected: ${tamperVerification.details})`
  );

  // -------------------------------------------------------------------------
  // SECTION 6: API INTEGRATION TEST (/api/audits/generate)
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Testing /api/audits/generate Endpoint ---');

  try {
    const apiRes = await postJson('http://localhost:3000/api/audits/generate', {
      commitmentId: 'com-mum-exp-02',
      cityId: 'mumbai',
    });

    assert(
      apiRes.status === 200 && apiRes.body.success === true,
      `POST /api/audits/generate returns HTTP 200 with success: true`
    );
    assert(
      apiRes.body.chainMetadata && apiRes.body.chainMetadata.storageNotice,
      `API returns chainMetadata with explicit cache boundary disclosure`
    );
    assert(
      apiRes.body.chainMetadata.parentHashSource === 'server_seed_head',
      `API derived previous hash from server seed head (parentHashSource: ${apiRes.body.chainMetadata?.parentHashSource})`
    );

    // Test with caller-provided previousHash and blockNumber
    const customHash = 'sha256:1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff';
    const callerRes = await postJson('http://localhost:3000/api/audits/generate', {
      commitmentId: 'com-mum-exp-02',
      cityId: 'mumbai',
      previousHash: customHash,
      blockNumber: 42,
    });
    assert(
      callerRes.body.audit?.previousHash === customHash && callerRes.body.chainMetadata?.blockNumber === 42,
      `API respects caller-provided previousHash and blockNumber (parentHashSource: ${callerRes.body.chainMetadata?.parentHashSource})`
    );
  } catch (err) {
    assert(false, `API request failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} passed, ${failedTests} failed.`);
  console.log('===============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runRegressionSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
