# Contributing to Personal Notebook

Thank you for your interest in contributing! This project aims to be a free, privacy-first productivity tool.

## Getting Started
- **Clone**: `git clone https://github.com/mesbahtanvir/personal-notebook.git`
- **Install**: `npm ci` (or `npm install` locally if lockfile needs sync)
- **Run**: `npm start`
- **Test**: `npm test`
- **Lint**: `npm run lint`
- **Build**: `npm run build`

## Branching & Commits
- **Branch naming**: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`
- **Commit style** (Conventional):
  - `feat: add X`
  - `fix: resolve Y`
  - `chore: update deps`
  - `test: add unit tests for Z`

## Pull Requests
- Keep PRs focused and small where possible.
- Include tests for new logic (components, hooks, utils).
- Ensure `npm run lint` and `npm test` pass locally.
- CI runs lint → tests → build. Only green PRs are merged.

## Testing Guidelines
- Use React Testing Library for components.
- Use Jest for hooks and utilities.
- Aim for coverage on edge cases (invalid input, empty states, error paths).

## Project Structure (high-level)
- `src/components/` — UI components
- `src/pages/` — top-level pages (e.g., Dashboard)
- `src/hooks/` — custom hooks (e.g., `useLocalStorage`)
- `src/utils/` — pure helpers (`dataHelpers.js`)
- `src/tests/` — unit tests

## Coding Standards
- Follow ESLint rules (`npm run lint`).
- Prefer pure functions in `utils/` and clear prop types in components.
- Keep functions small and composable.

## Security & Privacy
- No analytics or external data collection.
- Do not introduce dependencies that transmit user data.

## Release & Deployment
- CI builds on every PR and push to `main`.
- Deploys to Vercel are triggered on `main` via a deploy hook.

## Questions?
Open an issue or start a discussion on GitHub. We’re happy to help.
