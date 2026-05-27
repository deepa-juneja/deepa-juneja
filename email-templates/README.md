# Email templates

Pre-formatted HTML emails Deepa can paste into Gmail when reaching out about opportunities. Each template uses the same warm-professional palette as [the portfolio site](../index.html), but with **web-safe fonts and inline styles only** so the formatting survives in Gmail, Apple Mail, Outlook, and mobile clients.

## Templates

| File | Purpose |
|---|---|
| [`school-outreach.html`](school-outreach.html) | Introduce Deepa to schools — Science Faculty / Academic Coordinator / School Coordinator. Pair with `?role=school-coordinator` PDF. |

## How to send one

1. **Download the matching resume PDF.**
   - Open https://raiaman15.github.io/deepa-juneja/
   - Click *Download Resume*
   - In the picker, type the role you're targeting (e.g. *School Coordinator*, *Science Faculty*) and pick it
   - On the resume page, click **↓ Save as PDF**
   - Save it somewhere easy to find

2. **Open the template in a browser.** Double-click the `.html` file in Finder, or right-click → *Open With* → Chrome / Safari. You should see the rendered email, not the source code.

3. **Copy everything.** Click anywhere on the page, then `⌘ A` to select all, `⌘ C` to copy.

4. **Paste into Gmail.** Open Gmail → *Compose* → click inside the body of the message → `⌘ V`. The colors, headings, and layout will be preserved as rich text.

5. **Fill in the bracketed placeholders.** `[Principal / Head of School]` and `[School Name]`.

6. **Attach the resume PDF** from step 1.

7. **Set the subject line.** Each template's HTML comments include suggestions.

8. **Send.**

## A note on HTML email

- Don't paste the raw HTML source code into Gmail — paste the rendered output. Gmail interprets pasted source as text.
- Inline styles are required: Gmail strips most `<style>` blocks.
- Web fonts (Google Fonts) are unreliable in email — these templates use Georgia + Helvetica fallbacks for the Fraunces + Newsreader pair on the portfolio.
