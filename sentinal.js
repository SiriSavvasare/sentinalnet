// ─── MULTI-PAGE VIEW SWITCHER ─────────────────────────────
function switchPage(pageId, tabElement) {
  document.querySelectorAll('.page-view').forEach(p => p.style.display = 'none');
  document.getElementById(pageId).style.display = pageId === 'consolePage' ? 'flex' : 'block';

  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  if (tabElement) tabElement.classList.add('active');

  if (pageId === 'consolePage') {
    renderSignals();
  }
}

// ─── GENIE PAGE QUERY HANDLER ─────────────────────────────
function runGeniePageQuery(queryText) {
  const input = document.getElementById('genieInputFull');
  const q = queryText || input.value;
  if (!q) return;
  input.value = q;

  const sqlBox = document.getElementById('sqlPreview');
  const sqlCode = document.getElementById('sqlCode');
  const tableWrap = document.getElementById('genieTableWrap');
  const tableBody = document.getElementById('genieTableBody');

  let results = mockPosts.map(p => {
    const { scores } = computeScore(p);
    return { ...p, riskScore: scores.total };
  });

  const lower = q.toLowerCase();
  if (lower.includes('> 80') || lower.includes('80') || lower.includes('high')) {
    results = results.filter(p => p.riskScore >= 70);
    sqlCode.textContent = "SELECT alert_id, title, channel, contact, risk_score, precedent_status FROM delta_lakehouse.threat_telemetry WHERE risk_score >= 70 ORDER BY risk_score DESC;";
  } else if (lower.includes('low') || lower.includes('safe') || lower.includes('verified')) {
    results = results.filter(p => p.riskScore < 35);
    sqlCode.textContent = "SELECT * FROM delta_lakehouse.threat_telemetry WHERE risk_score < 35 AND institutional_verified = true;";
  } else {
    sqlCode.textContent = "SELECT * FROM delta_lakehouse.threat_telemetry WHERE post_text LIKE '%crypto%' OR post_text LIKE '%fee%' ORDER BY timestamp DESC;";
  }

  sqlBox.style.display = 'block';
  tableWrap.style.display = 'block';

  tableBody.innerHTML = results.map(p => {
    const color = p.riskScore > 70 ? 'var(--red)' : p.riskScore > 35 ? 'var(--amber)' : 'var(--neon-lime)';
    const statusText = p.riskScore > 70 ? 'MATCHED 4 TAKEDOWNS' : p.riskScore > 35 ? 'UNVERIFIED ENTITY' : 'VERIFIED INSTITUTION';
    
    return `
      <tr>
        <td style="font-weight:600;">${p.title.substring(0, 40)}...</td>
        <td class="mono">${p.source}</td>
        <td class="mono" style="color:var(--cyan);">${p.contact}</td>
        <td class="mono" style="color:${color};font-weight:700;">${p.riskScore}/100</td>
        <td><span class="risk-badge ${p.riskScore>70?'risk-high':p.riskScore>35?'risk-medium':'risk-low'}">${statusText}</span></td>
        <td><button onclick="switchPage('consolePage', document.querySelectorAll('.nav-tab')[1]); selectSignal(${p.id});" style="background:transparent; border:1px solid var(--border); color:var(--neon-lime); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px;">View Telemetry</button></td>
      </tr>
    `;
  }).join('');
}

function genieFullChip(el) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  runGeniePageQuery(el.textContent);
}