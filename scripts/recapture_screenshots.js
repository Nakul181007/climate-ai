const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'chrome_pdf_capture_' + Date.now());

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const views = [
  { id: '01_landing', url: 'http://localhost:3000/' },
  { id: '02_admin_overview', url: 'http://localhost:3000/admin' },
  { id: '03_admin_commitments', url: 'http://localhost:3000/admin/commitments' },
  { id: '04_commitment_best', url: 'http://localhost:3000/admin/commitments/com-mum-exp-02' },
  { id: '05_commitment_keast', url: 'http://localhost:3000/admin/commitments/com-mum-exp-05' },
  { id: '06_admin_policies', url: 'http://localhost:3000/admin/policies' },
  { id: '07_admin_evidence', url: 'http://localhost:3000/admin/evidence' },
  { id: '08_admin_audit_workspace', url: 'http://localhost:3000/admin/audit-workspace' },
  { id: '09_admin_audit_history', url: 'http://localhost:3000/admin/audit-history' },
  { id: '10_admin_recommendations', url: 'http://localhost:3000/admin/recommendations' },
  { id: '11_admin_simulator', url: 'http://localhost:3000/admin/simulator' },
  { id: '12_admin_map', url: 'http://localhost:3000/admin/map' },
  { id: '13_citizen_overview', url: 'http://localhost:3000/citizen' },
  { id: '14_citizen_tracker', url: 'http://localhost:3000/citizen/tracker' },
  { id: '15_citizen_environment', url: 'http://localhost:3000/citizen/environment' },
  { id: '16_citizen_map', url: 'http://localhost:3000/citizen/map' },
  { id: '17_citizen_assistant', url: 'http://localhost:3000/citizen/assistant' }
];

console.log(`Recapturing ${views.length} screenshots from live server...`);

for (let i = 0; i < views.length; i++) {
  const v = views[i];
  const imgPath = path.join(SCREENSHOTS_DIR, `${v.id}.png`);
  console.log(`[${i + 1}/${views.length}] Capturing ${v.id} from ${v.url}...`);
  const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --no-sandbox --window-size=1440,900 --virtual-time-budget=4000 --user-data-dir="${TEMP_USER_DATA}" --screenshot="${imgPath}" "${v.url}"`;
  try {
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(imgPath)) {
      const stats = fs.statSync(imgPath);
      console.log(`  ✓ Saved ${v.id}.png (${Math.round(stats.size / 1024)} KB)`);
    } else {
      console.warn(`  ⚠️ Failed to save ${imgPath}`);
    }
  } catch (err) {
    console.error(`  ❌ Error capturing ${v.id}:`, err.message);
  }
}

console.log('Finished capturing all views.');
