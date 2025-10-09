# Personal Notebook

Free tool for productivity and growth based on research on personal personal productivity — it will be free, no data is gonna be transfer to anywhere, your data belongs to you.

This project is a privacy‑first personal productivity dashboard with tasks, focus blocks, and a simple mood tracker. Built with React, Tailwind CSS, and tested with Jest + React Testing Library.

## Features
- **Backlog & Today:** plan tasks and move them into today
- **Focus blocks:** quick timers for deep work sessions
- **Mood tracker:** lightweight daily mood logging
- **Privacy-first:** everything runs locally in your browser using `localStorage`

## Privacy
- No analytics. No tracking. No external data collection.
- All data is stored locally in your browser (`localStorage`).
- You can clear your data at any time from your browser settings.

## Getting Started
```bash
npm ci        # or: npm install
npm start     # start dev server at http://localhost:3000
```

## Scripts
- **Start:** `npm start`
- **Test:** `npm test`
- **Lint:** `npm run lint`
- **Build:** `npm run build`

## CI & Deploy
- GitHub Actions runs: lint → test → build on every PR/push to `main` (`.github/workflows/ci.yml`).
- On successful push to `main`, Vercel deploy is triggered via a deploy hook.

## Contributing
See `CONTRIBUTING.md` for guidelines on setup, coding standards, and PR process.

## License
Licensed under the MIT License. See `LICENSE` for details.
