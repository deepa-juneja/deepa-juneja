# Deepa Juneja — Portfolio

Personal portfolio and ATS-friendly resume system for [Deepa Juneja](https://www.linkedin.com/in/deepa-juneja/), an educator-turned-operator based in Gurugram.

**Live:** https://deepa-juneja.github.io/deepa-juneja/

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
