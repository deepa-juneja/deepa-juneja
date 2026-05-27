const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

const VALID = new Set(['general','training-ld','edtech-counselor','data-analyst','hr-operations','school-coordinator']);

function getRoleKey() {
  const k = new URLSearchParams(location.search).get('role');
  return VALID.has(k) ? k : 'general';
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

function applyOverlay(profile, overlay) {
  // experience
  let experience;
  if (overlay.include_experience === 'all') {
    experience = profile.experience.slice();
  } else {
    const map = new Map(profile.experience.map(x => [x.id, x]));
    experience = overlay.include_experience
      .map(id => map.get(id))
      .filter(Boolean);
  }
  experience = experience.map(x => {
    const ov = overlay.experience_overrides?.[x.id];
    return ov ? { ...x, highlights: ov.highlights ?? x.highlights } : x;
  });

  // skills
  let skills;
  if (overlay.emphasized_skills === 'all') {
    skills = [
      ...(profile.skills.office_productivity ?? []),
      ...(profile.skills.operations_people ?? []),
      ...(profile.skills.technical_ai ?? [])
    ];
  } else {
    skills = overlay.emphasized_skills.slice();
  }

  // certifications
  let certs;
  if (overlay.include_certifications === 'all') {
    certs = profile.certifications.slice();
  } else {
    const map = new Map(profile.certifications.map(c => [c.id, c]));
    certs = overlay.include_certifications.map(id => map.get(id)).filter(Boolean);
  }

  return { experience, skills, certs };
}

function render(profile, overlay) {
  document.title = `Deepa Juneja — ${overlay.role_title} Resume`;
  setAttr('meta-keywords', 'content', (overlay.keywords ?? []).join(', '));
  setText('role-tag', `Resume · ${overlay.role_title}`);

  setHTML('contact', [
    `<span>${esc(profile.contact.email)}</span>`,
    `<span>${esc(profile.contact.phone)}</span>`,
    `<span>${esc(profile.contact.location)}</span>`
  ].join(''));

  setText('summary', overlay.summary);

  const { experience, skills, certs } = applyOverlay(profile, overlay);

  setHTML('experience', experience.map(x => `
    <div class="job">
      <div class="job-head">
        <div class="left">${esc(x.title)}, <span class="org">${esc(x.organization)}</span></div>
        <div class="right">${formatDateRange(x.start, x.end)}</div>
      </div>
      ${x.location ? `<div class="where">${esc(x.location)}</div>` : ''}
      <ul>${(x.highlights ?? []).map(h => `<li>${esc(h)}</li>`).join('')}</ul>
    </div>`).join(''));

  const visibleEdu = profile.education.filter(e => !['xii','x'].includes(e.id));
  setHTML('education', visibleEdu.map(e => `
    <div class="edu-item">
      <div class="deg">${esc(e.degree)} <span class="inst">— ${esc(e.institution)}</span>${e.score ? ` <span class="score">(${esc(e.score)})</span>` : ''}</div>
      <div class="yrs">${esc(e.start)} – ${esc(e.end)}</div>
    </div>`).join(''));

  setHTML('skills', skills.map(s => `<p>${esc(s)}</p>`).join(''));

  setHTML('certifications', certs.map(c => {
    const tag = c.status === 'in-progress' ? ' (in progress)' : '';
    return `<li>${esc(c.name)} — ${esc(c.issuer)}${tag}</li>`;
  }).join(''));
}

async function load() {
  const role = getRoleKey();
  try {
    const [p, o] = await Promise.all([
      fetch('data/profile.json', { cache: 'no-store' }).then(r => r.json()),
      fetch(`data/roles/${role}.json`, { cache: 'no-store' }).then(r => r.json())
    ]);
    render(p, o);
  } catch (err) {
    console.error('Failed to render resume:', err);
    document.querySelector('.page-wrap').innerHTML = `<p style="color:#900;">Failed to load resume data: ${esc(err.message)}</p>`;
  }
}

load();
