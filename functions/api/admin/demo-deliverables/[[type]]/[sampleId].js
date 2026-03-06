// Admin Demo Deliverables Generation Endpoint
// GET /api/admin/demo-deliverables/{type}/{sampleId}
// Generates demo/sample deliverables with "DEMO" watermark for marketing
// Types: one-pager, tracking-profile, film-index, badge
// Sample IDs: sample-1, sample-2, sample-3 or custom

import { verifyJWT } from '../../../../utils/jwt.js';

// HWH Brand Colors
const COLORS = {
  primary: '#0134bd',    // HWH Blue
  secondary: '#fb6c1d',  // HWH Orange
  white: '#ffffff',
  black: '#1a1a1a',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  demoRed: '#dc2626'     // Demo watermark color
};

// Sample player data templates for demos
const SAMPLE_PLAYERS = {
  'sample-1': {
    player_name: 'Demo Prospect - Elite Guard',
    player_key: 'DEMO-001',
    grad_class: '2026',
    primary_position: 'PG',
    secondary_position: 'SG',
    height: "6'2",
    weight: '175',
    gender: 'male',
    school: 'Elite Prep Academy',
    city: 'Chicago',
    state: 'IL',
    ppg: 18.5,
    rpg: 4.2,
    apg: 6.8,
    spg: 2.1,
    bpg: 0.5,
    fg_percent: 48,
    three_p_percent: 42,
    ft_percent: 85,
    verified: true,
    parent_name: 'Demo Parent',
    parent_email: 'demo@elitegbb.com',
    parent_phone: '(555) 123-4567',
    instagram_handle: 'demo_prospect',
    highlight_url: 'https://hudl.com/demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  'sample-2': {
    player_name: 'Demo Prospect - Forward Prospect',
    player_key: 'DEMO-002',
    grad_class: '2027',
    primary_position: 'SF',
    secondary_position: 'PF',
    height: "6'7",
    weight: '210',
    gender: 'female',
    school: 'Metro High School',
    city: 'Atlanta',
    state: 'GA',
    ppg: 14.3,
    rpg: 8.7,
    apg: 3.2,
    spg: 1.4,
    bpg: 1.8,
    fg_percent: 52,
    three_p_percent: 35,
    ft_percent: 78,
    verified: true,
    parent_name: 'Demo Guardian',
    parent_email: 'guardian@elitegbb.com',
    parent_phone: '(555) 987-6543',
    instagram_handle: 'demo_forward',
    highlight_url: 'https://hudl.com/demo2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  'sample-3': {
    player_name: 'Demo Prospect - Center Big',
    player_key: 'DEMO-003',
    grad_class: '2025',
    primary_position: 'C',
    secondary_position: 'PF',
    height: "6'10",
    weight: '245',
    gender: 'male',
    school: 'Powerhouse Academy',
    city: 'Houston',
    state: 'TX',
    ppg: 12.8,
    rpg: 11.2,
    apg: 2.1,
    spg: 0.8,
    bpg: 2.5,
    fg_percent: 62,
    three_p_percent: 0,
    ft_percent: 70,
    verified: true,
    parent_name: 'Demo Parent 2',
    parent_email: 'parent@elitegbb.com',
    parent_phone: '(555) 456-7890',
    instagram_handle: 'demo_center',
    highlight_url: 'https://hudl.com/demo3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

// Verify admin token
async function verifyAdminToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing token' };
  }

  const token = authHeader.substring(7);
  try {
    const payload = await verifyJWT(token, env.JWT_SECRET || 'fallback-secret-key-change-in-production');
    if (payload.role !== 'admin' && payload.role !== 'editor') {
      return { valid: false, error: 'Insufficient permissions' };
    }
    return { valid: true, user: payload };
  } catch (err) {
    return { valid: false, error: 'Invalid token' };
  }
}

// Generate Demo One-Pager HTML with DEMO watermark
function generateDemoOnePagerHTML(player) {
  const stats = {
    ppg: player.ppg || 0,
    rpg: player.rpg || 0,
    apg: player.apg || 0,
    spg: player.spg || 0,
    bpg: player.bpg || 0,
    fg: player.fg_percent || 0,
    three: player.three_p_percent || 0,
    ft: player.ft_percent || 0
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: ${COLORS.white};
      color: ${COLORS.black};
      width: 612pt;
      height: 792pt;
      padding: 36pt;
      position: relative;
    }
    .demo-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 72pt;
      font-weight: 800;
      color: ${COLORS.demoRed};
      opacity: 0.15;
      z-index: 1000;
      pointer-events: none;
      letter-spacing: 8pt;
    }
    .header {
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primary}dd 100%);
      color: ${COLORS.white};
      padding: 24pt;
      border-radius: 12pt;
      margin-bottom: 20pt;
    }
    .header h1 {
      font-size: 28pt;
      font-weight: 800;
      margin-bottom: 4pt;
    }
    .header .subtitle {
      font-size: 12pt;
      opacity: 0.9;
    }
    .demo-badge {
      display: inline-block;
      background: ${COLORS.demoRed};
      color: ${COLORS.white};
      padding: 4pt 12pt;
      border-radius: 4pt;
      font-size: 9pt;
      font-weight: 700;
      margin-top: 8pt;
      text-transform: uppercase;
      letter-spacing: 2pt;
    }
    .section {
      margin-bottom: 16pt;
    }
    .section-title {
      font-size: 14pt;
      font-weight: 700;
      color: ${COLORS.primary};
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      margin-bottom: 10pt;
      padding-bottom: 6pt;
      border-bottom: 2pt solid ${COLORS.secondary};
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12pt;
    }
    .info-item {
      background: ${COLORS.lightGray};
      padding: 12pt;
      border-radius: 8pt;
      border-left: 3pt solid ${COLORS.primary};
    }
    .info-label {
      font-size: 9pt;
      color: ${COLORS.gray};
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      margin-bottom: 4pt;
    }
    .info-value {
      font-size: 14pt;
      font-weight: 700;
      color: ${COLORS.black};
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10pt;
    }
    .stat-box {
      background: linear-gradient(145deg, ${COLORS.primary} 0%, ${COLORS.primary}ee 100%);
      color: ${COLORS.white};
      padding: 16pt 10pt;
      border-radius: 10pt;
      text-align: center;
    }
    .stat-value {
      font-size: 24pt;
      font-weight: 800;
      margin-bottom: 4pt;
    }
    .stat-label {
      font-size: 9pt;
      opacity: 0.9;
      text-transform: uppercase;
    }
    .contact-section {
      background: ${COLORS.lightGray};
      padding: 14pt;
      border-radius: 8pt;
      margin-top: 16pt;
    }
    .contact-title {
      font-size: 11pt;
      font-weight: 700;
      color: ${COLORS.primary};
      margin-bottom: 8pt;
    }
    .contact-info {
      font-size: 10pt;
      line-height: 1.6;
    }
    .footer {
      position: absolute;
      bottom: 36pt;
      left: 36pt;
      right: 36pt;
      text-align: center;
      font-size: 9pt;
      color: ${COLORS.gray};
      padding-top: 12pt;
      border-top: 1pt solid ${COLORS.lightGray};
    }
    .hwh-logo {
      font-weight: 800;
      font-size: 16pt;
      color: ${COLORS.primary};
    }
    .sample-notice {
      background: ${COLORS.demoRed}15;
      border: 1pt solid ${COLORS.demoRed};
      color: ${COLORS.demoRed};
      padding: 8pt 12pt;
      border-radius: 6pt;
      font-size: 9pt;
      margin-bottom: 16pt;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="demo-watermark">DEMO</div>
  
  <div class="sample-notice">
    ⚠️ SAMPLE DOCUMENT - This is a demonstration of Elite GBB deliverables
  </div>
  
  <div class="header">
    <h1>${player.player_name || 'Demo Player'}</h1>
    <div class="subtitle">${player.primary_position || 'N/A'} | Class of ${player.grad_class || 'N/A'} | ${player.school || 'N/A'}</div>
    <div class="demo-badge">Sample Document</div>
  </div>

  <div class="section">
    <div class="section-title">Player Information</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Height</div>
        <div class="info-value">${player.height || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Weight</div>
        <div class="info-value">${player.weight ? player.weight + ' lbs' : 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Gender</div>
        <div class="info-value">${player.gender || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Location</div>
        <div class="info-value">${player.city || ''}, ${player.state || ''}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Sample Statistics</div>
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-value">${stats.ppg}</div>
        <div class="stat-label">PPG</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats.rpg}</div>
        <div class="stat-label">RPG</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats.apg}</div>
        <div class="stat-label">APG</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats.spg}</div>
        <div class="stat-label">SPG</div>
      </div>
    </div>
    <div style="margin-top: 10pt; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt;">
      <div class="stat-box" style="background: ${COLORS.secondary};">
        <div class="stat-value">${stats.fg}%</div>
        <div class="stat-label">FG%</div>
      </div>
      <div class="stat-box" style="background: ${COLORS.secondary};">
        <div class="stat-value">${stats.three}%</div>
        <div class="stat-label">3PT%</div>
      </div>
      <div class="stat-box" style="background: ${COLORS.secondary};">
        <div class="stat-value">${stats.ft}%</div>
        <div class="stat-label">FT%</div>
      </div>
    </div>
  </div>

  <div class="contact-section">
    <div class="contact-title">Sample Contact Information</div>
    <div class="contact-info">
      <strong>Parent/Guardian:</strong> ${player.parent_name || 'N/A'}<br>
      <strong>Email:</strong> ${player.parent_email || 'N/A'}<br>
      <strong>Phone:</strong> ${player.parent_phone || 'N/A'}<br>
      ${player.instagram_handle ? `<strong>Instagram:</strong> @${player.instagram_handle}<br>` : ''}
    </div>
  </div>

  <div class="footer">
    <div class="hwh-logo">ELITE GBB - SAMPLE DOCUMENT</div>
    <div>This is a demonstration document for marketing purposes only.</div>
    <div>Generated ${new Date().toLocaleDateString()} • Not an actual player profile</div>
  </div>
</body>
</html>`;
}

// Generate Demo Tracking Profile HTML
function generateDemoTrackingProfileHTML(player) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: ${COLORS.white};
      color: ${COLORS.black};
      width: 612pt;
      min-height: 792pt;
      padding: 36pt;
      position: relative;
    }
    .demo-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 72pt;
      font-weight: 800;
      color: ${COLORS.demoRed};
      opacity: 0.15;
      z-index: 1000;
      pointer-events: none;
      letter-spacing: 8pt;
    }
    .header {
      background: ${COLORS.primary};
      color: ${COLORS.white};
      padding: 20pt;
      border-radius: 10pt;
      margin-bottom: 16pt;
    }
    .header h1 {
      font-size: 22pt;
      font-weight: 800;
    }
    .sample-badge {
      background: ${COLORS.demoRed};
      color: ${COLORS.white};
      padding: 4pt 10pt;
      border-radius: 4pt;
      font-size: 9pt;
      font-weight: 700;
      display: inline-block;
      margin-top: 6pt;
    }
    .sample-notice {
      background: ${COLORS.demoRed}15;
      border: 1pt solid ${COLORS.demoRed};
      color: ${COLORS.demoRed};
      padding: 8pt 12pt;
      border-radius: 6pt;
      font-size: 9pt;
      margin-bottom: 16pt;
      text-align: center;
    }
    .timeline {
      border-left: 3pt solid ${COLORS.primary};
      padding-left: 16pt;
      margin: 16pt 0;
    }
    .timeline-item {
      position: relative;
      margin-bottom: 16pt;
      padding: 12pt;
      background: ${COLORS.lightGray};
      border-radius: 8pt;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -22pt;
      top: 14pt;
      width: 10pt;
      height: 10pt;
      background: ${COLORS.secondary};
      border-radius: 50%;
    }
    .stats-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0;
    }
    .stats-table th {
      background: ${COLORS.primary};
      color: ${COLORS.white};
      padding: 10pt;
      text-align: left;
      font-size: 10pt;
    }
    .stats-table td {
      padding: 10pt;
      border-bottom: 1pt solid ${COLORS.lightGray};
      font-size: 11pt;
    }
    .footer {
      margin-top: 24pt;
      padding-top: 12pt;
      border-top: 2pt solid ${COLORS.lightGray};
      text-align: center;
      font-size: 9pt;
      color: ${COLORS.gray};
    }
  </style>
</head>
<body>
  <div class="demo-watermark">DEMO</div>
  
  <div class="sample-notice">
    ⚠️ SAMPLE TRACKING PROFILE - For demonstration purposes only
  </div>

  <div class="header">
    <h1>Sample Tracking Profile: ${player.player_name}</h1>
    <div class="sample-badge">DEMO ID: ${player.player_key}</div>
  </div>

  <div class="timeline">
    <div class="timeline-item">
      <div style="font-size: 9pt; color: ${COLORS.gray};">Profile Created</div>
      <div style="font-size: 12pt; font-weight: 700; color: ${COLORS.primary};">Sample Timeline Entry</div>
      <div style="font-size: 10pt;">This demonstrates the tracking profile feature.</div>
    </div>
  </div>

  <h3 style="font-size: 14pt; color: ${COLORS.primary}; margin: 16pt 0 10pt;">Sample Performance Metrics</h3>
  <table class="stats-table">
    <tr>
      <th>Category</th>
      <th>Sample Value</th>
      <th>Target</th>
    </tr>
    <tr>
      <td>Points Per Game</td>
      <td>${player.ppg || 0}</td>
      <td>20+</td>
    </tr>
    <tr>
      <td>Rebounds Per Game</td>
      <td>${player.rpg || 0}</td>
      <td>8+</td>
    </tr>
  </table>

  <div class="footer">
    <strong>ELITE GBB - SAMPLE DOCUMENT</strong><br>
    Generated for demonstration purposes only • Not an actual player profile
  </div>
</body>
</html>`;
}

// Generate Demo Badge SVG with DEMO watermark
function generateDemoBadgeSVG(player) {
  const width = 400;
  const height = 400;
  const playerName = (player.player_name || 'Demo Player').toUpperCase();
  const year = player.grad_class || '2026';
  const position = player.primary_position || 'BASKETBALL';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0254ff;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.secondary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff8a4c;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>

  <!-- Background circle -->
  <circle cx="200" cy="200" r="190" fill="url(#primaryGradient)" filter="url(#shadow)"/>
  
  <!-- DEMO watermark -->
  <text x="200" y="200" font-family="Arial Black, sans-serif" font-size="48" font-weight="800" fill="${COLORS.demoRed}" text-anchor="middle" opacity="0.3" transform="rotate(-45, 200, 200)">DEMO</text>
  
  <!-- Top banner -->
  <path d="M 60 80 Q 200 40 340 80 L 340 120 Q 200 80 60 120 Z" fill="${COLORS.secondary}"/>
  <text x="200" y="108" font-family="Arial Black, sans-serif" font-size="24" font-weight="800" fill="${COLORS.white}" text-anchor="middle" letter-spacing="4">ELITE</text>
  
  <!-- Main content area -->
  <circle cx="200" cy="200" r="130" fill="${COLORS.white}"/>
  
  <!-- Basketball icon -->
  <g transform="translate(200, 155)">
    <circle cx="0" cy="0" r="35" fill="${COLORS.secondary}"/>
    <path d="M -35 0 Q 0 0 35 0" fill="none" stroke="${COLORS.black}" stroke-width="2"/>
    <path d="M 0 -35 Q 0 0 0 35" fill="none" stroke="${COLORS.black}" stroke-width="2"/>
  </g>
  
  <!-- GBB text -->
  <text x="200" y="195" font-family="Arial Black, sans-serif" font-size="16" font-weight="800" fill="${COLORS.primary}" text-anchor="middle">GBB</text>
  
  <!-- Player name -->
  <text x="200" y="235" font-family="Arial, sans-serif" font-size="${Math.max(12, 18 - playerName.length / 3)}" font-weight="700" fill="${COLORS.black}" text-anchor="middle" letter-spacing="1">
    ${playerName}
  </text>
  
  <!-- Divider line -->
  <line x1="100" y1="255" x2="300" y2="255" stroke="${COLORS.primary}" stroke-width="2"/>
  
  <!-- Position and Year -->
  <text x="200" y="280" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="${COLORS.gray}" text-anchor="middle">
    ${position} • CLASS OF ${year}
  </text>
  
  <!-- Demo badge -->
  <rect x="140" y="300" width="120" height="24" rx="12" fill="${COLORS.demoRed}"/>
  <text x="200" y="316" font-family="Arial, sans-serif" font-size="10" font-weight="700" fill="${COLORS.white}" text-anchor="middle">SAMPLE BADGE</text>
  
  <!-- Serial number -->
  <text x="200" y="375" font-family="monospace" font-size="9" fill="${COLORS.white}" text-anchor="middle" opacity="0.7">
    DEMO ID: ${player.player_key || 'DEMO-000'}
  </text>
</svg>`;
}

// Main request handler
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Parse path parameters
  const pathMatch = url.pathname.match(/\/demo-deliverables\/([^/]+)\/([^/]+)/);
  if (!pathMatch) {
    return new Response(
      JSON.stringify({ detail: 'Invalid URL format. Use: /api/admin/demo-deliverables/{type}/{sampleId}' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const [, type, sampleId] = pathMatch;

  // Validate deliverable type
  const validTypes = ['one-pager', 'tracking-profile', 'film-index', 'badge'];
  if (!validTypes.includes(type)) {
    return new Response(
      JSON.stringify({ detail: `Invalid type. Must be one of: ${validTypes.join(', ')}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Verify admin authentication
    const auth = await verifyAdminToken(request, env);
    if (!auth.valid) {
      return new Response(
        JSON.stringify({ detail: auth.error }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get sample player data
    const player = SAMPLE_PLAYERS[sampleId] || SAMPLE_PLAYERS['sample-1'];

    // Generate appropriate deliverable based on type
    let content;
    let contentType;
    let filename;

    switch (type) {
      case 'one-pager':
        content = generateDemoOnePagerHTML(player);
        contentType = 'text/html';
        filename = `Demo_OnePager_${sampleId}.html`;
        break;
      
      case 'tracking-profile':
        content = generateDemoTrackingProfileHTML(player);
        contentType = 'text/html';
        filename = `Demo_TrackingProfile_${sampleId}.html`;
        break;
      
      case 'film-index':
        // Film index uses the same format as tracking for demo
        content = generateDemoTrackingProfileHTML(player);
        contentType = 'text/html';
        filename = `Demo_FilmIndex_${sampleId}.html`;
        break;
      
      case 'badge':
        content = generateDemoBadgeSVG(player);
        contentType = 'image/svg+xml';
        filename = `Demo_Badge_${sampleId}.svg`;
        break;
    }

    // Return the generated content
    if (type === 'badge') {
      return new Response(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    } else {
      // For HTML documents, return with appropriate headers
      return new Response(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

  } catch (err) {
    return new Response(
      JSON.stringify({ detail: 'Error generating demo deliverable', error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// OPTIONS handler for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
