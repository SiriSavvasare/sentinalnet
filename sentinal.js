// ─── MOCK DATA ────────────────────────────────────────────
const sharedPhone = '+1-555-0142';
const sharedHandle = '@quickcashhr';

const mockPosts = [
  {
    id:1, source:'Craigslist', time:'2 min ago', 
    title:'$35/hr Campus Data Entry — Start TODAY, No Experience Needed!',
    text:'Immediate start! We need data entry clerks urgently. No paperwork required, no background check. Send deposit of $50 via Venmo to secure your spot. Contact via Telegram only: @quickcashhr. Must start within 24 hours — limited slots! Pay: $35/hour cash, direct deposit available after first week.',
    contact: sharedHandle, 
    flags: ['urgency','no_paperwork','deposit','telegram_only','unrealistic_pay']
  },
  {
    id:2, source:'Handshake', time:'5 min ago',
    title:'Summer Software Engineering Intern — Google DeepMind',
    text:'Google is seeking motivated CS students for a 12-week paid summer internship working on cutting-edge AI research. Competitive compensation, relocation assistance, and mentorship from senior engineers. Apply through the official Google careers portal. Requires current enrollment in accredited university program.',
    contact:'careers@google.com',
    flags: ['legit']
  },
  {
    id:3, source:'Indeed', time:'8 min ago',
    title:'Part-Time Social Media Manager — Flexible Hours',
    text:'Looking for a student to manage our social media accounts 15-20 hours/week. $22/hr, paid bi-weekly via direct deposit. Must have own laptop. Send resume to hr@mediapro.co. We are a registered LLC based in Austin, TX. Position starts after campus career fair.',
    contact:'hr@mediapro.co',
    flags: ['legit','minor_concern']
  },
  {
    id:4, source:'Facebook', time:'12 min ago',
    title:'URGENT: $500/day Mystery Shopper — Cash Advance Provided!',
    text:'No experience necessary! We send you a check, you deposit it, keep $500 and send the rest via Western Union. First assignment available TODAY. No paperwork needed. Pay in crypto or gift cards if preferred. WhatsApp: +1-555-0142. Limited time offer — act now!',
    contact: sharedPhone,
    flags: ['urgency','no_paperwork','upfront_money','crypto','giftcard','unrealistic_pay','shared_contact']
  },
  {
    id:5, source:'University Portal', time:'15 min ago',
    title:'Undergraduate Research Assistant — Organic Chemistry Lab',
    text:'Dr. Martinez seeks 2 undergrad RAs for Spring semester. 10 hrs/week, $15/hr. Must be enrolled in CHEM 201 or above. Submit application through university research portal. Preference for juniors pursuing graduate school. Funded by NSF grant.',
    contact:'martinez@university.edu',
    flags: ['legit','university_verified']
  },
  {
    id:6, source:'Craigslist', time:'18 min ago',
    title:'Remote Customer Service — $28/hr, Work From Anywhere',
    text:'We are hiring remote customer service reps. No phone calls, just text chat. $28/hr guaranteed minimum. Send $75 training fee via CashApp ($QuickCashHR) to receive training materials and login credentials. Start earning within 48 hours. Contact @quickcashhr on Telegram.',
    contact: sharedHandle,
    flags: ['deposit','telegram_only','shared_contact','cashapp']
  },
  {
    id:7, source:'Handshake', time:'22 min ago',
    title:'Campus Career Fair — 50+ Employers This Thursday',
    text:'Join us this Thursday 10am-3pm in the Student Union ballroom. Companies attending include Microsoft, Goldman Sachs, Lockheed Martin, local startups, and government agencies. Bring printed resumes. Professional attire recommended. Free for all enrolled students.',
    contact:'career-services@university.edu',
    flags: ['legit','university_verified']
  },
  {
    id:8, source:'Twitter/X', time:'25 min ago',
    title:'NFT Artist Collaborator Wanted — 50% Revenue Share',
    text:'Building a new NFT collection and need graphic designers. No upfront cost to you! You create art, we mint and sell, you get 50% of all sales. Revenue paid in ETH. Must join our Discord. Several artists have already earned $10K+. DM @quickcashhr for details.',
    contact: sharedHandle,
    flags: ['crypto','shared_contact','scarcity']
  },
  {
    id:9, source:'Indeed', time:'30 min ago',
    title:'Library Shelving Assistant — On Campus',
    text:'The main library is hiring student shelvers for 12-15 hours/week at $13/hr. Must be available for at least one evening shift. Apply through campus HR system. Federal Work-Study eligible. Positions available for spring semester.',
    contact:'library-jobs@university.edu',
    flags: ['legit','university_verified']
  },
  {
    id:10, source:'Craigslist', time:'35 min ago',
    title:'Financial Freedom Program — Earn $5K/Month Passive Income',
    text:'Learn our proven system for generating passive income online! $200 registration fee covers all training materials. You will learn dropshipping, affiliate marketing, and crypto trading. WhatsApp for info: +1-555-0142. Only 5 spots remaining this month. "No risk" 30-day money back guarantee.',
    contact: sharedPhone,
    flags: ['deposit','scarcity','crypto','shared_contact','mlm_signals']
  }
];

// ─── SCORING ENGINE ───────────────────────────────────────
const linguisticPatterns = [
  {pattern:/(urgent|immediately|act now|limited time|start today|within 24)/i, points:12, label:'Urgency pressure language'},
  {pattern:/(no paperwork|no background check|no experience necessary)/i, points:10, label:'No verification required'},
  {pattern:/(deposit|registration fee|training fee|send.*\$)/i, points:15, label:'Requests upfront payment'},
  {pattern:/(telegram|whatsapp|only|no email)/i, points:8, label:'Off-platform contact only'},
  {pattern:/(crypto|bitcoin|eth|gift card|cashapp|venmo|western union)/i, points:10, label:'Non-standard payment methods'},
  {pattern:/(\$\d{2,3}\/hr|\$\d{3,4}\/day|\$\d{4,5}\/month)/i, points:8, label:'Unrealistic compensation'},
  {pattern:/(no risk|guaranteed|proven system|passive income)/i, points:6, label:'Guaranteed income claims'},
  {pattern:/(limited spots|only \d+ spots|act fast)/i, points:5, label:'Artificial scarcity tactics'},
  {pattern:/(dropship|affiliate|nft)/i, points:4, label:'High-risk business model'},
  {pattern:/(mlm|multi.level|network marketing)/i, points:8, label:'MLM/Pyramid indicators'}
];

const legitPatterns = [
  {pattern:/(university|campus|career|portal|enrolled|student)/i, points:-3, label:'Academic context'},
  {pattern:/(apply through|official|registered|llc|nsf grant)/i, points:-4, label:'Verified channels'},
  {pattern:/(bi.weekly|direct deposit|federal work.study)/i, points:-3, label:'Standard payment practices'}
];

function computeScore(post) {
  let linguistic = 0;
  const explanations = [];
  
  // Linguistic scan
  for (const p of linguisticPatterns) {
    if (p.pattern.test(post.text)) {
      linguistic = Math.min(30, linguistic + p.points);
      explanations.push({type:'negative', icon:'▲', text:`+${p.points} ${p.label}`});
    }
  }
  for (const p of legitPatterns) {
    if (p.pattern.test(post.text)) {
      linguistic = Math.max(0, linguistic + p.points);
      if (p.points < 0) explanations.push({type:'positive', icon:'▼', text:`${p.points} ${p.label}`});
    }
  }
  
  // Relational Graph (shared contacts)
  let relational = 0;
  const contactCount = mockPosts.filter(p => p.contact === post.contact).length;
  if (contactCount > 1) {
    relational = Math.min(25, contactCount * 8 + 5);
    explanations.push({type:'negative', icon:'▲', text:`+${relational} Contact reused across ${contactCount} postings`});
  } else {
    relational = 2;
    explanations.push({type:'positive', icon:'▼', text:'-2 Unique contact identifier'});
  }
  
  // Posting Velocity
  let velocity = 0;
  const timeIdx = ['2 min','5 min','8 min','12 min','15 min','18 min','22 min','25 min','30 min','35 min'];
  const idx = timeIdx.indexOf(post.time.replace(' ago',''));
  if (idx <= 2) { velocity = 18; explanations.push({type:'negative', icon:'▲', text:'+18 Extremely recent posting velocity'}); }
  else if (idx <= 4) { velocity = 12; explanations.push({type:'negative', icon:'▲', text:'+12 High posting frequency'}); }
  else if (idx <= 7) { velocity = 7; explanations.push({type:'neutral', icon:'—', text:'+7 Moderate posting velocity'}); }
  else { velocity = 3; explanations.push({type:'positive', icon:'▼', text:'+3 Normal posting velocity'}); }
  
  // Historical Precedent
  let precedent = 0;
  const flags = post.flags;
  if (flags.includes('shared_contact')) { precedent = 14; explanations.push({type:'negative', icon:'▲', text:'+14 Matched known scam pattern from Genie database'}); }
  else if (flags.includes('university_verified')) { precedent = 2; explanations.push({type:'positive', icon:'▼', text:'+2 Verified institutional posting'}); }
  else { precedent = 5; explanations.push({type:'neutral', icon:'—', text:'+5 No strong precedent match'}); }
  
  // Geographic Mismatch
  let geo = 0;
  if (flags.includes('crypto') || flags.includes('giftcard') || flags.includes('telegram_only')) {
    geo = 9; explanations.push({type:'negative', icon:'▲', text:'+9 Geographic markers inconsistent with campus location'});
  } else if (flags.includes('university_verified')) {
    geo = 1; explanations.push({type:'positive', icon:'▼', text:'+1 Confirmed campus address'});
  } else {
    geo = 4; explanations.push({type:'neutral', icon:'—', text:'+4 Neutral geographic signals'});
  }
  
  const total = Math.min(100, linguistic + relational + velocity + precedent + geo);
  const scores = {linguistic, relational, velocity, precedent, geo, total};
  
  return {scores, explanations};
}

// ─── APP STATE ────────────────────────────────────────────
let activeId = null;
let isAnimating = false;

// ─── RENDER SIGNALS ───────────────────────────────────────
function renderSignals() {
  const list = document.getElementById('signalsList');
  list.innerHTML = mockPosts.map(p => `
    <div class="signal-card ${activeId===p.id?'active':''}" onclick="selectSignal(${p.id})" id="card-${p.id}">
      <div class="signal-meta">
        <span class="signal-source">${p.source}</span>
        <span class="signal-time">${p.time}</span>
      </div>
      <div class="signal-title">${p.title}</div>
      <div class="signal-snippet">${p.text}</div>
      <div class="signal-footer">
        <span class="risk-badge risk-queued" id="badge-${p.id}">QUEUED</span>
      </div>
    </div>
  `).join('');
  document.getElementById('signalCount').textContent = mockPosts.length;
}

// ─── PIPELINE ANIMATION ──────────────────────────────────
async function animatePipeline() {
  const nodes = ['n1','n2','n3','n4','n5'];
  const labels = ['l1','l2','l3','l4','l5'];
  const connectors = ['c1','c2','c3','c4'];
  const names = ['Ingestion','Multi-Agent Matrix','Genie Precedent Loop','Risk Fusion','Command UI'];
  
  // Reset
  nodes.forEach(n => { document.getElementById(n).className = 'node-circle'; });
  labels.forEach((l,i) => { document.getElementById(l).className = 'node-label'; document.getElementById(l).textContent = names[i]; });
  connectors.forEach(c => { document.getElementById(c).className = 'pipeline-connector'; });
  
  for (let i = 0; i < nodes.length; i++) {
    document.getElementById(nodes[i]).classList.add('active');
    document.getElementById(labels[i]).classList.add('active');
    if (i < nodes.length - 1) await delay(350);
    document.getElementById(nodes[i]).classList.remove('active');
    document.getElementById(nodes[i]).classList.add('complete');
    document.getElementById(labels[i]).classList.remove('active');
    document.getElementById(labels[i]).classList.add('complete');
    if (i < connectors.length) {
      document.getElementById(connectors[i]).classList.add('complete');
    }
    if (i < nodes.length - 1) await delay(100);
  }
  await delay(200);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── SELECT SIGNAL ────────────────────────────────────────
async function selectSignal(id) {
  if (isAnimating) return;
  isAnimating = true;
  activeId = id;
  const post = mockPosts.find(p => p.id === id);
  
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('activeView').style.display = 'block';
  document.getElementById('resultsPanel').style.display = 'none';
  
  renderSignals();
  
  // Animate pipeline
  await animatePipeline();
  
  // Compute score
  const {scores, explanations} = computeScore(post);
  
  // Update badge
  const badge = document.getElementById(`badge-${id}`);
  let tier, tierClass, tierLabel;
  if (scores.total < 40) { tier = 'teal'; tierClass = 'risk-low'; tierLabel = 'LOW'; }
  else if (scores.total < 75) { tier = 'amber'; tierClass = 'risk-medium'; tierLabel = 'MEDIUM'; }
  else { tier = 'red'; tierClass = 'risk-high'; tierLabel = 'HIGH'; }
  badge.className = 'risk-badge ' + tierClass;
  badge.textContent = tierLabel;
  
  // Show results
  document.getElementById('resultsPanel').style.display = 'block';
  animateDial(scores.total, tier);
  renderSubscores(scores);
  renderExplanations(explanations, scores, tier);
  
  isAnimating = false;
}

// ─── DIAL ANIMATION ───────────────────────────────────────
function animateDial(score, tier) {
  const fill = document.getElementById('dialFill');
  const number = document.getElementById('dialNumber');
  const circumference = 2 * Math.PI * 60;
  
  const colors = {teal:'#33C7B0', amber:'#E8A23D', red:'#E4584B'};
  fill.style.stroke = colors[tier];
  
  // Animate offset
  fill.style.transition = 'none';
  fill.setAttribute('stroke-dashoffset', circumference);
  number.textContent = '0';
  
  requestAnimationFrame(() => {
    fill.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
    const offset = circumference - (score / 100) * circumference;
    fill.setAttribute('stroke-dashoffset', offset);
    
    // Animate number
    let current = 0;
    const step = score / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= score) { current = score; clearInterval(timer); }
      number.textContent = Math.round(current);
    }, 30);
  });
}

// ─── SUBSCORES ────────────────────────────────────────────
function renderSubscores(scores) {
  const bars = [
    {name:'Semantic Linguistic Intent', value:scores.linguistic, max:30, weight:'30%'},
    {name:'Relational Graph Clustering', value:scores.relational, max:25, weight:'25%'},
    {name:'Posting Velocity', value:scores.velocity, max:20, weight:'20%'},
    {name:'Genie Historical Precedent', value:scores.precedent, max:15, weight:'15%'},
    {name:'Geographic Mismatch', value:scores.geo, max:10, weight:'10%'}
  ];
  
  const container = document.getElementById('subscores');
  container.innerHTML = bars.map(b => {
    const pct = (b.value / b.max) * 100;
    let color;
    if (b.name === 'Semantic Linguistic Intent') color = 'var(--amber)';
    else if (b.name === 'Relational Graph Clustering') color = 'var(--red)';
    else if (b.name === 'Posting Velocity') color = 'var(--blue)';
    else if (b.name === 'Genie Historical Precedent') color = 'var(--teal)';
    else color = '#9B72CF';
    
    return `
      <div class="subscore">
        <div class="subscore-header">
          <span class="subscore-name">${b.name} <span style="color:var(--text-dim);font-size:10px">(${b.weight})</span></span>
          <span class="subscore-value mono">${b.value}/${b.max}</span>
        </div>
        <div class="subscore-bar">
          <div class="subscore-fill" style="width:0%;background:${color}"></div>
        </div>
      </div>
    `;
  }).join('');
  
  // Animate bars
  requestAnimationFrame(() => {
    setTimeout(() => {
      container.querySelectorAll('.subscore-fill').forEach((el, i) => {
        el.style.width = (bars[i].value / bars[i].max * 100) + '%';
      });
    }, 100);
  });
}

// ─── EXPLANATIONS ─────────────────────────────────────────
function renderExplanations(explanations, scores, tier) {
  const list = document.getElementById('explainList');
  const sorted = [...explanations].sort((a,b) => {
    const order = {negative:0, neutral:1, positive:2};
    return order[a.type] - order[b.type];
  });
  
  list.innerHTML = sorted.map(e => `
    <div class="explain-item explain-${e.type}">
      <div class="explain-icon">${e.icon}</div>
      <div>${e.text}</div>
    </div>
  `).join('');
  
  // Verdict
  const verdictBox = document.getElementById('verdictBox');
  const verdictText = document.getElementById('verdictText');
  verdictBox.style.display = 'block';
  
  let verdict, verdictColor;
  if (tier === 'red') {
    verdict = '⛔ HIGH RISK — Strong indicators of scam. Block and flag for campus security review.';
    verdictColor = 'var(--red)';
  } else if (tier === 'amber') {
    verdict = '⚠ MEDIUM RISK — Suspicious patterns detected. Manual review recommended before engagement.';
    verdictColor = 'var(--amber)';
  } else {
    verdict = '✓ LOW RISK — Posting appears legitimate. Safe to engage with standard precautions.';
    verdictColor = 'var(--teal)';
  }
  verdictText.textContent = verdict;
  verdictText.style.color = verdictColor;
  verdictText.style.background = tier==='red'?'var(--red-bg)':tier==='amber'?'var(--amber-bg)':'var(--teal-bg)';
  verdictText.style.padding = '12px';
  verdictText.style.borderRadius = '8px';
  verdictText.style.fontSize = '12px';
}

// ─── GENIE QUERY ──────────────────────────────────────────
function runGenieQuery(query) {
  const q = query || document.getElementById('genieInput').value;
  if (!q) return;
  document.getElementById('genieInput').value = q;
  
  let results = mockPosts.map(p => {
    const {scores} = computeScore(p);
    return {...p, riskScore: scores.total};
  });
  
  const lower = q.toLowerCase();
  
  if (lower.includes('risk') && (lower.includes('>') || lower.includes('above') || lower.includes('high'))) {
    const threshold = lower.includes('80') ? 80 : lower.includes('50') ? 50 : lower.includes('30') ? 30 : 75;
    results = results.filter(p => p.riskScore > threshold);
  } else if (lower.includes('low') || lower.includes('safe') || lower.includes('legitimate') || lower.includes('verified')) {
    results = results.filter(p => p.riskScore < 30);
  } else if (lower.includes('crypto') || lower.includes('gift card')) {
    results = results.filter(p => p.text.toLowerCase().includes('crypto') || p.text.toLowerCase().includes('gift'));
  } else if (lower.includes('compare') || lower.includes('average') || lower.includes('source')) {
    // Show all grouped by source
  }
  
  results.sort((a,b) => b.riskScore - a.riskScore);
  renderResultsTable(results);
}

function genieChip(el) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  runGenieQuery(el.textContent);
}

function renderResultsTable(results) {
  const wrap = document.getElementById('tableWrap');
  const body = document.getElementById('tableBody');
  wrap.style.display = 'block';
  
  body.innerHTML = results.map(p => {
    let color, label;
    if (p.riskScore < 40) { color='var(--teal)'; label='Low'; }
    else if (p.riskScore < 75) { color='var(--amber)'; label='Medium'; }
    else { color='var(--red)'; label='High'; }
    const badge = document.getElementById(`badge-${p.id}`);
    const status = badge ? badge.textContent : 'QUEUED';
    
    return `<tr onclick="selectSignal(${p.id})">
      <td>${p.title.substring(0,45)}${p.title.length>45?'…':''}</td>
      <td>${p.source}</td>
      <td class="score-cell" style="color:${color}">${p.riskScore}</td>
      <td><span class="risk-badge ${p.riskScore<40?'risk-low':p.riskScore<75?'risk-medium':'risk-high'}">${label}</span></td>
    </tr>`;
  }).join('');
}

// ─── CLOCK ────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// ─── INIT ─────────────────────────────────────────────────
renderSignals();
