const VARIANTS = {
  'training-ld':        'Training & L&D',
  'edtech-counselor':   'EdTech Counsellor',
  'data-analyst':       'Data / MIS Analyst',
  'hr-operations':      'HR / Operations',
  'school-coordinator': 'School Coordinator',
};

const ROLES = [
  // HR / Operations
  { name: 'HR Coordinator',                v: 'hr-operations' },
  { name: 'HR Executive',                  v: 'hr-operations' },
  { name: 'HR Generalist',                 v: 'hr-operations' },
  { name: 'HR Assistant / Associate',      v: 'hr-operations' },
  { name: 'Operations Coordinator',        v: 'hr-operations' },
  { name: 'Operations Executive',          v: 'hr-operations' },
  { name: 'Office Coordinator',            v: 'hr-operations' },
  { name: 'Admin Coordinator',             v: 'hr-operations' },
  { name: 'Recruiting Coordinator',        v: 'hr-operations' },
  { name: 'People Operations Associate',   v: 'hr-operations' },

  // Training & L&D
  { name: 'Training Coordinator',          v: 'training-ld' },
  { name: 'L&D Coordinator',               v: 'training-ld' },
  { name: 'Learning & Development Executive', v: 'training-ld' },
  { name: 'Corporate Trainer',             v: 'training-ld' },
  { name: 'Process Trainer (BPO / KPO)',   v: 'training-ld' },
  { name: 'Training Specialist',           v: 'training-ld' },
  { name: 'Soft Skills Trainer',           v: 'training-ld' },
  { name: 'Onboarding Specialist',         v: 'training-ld' },
  { name: 'Instructional Designer',        v: 'training-ld' },
  { name: 'IT Training Coordinator',       v: 'training-ld' },

  // Data / MIS / BA
  { name: 'Data Analyst (Junior)',         v: 'data-analyst' },
  { name: 'MIS Executive',                 v: 'data-analyst' },
  { name: 'MIS Analyst',                   v: 'data-analyst' },
  { name: 'Reporting Analyst',             v: 'data-analyst' },
  { name: 'Business Analyst (Junior)',     v: 'data-analyst' },
  { name: 'Excel / Power BI Analyst',      v: 'data-analyst' },
  { name: 'Operations Analyst',            v: 'data-analyst' },

  // EdTech
  { name: 'Academic Counsellor',           v: 'edtech-counselor' },
  { name: 'Admissions Counsellor',         v: 'edtech-counselor' },
  { name: 'Education Counsellor',          v: 'edtech-counselor' },
  { name: 'EdTech Coordinator',            v: 'edtech-counselor' },
  { name: 'Programme Coordinator',         v: 'edtech-counselor' },
  { name: 'Career Counsellor',             v: 'edtech-counselor' },
  { name: 'Student Success Associate',     v: 'edtech-counselor' },

  // School Coordinator
  { name: 'School Coordinator',            v: 'school-coordinator' },
  { name: 'Academic Coordinator',          v: 'school-coordinator' },
  { name: 'Faculty Coordinator',           v: 'school-coordinator' },
  { name: 'Activity Head',                 v: 'school-coordinator' },
  { name: 'Science Faculty / Teacher',     v: 'school-coordinator' },
  { name: 'Headmistress / Vice Principal', v: 'school-coordinator' },
];

const MODAL_HTML = `
<div class="modal-backdrop" id="rolePicker" role="dialog" aria-modal="true" aria-labelledby="rpTitle" hidden>
  <div class="modal" role="document">
    <button class="modal-close" data-close-picker aria-label="Close" type="button">×</button>

    <div class="modal-primary">
      <div class="kicker">§ The Resume Desk</div>
      <button class="modal-default" data-variant="general" type="button">
        <div class="md-text">
          <div class="md-title">Download my complete resume</div>
          <div class="md-sub">All experience and skills, in one place.</div>
        </div>
        <span class="md-arr">↓</span>
      </button>
    </div>

    <div class="modal-divider"><span>Or pick a specific role</span></div>

    <div class="modal-sub-head">
      <h3 id="rpTitle">Which role are you <em>recruiting for?</em></h3>
      <p>I'd happily send a focused version that leads with the most relevant experience.</p>
    </div>
    <div class="modal-search">
      <span class="icon">⌕</span>
      <input id="rpSearch" type="text" autocomplete="off" spellcheck="false" placeholder="e.g. HR Coordinator, MIS Analyst, Process Trainer…">
    </div>
    <div class="modal-list" id="rpList" role="listbox" aria-label="Matching roles"></div>
    <div class="modal-foot">
      <span><kbd>↑</kbd><kbd>↓</kbd> move &nbsp;·&nbsp; <kbd>↵</kbd> select &nbsp;·&nbsp; <kbd>Esc</kbd> close</span>
      <span>Tailored versions available</span>
    </div>
  </div>
</div>
`;

function escHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function highlight(text, q) {
  if (!q) return escHtml(text);
  const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(' + escapedQ + ')', 'ig');
  return escHtml(text).replace(re, '<mark>$1</mark>');
}

document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

const modal = document.getElementById('rolePicker');
const list  = document.getElementById('rpList');
const input = document.getElementById('rpSearch');

let focusedIdx = 0;
let visible    = [];

function render(query) {
  const q = query.trim().toLowerCase();
  visible = q
    ? ROLES.filter(r => r.name.toLowerCase().includes(q) || VARIANTS[r.v].toLowerCase().includes(q))
    : ROLES.slice();
  focusedIdx = 0;

  if (!visible.length) {
    list.innerHTML = `
      <div class="modal-empty">
        <p>No exact match. Pick the closest variant:</p>
        ${Object.entries(VARIANTS).map(([key, label], i) => `
          <div class="role-row" data-variant="${key}" data-idx="${i}">
            <span class="rname">${label}</span>
            <span class="rvariant">Variant</span>
          </div>`).join('')}
      </div>`;
    visible = Object.entries(VARIANTS).map(([key, label]) => ({ name: label, v: key }));
    attachClicks();
    return;
  }

  const grouped = {};
  visible.forEach(r => { (grouped[r.v] ||= []).push(r); });
  let html = '';
  let idx  = 0;
  for (const key of Object.keys(grouped)) {
    html += `<div class="group-label">— ${VARIANTS[key]}</div>`;
    for (const r of grouped[key]) {
      html += `
        <div class="role-row${idx === focusedIdx ? ' focused' : ''}" data-variant="${r.v}" data-idx="${idx}" role="option">
          <span class="rname">${highlight(r.name, q)}</span>
          <span class="rvariant">→ <b>${VARIANTS[r.v]}</b></span>
        </div>`;
      idx++;
    }
  }
  list.innerHTML = html;
  attachClicks();
}

function attachClicks() {
  list.querySelectorAll('.role-row').forEach(row => {
    row.addEventListener('click', () => choose(row.dataset.variant));
    row.addEventListener('mouseenter', () => {
      focusedIdx = +row.dataset.idx;
      updateFocus();
    });
  });
}
function updateFocus() {
  list.querySelectorAll('.role-row').forEach((row, i) => {
    row.classList.toggle('focused', i === focusedIdx);
    if (i === focusedIdx) row.scrollIntoView({ block: 'nearest' });
  });
}
function choose(variantKey) {
  close();
  window.location.href = `resume.html?role=${encodeURIComponent(variantKey)}`;
}
function open() {
  modal.hidden = false;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  input.value = '';
  render('');
  setTimeout(() => input.focus(), 50);
}
function close() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modal.hidden = true; }, 200);
}

document.querySelectorAll('[data-open-picker]').forEach(b => b.addEventListener('click', open));
document.querySelectorAll('[data-close-picker]').forEach(b => b.addEventListener('click', close));
modal.querySelector('.modal-default').addEventListener('click', () => choose('general'));
modal.addEventListener('click', e => { if (e.target === modal) close(); });

input.addEventListener('input', e => render(e.target.value));

document.addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape')        { e.preventDefault(); close(); }
  else if (e.key === 'ArrowDown'){ e.preventDefault(); focusedIdx = Math.min(focusedIdx + 1, visible.length - 1); updateFocus(); }
  else if (e.key === 'ArrowUp')  { e.preventDefault(); focusedIdx = Math.max(focusedIdx - 1, 0); updateFocus(); }
  else if (e.key === 'Enter')    {
    e.preventDefault();
    const row = list.querySelectorAll('.role-row')[focusedIdx];
    if (row) choose(row.dataset.variant);
  }
});
