const http = require('http');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
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
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body || '{}') }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING PLATFORM INTEGRATION TESTS ===\n');

  // Test 1: Routes accessibility
  const routes = [
    '/',
    '/admin',
    '/admin/commitments',
    '/admin/commitments/com-mum-exp-02',
    '/admin/commitments/com-mum-exp-05',
    '/admin/policies',
    '/admin/evidence',
    '/admin/audit-workspace',
    '/admin/audit-history',
    '/admin/recommendations',
    '/admin/simulator',
    '/admin/map',
    '/citizen',
    '/citizen/tracker',
    '/citizen/environment',
    '/citizen/map',
    '/citizen/assistant',
    '/api/health',
    '/api/policies',
    '/api/download',
  ];

  let failedRoutes = 0;
  for (const r of routes) {
    try {
      const res = await get(`http://localhost:3000${r}`);
      const ok = res.status === 200;
      console.log(`Route [${r}]: HTTP ${res.status} ${ok ? '✓ PASS' : '✗ FAIL'}`);
      if (!ok) failedRoutes++;
    } catch (err) {
      console.error(`Route [${r}] error:`, err.message);
      failedRoutes++;
    }
  }

  // Test 2: AI Assistant Endpoint with Grounded Ward K-East question
  console.log('\n--- Testing AI Assistant API ---');
  const aiRes = await postJson('http://localhost:3000/api/ai/assistant', {
    message: 'Why was Ward K-East green cover marked as a discrepancy?',
    cityId: 'mumbai',
    language: 'en',
  });
  console.log('AI Assistant Status:', aiRes.status);
  console.log('Citations count:', aiRes.body.citations?.length);
  console.log('Sample answer snippet:', aiRes.body.reply?.substring(0, 150));
  const aiPassed = aiRes.status === 200 && aiRes.body.reply && aiRes.body.citations?.length > 0;
  console.log('AI Assistant Test:', aiPassed ? '✓ PASS' : '✗ FAIL');

  // Test 3: Policy Extraction with Climate Text
  console.log('\n--- Testing Policy Ingestion API ---');
  const policyRes = await postJson('http://localhost:3000/api/policies/extract', {
    documentName: 'MCAP_Transport_Solar_Excerpt.pdf',
    documentText: 'The Municipal Corporation shall expand rooftop solar to 150 MW and restore mangrove wetland buffers across Mumbai by 2026.',
    cityId: 'mumbai',
  });
  console.log('Policy Extract Status:', policyRes.status);
  console.log('Extracted commitments count:', policyRes.body.extractedCommitments?.length);
  const policyPassed = policyRes.status === 200 && policyRes.body.extractedCommitments?.length > 0;
  console.log('Policy Extraction Test:', policyPassed ? '✓ PASS' : '✗ FAIL');

  // Test 4: Policy Extraction with Non-Climate Text (Should refuse to invent commitments)
  console.log('\n--- Testing Policy Ingestion Rejection on Non-Climate Document ---');
  const nonClimateRes = await postJson('http://localhost:3000/api/policies/extract', {
    documentName: 'Random_Invoice_123.pdf',
    documentText: 'Invoice number 12345 for software license renewal. Total amount payable: 500 dollars. Payment due upon receipt.',
    cityId: 'mumbai',
  });
  console.log('Non-Climate Status:', nonClimateRes.status);
  console.log('Extracted commitments:', nonClimateRes.body.extractedCommitments?.length);
  console.log('Notice:', nonClimateRes.body.extractionNotice);
  const nonClimatePassed = nonClimateRes.status === 200 && nonClimateRes.body.extractedCommitments?.length === 0;
  console.log('Truthful Non-Climate Rejection Test:', nonClimatePassed ? '✓ PASS (Did not invent false targets)' : '✗ FAIL');

  console.log('\n=== SUMMARY ===');
  console.log(`Failed routes: ${failedRoutes}`);
  console.log(`AI Assistant: ${aiPassed ? 'PASS' : 'FAIL'}`);
  console.log(`Policy Extraction: ${policyPassed ? 'PASS' : 'FAIL'}`);
  console.log(`Scientific Integrity Protection: ${nonClimatePassed ? 'PASS' : 'FAIL'}`);

  if (failedRoutes > 0 || !aiPassed || !policyPassed || !nonClimatePassed) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

