# Deepa Juneja — Portfolio + Resume System

**Date:** 2026-05-27
**Status:** Shipped 2026-05-27 — https://raiaman15.github.io/deepa-juneja/
**Owner:** Aman Rai (raiaman15)
**Subject:** Deepa Juneja

## 1. Goal

Build a single-page personal portfolio for Deepa Juneja that:

- Tells her career story for a corporate-pivot audience (educator → operator).
- Serves **six** downloadable resumes — one general, five role-tailored — from a single JSON source of truth.
- Lets a recruiter pick the closest role to what they're hiring for and receive a focused, ATS-friendly version that emphasises the relevant experience and skills.
- Is hand-built (no frameworks, no build step), hosted free on GitHub Pages, and trivially maintainable.

The implicit goal is *signal*: a thoughtful, well-made portfolio is itself proof that the person behind it pays attention to detail.

## 2. Non-goals

- No CMS, no auth, no analytics, no contact form backend.
- No multi-role switcher on the live portfolio — the portfolio is one general page; the tailoring happens at PDF download time.
- No server-side PDF generation. PDFs are rendered by the browser's print engine from a dedicated HTML page per role.
- No custom domain in v1 — default GitHub Pages URL is fine.
- No SPA, no client-side routing beyond a single `?role=<key>` query param on the resume page.

## 3. Architecture

```
data/profile.json (master record)        ──┐
data/roles/<role>.json (5 overlays)      ──┤──► js/render-portfolio.js  ──► index.html DOM
                                            │
                                            └──► js/render-resume.js (reads ?role=)
                                                 ──► resume.html DOM ──► window.print() ──► user "Save as PDF"
```

**Stack:** Vanilla HTML / CSS / JS. No build step. ES modules optional but not required.
**Fonts:** Google Fonts (Fraunces + Newsreader) for the portfolio; system fonts (Calibri / Arial / Helvetica) for the resume to guarantee ATS-clean printing.
**Hosting:** GitHub Pages from `main`, deployed via `.github/workflows/deploy.yml`.

## 4. File layout

```
/
├── index.html                          # portfolio (renders from profile.json)
├── resume.html                         # generic printable template (reads ?role=<key>)
├── data/
│   ├── profile.json                    # master — single source of truth
│   └── roles/
│       ├── general.json                # the catch-all variant
│       ├── training-ld.json
│       ├── edtech-counselor.json
│       ├── data-analyst.json
│       ├── hr-operations.json
│       └── school-coordinator.json
├── css/
│   ├── styles.css                      # portfolio screen styles (warm-professional editorial)
│   └── resume.css                      # ATS-clean print + on-screen resume styles
├── js/
│   ├── render-portfolio.js             # fetch profile.json → render index.html
│   ├── render-resume.js                # fetch profile.json + roles/<role>.json → render resume.html
│   └── role-picker.js                  # modal logic + role catalogue
├── assets/
│   ├── deepa.jpg                       # extracted from DeepaJuneja__Resume.pdf during implementation
│   └── favicon.svg
├── .github/workflows/deploy.yml        # GH Pages deploy on push to main
├── docs/superpowers/specs/             # this folder
└── README.md
```

The `mockup/` directory was the visual contract during design and has been removed in favour of the live `index.html` / `resume.html`.

## 5. JSON schema

### 5.1 `data/profile.json` — master record

Single source of truth. The portfolio reads this directly. Each role overlay refers to items here by `id`.

```json
{
  "name": "Deepa Juneja",
  "tagline": "Educator. Coordinator. Operator.",
  "contact": {
    "email": "d.deepa2601@gmail.com",
    "phone": "+91-9205562407",
    "location": "Sector 23, Gurugram, Haryana, India",
    "linkedin": "https://www.linkedin.com/in/deepa-juneja/"
  },
  "languages": ["English", "Hindi"],
  "summary_general": "BCA, MCA, and an MBA — and over a decade running classrooms and school operations. I'm bringing that craft to corporate training, operations, and analytics.",
  "about": [
    "My career began with computer applications — BCA, then MCA, with an MBA done in parallel. The first paid year was teaching DBMS to BCA students as a contract lecturer in Rohtak. The decade that followed turned educational — coordinating schools, running examinations, building activity calendars, and teaching science. What looks like a 'switch' was always one continuous thread: figuring out how a group of people learns a complicated thing on a schedule.",
    "Curriculum is a roadmap. A timetable is an operations plan. A parent–teacher meeting is stakeholder management. The vocabulary changes between schools and offices; the work doesn't. I'm looking for a role where this combination — three degrees, over a decade of running rooms full of people, and a fresh layer of AI fluency — does its best work."
  ],
  "pull_quote": "I taught science to teenagers, ran a school's calendar, and made spreadsheets the staff actually used. The work was always operational — it just lived inside a classroom.",
  "education": [
    { "id": "mba",  "degree": "Master of Business Administration", "institution": "Maharishi Dayanand University, Rohtak", "score": "~79%",  "start": "2010", "end": "2012" },
    { "id": "mca",  "degree": "Master of Computer Applications",   "institution": "Vaish College of Engineering, Rohtak", "score": "~78%",  "start": "2008", "end": "2011" },
    { "id": "bca",  "degree": "Bachelor of Computer Applications", "institution": "L.N. Hindu College, Rohtak",          "score": "75%",   "start": "2005", "end": "2008" },
    { "id": "xii",  "degree": "12th Standard, CBSE",               "institution": "Shiksha Bharti School, Rohtak",       "score": "71%",   "start": "2003", "end": "2004" },
    { "id": "x",    "degree": "10th Standard, CBSE",               "institution": "D.A.V Public School, Rohtak",         "score": "72%",   "start": "2001", "end": "2002" }
  ],
  "experience": [
    { "id": "ai-upskill",  "title": "Self-directed AI Upskilling",       "organization": "Independent",                       "location": "Remote",            "start": "2025-02", "end": "present",     "type": "self-directed", "highlights": ["Working through Google's AI Essentials and AI Professional Certificate (Coursera).", "Daily working use of ChatGPT, Gemini, and Claude for research, writing, and planning.", "Pivoting from EdTech-AI to broader corporate roles in training, operations, and analytics."] },
    { "id": "shikshiyan",  "title": "Science Teacher",                   "organization": "Shikshiyan School",                  "location": "Gurugram",          "start": "2024-04", "end": "2025-01",     "highlights": ["Taught Science to Grades 7 and 8.", "Designed lesson plans, assessments, and classroom activities aligned with the school's curriculum.", "Mentored students through term-end examinations and remediation."] },
    { "id": "alpine",      "title": "Science Faculty",                   "organization": "Alpine Convent School",              "location": "Gurgaon",           "start": "2023-04", "end": "2023-12",     "highlights": ["Taught Science to upper-primary and middle-school students.", "Held additional charge as Activity Head; led school-level Science Quizzes and inter-school competitions."] },
    { "id": "gao-tek",     "title": "HR Intern (part-time, remote)",     "organization": "GAO Tek Group",                      "location": "Remote",            "start": "2023-05", "end": "2023-06",     "highlights": ["Coordinated candidate sourcing pipelines using shared trackers and Microsoft Teams.", "Maintained candidate and interviewer schedules in MS Excel; produced weekly progress reports.", "Drafted standardised outreach templates and onboarding checklists adopted by the wider HR team."] },
    { "id": "home-tuition","title": "Home Tuition Educator",             "organization": "Self-employed",                       "location": "Rohtak",            "start": "2019",    "end": "2023",        "highlights": ["Taught all subjects to Grades 6–10 — batches of 8 to 10 students.", "Kept teaching going through the pandemic when classrooms weren't an option.", "Built lesson plans, ran assessments, and tracked student progress over multiple academic years."] },
    { "id": "amps",        "title": "Science Faculty, then Coordinator", "organization": "American Montessori Public School",  "location": "Gurugram",          "start": "2017",    "end": "2019",        "highlights": ["Joined as Science Faculty; promoted to Coordinator with charge over the academic and activity calendar.", "Owned exam logistics — seating, invigilation rosters, result compilation — for 600+ students.", "Acted as the operational point of contact between parents, teachers, and the principal's office."] },
    { "id": "iimt",        "title": "Project Coordinator",               "organization": "IIMT College of Pharmacy",            "location": "Greater Noida",     "start": "2016",    "end": "2017-01",     "highlights": ["Coordinated departmental projects, academic events, and student records across multiple faculty stakeholders.", "Prepared trackers and weekly status documents that became the standard reporting format for the department."] },
    { "id": "ved",         "title": "School Coordinator",                "organization": "Ved Model International School",      "location": "Rohtak",            "start": "2014",    "end": "2016",        "highlights": ["Managed end-to-end academic operations: timetabling, substitute scheduling, examination administration.", "Led extra-curricular programming and inter-school events; coordinated vendor logistics for school functions."] },
    { "id": "neki-ram",    "title": "Contract Lecturer, DBMS",           "organization": "Neki Ram College",                    "location": "Rohtak",            "start": "2012",    "end": "2013",        "highlights": ["Taught Database Management Systems to Bachelor of Computer Applications students as a full-time contract lecturer.", "Designed coursework, conducted lab sessions, and evaluated semester assessments."] }
  ],
  "career_chapters": [
    { "year": "2008",            "title": "BCA.",                                  "org": "L.N. Hindu College, Rohtak.",                  "body": "Three years on computer applications — C++, databases, the bones of how software is built." },
    { "year": "2011",            "title": "MCA.",                                  "org": "Vaish College of Engineering, Rohtak.",        "body": "Three more years on the technical side — software engineering, systems, and the DBMS I'd later teach." },
    { "year": "2012",            "title": "MBA.",                                  "org": "Maharishi Dayanand University.",               "body": "Business administration in parallel with the MCA — operations, HR, strategy. The frameworks behind the work." },
    { "year": "2012–13",         "title": "Contract Lecturer, DBMS.",              "org": "Neki Ram College, Rohtak.",                    "body": "Full-time lecturer for BCA students — first time on the other side of the lecture hall." },
    { "year": "2013–14",         "title": "A personal year.",                      "org": "Marriage and home.",                           "body": "A year away from work — the kind of pause that's part of any honest career." },
    { "year": "2014–16",         "title": "School Coordinator.",                   "org": "Ved Model International School, Rohtak.",      "body": "End-to-end academic operations — timetabling, examinations, inter-school events." },
    { "year": "2016–17",         "title": "Project Coordinator.",                  "org": "IIMT College of Pharmacy, Greater Noida.",     "body": "Departmental projects, academic events, and the trackers that became the team's reporting standard." },
    { "year": "2017–19",         "title": "Science Faculty, then Coordinator.",    "org": "American Montessori, Gurugram.",               "body": "Taught Science, then took over the academic and activity calendar for 600+ students across grade levels." },
    { "year": "2019–23",         "title": "Home tuition.",                         "org": "Rohtak, through the pandemic.",                "body": "All subjects, Grades 6–10, batches of 8 to 10 students — kept the work going when classrooms weren't an option." },
    { "year": "Apr–Dec 2023",    "title": "Science Faculty.",                      "org": "Alpine Convent School, Gurgaon.",              "body": "Returned to a school classroom from April through December — a final teaching chapter before the corporate pivot." },
    { "year": "May–Jun 2023",    "title": "HR Intern, part-time.",                 "org": "GAO Tek Group, Remote.",                       "body": "A two-month internship alongside Alpine — first formal corporate experience since the MBA." },
    { "year": "2024–25",         "title": "Science Teacher.",                      "org": "Shikshiyan School, Gurugram.",                 "body": "Taught Science to Grades 7 and 8 from April 2024 to January 2025." },
    { "year": "2025→ now",       "title": "AI upskilling and the pivot.",          "org": "Self-directed.",                               "body": "Working through Google's AI Essentials and AI Professional Certificate. Looking for the next chapter — training, operations, or analytics." }
  ],
  "skills": {
    "office_productivity": ["Microsoft 365", "Excel", "PowerPoint", "Word", "Microsoft Showcase", "Canva"],
    "operations_people":   ["Stakeholder management", "Curriculum design", "Team leadership", "Activity coordination", "Examination logistics", "L&D content"],
    "technical_ai":        ["C++", "Java", "HTML", "DBMS", "Software Testing", "MIS reporting", "ChatGPT (daily use)", "Gemini (daily use)", "Claude (daily use)", "Google AI · learning", "Power BI · learning", "SQL · learning"]
  },
  "certifications": [
    { "id": "google-ai-essentials", "name": "Google AI Essentials",                  "issuer": "Google",   "status": "in-progress" },
    { "id": "google-ai-prof",       "name": "Google AI Professional Certificate",    "issuer": "Coursera", "status": "in-progress" },
    { "id": "cbse-nep",             "name": "NEP 2020 — Salient Features",           "issuer": "CBSE",     "status": "completed" },
    { "id": "cbse-math",            "name": "Joyful Mathematics",                    "issuer": "CBSE",     "status": "completed" },
    { "id": "cbse-storytelling",    "name": "Story Telling in Classroom",            "issuer": "CBSE",     "status": "completed" },
    { "id": "udemy-testing",        "name": "Software Testing — Foundations",        "issuer": "Udemy",    "status": "completed" }
  ]
}
```

### 5.2 `data/roles/<role>.json` — overlay

Each overlay tells the resume renderer which experience to include, in what order, what to override, and what to lead with.

```json
{
  "role_key": "data-analyst",
  "role_title": "Data / MIS Analyst",
  "summary": "Computer Applications postgrad (BCA, MCA) and MBA with twelve years building, running, and reporting on operational systems in schools and small institutions. Practical proficiency in Excel and MIS reporting from day-to-day school operations; SQL and Power BI in active progress. Seeking a junior Data / MIS Analyst role to apply the analytical foundation to a business-driven environment.",
  "include_experience": ["ai-upskill", "gao-tek", "amps", "iimt", "ved", "neki-ram"],
  "experience_overrides": {
    "amps": {
      "highlights": [
        "Maintained student and staff records in MS Excel; produced termly reports for the principal's office.",
        "Owned the examination logistics tracker — seating, invigilation, results — as the de-facto MIS for 600+ students.",
        "Coordinated faculty schedules across grade levels — stakeholder management for 25+ teachers."
      ]
    }
  },
  "emphasized_skills": [
    "Microsoft Excel (advanced)",
    "MIS reporting",
    "Data visualisation (Power BI · learning)",
    "SQL (basics · learning)",
    "DBMS fundamentals",
    "Stakeholder management",
    "Google AI Essentials (in progress)"
  ],
  "include_certifications": ["google-ai-essentials", "google-ai-prof", "udemy-testing"],
  "keywords": ["MIS", "Excel", "VLOOKUP", "reporting", "MBA", "MCA", "data analysis", "Power BI", "SQL", "DBMS"]
}
```

### 5.3 Render rules

- `include_experience`: array of `experience[].id`. Items render in the order given. Items not listed are omitted.
- `experience_overrides[<id>].highlights`: when present, **replaces** the master `highlights` for that item; when absent, master highlights are used.
- `emphasized_skills`: flat array. Becomes the Skills section, replacing the master `skills` block on the resume.
- `include_certifications`: array of `certifications[].id`. Filters the cert section. Use `["all"]` for general resume.
- `summary`: role-specific paragraph, replaces the generic `summary_general` at the top of the resume.
- `keywords`: not rendered; used as a hidden `<meta>` for ATS keyword density (no white-text-on-white tricks; just declared in the head as `name="keywords"`).

### 5.4 The `general` variant

`data/roles/general.json` is a pass-through:

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

The renderer treats the literal string `"all"` for `include_experience`, `emphasized_skills`, and `include_certifications` as "include everything from `profile.json` in master order."

## 6. Pages

### 6.1 `index.html` — the portfolio

**Sections in order (matches the approved mockup):**

1. **Masthead** — name + nav (About / Work / Career / Resume / Contact)
2. **Hero** — name, lede, meta strip, two CTAs ("Download Resume" → opens role picker; "Get in touch" → scrolls to contact), photo frame
3. **§ I — About** — pull quote left, two paragraphs right (no drop-cap in tightened version)
4. **§ II — Where the work happened** — 8 experience rows (newest first)
5. **§ III — Education & credentials** — 3 degrees (MBA / MCA / BCA) left + 6 certifications right (10th, 12th appear only on resume, not portfolio)
6. **§ IV — The career so far** — 13 career-chapter rows in a 2-column grid
7. **§ V — Skills I know** — 3 columns (Office & productivity / Operations & people / Technical & AI)
8. **§ VI — Take the resume** — short blurb + single "Download Resume" button that opens the role picker
9. **Footer / Contact** — desk block, reach block (email / phone / location), elsewhere block (LinkedIn / GitHub source / Resume anchor)

**Behavior:** On `DOMContentLoaded`, `render-portfolio.js` fetches `data/profile.json` and populates sections by `data-section="..."` slots. If the fetch fails the page degrades to a static stub message; full hard-coded fallback is not required.

### 6.2 `resume.html` — the printable role resume

**URL form:** `resume.html?role=<key>` where `<key>` is one of `general | training-ld | edtech-counselor | data-analyst | hr-operations | school-coordinator`. Missing or unknown `role` defaults to `general`.

**Behavior:**
1. Read `?role=` from `URLSearchParams`.
2. Fetch `data/profile.json` and `data/roles/<role>.json` in parallel.
3. Apply overlay to master per §5.3.
4. Render into the ATS-clean template.
5. Show a screen-only "Save as PDF" button that calls `window.print()` (button has `class="no-print"`, hidden in print stylesheet).
6. Title set to `Deepa Juneja — <Role Title> Resume` so Chrome/Edge default the filename usefully.

**Critical: do not auto-trigger print.** The user clicks the button. Auto-print is hostile.

### 6.3 Role-picker modal

Lives in `index.html` markup; logic in `js/role-picker.js`.

**Structure (top to bottom):**
1. Close button
2. **Primary section** — kicker "§ THE RESUME DESK" + big dark "Download my complete resume" card with subtitle "All experience and skills, in one place." Clicking → navigates to `resume.html?role=general`.
3. Divider — "— OR PICK A SPECIFIC ROLE —"
4. **Sub-head** — "Which role are you recruiting for?" + line "I'd happily send a focused version that leads with the most relevant experience."
5. Search input (live substring filter, case-insensitive)
6. Grouped, scrollable role list — ~40 common Indian job titles mapped to the 5 underlying variants (see Appendix A)
7. Footer keyboard hint — ↑↓ ↵ Esc

**Behavior:**
- Opens on click of any `[data-open-picker]` element.
- Closes on `Esc`, backdrop click, or the `×` button.
- ↑↓ move focus; ↵ navigates to `resume.html?role=<variant>`; mouse hover sets focus.
- Empty search shows full grouped list. Non-empty filters on role name + variant label, with `<mark>` highlight on matched text.
- No matches → shows the 5 variants as plain rows so the recruiter can pick one manually.

## 7. ATS rules — resume PDFs

Hard constraints baked into `css/resume.css` and `resume.html`:

- **No photo, no icons, no logos** on the printed resume.
- **Single column** — no flex/grid containers for content blocks in print; only for in-screen chrome.
- **No tables, no text boxes, no floating elements** for content. Plain `<h1>`/`<h2>`/`<p>`/`<ul>`/`<li>`.
- **Standard fonts only** — `font-family: Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif`. No Google Fonts on the resume.
- **Black on white in print** — `@media print { body { background: #FFF !important; color: #000; } }`.
- **Selectable text only** — no images-of-text. SVG icons explicitly forbidden in the resume body.
- **Section headings** ATS recognises: `Summary`, `Experience`, `Education`, `Skills`, `Certifications`. Do not creative-rename these in resume HTML even though the portfolio uses § I / § II / etc.
- **Reverse-chronological** experience with month + year dates (e.g., `Apr 2024 – Jan 2025`).
- **Page setup**: `@page { size: A4; margin: 0.55in 0.65in; }`. Page-break-inside avoid on each job and education item.
- **Filename**: rely on `<title>` (Chrome/Edge use page title for default PDF filename). Title format: `Deepa Juneja — <Role Title> Resume`.
- **Keywords** in `<meta name="keywords" content="...">` from `role.keywords` — declared metadata, no hidden text in the body.

## 8. Visual design

### 8.1 Portfolio (warm-professional editorial)

- **Palette:**
  - Background `--cream: #F3ECDC`
  - Paper `--paper: #FAF5EA`
  - Ink `--ink: #1E1812`, soft `--ink-2: #3B3025`
  - Mute `--mute: #8A7C66`, line `--line: #D6C9AC`
  - Terra accent `--terra: #B25339`, deep `--terra-2: #8F3D24`
  - Sage support `--sage: #6F8166`, honey highlight `--honey: #C5853A`
- **Type:** display + body **Fraunces** (serif, variable: `opsz`, `wght`, `SOFT`); body alternative **Newsreader** (literary serif).
- **Subtle paper grain:** SVG fractal-noise overlay at `opacity: .14`, `mix-blend-mode: multiply`.
- **Asymmetric magazine layout:** masthead, 60/40 hero, two-column journey grid, three-column skills.
- **Hover treatments:** terracotta underline grows on links and experience rows; ink-fill slide on resume CTA (in earlier draft; current quiet "Resume" section is a simple button).
- **Animations:** staggered fade-up on hero only (`@keyframes rise`), no scroll-jacking. Respects `prefers-reduced-motion: reduce`.
- **Responsive:** Single-column collapse at `≤900px`; meta/kickers hidden on mobile.

### 8.2 Resume (ATS-clean)

- White paper background, 1px screen-only border + soft shadow when previewed in the browser; both stripped in print.
- Calibri at 11pt body, 22pt name in tracked all-caps, 11.5pt uppercase tracked section headings with a 0.75pt black rule underneath.
- Action bar (screen only): back link to portfolio, role tag, dark "↓ Save as PDF" button.

## 9. Deployment

- **GitHub Actions workflow** at `.github/workflows/deploy.yml`:
  - Triggers on `push` to `main`.
  - Uses `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` (root path), and `actions/deploy-pages@v4`.
  - No build step — the repo root is the artifact.
- **Settings:** Pages source set to "GitHub Actions" in the repo settings.
- **No custom domain in v1.** Default URL: `https://raiaman15.github.io/deepa-juneja/`.

## 10. Data of record

The verified single-source-of-truth data (already captured in §5.1 above) was confirmed entry-by-entry with the user on 2026-05-27. Highlights of corrections that overrode the raw resume PDFs:

- **MBA dates: 2010 – 2012, ~79%** (not 2019 – 2021, not 78%).
- **MCA: Vaish College of Engineering, Rohtak — 2008 – 2011, ~78%** (was either missing or shown as MDU in resumes).
- **D.A.V Public School Science Faculty entry: removed** (did not happen — likely a resume artefact).
- **New entry: Contract Lecturer, DBMS at Neki Ram College, Rohtak — 2012 – 2013** (was missing from all three resumes).
- **2013 – 2014: personal year (marriage)** — acknowledged on the timeline.
- **Home tuition in Rohtak, all subjects, Grades 6–10, batches of 8–10, 2019 – 2023** — pandemic-era self-employment, missing from resumes.
- **Alpine Convent dates: April 2023 – December 2023** (not 2019 – 2021 as I had estimated).
- **GAO Tek HR Intern reframed as part-time, remote** to explain the May–Jun 2023 overlap with Alpine.
- **New entry: Shikshiyan School, Gurugram — Science, Grades 7 & 8 — April 2024 – January 2025.**
- **Feb 2025 – present: self-directed AI upskilling** — Google AI Essentials + Google AI Professional Certificate (Coursera), both in progress; daily working use of ChatGPT, Gemini, Claude.
- **LinkedIn:** `https://www.linkedin.com/in/deepa-juneja/`.

## 11. Open items

- **Photo extraction:** `assets/deepa.jpg` needs to be extracted from `DeepaJuneja__Resume.pdf` at implementation time. No PDF-extraction tools were available in the brainstorming environment; implementation should either use a Python helper (`pdf2image`, `pdfplumber`) or convert the PDF to a PNG via `sips` / `qlmanage` on macOS, then crop the embedded headshot. If extraction fails, fall back to the styled `DJ` initial in a terracotta gradient frame (already designed).
- **Resume bullet content for each role overlay:** the `experience_overrides` for the 6 variants need writing during implementation. The data structure is locked; the prose is not. Sketch one variant first, get the user's review, then write the other five.
- **Favicon:** simple SVG monogram in terracotta on cream.
- **Custom domain:** out of scope for v1; revisit later.

## 12. Appendix A — Role-picker catalogue

The 5 underlying variants:

| Key | Label |
|---|---|
| `training-ld` | Training & L&D |
| `edtech-counselor` | EdTech Counsellor |
| `data-analyst` | Data / MIS Analyst |
| `hr-operations` | HR / Operations |
| `school-coordinator` | School Coordinator |

Plus the catch-all `general` (no list entry — accessed via the primary CTA at the top of the picker).

Common posted job titles → variant mapping (the searchable list inside the modal):

- **HR / Operations:** HR Coordinator, HR Executive, HR Generalist, HR Assistant / Associate, Operations Coordinator, Operations Executive, Office Coordinator, Admin Coordinator, Recruiting Coordinator, People Operations Associate
- **Training & L&D:** Training Coordinator, L&D Coordinator, Learning & Development Executive, Corporate Trainer, Process Trainer (BPO / KPO), Training Specialist, Soft Skills Trainer, Onboarding Specialist, Instructional Designer, IT Training Coordinator
- **Data / MIS:** Data Analyst (Junior), MIS Executive, MIS Analyst, Reporting Analyst, Business Analyst (Junior), Excel / Power BI Analyst, Operations Analyst
- **EdTech:** Academic Counsellor, Admissions Counsellor, Education Counsellor, EdTech Coordinator, Programme Coordinator, Career Counsellor, Student Success Associate
- **School Coordinator:** School Coordinator, Academic Coordinator, Faculty Coordinator, Activity Head, Science Faculty / Teacher, Headmistress / Vice Principal
