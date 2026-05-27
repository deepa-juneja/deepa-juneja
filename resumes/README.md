# Pre-built resume PDFs

ATS-friendly resume PDFs generated from `data/profile.json` and the role overlays in `data/roles/`. Attach the right one when applying.

## Which file to attach

| Target role on the job posting | Attach this file |
|---|---|
| Default / unsure / multi-purpose / generalist | **Deepa Juneja - General.pdf** |
| Training Coordinator, L&D Coordinator, Corporate Trainer, Process Trainer, Instructional Designer, Onboarding Specialist | **Deepa Juneja - Training & L&D Coordinator.pdf** |
| Academic Counsellor, Admissions Counsellor, Career Counsellor, EdTech Coordinator, Programme Coordinator, Student/Learner Success | **Deepa Juneja - EdTech Counsellor.pdf** |
| Data Analyst (Junior), MIS Executive / Analyst, Reporting Analyst, Business Analyst (Junior), Excel/Power BI Analyst, Operations Analyst | **Deepa Juneja - Data and MIS Analyst.pdf** |
| HR Coordinator/Executive/Generalist/Assistant, Operations Coordinator/Executive, Office/Admin Coordinator, Recruiting Coordinator, People Operations | **Deepa Juneja - HR and Operations Coordinator.pdf** |
| School Coordinator, Academic Coordinator, Faculty Coordinator, Activity Head, Science Faculty/Teacher | **Deepa Juneja - School Coordinator.pdf** |

When in doubt, use **General**.

## Regenerating

These PDFs are produced from the JSON data — they are NOT hand-edited. Any time the profile or overlays change, regenerate:

```bash
npm run generate-pdfs
# or:  ./scripts/generate-pdfs.sh
```

The script:
1. Validates the JSON data.
2. Spins up a local static server.
3. Uses Google Chrome in headless mode to render each `resume.html?role=<key>` and print to PDF.
4. Saves into this folder with recruiter-facing filenames.

Re-commit the updated PDFs after regenerating.

## ATS-friendliness

Each PDF satisfies common ATS constraints:

- Single column, no tables/text-boxes for content
- Standard fonts (Calibri / Helvetica fallback) — no Google Fonts
- No photos, no icons, no embedded images in the resume body
- Plain section headings — `Summary`, `Experience`, `Education`, `Skills`, `Certifications`
- Selectable text — verified via `pdftotext`
- Reverse-chronological experience with month + year dates
- A4 page size

Verified with `pdftotext` extraction — names, dates, and bullet content come through as plain text.
