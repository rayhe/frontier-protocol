# Release QA — 2026-10-18

## Engine

`node --test` covers seeded reproducibility, save round-trip and malformed data, projection privacy, invalid actions, card scoring, historical audit evidence, temporary quarantine, all faction victories, intervention and warning reset/re-arm, resource-collapse precedence, timeout, scripted information boundaries, and resource caps.

## Balance sampling

`node scripts/simulate.mjs`, 1,000 seeds per policy. Policies restore low supplies/hull/trust and deliberate at high control. These are scripted experiments, not human session statistics.

| Crisis policy | Compact wins | Custodian wins | Everyone loses |
| --- | ---: | ---: | ---: |
| Always open | 426 | 0 | 574 |
| Always oversight | 619 | 381 | 0 |
| Adaptive (oversight below control 3) | 454 | 0 | 546 |

Always oversight is strong under this scripted policy, but has substantial takeover risk. No claim of fully balanced competitive play is made. Testing informed off-suit support, slower difficulty escalation, and an antagonist that cooperates until route progress 3.

## Independent review

A separate reviewer inspected the implementation and simulated 3,000 initial games. Initial blockers: excessive Custodian advantage, audits exposing identity, voting reading another role, and immediate takeover without intervention. All were revised. Re-review reported no blocking engine defect; follow-ups for quarantine test specificity, warning re-arm, save validation, and cycle-eight documentation were incorporated.

## Browser and visual checks

Automated Chrome checks exercise Field manual modal and Escape, solo contribution/resolution, autosave reload/resume, confidential audit display, 390px layout without horizontal overflow, and all four private local handoffs. A full solo expedition is played through the actual controls to a definitive ending. Page errors fail the script. Desktop and mobile screenshots are retained in `screenshots/` and inspected visually.

Release result: **14/14 engine tests passed** locally and in GitHub Actions. The browser suite passed against both the local server and the published HTTPS site at https://rayhe.github.io/frontier-protocol/. GitHub Pages reported `built`, HTTPS enforcement enabled. The complete browser expedition reached the cycle-eight ending without errors.

## Known limits

- Only Chrome automation has been run; no broad assistive-technology or cross-browser certification.
- No human balance study. Session length is an estimate, particularly dependent on local discussion.
- Scripted bots and scripted council votes. Local mode has one council chair and four private contributors, not four equal governance seats.
- Secrets exist in client memory and localStorage. The projection and handoff prevent accidental screen exposure, not inspection by a determined player.
- Crisis prose, suit, and threatened resource vary, while the two governance choices share one rule structure.
- Emancipator can share Compact victory; it is not necessarily an enemy. Its independent agency is mainly expressed through local discussion in v1.
- No remote multiplayer, user accounts, or cloud saves.
