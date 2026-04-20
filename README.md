# Study Plan Generator

A single-file, offline web app that turns your exam subjects, topics, and available time into a printable day-by-day study schedule.

No build step. No server. No dependencies. Just open `index.html` in a browser.

## Live demo

Once GitHub Pages is enabled on this repo, the site is available at:

```
https://<your-username>.github.io/<repo-name>/
```

## What it does

1. You enter:
   - **Start and end date** for the study period
   - **Time slots per day** — weekday afternoon/evening, Sat/Sun morning/afternoon/evening (in minutes; set to 0 to skip)
   - **Subjects and topics** — each topic has a name and a page range; each subject has a difficulty weight (Light / Normal / Heavy / Very heavy)
   - **Review allowance** — 0–25% of total time reserved at the end for revision
2. You click **Generate plan**.
3. The page renders:
   - A **stats strip** — total study hours, days, subject count, topic count
   - A **subject-allocation table** showing how the time is split
   - A **day-by-day schedule** — each day's sessions with exact tasks, page ranges, and minutes
   - A **coverage checklist** — every topic with a tick-box and the date it's scheduled
4. Click **Print / Save PDF** to print or save as a PDF. The form column is hidden during print.

## How the scheduler works

- Total available minutes are summed across the date range based on your slot settings.
- A configurable percentage (default 15%) is reserved at the tail end for review + mock quizzes.
- Each topic gets a time budget proportional to `pages × subject_weight`.
- Subjects are **interleaved round-robin** so you don't do the same subject back-to-back.
- Long topics are **split across sessions** automatically (labelled "part 1", "part 2", ...).
- The final review sessions are populated with a mock quiz, per-subject full-reviews, and a light flashcard session on the last day.

## Features

- **Fully offline** — no external JS or CSS; no network calls
- **Unicode-friendly** — works with Chinese (华文), Malay (Bahasa Melayu), or any other script
- **Print-optimized** — clean A4 layout when printing, form column hidden, rows don't break
- **Responsive** — form collapses above the output on narrow screens
- **Sample data** — click "Load sample" to see a working Year 6 schedule instantly

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

## Tech

Single HTML file with:

- Vanilla JavaScript — no framework
- Plain CSS — no preprocessor, no Tailwind
- Zero dependencies

## License

MIT — use it however you like.
