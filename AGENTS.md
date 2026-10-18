# Contributor handoff

This directory is the standalone Frontier Protocol project. Do not read, import, copy, or publish unrelated/private repositories.

- Engine: `engine.js`, pure seeded transitions mutating a serializable game state.
- UI: `app.js`, DOM built from `publicView()` plus explicitly revealed private seat data.
- Run: `node server.mjs`; tests: `node --test`; build: `node build.mjs`.
- Browser QA: optional Playwright, `node scripts/browser-qa.mjs`; set `PLAYWRIGHT_PATH` if using a preinstalled package.
- Static deployment: root or generated `dist/`.
- Preserve explicit statements about scripted bots, scripted votes, local save privacy, and hybrid local governance.
- Never expose private faction/hand data in public HTML, log, or accessibility labels before game end.
- Changes to victory rules must update RULES.md, in-game manual, and tests together.
- Endgame order: resource collapse; armed takeover; eligible arrival; cycle-eight timeout; warning arm/reset.
- No secrets, tokens, environment dumps, or private account data belong in Git.

Release review: independent agent reviewed source and simulated 3,000 games, found initial balance and information-boundary defects, then re-reviewed fixes with no blocking engine finding. See QA.md for evidence and remaining scope.
