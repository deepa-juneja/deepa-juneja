const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function setText(slot, text) {
  const node = document.querySelector(`[data-slot="${slot}"]`);
  if (node) node.textContent = text;
}

function setHTML(slot, html) {
  const node = document.querySelector(`[data-slot="${slot}"]`);
  if (node) node.innerHTML = html;
}

function setAttr(slot, attr, value) {
  const node = document.querySelector(`[data-slot="${slot}"]`);
  if (node) node.setAttribute(attr, value);
}

function renderHero(p) {
  setHTML('lede', `BCA, MCA, and an MBA — and over a decade running classrooms and school operations. <em>I'm bringing that craft to corporate training, operations, and analytics.</em>`);
  setHTML('meta', `
    <span><b>Based in</b> ${esc(p.contact.location.split(',').slice(-3, -2)[0]?.trim() ?? 'Gurugram')}, IN</span>
    <span><b>Open to</b> Hybrid · Remote · NCR onsite</span>
    <span><b>Languages</b> ${p.languages.map(esc).join(' · ')}</span>
  `);
  setHTML('portrait', ``); // photo wired in Task 18
}

function renderAbout(p) {
  setText('pull-quote', p.pull_quote);
  setHTML('about-paragraphs', p.about.map(par => `<p>${esc(par)}</p>`).join(''));
}

function renderExperience(p) {
  setHTML('experience', p.experience.map((x, i) => {
    const num = String(i + 1).padStart(2, '0');
    const dates = formatDateRange(x.start, x.end);
    const orgLine = `${esc(x.organization)}${x.location ? ', ' + esc(x.location) : ''}`;
    return `
      <div class="xp">
        <span class="num">${num}</span>
        <div class="role-name">${esc(x.title)} <span class="org">— ${orgLine}</span></div>
        <span class="yrs">${dates}</span>
      </div>`;
  }).join(''));
}

function renderEducation(p) {
  const visible = p.education.filter(e => !['xii', 'x'].includes(e.id));
  setHTML('education', visible.map(e => `
    <div class="edu-item">
      <div class="deg">${esc(e.degree)} <span class="where">${esc(e.institution)}</span></div>
      <div class="meta"><b>${esc(e.score)}</b>${esc(e.start)} – ${esc(e.end)}</div>
    </div>`).join(''));
}

function renderCertifications(p) {
  setHTML('certifications', p.certifications.map((c, i) => {
    const roman = toRoman(i + 1);
    const tag = c.status === 'in-progress' ? `${esc(c.issuer)} · in progress` : esc(c.issuer);
    return `
      <div class="cert-item">
        <span class="ci">${roman}.</span>
        <span class="cname">${esc(c.name)}</span>
        <span class="ciss">${tag}</span>
      </div>`;
  }).join(''));
}

function renderCareer(p) {
  setHTML('career', p.career_chapters.map(c => `
    <div class="j-row">
      <div class="year">${formatJourneyYear(c.year)}</div>
      <div>
        <h3>${esc(c.title)} <span class="org">${esc(c.org)}</span></h3>
        <p>${esc(c.body)}</p>
      </div>
    </div>`).join(''));
}

function renderSkills(p) {
  const groups = [
    { title: 'Office & productivity', key: 'office_productivity', accent: false },
    { title: 'Operations & people',  key: 'operations_people',  accent: true  },
    { title: 'Technical & AI',       key: 'technical_ai',       accent: false }
  ];
  setHTML('skills', groups.map(g => `
    <div class="skill-col">
      <h5>${esc(g.title)}</h5>
      <div class="chips">
        ${(p.skills[g.key] ?? []).map(s => `<span class="chip${g.accent ? ' accent' : ''}">${esc(s)}</span>`).join('')}
      </div>
    </div>`).join(''));
}

function renderFooter(p) {
  const email = document.querySelector('[data-slot="footer-email"]');
  if (email) { email.textContent = p.contact.email; email.href = `mailto:${p.contact.email}`; }
  const phone = document.querySelector('[data-slot="footer-phone"]');
  if (phone) { phone.textContent = p.contact.phone; phone.href = `tel:${p.contact.phone.replace(/\s|-/g,'')}`; }
  const loc = document.querySelector('[data-slot="footer-location"]');
  if (loc) loc.innerHTML = esc(p.contact.location);
  const li = document.querySelector('[data-slot="footer-linkedin"]');
  if (li) li.href = p.contact.linkedin;
}

function formatDateRange(start, end) {
  const fmt = (s) => {
    if (s === 'present') return 'Present';
    if (/^\d{4}-\d{2}$/.test(s)) {
      const [y, m] = s.split('-');
      const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1];
      return `${month} ${y}`;
    }
    return s;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatJourneyYear(y) {
  // Allow simple strings like "2023→ now", "2014–16", "Apr–Dec 2023"
  return esc(y).replace(/(→.+|–[\w\s]+)$/, '<em>$1</em>');
}

function toRoman(n) {
  const map = [['x',10],['ix',9],['v',5],['iv',4],['i',1]];
  let out = '';
  for (const [r, v] of map) while (n >= v) { out += r; n -= v; }
  return out;
}

async function load() {
  try {
    const res = await fetch('data/profile.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const profile = await res.json();
    renderHero(profile);
    renderAbout(profile);
    renderExperience(profile);
    renderEducation(profile);
    renderCertifications(profile);
    renderCareer(profile);
    renderSkills(profile);
    renderFooter(profile);
  } catch (err) {
    console.error('Failed to load profile.json:', err);
    document.body.insertAdjacentHTML('afterbegin',
      `<pre style="padding:20px;background:#fee;color:#900;">Failed to load portfolio data: ${esc(err.message)}</pre>`);
  }
}

load();
