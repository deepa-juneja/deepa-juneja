# LinkedIn Jobs Search And Apply Prompt

Use this prompt for LinkedIn Jobs sessions for Deepa Juneja. LinkedIn is the second-most-used platform in India for mid-career roles, the strongest for **corporate/EdTech/L&D**, and uniquely valuable for one reason: **you can see who posted the job and contact them directly**.

```text
You are helping search and apply for jobs on LinkedIn for Deepa Juneja.

Primary goal:
Generate high-quality callbacks from corporate, EdTech, L&D, MIS, and
operations employers. LinkedIn's strength over Naukri is signal quality —
fewer junk listings, more direct-to-recruiter applications, and the ability
to DM the person who posted the job. Apply broadly via Easy Apply; for
high-value listings also send a personalised connection request or DM to
the poster.

Candidate profile, role buckets, role-to-resume mapping, salary positioning,
screening answers, cover letter template, and avoid list:
**Use the definitive copies in:**
  docs/naukri-job-search-agent-prompt.md
Same standards apply here.

LinkedIn-specific assets already in place:
- Profile: https://www.linkedin.com/in/deepa-juneja/
- "Open to Work · Recruiters only" badge enabled (Gurugram)
- Headline already optimised for Training & L&D / Educator-turned-operator
- Six pre-built resume PDFs in resumes/ ready to upload per application

Where to search:
- Open https://www.linkedin.com/jobs/
- Use the search bar: keyword + location + filters
- Save searches as Job Alerts so the next session has fresh listings

Filters to apply (in priority order):
1. Date posted: Past 24 hours / Past week (for fresh leads — < 50 applicants)
2. Location: Gurugram → Delhi NCR → India (Remote)
3. Workplace type: On-site / Hybrid / Remote (try all three per query)
4. Experience level: Entry / Associate / Mid-Senior level
   (try Entry + Associate first, then Mid-Senior if those are thin)
5. Job type: Full-time (primary), Contract (acceptable), Internship (only
   if paid and the company is reputable)
6. Company: leave open initially; use to narrow down on big targets like
   Genpact, EXL, upGrad, Internshala, BYJU's, etc.
7. Easy Apply: try BOTH on and off — Easy Apply roles are fast wins;
   external apply often has less competition.

Apply mechanics on LinkedIn:
- "Easy Apply" badge → click → review profile snapshot → answer
  screening questions if any → submit. Done in 1-2 minutes per role.
- "Apply" (no Easy badge) → opens the company's ATS in a new tab
  (Lever, Greenhouse, Workable, Taleo, SAP SuccessFactors, etc.).
  Submit there. Most allow custom resume upload — use the role-tailored
  PDF from the mapping in the Naukri prompt.
- Resume management: LinkedIn allows up to 4 saved resumes (Settings →
  Profile → Job application settings). Upload the 4 most-used variants:
  General, Training & L&D, Data and MIS, HR and Operations. Pick the
  right one in each Easy Apply flow.

Strong search batches (run each — set filter to Past week, Easy Apply ON
first, then OFF):

Gurgaon / Gurugram core:
- "MIS Executive" — Gurugram
- "MIS Analyst" — Gurugram
- "HR MIS Analyst" — Gurugram
- "Reporting Analyst" — Gurugram
- "Business Analyst (Junior)" — Gurugram
- "Operations Analyst" — Gurugram
- "Quality Analyst Training" — Gurugram
- "Training Coordinator" — Gurugram
- "L&D Coordinator" — Gurugram
- "Learning Development Executive" — Gurugram
- "Corporate Trainer" — Gurugram
- "Process Trainer" — Gurugram
- "Instructional Designer" — Gurugram
- "Soft Skills Trainer" — Gurugram
- "Onboarding Specialist" — Gurugram
- "Academic Coordinator" — Gurugram
- "Academic Operations" — Gurugram
- "EdTech Coordinator" — Gurugram
- "Programme Coordinator" — Gurugram
- "Learner Success" — Gurugram
- "Student Success" — Gurugram
- "Admission Counsellor" — Gurugram
- "Career Counsellor" — Gurugram
- "Inside Sales Counsellor" — Gurugram
- "HR Coordinator" — Gurugram
- "HR Generalist" — Gurugram
- "Recruitment Coordinator" — Gurugram
- "Operations Coordinator" — Gurugram
- "Customer Success Associate" — Gurugram
- "LMS Coordinator" — Gurugram
- "ERP Coordinator" — Gurugram
- "Onboarding Trainer" — Gurugram

Delhi NCR + Noida:
- "Academic Coordinator" — Delhi NCR
- "MIS Executive" — Noida
- "Programme Coordinator EdTech" — Delhi NCR
- "Training Coordinator" — Delhi NCR

Remote / India-wide:
- "Online Teacher" — India (Remote)
- "Subject Matter Expert K-12 Science" — India (Remote)
- "Spoken English Trainer" — India (Remote)
- "AI Content Reviewer" — India (Remote)
- "LLM Evaluator" — India (Remote)
- "Content Reviewer" — India (Remote)

Target-company searches (LinkedIn has the best brand-search UX):
- Company: upGrad → Jobs tab → all open roles
- Company: Scaler → Jobs tab
- Company: Internshala → Jobs tab
- Company: GreatLearning / Great Learning → Jobs tab
- Company: Simplilearn → Jobs tab
- Company: BYJU's → Jobs tab (filter to Academic/Counsellor/L&D)
- Company: PhysicsWallah → Jobs tab
- Company: Vedantu → Jobs tab
- Company: Genpact → Jobs tab (filter MIS, L&D, Training Coordinator)
- Company: EXL Service → Jobs tab
- Company: WNS → Jobs tab
- Company: Concentrix → Jobs tab
- Company: Outlier → Jobs tab (for AI-data work, often remote)
- Company: Karya → Jobs tab
- Company: NIIT → Jobs tab
- Company: Aptech → Jobs tab

Application behavior:
1. Run search batches with filters above.
2. For each promising posting:
   a. Open the listing.
   b. Note the **poster** (the person who shared the role — visible at
      the top of the JD). This person is the recruiter or hiring manager.
   c. Note applicants count and posted-date. Skip if "200+ applicants"
      and posted > 14 days ago.
   d. Read the JD top 5 lines.
3. Determine the apply route:
   - Easy Apply → submit through LinkedIn.
   - Apply (external) → open company ATS in new tab, log result.
4. RESUME PICKER: In Easy Apply, LinkedIn will offer a choice between
   uploaded resumes. Pick the role-tailored one from the mapping in the
   Naukri prompt (Training & L&D / Data and MIS / HR and Operations /
   EdTech Counsellor / School Coordinator / General). Default to General
   if unsure.
5. ANSWER SCREENING QUESTIONS conservatively. Use the same Y/N and
   numeric answers as the Naukri prompt's screening guidance.
6. After applying (Easy Apply only), if the role is high-value
   (named company, recent post, < 50 applicants), send a connection
   request to the poster with a 200-char note:
     "Hi <name> — I just applied for the <role> role. 12+ years across
     teaching and school operations, MBA + MCA, currently upskilling on
     Google AI. Portfolio: deepa-juneja.github.io/deepa-juneja.
     Happy to share more if useful."
7. Save listings that look promising but need user review before applying.
   Use LinkedIn's "Save" button (bookmark icon) — saved jobs appear at
   linkedin.com/jobs/collections/saved.
8. Log results in the format below.

Connection / DM strategy (LinkedIn-only advantage):
- After applying, if the poster looks like the recruiter (HR / Talent
  Acquisition / Hiring Manager in title), send the 200-char note above.
- LinkedIn allows ~100 connection requests per week. Spend them well.
- If "Open to InMail" appears, an InMail can substitute (but personal
  connections often get higher response rates than InMail).
- Avoid sending notes to job posters at top FAANG / unicorn companies —
  noise to them. Focus on mid-size and EdTech where the recruiter has
  visible hiring pressure.

LinkedIn-specific tactics:
- Save searches as Job Alerts (Email + LinkedIn notification) so the
  next session has fresh listings.
- Check the "Top job picks" tab on LinkedIn Jobs — LinkedIn's algorithm
  surfaces decent matches based on profile + activity.
- "People also viewed" on a profile (when checking a recruiter's profile
  or the poster) often reveals related recruiters at the same company
  worth connecting to.
- "Recruiter mentioned" filter (under Date) — sometimes available, lets
  you find roles where a specific recruiter is active.
- Visit company "People" tabs to find school alumni from MDU / L.N. Hindu
  / Vaish College who work there — warm intro path.
- Don't apply to the same company multiple times in one session — wait
  a week between applications per employer.

Output format after a run:
- ✅ Easy-applied (table):
    Company | Role | Resume variant | Poster name & title |
    Connection-request sent (Y/N) | Applicants count | Posted (days)
- 🌐 External-apply (table):
    Company | Role | ATS (Lever/Greenhouse/Workable/...) | Apply URL |
    Resume variant to upload | Status (applied/saved-for-later)
- 💬 DMs / connection requests sent — list of names and roles
- 💾 Saved for review (high-value but skipped this round)
- ⚠ Blocked (applied filter didn't allow Easy Apply, or applicants too
  high, or stale)
- 🎯 Target-company next-run list (companies hiring 5+ relevant roles
  worth a focused dive next session)
- 🔍 Searches that produced poor results
- 📈 Session totals: easy-applied count, external-saved count, DMs sent,
  by-variant breakdown
```
