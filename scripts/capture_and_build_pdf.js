const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const OUTPUT_PDF = path.join(__dirname, '..', 'ClimateAI_Maharashtra_Platform_Walkthrough.pdf');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'chrome_pdf_capture');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const views = [
  {
    id: '01_landing',
    name: 'Public Gateway & Landing Page',
    portal: 'Public Entry Gateway',
    url: 'http://localhost:3000/',
    route: '/',
    action: 'Clicking "Launch Government Portal" or "Explore Citizen Tracker"',
    description: 'Entry gateway introducing the product mission ("From Climate Commitments to Verified Climate Action"), the 5 Core Citizen Questions architecture, primary pilot indicators (Mumbai & Pune), and seamless role-based navigation.',
    features: [
      'Dual audience routing (Government Intelligence vs. Citizen Public Transparency)',
      'Pilot city badges: Mumbai (MCAP 2022) and Pune (PCAP 2023)',
      'Overview of the 5 Core Questions: What was promised? What is observed? Does it match? What gaps exist? What next?'
    ]
  },
  {
    id: '02_admin_overview',
    name: 'Executive Command Centre',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin',
    route: '/admin',
    action: 'Clicking city switcher, sector filter pills, or quick What-If simulation slider',
    description: 'Executive intelligence command centre. Replaces generic dashboard tropes with an authoritative dual-status matrix, overall verified portfolio score (60.7%), and average reporting overstatement (+11.0%).',
    features: [
      'Portfolio aggregates: Overall Verified Score (60.7%), Avg Overstatement (+11.0%)',
      'Dual-Axis Sector Health Matrix (Progress Status vs. Evidence Audit Outcome)',
      'Statutory Status Distribution Donut Chart and City Comparison Card',
      'Interactive What-If Quick Modeller spotlight'
    ]
  },
  {
    id: '03_admin_commitments',
    name: 'Statutory Commitments Directory',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/commitments',
    route: '/admin/commitments',
    action: 'Clicking table row, sector pill, target year filter, or switching between High-Density Table and Card view',
    description: 'Searchable statutory commitment directory providing both a high-density analytical table view (with all mathematical columns from the Excel workbook) and responsive card view.',
    features: [
      'Analytical data table with Planned %, City Reported %, Verified %, Overstatement %, and Gap %',
      'Dual status badges: Progress Status (On Track / At Risk / Off Track) & Source Agreement',
      'Multi-criteria filters: Sector, Target Year, Reporting Overstatement, and Search query',
      'Clicking any record opens the comprehensive Commitment Dossier'
    ]
  },
  {
    id: '04_commitment_detail',
    name: 'Commitment Dossier (BEST Electrification)',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/commitments/com-mum-exp-01',
    route: '/admin/commitments/com-mum-exp-01',
    action: 'Clicking "Run Audit Verification", toggling language tabs, or clicking "Export Official PDF Dossier"',
    description: 'Comprehensive statutory dossier for 100% Electrification of BEST Municipal Bus Fleet. Displays verbatim policy quote from MCAP Page 78, raw multi-source observation streams, and mathematical strip.',
    features: [
      'Mathematical Verification Strip: Planned 30.0% vs. City 14.0% vs. Verified 6.5% -> 23.5% Implementation Gap',
      'Verbatim statutory text quote with exact document metadata and page reference',
      'Multi-source observation streams: BEST Telemetry Logs and CPCB Ground Monitors',
      'One-click PDF Dossier Generation via jsPDF'
    ]
  },
  {
    id: '05_discrepancy_detail',
    name: 'Discrepancy Audit Dossier (Ward K-East Mangroves)',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/commitments/com-mum-exp-03',
    route: '/admin/commitments/com-mum-exp-03',
    action: 'Clicking on Potential Discrepancy badge to inspect conflicting satellite observations',
    description: 'Dossier highlighting a major discrepancy (+36.5% Overstatement). City claimed 45,000 nursery saplings planted, but Copernicus Sentinel-2 satellite radiometric surveillance detected net vegetation decline.',
    features: [
      'Prominent POTENTIAL DISCREPANCY audit alert and Conflict status banner',
      'Reporting Overstatement math: Claimed 45.0% vs. Satellite Verified 8.5% (+36.5% discrepancy)',
      'Sentinel-2 Level-2A NDVI empirical sensor feed with cloud cover < 10%',
      'Trilingual Gemini explanation explaining the disparity for administrators and citizens'
    ]
  },
  {
    id: '06_admin_policies',
    name: 'Policy Intelligence & Ingestion Studio',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/policies',
    route: '/admin/policies',
    action: 'Clicking "Upload PDF", selecting sample document, triggering Gemini extraction, and clicking "Approve"',
    description: 'End-to-end PDF ingestion pipeline. Government administrators upload climate policies (e.g. MCAP 2022); Google Gemini extracts structured commitments with page numbers for human review and approval.',
    features: [
      'Drag-and-drop PDF upload zone and pre-loaded official policy selector',
      'Multi-stage pipeline: Text extraction -> Gemini structured analysis -> Human-in-the-loop review',
      'Confidence scoring (e.g. 96%) and missing information flags',
      'Approve button commits structured target directly into statutory platform state'
    ]
  },
  {
    id: '07_admin_evidence',
    name: 'Multi-Source Evidence Explorer',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/evidence',
    route: '/admin/evidence',
    action: 'Filtering by source type (Satellite, Ground Sensors, Municipal Logs) or clicking observation detail',
    description: 'Professional scientific research repository. Displays raw Copernicus Sentinel-2 Level-2A surface reflectance data, CPCB CAAQMS sensor telemetry, valid pixel percentages, and calibration certificates.',
    features: [
      'Sentinel-2 multispectral band details (B04 Red, B08 NIR for NDVI)',
      'Cloud cover verification (< 10%) and valid pixel ratios (94.2%)',
      'CPCB Ground PM2.5 monitor logs with sensor serial numbers and MPCB calibration stamps',
      'Clear declaration of Scientific Integrity protocols'
    ]
  },
  {
    id: '08_admin_audit_workspace',
    name: 'Deterministic Climate Audit Engine',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/audit-workspace',
    route: '/admin/audit-workspace',
    action: 'Selecting a commitment, clicking "Execute Deterministic Audit", and viewing mathematical provenance',
    description: 'Execution workbench where administrators execute audits. The engine strictly isolates mathematical truth from generative text, evaluating gap thresholds and source corroboration.',
    features: [
      'Deterministic gap evaluation: On Track (<=5%), At Risk (5-15%), Off Track (>15%)',
      'Cryptographic provenance signature generated upon verification completion',
      'Multi-source corroboration matrix comparing satellite and ground sensor streams',
      'Direct export of official verification certificate'
    ]
  },
  {
    id: '09_admin_audit_history',
    name: 'Immutable Audit History Ledger',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/audit-history',
    route: '/admin/audit-history',
    action: 'Clicking "Download PDF Report" on any audit record or filtering by audit outcome',
    description: 'Cryptographically hashed historical audit trail providing complete transparency. Every audit event logs timestamp, auditor identity, input evidence hashes, and mathematical outcome.',
    features: [
      'SHA-256 state hashes ensuring tamper-evident accountability',
      'Dual status outcomes logged chronologically',
      'Instant PDF report download button on every row generating formal audit certificates',
      'Statutory compliance filter (Supported, Partially Supported, Inconclusive, Discrepancy)'
    ]
  },
  {
    id: '10_admin_recommendations',
    name: 'Ranked Decision Recommendations Engine',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/recommendations',
    route: '/admin/recommendations',
    action: 'Filtering by sector, sorting by priority or cost-effectiveness, or clicking "Simulate in What-If Engine"',
    description: 'Decision support system translating audit findings into prioritized interventions. Evaluates capital expenditure, implementation feasibility, emissions abatement, and policy urgency.',
    features: [
      'Multi-criteria scoring: Cost-effectiveness, Abatement potential, Feasibility, Urgency',
      'Targeted interventions for high-gap commitments (e.g. Dedicated EV Bus Depots, Rooftop Solar DISCOM link)',
      'Direct link to test intervention in the What-If Simulator'
    ]
  },
  {
    id: '11_admin_simulator',
    name: 'What-If Scenario Simulator (Exact Excel Model)',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/simulator',
    route: '/admin/simulator',
    action: 'Dragging the "Additional Electric Buses" slider (200 -> 450) and "Dedicated Corridors" slider (3 -> 5)',
    description: 'Interactive policy lever modeller implementing the exact mathematical model from the hackathon specification workbook. Shows real-time recalculation of projected progress, CapEx, and emissions mitigated.',
    features: [
      'Exact Excel Model Parity: Baseline 6.0% + 200 buses + 3 corridors = 17.8% projected progress',
      'Capital expenditure calculation: 200 buses @ 1.50 Cr + 3 corridors @ 25 Cr = 375 Cr CapEx',
      'Target comparison: 17.8% projected vs. 30.0% statutory target -> 12.2% projected shortfall',
      'Interactive sliders updating live with budget constraint badges'
    ]
  },
  {
    id: '12_admin_map',
    name: 'Municipal GIS Command Map',
    portal: 'Government Intelligence Portal',
    url: 'http://localhost:3000/admin/map',
    route: '/admin/map',
    action: 'Toggling map layers (NDVI, Air Quality, Bus Corridors) or clicking a geographic observation marker',
    description: 'Geospatial intelligence map built with Leaflet and OpenStreetMap. Provides ward-level spatial analysis for Mumbai and Pune with observation pins, telemetry feeds, and boundary overlays.',
    features: [
      'Layer controls: Sentinel-2 NDVI overlay, CPCB Ground Monitors, Transit Corridors',
      'Ward-level interactive markers displaying local verification status and empirical metrics',
      'City zoom toggle between Mumbai and Pune jurisdictions'
    ]
  },
  {
    id: '13_citizen_overview',
    name: 'Citizen Public Transparency Portal (English)',
    portal: 'Citizen Accountability Portal',
    url: 'http://localhost:3000/citizen',
    route: '/citizen',
    action: 'Clicking through the 5 Core Citizen Questions, or clicking the language switcher (HI / MR)',
    description: 'Public-facing transparency portal designed for democratic accountability. Translates technical audits into plain-language civic scorecards answering the 5 Core Citizen Questions.',
    features: [
      'Structured around the 5 Questions: What was promised? What is happening? Does evidence agree?',
      'Transparent display of verified progress vs. city-reported numbers',
      'Overstatement alert badges alerting citizens to unverified government claims',
      'Instant access to the cited AI Assistant'
    ]
  },
  {
    id: '14_citizen_tracker',
    name: 'Citizen Public Commitment Tracker',
    portal: 'Citizen Accountability Portal',
    url: 'http://localhost:3000/citizen/tracker',
    route: '/citizen/tracker',
    action: 'Filtering commitments by sector or clicking on an individual commitment scorecard',
    description: 'Democratized version of the commitments directory. Presents statutory goals as accessible citizen scorecards with verified evidence badges, independent data sources, and progress bars.',
    features: [
      'Simplified progress visualizers with color-coded status chips',
      'Plain-language source attribution (e.g. "Sentinel Satellite", "Central Pollution Control Board")',
      'Verified score comparison highlighting reporting discrepancies'
    ]
  },
  {
    id: '15_citizen_environment',
    name: 'Environmental Intelligence Hub',
    portal: 'Citizen Accountability Portal',
    url: 'http://localhost:3000/citizen/environment',
    route: '/citizen/environment',
    action: 'Clicking on educational tabs: "Satellite NDVI", "Air Quality (PM2.5)", or "Heat Islands"',
    description: 'Civic education centre explaining Earth observation science. Demystifies satellite spectral indices, ground air quality monitors, and emphasizes key scientific integrity rules.',
    features: [
      'Scientific primer on Sentinel-2 NDVI: explains chlorophyll reflectance vs. individual trees',
      'CPCB PM2.5 monitoring network guide and health hazard thresholds',
      'Urban heat island analysis for Mumbai and Pune coastal micro-climates'
    ]
  },
  {
    id: '16_citizen_map',
    name: 'Citizen Public Spatial Map',
    portal: 'Citizen Accountability Portal',
    url: 'http://localhost:3000/citizen/map',
    route: '/citizen/map',
    action: 'Clicking on neighborhood observation pins to view local green cover and air quality readings',
    description: 'Accessible geospatial interface allowing citizens to explore local environmental health across Mumbai and Pune wards with simple status indicators.',
    features: [
      'Geo-located neighborhood observation pins with plain-language metrics',
      'Ward-level environmental health indicator summary',
      'Accessible color scheme complying with public transparency standards'
    ]
  },
  {
    id: '17_citizen_assistant',
    name: 'Cited ClimateAI Conversational Assistant',
    portal: 'Citizen Accountability Portal',
    url: 'http://localhost:3000/citizen/assistant',
    route: '/citizen/assistant',
    action: 'Clicking sample prompt "What is the discrepancy in Ward K-East?" to view cited response',
    description: 'Retrieval-grounded AI assistant powered by Google Gemini. Provides citizens with plain-language answers accompanied by exact statutory citations, page references, and empirical data points.',
    features: [
      'Clickable statutory citations referencing specific MCAP pages and document sections',
      'Quick-prompt pills for instant discovery of key audit findings and discrepancy alerts',
      'Multilingual synthesis capability in English, Hindi, and Marathi'
    ]
  }
];

async function captureScreenshots() {
  console.log(`Starting capture of ${views.length} platform screens...`);
  for (let i = 0; i < views.length; i++) {
    const v = views[i];
    const imgPath = path.join(SCREENSHOTS_DIR, `${v.id}.png`);
    console.log(`[${i + 1}/${views.length}] Capturing ${v.name} (${v.route})...`);
    
    // Command string using cmd.exe and Chrome headless
    const cmd = `cmd.exe /c ""${CHROME_PATH}" --headless=new --disable-gpu --no-sandbox --window-size=1440,900 --virtual-time-budget=3000 --user-data-dir="${TEMP_USER_DATA}" --screenshot="${imgPath}" "${v.url}""`;
    try {
      execSync(cmd, { stdio: 'ignore' });
      if (fs.existsSync(imgPath)) {
        const stats = fs.statSync(imgPath);
        console.log(`  ✓ Saved ${v.id}.png (${Math.round(stats.size / 1024)} KB)`);
      } else {
        console.warn(`  ⚠️ File not found: ${imgPath}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed to capture ${v.id}:`, err.message);
    }
  }
}

function buildPdf() {
  console.log('Generating comprehensive PDF document...');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm

  // ==========================================
  // COVER PAGE
  // ==========================================
  // Deep forest background accent banner
  doc.setFillColor(14, 46, 35); // #0E2E23
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Badge
  doc.setFillColor(5, 150, 105); // #059669
  doc.roundedRect(margin, 20, 68, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('INTERNATIONAL GRAND CHALLENGE 2026', margin + 3, 25.5);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('ClimateAI Maharashtra', margin, 42);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(167, 243, 208); // Emerald-200
  doc.text('"From Climate Commitments to Verified Climate Action"', margin, 52);

  // Tagline description
  doc.setFontSize(9);
  doc.setTextColor(209, 250, 229);
  doc.text('Complete Platform Visual Documentation & User Interaction Walkthrough', margin, 62);
  doc.text('A comprehensive reference documenting every click, state transition, and audit verification.', margin, 68);

  // Cover Body
  doc.setTextColor(15, 23, 42); // Slate-900
  let y = 108;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Platform Specification & Engineering Roster', margin, y);
  y += 6;

  // Metadata Card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('INSTITUTION & EVENT:', margin + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text('PCCOE International Grand Challenge 2026 / FCRIT Innovation Labs', margin + 52, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('DEVELOPMENT TEAM:', margin + 6, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text('Ryan D\'Souza, Tushar Agarwal, Nakul Dalal, Nainish Gothankar, Sean Fernandes', margin + 52, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('PILOT JURISDICTIONS:', margin + 6, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text('Primary Pilot: Mumbai (MCAP 2022) | Expansion Jurisdiction: Pune (PCAP 2023)', margin + 52, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('VERIFICATION ENGINE:', margin + 6, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text('Copernicus Sentinel-2 Level-2A (NDVI) + CPCB Telemetry + Deterministic Rules', margin + 52, y + 32);

  y += 52;

  // Table of Contents Overview
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('Platform Navigation & Screen Index', margin, y);
  y += 8;

  const tocItems = [
    { num: '01', title: 'Public Gateway Landing Page', route: '/' },
    { num: '02', title: 'Executive Command Centre', route: '/admin' },
    { num: '03', title: 'Statutory Commitments Directory', route: '/admin/commitments' },
    { num: '04', title: 'Commitment Dossier (BEST Electrification)', route: '/admin/commitments/com-mum-exp-01' },
    { num: '05', title: 'Discrepancy Audit Dossier (Ward K-East)', route: '/admin/commitments/com-mum-exp-03' },
    { num: '06', title: 'Policy Intelligence & Ingestion Studio', route: '/admin/policies' },
    { num: '07', title: 'Multi-Source Evidence Explorer', route: '/admin/evidence' },
    { num: '08', title: 'Deterministic Climate Audit Engine', route: '/admin/audit-workspace' },
    { num: '09', title: 'Immutable Audit History Ledger', route: '/admin/audit-history' },
    { num: '10', title: 'Ranked Decision Recommendations', route: '/admin/recommendations' },
    { num: '11', title: 'What-If Scenario Simulator (Excel Model)', route: '/admin/simulator' },
    { num: '12', title: 'Municipal GIS Command Map', route: '/admin/map' },
    { num: '13', title: 'Citizen Public Transparency Portal', route: '/citizen' },
    { num: '14', title: 'Citizen Commitment Tracker', route: '/citizen/tracker' },
    { num: '15', title: 'Environmental Intelligence Hub', route: '/citizen/environment' },
    { num: '16', title: 'Citizen Public Spatial Map', route: '/citizen/map' },
    { num: '17', title: 'Cited ClimateAI Conversational Assistant', route: '/citizen/assistant' },
  ];

  doc.setFontSize(8);
  for (let idx = 0; idx < tocItems.length; idx++) {
    const item = tocItems[idx];
    const col = idx < 9 ? 0 : 1;
    const row = idx < 9 ? idx : idx - 9;
    const colX = margin + col * 92;
    const itemY = y + row * 8;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(item.num, colX, itemY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(item.title, colX + 8, itemY);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(item.route, colX + 68, itemY);
  }

  // Cover Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated for International Hackathon Evaluation • Production Build v1.0.0', margin, pageHeight - 12);
  doc.text('Date: November 2026 • Port 3000 Active Verification', pageWidth - margin - 75, pageHeight - 12);

  // ==========================================
  // VIEW WALKTHROUGH PAGES
  // ==========================================
  views.forEach((v, index) => {
    doc.addPage();
    const pageNum = index + 2;

    // Header bar
    doc.setFillColor(14, 46, 35); // #0E2E23
    doc.rect(0, 0, pageWidth, 18, 'F');

    // Title in header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Screen ${String(index + 1).padStart(2, '0')}: ${v.name}`, margin, 11);

    // Portal Badge in header
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(pageWidth - margin - 58, 4, 58, 10, 2, 2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(v.portal.toUpperCase(), pageWidth - margin - 55, 10.5);

    // Route Subheader
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 18, pageWidth, 8, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`ROUTE: ${v.route}  •  HOST: ${v.url}`, margin, 23.5);

    // SCREENSHOT IMAGE
    const imgPath = path.join(SCREENSHOTS_DIR, `${v.id}.png`);
    const imgX = margin;
    const imgY = 29;
    const imgW = contentWidth; // 182 mm
    const imgH = 113.75; // aspect ratio 1440 x 900 = 1.6

    if (fs.existsSync(imgPath)) {
      const imgBase64 = fs.readFileSync(imgPath).toString('base64');
      // Draw framed border behind image
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(imgX - 1, imgY - 1, imgW + 2, imgH + 2, 1, 1, 'FD');
      // Add screenshot
      doc.addImage('data:image/png;base64,' + imgBase64, 'PNG', imgX, imgY, imgW, imgH);
    } else {
      // Fallback placeholder box
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(241, 245, 249);
      doc.rect(imgX, imgY, imgW, imgH, 'FD');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`[Screenshot image: ${v.id}.png]`, imgX + imgW / 2 - 25, imgY + imgH / 2);
    }

    // INTERACTION & WORKFLOW EXPLANATION SECTION
    let detailsY = imgY + imgH + 8; // ~ 151 mm

    // Card 1: What Happens on Click / User Interaction
    doc.setFillColor(240, 253, 244); // Light emerald
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, detailsY, contentWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70); // Emerald-800
    doc.text('👆 USER INTERACTION & WHAT HAPPENS ON CLICK:', margin + 4, detailsY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const actionLines = doc.splitTextToSize(v.action, contentWidth - 8);
    doc.text(actionLines, margin + 4, detailsY + 12);

    const descLines = doc.splitTextToSize(v.description, contentWidth - 8);
    doc.text(descLines, margin + 4, detailsY + 18);

    detailsY += 28;

    // Card 2: Features, Mathematical Proofs & Scientific Grounding
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, detailsY, contentWidth, 36, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('🔬 SCIENTIFIC GROUNDING, MATHEMATICAL VERIFICATION & KEY DATA POINTS:', margin + 4, detailsY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    let bulletY = detailsY + 13;
    v.features.forEach((feat) => {
      doc.setFillColor(5, 150, 105);
      doc.circle(margin + 6, bulletY - 1.2, 1, 'F');
      const lines = doc.splitTextToSize(feat, contentWidth - 14);
      doc.text(lines, margin + 10, bulletY);
      bulletY += 7;
    });

    // FOOTER
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('ClimateAI Maharashtra • International Hackathon 2026 Walkthrough', margin, pageHeight - 8);
    doc.text(`Page ${pageNum} of ${views.length + 1}`, pageWidth - margin - 22, pageHeight - 8);
  });

  doc.save(OUTPUT_PDF);
  console.log(`\n🎉 PDF successfully written to:\n${OUTPUT_PDF}`);
  const stats = fs.statSync(OUTPUT_PDF);
  console.log(`Total PDF Size: ${Math.round(stats.size / 1024)} KB across ${views.length + 1} pages.`);
}

async function run() {
  await captureScreenshots();
  buildPdf();
}

run().catch((err) => {
  console.error('Fatal error in generator:', err);
  process.exit(1);
});

