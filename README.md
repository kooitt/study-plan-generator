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
- **Import / Export JSON** — save your plan, share it, or reload it later.
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

## Tech

Single HTML file — vanilla JavaScript, plain CSS, no framework, no build step, no dependencies.

## License

MIT — use it however you like.
