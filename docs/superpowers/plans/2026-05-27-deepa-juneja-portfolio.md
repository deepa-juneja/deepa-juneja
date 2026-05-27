# Deepa Juneja Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the live portfolio + 6-variant resume system at `https://raiaman15.github.io/deepa-juneja/` from the approved design spec.

**Architecture:** Vanilla HTML/CSS/JS, no build step. Master profile JSON + 6 role overlay JSONs. Portfolio is one page; resume is one template that accepts `?role=<key>` and renders the appropriate variant. PDFs are produced by the browser's print dialog. Deployed via GitHub Actions to GitHub Pages.

**Tech Stack:** HTML5, CSS3 (CSS variables, `@media print`, `@page`), vanilla ES6+ JS (no bundler, no transpiler), Google Fonts (Fraunces + Newsreader) for the portfolio, system fonts (Calibri / Arial / Helvetica) for the resume, GitHub Actions for deploy.

**Source of truth:** [`docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md`](../specs/2026-05-27-deepa-juneja-portfolio-design.md). The current `mockup/index.html` and `mockup/resume.html` are the visual contracts. Implementation must match their final state.

**Testing note:** Vanilla static sites don't have a unit-test harness here. Each task ends with a **manual verification gate** instead — open the page in a browser, observe the listed behaviour, then commit. A JSON-validator script is added in Task 3 to catch data shape errors early.

---

## File layout (locked from spec)

```
/
├── index.html
├── resume.html
├── data/
│   ├── profile.json
│   └── roles/
│       ├── general.json
│       ├── data-analyst.json
│       ├── training-ld.json
│       ├── edtech-counselor.json
│       ├── hr-operations.json
│       └── school-coordinator.json
├── css/
│   ├── styles.css
│   └── resume.css
├── js/
│   ├── render-portfolio.js
│   ├── render-resume.js
│   └── role-picker.js
├── assets/
│   ├── deepa.jpg
│   └── favicon.svg
├── scripts/
│   └── validate-data.mjs
├── .github/workflows/deploy.yml
├── docs/superpowers/{specs,plans}/
└── README.md
```

Each file has one responsibility:
- **`index.html`** — semantic skeleton with `data-section=*` slots.
- **`resume.html`** — semantic skeleton for the printable CV with `data-slot=*` slots.
- **`css/styles.css`** — portfolio screen styles only.
- **`css/resume.css`** — resume on-screen + ATS print styles.
- **`js/render-portfolio.js`** — fetches `profile.json`, populates `index.html` slots, attaches print-trigger.
- **`js/render-resume.js`** — fetches `profile.json` + overlay, applies overlay logic, populates `resume.html` slots.
- **`js/role-picker.js`** — the modal: catalogue, search, keyboard nav, navigation.
- **`data/profile.json`** — master record.
- **`data/roles/<role>.json`** — overlays.
- **`scripts/validate-data.mjs`** — Node script that lints JSON shape, used in CI and locally.

---

## Phase 1 — Repo foundation

### Task 1: `.gitignore` and `.editorconfig`

**Files:**
- Create: `.gitignore`
- Create: `.editorconfig`

- [ ] **Step 1: Create `.gitignore`**

```
# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp

# Node (only used for the validator script)
node_modules/

# Generated
*.log
```

- [ ] **Step 2: Create `.editorconfig`**

```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore .editorconfig
git commit -m "chore: add gitignore and editorconfig"
```

### Task 2: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace `README.md`**

```markdown
# Deepa Juneja — Portfolio

Personal portfolio and ATS-friendly resume system for [Deepa Juneja](https://www.linkedin.com/in/deepa-juneja/), an educator-turned-operator based in Gurugram.

**Live:** https://raiaman15.github.io/deepa-juneja/

## How it works

- One `data/profile.json` holds every fact (education, experience, skills, certs).
- `index.html` reads that JSON and renders the portfolio.
- `resume.html?role=<key>` reads JSON + an overlay from `data/roles/<key>.json` and renders an ATS-clean one-page CV that the browser turns into a PDF via the print dialog.
- Six role variants: `general` (default) plus `training-ld`, `edtech-counselor`, `data-analyst`, `hr-operations`, `school-coordinator`.

## Local development

No build step. Open `index.html` in a static server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/
```

Validate the JSON data:

```bash
node scripts/validate-data.mjs
```

## Design and plan

- Design spec — [`docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md`](docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md)
- Implementation plan — [`docs/superpowers/plans/2026-05-27-deepa-juneja-portfolio.md`](docs/superpowers/plans/2026-05-27-deepa-juneja-portfolio.md)
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README"
```

### Task 3: Data validator script

**Files:**
- Create: `scripts/validate-data.mjs`
- Create: `package.json`

The validator runs before commits and in CI to catch missing fields, broken `id` references, and bad role overlays. Pure Node (no deps).

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "deepa-juneja-portfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "validate": "node scripts/validate-data.mjs"
  }
}
```

- [ ] **Step 2: Create `scripts/validate-data.mjs`**

```javascript
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DATA = join(ROOT, 'data');

const REQUIRED_PROFILE_KEYS = [
  'name', 'tagline', 'contact', 'languages', 'summary_general',
  'about', 'pull_quote', 'education', 'experience', 'career_chapters',
  'skills', 'certifications'
];

const REQUIRED_OVERLAY_KEYS = [
  'role_key', 'role_title', 'summary',
  'include_experience', 'experience_overrides',
  'emphasized_skills', 'include_certifications', 'keywords'
];

const errors = [];
const note = (msg) => errors.push(msg);

async function loadJson(path) {
  const raw = await readFile(path, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    note(`${path}: invalid JSON — ${e.message}`);
    return null;
  }
}

const profile = await loadJson(join(DATA, 'profile.json'));
if (profile) {
  for (const k of REQUIRED_PROFILE_KEYS) {
    if (!(k in profile)) note(`profile.json: missing key "${k}"`);
  }
  const expIds = new Set((profile.experience ?? []).map(x => x.id));
  const certIds = new Set((profile.certifications ?? []).map(x => x.id));

  const roleFiles = await readdir(join(DATA, 'roles'));
  for (const file of roleFiles) {
    if (!file.endsWith('.json')) continue;
    const overlay = await loadJson(join(DATA, 'roles', file));
    if (!overlay) continue;
    for (const k of REQUIRED_OVERLAY_KEYS) {
      if (!(k in overlay)) note(`roles/${file}: missing key "${k}"`);
    }
    const inc = overlay.include_experience;
    if (Array.isArray(inc)) {
      for (const id of inc) {
        if (!expIds.has(id)) note(`roles/${file}: include_experience references unknown id "${id}"`);
      }
    } else if (inc !== 'all') {
      note(`roles/${file}: include_experience must be array or "all"`);
    }
    const incc = overlay.include_certifications;
    if (Array.isArray(incc)) {
      for (const id of incc) {
        if (!certIds.has(id)) note(`roles/${file}: include_certifications references unknown id "${id}"`);
      }
    } else if (incc !== 'all') {
      note(`roles/${file}: include_certifications must be array or "all"`);
    }
    for (const id of Object.keys(overlay.experience_overrides ?? {})) {
      if (!expIds.has(id)) note(`roles/${file}: experience_overrides has unknown id "${id}"`);
    }
  }
}

if (errors.length) {
  console.error('Data validation failed:');
  for (const e of errors) console.error('  • ' + e);
  process.exit(1);
}
console.log('Data validation passed.');
```

- [ ] **Step 3: Run validator (expect to fail — no data files yet)**

```bash
node scripts/validate-data.mjs
# Expected: error about reading data/profile.json
```

- [ ] **Step 4: Commit**

```bash
git add scripts/ package.json
git commit -m "chore: add JSON data validator script"
```

---

## Phase 2 — Data layer

### Task 4: `data/profile.json` (master record)

**Files:**
- Create: `data/profile.json`

The full content is taken verbatim from the design spec §5.1.

- [ ] **Step 1: Create `data/profile.json`**

Copy the JSON object from §5.1 of the design spec (`docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md`). Use the exact content — all education, experience, career_chapters, skills, certifications. Do **not** paraphrase or rewrite the prose.

- [ ] **Step 2: Run validator (will still fail because role overlays don't exist yet — that's fine, but profile-related errors should be gone)**

```bash
node scripts/validate-data.mjs
# Expected: complains about missing data/roles/*.json (but NOT about profile fields)
```

- [ ] **Step 3: Commit**

```bash
git add data/profile.json
git commit -m "data: add master profile.json"
```

### Task 5: `data/roles/general.json`

**Files:**
- Create: `data/roles/general.json`

This is the pass-through variant. Includes everything from master.

- [ ] **Step 1: Create `data/roles/general.json`**

```json
{
  "role_key": "general",
  "role_title": "General",
  "summary": "BCA, MCA, and an MBA with over a decade of experience in academic coordination, project coordination, classroom teaching, and people operations. Comfortable with Microsoft 365, Excel, MIS reporting, and the everyday use of ChatGPT, Gemini, and Claude. Open to roles in corporate training, operations, EdTech, HR, and analytics.",
  "include_experience": "all",
  "experience_overrides": {},
  "emphasized_skills": "all",
  "include_certifications": "all",
  "keywords": ["MBA", "MCA", "BCA", "coordinator", "training", "operations", "HR", "EdTech", "analytics", "Excel", "MIS"]
}
```

- [ ] **Step 2: Run validator**

```bash
node scripts/validate-data.mjs
# Expected: still complains about the 5 other role files
```

- [ ] **Step 3: Commit**

```bash
git add data/roles/general.json
git commit -m "data: add general role overlay"
```

### Task 6: `data/roles/data-analyst.json` (sketch — gets reviewed)

**Files:**
- Create: `data/roles/data-analyst.json`

This is the first specific-role overlay. After this task we **stop and have the user review the prose** before writing the other four. The data structure is locked; only the bullet wording and keyword choices need user buy-in.

- [ ] **Step 1: Create `data/roles/data-analyst.json`**

```json
{
  "role_key": "data-analyst",
  "role_title": "Data / MIS Analyst",
  "summary": "Computer Applications postgrad (BCA, MCA) and MBA with over a decade of building, running, and reporting on operational systems across schools and small institutions. Day-to-day proficiency in Microsoft Excel and MIS reporting from running examinations, calendars, and stakeholder pipelines. SQL and Power BI in active progress; foundation in DBMS from teaching the subject. Seeking a junior Data Analyst, MIS Analyst, or Reporting Analyst role to apply this analytical foundation in a business-driven environment.",
  "include_experience": ["ai-upskill", "shikshiyan", "alpine", "gao-tek", "amps", "iimt", "ved", "neki-ram"],
  "experience_overrides": {
    "amps": {
      "highlights": [
        "Maintained student, staff, and exam records in Microsoft Excel; produced termly reports for the principal's office.",
        "Owned the examination logistics tracker — seating, invigilation, results — as the de-facto MIS for 600+ students.",
        "Coordinated faculty schedules across grade levels — stakeholder management for 25+ teachers."
      ]
    },
    "gao-tek": {
      "highlights": [
        "Maintained candidate and interviewer schedules in Microsoft Excel; produced weekly hiring progress reports.",
        "Coordinated multi-role pipelines across time zones with shared trackers and Microsoft Teams.",
        "Standardised reporting templates that the wider HR team adopted."
      ]
    },
    "neki-ram": {
      "highlights": [
        "Taught Database Management Systems to BCA students — relational modelling, normalisation, SQL fundamentals.",
        "Designed coursework, lab exercises, and semester assessments."
      ]
    },
    "ai-upskill": {
      "highlights": [
        "Working through Google AI Essentials and the Google AI Professional Certificate (Coursera).",
        "Daily working use of ChatGPT, Gemini, and Claude for research, writing, and analysis.",
        "Self-paced Excel, Power BI, and SQL practice for data-analyst roles."
      ]
    }
  },
  "emphasized_skills": [
    "Microsoft Excel (advanced — VLOOKUP, pivot tables, conditional formatting)",
    "MIS reporting (operational dashboards, weekly status reports)",
    "Data visualisation — Power BI (learning)",
    "SQL — basics (learning)",
    "DBMS fundamentals — taught at college level",
    "Stakeholder management across faculty, parents, leadership",
    "Google AI Essentials (in progress)",
    "Daily AI tooling — ChatGPT, Gemini, Claude"
  ],
  "include_certifications": ["google-ai-essentials", "google-ai-prof", "udemy-testing"],
  "keywords": ["Data Analyst", "MIS", "MIS Executive", "Reporting Analyst", "Business Analyst", "Excel", "VLOOKUP", "Pivot Tables", "Power BI", "SQL", "DBMS", "MBA", "MCA", "BCA", "stakeholder management", "data analysis", "MS Office"]
}
```

- [ ] **Step 2: Run validator (should now pass for two overlays; will still fail for the 4 missing)**

```bash
node scripts/validate-data.mjs
```

- [ ] **Step 3: Commit**

```bash
git add data/roles/data-analyst.json
git commit -m "data: add data-analyst role overlay (draft for review)"
```

- [ ] **Step 4: CHECKPOINT — Pause for user review**

Show the user `data/roles/data-analyst.json`. Confirm:
- The summary paragraph reads naturally.
- The bullet overrides feel honest and not embellished.
- The emphasised_skills order is right.
- Keywords cover what recruiters actually search for.

Apply any wording changes the user requests as a follow-up commit, then proceed to Task 7.

### Task 7: `data/roles/training-ld.json`

**Files:**
- Create: `data/roles/training-ld.json`

- [ ] **Step 1: Create `data/roles/training-ld.json`**

```json
{
  "role_key": "training-ld",
  "role_title": "Training & L&D Coordinator",
  "summary": "Twelve years of classroom teaching, school coordination, and adult-learner instruction (DBMS, science, multi-subject), now bringing that craft to corporate L&D. MBA-trained operator with proven experience designing curricula, running training calendars, coordinating faculty, and tracking outcomes — the same operations work corporate L&D teams do, in a different vocabulary. Seeking a Training Coordinator, L&D Coordinator, or Corporate Trainer role.",
  "include_experience": ["ai-upskill", "shikshiyan", "alpine", "amps", "iimt", "ved", "neki-ram", "home-tuition"],
  "experience_overrides": {
    "amps": {
      "highlights": [
        "Designed and ran the academic and activity calendar for 600+ learners across grade levels — the equivalent of a multi-cohort training programme.",
        "Coordinated 25+ teaching faculty: scheduling, content alignment, observation, and feedback.",
        "Managed examination delivery end-to-end — assessment design, invigilation, scoring, results."
      ]
    },
    "neki-ram": {
      "highlights": [
        "Full-time contract lecturer teaching Database Management Systems to BCA students at college level.",
        "Designed lectures, labs, and semester assessments; mentored students through coursework.",
        "First role training adult learners on a technical subject — the closest analogue to corporate technical training."
      ]
    },
    "home-tuition": {
      "highlights": [
        "Ran small-batch instruction (8–10 students per batch) across all subjects for Grades 6–10 from 2019 through 2023.",
        "Designed differentiated lesson plans for mixed-ability cohorts; tracked progress over multiple academic years."
      ]
    },
    "ai-upskill": {
      "highlights": [
        "Working through Google AI Essentials and the Google AI Professional Certificate (Coursera) — relevant for any L&D function that now needs AI literacy in its curriculum.",
        "Daily working use of ChatGPT, Gemini, and Claude — practical adult-learner exposure to the tools L&D programmes are starting to teach."
      ]
    }
  },
  "emphasized_skills": [
    "Curriculum and lesson design across age and subject ranges",
    "Training delivery — children, teenagers, and adult learners",
    "Calendar and faculty coordination at school scale",
    "Examination and assessment design",
    "Microsoft 365 — Word, Excel, PowerPoint, Teams",
    "Content design — Canva, Microsoft Showcase",
    "AI literacy for L&D — ChatGPT, Gemini, Claude",
    "Stakeholder management — faculty, parents, leadership"
  ],
  "include_certifications": "all",
  "keywords": ["Training Coordinator", "L&D Coordinator", "Learning and Development", "Corporate Trainer", "Process Trainer", "Soft Skills Trainer", "Instructional Designer", "Onboarding Specialist", "curriculum design", "training delivery", "facilitation", "MBA", "MCA", "LMS"]
}
```

- [ ] **Step 2: Run validator**

```bash
node scripts/validate-data.mjs
```

- [ ] **Step 3: Commit**

```bash
git add data/roles/training-ld.json
git commit -m "data: add training-ld role overlay"
```

### Task 8: `data/roles/edtech-counselor.json`

**Files:**
- Create: `data/roles/edtech-counselor.json`

- [ ] **Step 1: Create `data/roles/edtech-counselor.json`**

```json
{
  "role_key": "edtech-counselor",
  "role_title": "EdTech Counsellor / Coordinator",
  "summary": "Educator with twelve years inside schools and colleges — teaching, coordinating, and advising students through academic decisions. MBA-trained, with a Computer Applications background that bridges the technical and pedagogical sides of EdTech. Seeking an Academic Counsellor, Admissions Counsellor, or Programme Coordinator role at an EdTech firm — bringing real classroom credibility and AI literacy to the conversation with prospective learners.",
  "include_experience": ["ai-upskill", "shikshiyan", "alpine", "amps", "iimt", "ved", "home-tuition", "neki-ram"],
  "experience_overrides": {
    "amps": {
      "highlights": [
        "Coordinated student admissions, transfers, and academic placements for a school of 600+ students.",
        "Acted as the operational counsellor for parent–teacher communications across grade levels.",
        "Advised students through subject choices, exam preparation, and remediation pathways."
      ]
    },
    "iimt": {
      "highlights": [
        "Coordinated student records and academic events at a pharmacy college — the EdTech equivalent of programme operations.",
        "Prepared trackers and reports that supported faculty decisions on student progression."
      ]
    },
    "home-tuition": {
      "highlights": [
        "Direct one-to-many advisor to 8–10 students per batch across Grades 6–10, covering all subjects.",
        "Counselled families on subject choices, study habits, and exam strategy through the pandemic and into 2023."
      ]
    },
    "ai-upskill": {
      "highlights": [
        "Working through Google AI Essentials and the Google AI Professional Certificate — firsthand experience of the EdTech learner journey.",
        "Daily use of ChatGPT, Gemini, and Claude — credibility with prospective learners exploring AI-related programmes."
      ]
    }
  },
  "emphasized_skills": [
    "Academic counselling across age groups (Grades 6 – BCA)",
    "Admissions coordination and student placement",
    "Programme operations — calendar, faculty, assessments",
    "Parent and student stakeholder communication",
    "Content design — Canva, Microsoft 365",
    "AI literacy — ChatGPT, Gemini, Claude (daily use)",
    "Empathetic listening and learner advising"
  ],
  "include_certifications": "all",
  "keywords": ["Academic Counsellor", "Admissions Counsellor", "Education Counsellor", "Career Counsellor", "EdTech Coordinator", "Programme Coordinator", "Student Success", "BYJU", "upGrad", "Scaler", "Newton", "Masai", "MBA", "MCA", "counselling"]
}
```

- [ ] **Step 2: Run validator**

```bash
node scripts/validate-data.mjs
```

- [ ] **Step 3: Commit**

```bash
git add data/roles/edtech-counselor.json
git commit -m "data: add edtech-counselor role overlay"
```

### Task 9: `data/roles/hr-operations.json`

**Files:**
- Create: `data/roles/hr-operations.json`

- [ ] **Step 1: Create `data/roles/hr-operations.json`**

```json
{
  "role_key": "hr-operations",
  "role_title": "HR / Operations Coordinator",
  "summary": "MBA and Master of Computer Applications professional with twelve years of operational experience in academic coordination, project coordination, and people operations. Recent HR internship at GAO Tek Group (remote) plus four CBSE / Udemy certifications and two Google AI certifications in progress. Seeking an HR / Operations Coordinator role to apply proven skills in stakeholder management, scheduling, documentation, and MIS reporting in a corporate environment.",
  "include_experience": ["ai-upskill", "shikshiyan", "alpine", "gao-tek", "amps", "iimt", "ved", "neki-ram"],
  "experience_overrides": {
    "gao-tek": {
      "highlights": [
        "Coordinated candidate sourcing pipelines across multiple open roles using shared trackers and Microsoft Teams.",
        "Maintained candidate and interviewer schedules in Microsoft Excel; produced weekly progress reports for the hiring manager.",
        "Drafted standardised outreach templates and onboarding checklists adopted by the wider HR team."
      ]
    },
    "amps": {
      "highlights": [
        "Owned the academic and activity calendar for a school of 600+ students; coordinated 25+ faculty across grade levels.",
        "Ran examination logistics — seating, invigilation rosters, result compilation — using Microsoft Excel as the system of record.",
        "Acted as the operational point of contact between parents, teachers, and the principal's office for day-to-day issues."
      ]
    },
    "ved": {
      "highlights": [
        "Managed end-to-end academic operations: timetabling, substitute scheduling, and exam administration.",
        "Led extra-curricular programming and inter-school events; coordinated vendor logistics for school functions."
      ]
    },
    "ai-upskill": {
      "highlights": [
        "Working through Google AI Essentials and the Google AI Professional Certificate.",
        "Daily working use of ChatGPT, Gemini, and Claude for documentation, drafting, and process design."
      ]
    }
  },
  "emphasized_skills": [
    "Stakeholder management — faculty, parents, leadership, candidates",
    "Calendar, event, and examination coordination",
    "Recruiting coordination — sourcing, scheduling, tracking",
    "Onboarding documentation and process templates",
    "Microsoft 365 — Word, Excel, PowerPoint, Outlook, Teams",
    "MIS reporting — weekly status, hiring pipelines, operational dashboards",
    "Vendor coordination for institutional events",
    "AI literacy — ChatGPT, Gemini, Claude (daily use)"
  ],
  "include_certifications": "all",
  "keywords": ["HR Coordinator", "HR Executive", "HR Generalist", "HR Assistant", "Operations Coordinator", "Operations Executive", "Office Coordinator", "Admin Coordinator", "Recruiting Coordinator", "People Operations", "MBA", "MCA", "stakeholder management", "MIS"]
}
```

- [ ] **Step 2: Run validator**

```bash
node scripts/validate-data.mjs
```

- [ ] **Step 3: Commit**

```bash
git add data/roles/hr-operations.json
git commit -m "data: add hr-operations role overlay"
```

### Task 10: `data/roles/school-coordinator.json`

**Files:**
- Create: `data/roles/school-coordinator.json`

- [ ] **Step 1: Create `data/roles/school-coordinator.json`**

```json
{
  "role_key": "school-coordinator",
  "role_title": "School Coordinator",
  "summary": "Educator with twelve years inside schools — Science Faculty, Academic Coordinator, School Coordinator, and home-tuition educator through the pandemic. MBA and Master of Computer Applications, with four CBSE certifications spanning NEP 2020, Joyful Mathematics, and Story Telling in Classroom. Seeking a School Coordinator, Academic Coordinator, or Faculty Coordinator role at a CBSE / IB / IGCSE-affiliated school.",
  "include_experience": ["shikshiyan", "alpine", "amps", "home-tuition", "iimt", "ved", "neki-ram"],
  "experience_overrides": {
    "shikshiyan": {
      "highlights": [
        "Science Teacher for Grades 7 and 8 — daily classroom delivery, lesson planning, and term-end assessments.",
        "Mentored students through remediation, projects, and inter-class activities."
      ]
    },
    "alpine": {
      "highlights": [
        "Science Faculty for upper-primary and middle-school students from April through December 2023.",
        "Held additional charge as Activity Head; led school-level Science Quizzes and inter-school competitions."
      ]
    },
    "amps": {
      "highlights": [
        "Joined as Science Faculty; promoted to Coordinator with charge over the academic and activity calendar.",
        "Owned exam logistics — seating, invigilation rosters, result compilation — for 600+ students.",
        "Acted as the operational point of contact between parents, teachers, and the principal's office."
      ]
    },
    "ved": {
      "highlights": [
        "Managed end-to-end academic operations: timetabling, substitute scheduling, examination administration.",
        "Led extra-curricular programming and inter-school events; coordinated vendor logistics for school functions."
      ]
    },
    "home-tuition": {
      "highlights": [
        "Taught all subjects to Grades 6–10 in batches of 8 to 10 students from 2019 to 2023.",
        "Built lesson plans, ran assessments, and tracked student progress over multiple academic years through the pandemic."
      ]
    }
  },
  "emphasized_skills": [
    "Academic calendar and timetabling",
    "Examination administration — seating, invigilation, scoring, results",
    "Faculty coordination across grades and subjects",
    "Parent–teacher liaison and counselling",
    "Activity and event programming — quizzes, competitions, inter-school events",
    "CBSE curriculum and NEP 2020 alignment",
    "Microsoft 365, Canva, Microsoft Showcase",
    "Curriculum design and lesson planning"
  ],
  "include_certifications": ["cbse-nep", "cbse-math", "cbse-storytelling", "udemy-testing", "google-ai-essentials"],
  "keywords": ["School Coordinator", "Academic Coordinator", "Faculty Coordinator", "Activity Head", "Science Faculty", "Science Teacher", "Headmistress", "Vice Principal", "CBSE", "NEP 2020", "lesson planning", "examination", "MBA"]
}
```

- [ ] **Step 2: Run validator (should now fully pass)**

```bash
node scripts/validate-data.mjs
# Expected: "Data validation passed."
```

- [ ] **Step 3: Commit**

```bash
git add data/roles/school-coordinator.json
git commit -m "data: add school-coordinator role overlay"
```

---

## Phase 3 — Portfolio page

### Task 11: `css/styles.css` — port portfolio styles from mockup

**Files:**
- Create: `css/styles.css`

- [ ] **Step 1: Copy the `<style>` block from `mockup/index.html`**

Open `mockup/index.html`, locate the entire `<style>...</style>` block in `<head>`, and copy its contents verbatim into a new file `css/styles.css`. **Do not** modify the CSS during this task — it is the visual contract.

- [ ] **Step 2: Manual verification**

The file should be roughly the same length as the mockup style block (hundreds of lines), containing `:root` variables, `body::before` grain overlay, `.mast`, `.hero`, `.s`, `.about`, `.journey`, `.xp-list`, `.grid-two`, `.edu-item`, `.cert-item`, `.skills`, `.chip`, `.resume-row`, `.modal-*`, `footer`, `.foot-grid`, `@media (max-width: 900px)`, etc.

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "feat: add portfolio CSS"
```

### Task 12: `index.html` shell

**Files:**
- Create: `index.html` (overwriting any earlier draft)

Build the semantic skeleton with `data-section` slots that `render-portfolio.js` will fill. The structure mirrors `mockup/index.html` 1:1, but the bodies of dynamic sections are empty placeholders.

- [ ] **Step 1: Create `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Deepa Juneja — Educator, coordinator, operator.</title>
  <meta name="description" content="Personal portfolio of Deepa Juneja — MBA, MCA, and BCA with over a decade in school operations and teaching, now pivoting to corporate training, operations, and analytics.">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,0..100&family=Newsreader:opsz,ital,wght@6..72,0..1,200..700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>

<header class="mast">
  <div class="left">Deepa Juneja · Gurugram</div>
  <div class="mid">— Portfolio · MMXXVI —</div>
  <div class="right">
    <a href="#about">About</a>
    <a href="#experience">Work</a>
    <a href="#journey">Career</a>
    <a href="#resume">Resume</a>
    <a href="#contact">Contact</a>
  </div>
</header>

<div class="wrap">
<section class="hero">
  <span class="marker">§ Portfolio · Gurugram</span>
  <div>
    <h1>
      <span class="l1">Deepa</span>
      <span class="l2"><span class="it">Juneja.</span></span>
    </h1>
    <p class="lede" data-slot="lede"></p>
    <div class="meta" data-slot="meta"></div>
    <div class="cta-row">
      <button class="btn" data-open-picker type="button">Download Resume <span class="arr">↓</span></button>
      <a class="btn ghost" href="#contact">Get in touch <span class="arr">→</span></a>
    </div>
  </div>
  <div class="portrait">
    <div class="frame" data-slot="portrait"></div>
    <span class="caption">fig. i — Deepa, 2026</span>
  </div>
</section>
</div>

<div class="wrap"><section class="s" id="about">
  <div class="s-head"><span class="s-num">§ I</span><h2 class="s-title">A note from <em>the desk.</em></h2><span class="s-kicker">About</span></div>
  <div class="about">
    <div class="pull" data-slot="pull-quote"></div>
    <div data-slot="about-paragraphs"></div>
  </div>
</section></div>

<div class="wrap"><section class="s" id="experience">
  <div class="s-head"><span class="s-num">§ II</span><h2 class="s-title">Where the <em>work</em> happened.</h2><span class="s-kicker">Experience</span></div>
  <div class="xp-list" data-slot="experience"></div>
</section></div>

<div class="wrap"><section class="s" id="education">
  <div class="s-head"><span class="s-num">§ III</span><h2 class="s-title">Education &amp; <em>credentials.</em></h2><span class="s-kicker">Studied · Certified</span></div>
  <div class="grid-two">
    <div class="edu-list" data-slot="education"></div>
    <div class="cert-list" data-slot="certifications"></div>
  </div>
</section></div>

<div class="wrap"><section class="s" id="journey">
  <div class="s-head"><span class="s-num">§ IV</span><h2 class="s-title">The <em>career</em> so far.</h2><span class="s-kicker">Career</span></div>
  <div class="journey" data-slot="career"></div>
</section></div>

<div class="wrap"><section class="s" id="skills">
  <div class="s-head"><span class="s-num">§ V</span><h2 class="s-title">Skills <em>I know.</em></h2><span class="s-kicker">Skills</span></div>
  <div class="skills" data-slot="skills"></div>
</section></div>

<div class="wrap"><section class="s" id="resume">
  <div class="s-head"><span class="s-num">§ VI</span><h2 class="s-title">Take the <em>resume.</em></h2><span class="s-kicker">One-page PDF</span></div>
  <div>
    <div class="resume-row">
      <p>I've put together a well-crafted version of my resume in case you'd rather see only the experience relevant to the role you're hiring for.</p>
      <button class="btn" data-open-picker type="button">Download Resume <span class="arr">↓</span></button>
    </div>
  </div>
</section></div>

<footer id="contact">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <h6>— The desk</h6>
        <div class="f-name">Deepa <em>Juneja.</em></div>
        <p class="f-tag">I'm an educator-turned-operator, open to thoughtful conversations. If the work sounds like it might rhyme, please write.</p>
      </div>
      <div class="col">
        <h6>Reach</h6>
        <a data-slot="footer-email"></a>
        <a data-slot="footer-phone"></a>
        <p data-slot="footer-location"></p>
      </div>
      <div class="col">
        <h6>Elsewhere</h6>
        <a data-slot="footer-linkedin" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://github.com/raiaman15/deepa-juneja" target="_blank" rel="noopener">Source on GitHub</a>
        <a href="#resume">Resume ↓</a>
      </div>
    </div>
    <div class="foot-bar">
      <span>© MMXXVI — Deepa Juneja</span>
      <span>Hand-built · No frameworks · No analytics</span>
    </div>
  </div>
</footer>

<!-- Role-picker modal will be injected by js/role-picker.js -->

<script type="module" src="js/render-portfolio.js"></script>
<script type="module" src="js/role-picker.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add index.html shell with data-slot placeholders"
```

### Task 13: `js/render-portfolio.js`

**Files:**
- Create: `js/render-portfolio.js`

This module fetches `data/profile.json` and fills each `[data-slot=...]` element. Pure render — no event handling. Idempotent: replaces innerHTML each time.

- [ ] **Step 1: Create `js/render-portfolio.js`**

```javascript
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
  setHTML('portrait', ``); // photo wired in Task 22
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
```

- [ ] **Step 2: Manual verification — local server**

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/` and verify:
- Hero name, lede, meta strip render.
- About section shows the pull quote and two paragraphs.
- Experience shows 8 rows newest-first with correct dates.
- Education shows MBA / MCA / BCA (no 10th/12th).
- Certifications show 6 items, two marked "in progress".
- Career timeline shows 13 chapters in chronological order.
- Skills section shows 3 columns of chips, operations column has terra-coloured accent chips.
- Footer email / phone / LinkedIn links work.
- "Download Resume" buttons don't yet open the modal (next task).

- [ ] **Step 3: Commit**

```bash
git add js/render-portfolio.js
git commit -m "feat: render portfolio sections from profile.json"
```

---

## Phase 4 — Role picker modal

### Task 14: `js/role-picker.js`

**Files:**
- Create: `js/role-picker.js`

Self-contained module: injects modal markup into the DOM, wires up open/close, search, keyboard navigation, and navigation to `resume.html?role=<key>`.

- [ ] **Step 1: Create `js/role-picker.js`**

```javascript
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
```

- [ ] **Step 2: Manual verification**

Reload `http://localhost:8080/`. Click "Download Resume" → modal opens. Verify:
- Big "Download my complete resume" CTA at top.
- Search input filters as you type.
- Typing `MIS` highlights matches in the list.
- ↑↓ arrows navigate, ↵ navigates to `resume.html?role=…` (will 404 until Task 19).
- Esc closes the modal.
- Backdrop click closes the modal.

- [ ] **Step 3: Commit**

```bash
git add js/role-picker.js
git commit -m "feat: role-picker modal with searchable role catalogue"
```

---

## Phase 5 — Resume page

### Task 15: `css/resume.css`

**Files:**
- Create: `css/resume.css`

- [ ] **Step 1: Copy the `<style>` block from `mockup/resume.html`**

Open `mockup/resume.html`, copy the `<style>` block from `<head>` into a new file `css/resume.css`.

- [ ] **Step 2: Commit**

```bash
git add css/resume.css
git commit -m "feat: add ATS-clean resume CSS"
```

### Task 16: `resume.html` shell

**Files:**
- Create: `resume.html`

- [ ] **Step 1: Create `resume.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title data-slot="title">Deepa Juneja — Resume</title>
  <meta name="description" content="Deepa Juneja — one-page resume.">
  <meta name="keywords" data-slot="meta-keywords" content="">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/resume.css">
</head>
<body>

<div class="actions">
  <a href="index.html" class="who">← Deepa Juneja · Portfolio</a>
  <span class="role-tag" data-slot="role-tag">Resume</span>
  <button class="btn" onclick="window.print()" type="button">↓ Save as PDF</button>
</div>

<div class="page-wrap">
  <h1 class="name">DEEPA JUNEJA</h1>
  <div class="contact-line" data-slot="contact"></div>

  <h2 class="sec">Summary</h2>
  <p class="summary" data-slot="summary"></p>

  <h2 class="sec">Experience</h2>
  <div data-slot="experience"></div>

  <h2 class="sec">Education</h2>
  <div data-slot="education"></div>

  <h2 class="sec">Skills</h2>
  <div class="skills-block" data-slot="skills"></div>

  <h2 class="sec">Certifications</h2>
  <ul class="certs-list" data-slot="certifications"></ul>
</div>

<script type="module" src="js/render-resume.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add resume.html
git commit -m "feat: add resume.html shell"
```

### Task 17: `js/render-resume.js`

**Files:**
- Create: `js/render-resume.js`

- [ ] **Step 1: Create `js/render-resume.js`**

```javascript
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
```

- [ ] **Step 2: Manual verification — every role variant**

Visit each URL and confirm the resume renders correctly:
- `http://localhost:8080/resume.html?role=general`
- `http://localhost:8080/resume.html?role=training-ld`
- `http://localhost:8080/resume.html?role=edtech-counselor`
- `http://localhost:8080/resume.html?role=data-analyst`
- `http://localhost:8080/resume.html?role=hr-operations`
- `http://localhost:8080/resume.html?role=school-coordinator`
- `http://localhost:8080/resume.html` (no param → defaults to `general`)
- `http://localhost:8080/resume.html?role=nonsense` (invalid → defaults to `general`)

For each:
- Page title in tab is `Deepa Juneja — <Role Title> Resume`.
- Summary at top reads the right variant.
- Experience appears in the order from the overlay's `include_experience`.
- Skills section shows the variant's `emphasized_skills`.
- Certifications section is filtered correctly.
- The "↓ Save as PDF" button triggers the browser print dialog.

- [ ] **Step 3: Print-preview check (ATS rules)**

Press `Cmd+P` (or `Ctrl+P`) on `resume.html?role=hr-operations`. In the print preview:
- Single column, black on white.
- No photo, no icons, no terra/sage colours.
- Calibri (or system fallback) — **not** Fraunces/Newsreader.
- A4 portrait, ~0.6" margins.
- "↓ Save as PDF" button and the back-to-portfolio link are hidden.
- Page title in the PDF dialog filename suggestion is `Deepa Juneja — HR / Operations Resume.pdf`.
- Save as PDF, then open and confirm text is selectable.

- [ ] **Step 4: Commit**

```bash
git add js/render-resume.js
git commit -m "feat: render resume from profile + role overlay"
```

---

## Phase 6 — Photo, favicon, and final polish

### Task 18: Extract headshot from `DeepaJuneja__Resume.pdf`

**Files:**
- Create: `assets/deepa.jpg`

The user's resume PDF embeds her headshot at top-right of the first page.

- [ ] **Step 1: Install a PDF tool if needed**

Check `which pdfimages`. If missing on macOS:

```bash
brew install poppler
```

(`poppler` provides `pdfimages` and `pdftoppm`.)

- [ ] **Step 2: Extract the embedded image**

```bash
mkdir -p /tmp/deepa-extract
pdfimages -all "/Users/amanrai/Downloads/DeepaJuneja__Resume.pdf" /tmp/deepa-extract/img
ls /tmp/deepa-extract/
```

Inspect the extracted files. The headshot is typically the largest JPEG.

- [ ] **Step 3: Crop / scale if needed and save**

If the extracted image is already a portrait headshot, copy it directly:

```bash
cp /tmp/deepa-extract/<headshot>.jpg assets/deepa.jpg
```

If it needs cropping, use `sips` (macOS) — e.g., resize to ≤ 800px wide:

```bash
sips -Z 800 /tmp/deepa-extract/<headshot>.jpg --out assets/deepa.jpg
```

- [ ] **Step 4: Wire the photo into the hero frame**

Modify `js/render-portfolio.js` — replace the `renderHero` function's portrait line with:

```javascript
setHTML('portrait', `<img src="assets/deepa.jpg" alt="Deepa Juneja" loading="eager" style="width:100%;height:100%;object-fit:cover;display:block;">`);
```

Also update the `.frame` CSS in `css/styles.css` to remove the `::after { content: "DJ"; ... }` placeholder rule so the photo isn't obscured:

```css
/* In css/styles.css, locate `.portrait .frame::after { ... DJ ... }` */
/* Delete that entire rule block. */
```

- [ ] **Step 5: Manual verification**

Reload `index.html`. The terracotta frame should now show Deepa's actual headshot instead of the "DJ" monogram.

If the photo extraction fails, leave the placeholder rule in place and skip photo wiring — note "photo extraction blocked" and move on. The DJ monogram is the documented fallback.

- [ ] **Step 6: Commit**

```bash
git add assets/deepa.jpg js/render-portfolio.js css/styles.css
git commit -m "feat: extract and wire Deepa's headshot into hero"
```

### Task 19: `assets/favicon.svg`

**Files:**
- Create: `assets/favicon.svg`

A simple terracotta monogram on cream.

- [ ] **Step 1: Create `assets/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#F3ECDC"/>
  <text x="32" y="44" font-family="Georgia, serif" font-style="italic" font-weight="500" font-size="38" fill="#B25339" text-anchor="middle">D</text>
</svg>
```

- [ ] **Step 2: Manual verification**

Reload the site. Browser tab should show a small "D" favicon on cream.

- [ ] **Step 3: Commit**

```bash
git add assets/favicon.svg
git commit -m "feat: add favicon"
```

---

## Phase 7 — Deployment

### Task 20: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Validate JSON data
        run: node scripts/validate-data.mjs

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow"
```

### Task 21: Enable GitHub Pages and push

**Files:** none (settings change + push)

- [ ] **Step 1: Push the branch**

```bash
git push origin main
```

- [ ] **Step 2: Enable GitHub Pages**

In the repo on GitHub: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.

- [ ] **Step 3: Watch the workflow**

```bash
gh run watch
```

Or open the Actions tab in the browser and confirm both `validate` and `deploy` jobs pass.

- [ ] **Step 4: Manual verification — live site**

Open `https://raiaman15.github.io/deepa-juneja/`. Verify:
- Portfolio loads with all sections populated.
- "Download Resume" modal opens.
- Each role variant resume renders (try `.../resume.html?role=hr-operations`, etc.).
- Print dialog produces a clean ATS PDF (test on Chrome desktop).
- Favicon shows in the tab.
- LinkedIn link in footer opens her LinkedIn profile.

---

## Phase 8 — Cleanup

### Task 22: Remove the `mockup/` directory

**Files:**
- Delete: `mockup/`

The mockup served its purpose as the visual contract and is no longer needed. The spec references it but the implementation supersedes it.

- [ ] **Step 1: Remove the directory**

```bash
git rm -r mockup/
```

- [ ] **Step 2: Update the spec doc reference**

In `docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md`, locate the sentence in §4 that reads:
> The current `mockup/` directory (visual approval) will be **removed** at the end of implementation.

Replace it with:
> The `mockup/` directory was the visual contract and has been removed in favour of the live `index.html` / `resume.html`.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md
git commit -m "chore: remove mockup directory; update spec reference"
git push origin main
```

### Task 23: Final smoke test

**Files:** none

- [ ] **Step 1: Cross-browser check on the live URL**

Open `https://raiaman15.github.io/deepa-juneja/` in:
- Chrome desktop
- Safari desktop
- Mobile Chrome / Safari (use real device or a simulator)

For each:
- Hero renders, photo visible.
- Modal opens, keyboard nav works.
- A role resume opens and the Save-as-PDF button triggers the print dialog.
- Print preview shows ATS-clean output.
- No console errors.

- [ ] **Step 2: Update the design-spec status to "Shipped"**

In `docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md`, change the `**Status:**` line to:

```
**Status:** Shipped 2026-05-27 — https://raiaman15.github.io/deepa-juneja/
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md
git commit -m "docs: mark portfolio spec shipped"
git push origin main
```

---

## Self-review

**Spec coverage** — checked against `docs/superpowers/specs/2026-05-27-deepa-juneja-portfolio-design.md`:

| Spec section | Task(s) |
|---|---|
| §1 Goal | Tasks 11–17 (build) + 20–21 (deploy) |
| §2 Non-goals | Honoured by design — no Tasks needed |
| §3 Architecture | Tasks 11–17 |
| §4 File layout | Tasks 1–23 collectively |
| §5.1 Master profile JSON | Task 4 |
| §5.2 Role overlays | Tasks 5–10 (6 overlay files) |
| §5.3 Render rules | Task 17 (`applyOverlay`) |
| §5.4 `general` variant | Task 5 |
| §6.1 Portfolio page | Tasks 11, 12, 13 |
| §6.2 Resume page | Tasks 15, 16, 17 |
| §6.3 Role-picker modal | Task 14 |
| §7 ATS rules | Tasks 15, 16, 17 + verification in Task 17 Step 3 |
| §8.1 Visual design — portfolio | Task 11 (port mockup CSS) |
| §8.2 Visual design — resume | Task 15 (port mockup CSS) |
| §9 Deployment | Tasks 20, 21 |
| §10 Data of record | Task 4 |
| §11 Open items — photo extraction | Task 18 |
| §11 Open items — role overlay bullets | Tasks 6–10 (with user-review checkpoint after Task 6) |
| §11 Open items — favicon | Task 19 |
| §11 Open items — custom domain | Out of scope (v1) |
| §12 Appendix — role catalogue | Task 14 |

**Placeholder scan** — none. All steps contain exact file paths, complete code blocks, or precise commands.

**Type consistency** — checked: `applyOverlay` accepts the JSON shapes defined in Task 4 + Tasks 5–10. Slot names in `index.html` (Task 12) match `data-slot` queries in `render-portfolio.js` (Task 13). Slot names in `resume.html` (Task 16) match queries in `render-resume.js` (Task 17). Modal markup in `role-picker.js` (Task 14) matches CSS classes in `css/styles.css` (Task 11, ported from mockup). `VARIANTS` in `role-picker.js` matches the 5 specific overlays + `general` is handled by `modal-default` separately.
