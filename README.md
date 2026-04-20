# Study Plan Generator

A single-file, offline web app that turns your exam subjects, topics, and available time into a printable day-by-day study schedule.

No build step. No server. No dependencies. Just open `index.html` in a browser.

## Live demo

Once GitHub Pages is enabled on this repo, the site is available at:

```
https://<your-username>.github.io/<repo-name>/
```

## Features

- **Live preview** — the plan regenerates automatically as you type. No "Generate" button to click.
- **Autosave** — your form state is stored in `localStorage` and restored when you reopen the page.
- **Interactive checklist** — click any topic in the coverage grid to tick it off (`☐ → ☑`). Progress is saved and reflected in a progress bar at the top.
- **Drag-to-reorder** — drag subjects to change their order (and the scheduling order).
- **Color-coded subjects** — each subject gets its own color for the whole plan (chips, borders, checklist cards).
- **Stepper inputs** for time slots — tap +/− or type directly.
- **Quick presets** — one click to apply "Light", "Standard", "Intensive", or "Clear all" time-slot setups.
- **Weight slider** — 0.5× to 2× per subject, shown as a live multiplier.
- **Live form summaries** — as you adjust dates or time slots, the form tells you "N sessions · X.Xh total study time".
- **Inline validation** — bad input shows friendly warnings instead of a popup.
- **Import / Export JSON** — save your plan, share it, or reload it later. Exports include checklist ticks so you can back up progress or move it between devices.
- **Optional cloud sync** (Google Sign-in + Firebase) — turn it on and your plan + ticks follow you between phone / laptop / tablet, and you can share a plan with another user by email. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for the 10-minute one-time setup. Completely optional — the app works fully offline without it.
- **Dark mode** — toggle in the header.
- **Print / PDF** — a single click opens the browser print dialog with only the plan visible. Choose "Save as PDF" to export.
- **Fully offline** — works on plane mode. No external JS, no external fonts, no tracking.
- **Unicode-friendly** — works with Chinese (华文), Malay (Bahasa Melayu), or any other script.

## How the scheduler works

1. Total available minutes are summed across the date range based on your slot settings.
2. A configurable percentage (default 15%) is reserved at the tail end for review + mock quizzes.
3. Each topic gets a time budget proportional to `pages × subject_weight`.
4. Subjects are **interleaved round-robin** so you don't do the same subject back-to-back.
5. Long topics are **split across sessions** automatically (labelled "part 1", "part 2", ...).
6. The final review sessions are populated with a mock-quiz session, per-subject full-reviews, and a light flashcard session on the last day.

## Usage

### Online

Open the GitHub Pages URL above.

### Offline

Clone the repo and open `index.html` in any modern browser:

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
# Double-click index.html, or:
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

## Cloud sync (optional)

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for step-by-step instructions.

Summary:

1. Create a free Firebase project (no credit card needed).
2. Enable **Google Sign-in** and **Firestore Database**.
3. Paste the generated config into `firebase-config.js`.
4. Paste the rules from `firestore.rules` into Firebase Console → Firestore → Rules → Publish.
5. Push to GitHub. Done.

Then, on the site, you'll see a **Sign in with Google** button top-left. After signing in:
- Your plan and checklist auto-sync to your Firestore in real time.
- Open the site on another device, sign in with the same Google account — everything is already there.
- Click **+ New** to keep multiple named plans (e.g. "Mid-year exam", "Final exam").
- Click **Share…** to invite another user by email — both can edit and tick in real time.

Privacy: plans are stored in *your* Firebase project (under your Google account). Nobody else — including the author of this app — can see them. The Firestore security rules in `firestore.rules` enforce that a plan is only readable/writable by users whose Google email is on its `memberEmails` list.

## Tech

Single HTML file plus two small ES modules (`cloud-sync.js`, `firebase-config.js`). Vanilla JavaScript, plain CSS, no framework, no build step. The only external dependency is Firebase — and only when you opt in.

## License

MIT — use it however you like.
