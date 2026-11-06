# Implementation progress

Status: 6 November 2026. **23 published, functional games**, including **six Moroccan games**. Every published card opens actual gameplay with at least eight sourced items/questions. The complete 112-mode reference inventory and implementation mapping are in [GAME_INVENTORY.md](GAME_INVENTORY.md).

## Completed

- Original dark Moroccan identity, independently sourced local imagery, responsive catalog, filtering/search, ordering, bookmarks and functional navigation.
- Darija default, Arabic/French/English switching, RTL/LTR layouts, self-hosted fonts.
- Shared comparison and true/false engine, shuffled nonrepeating finite decks, explicit ties, classic/three-life relaxed modes, animated reveals, feedback, sound/mute, results and replay.
- Local history/high scores, profile, six unlockable achievements, challenge links, WhatsApp sharing and downloadable PNG score cards.
- Server-owned guest/authenticated runs, conditional per-turn updates, dataset snapshots and validated scoring.
- Optional email/password accounts, salted password hashes, expiring token-hash sessions, sign-out, editable names/country and cross-device score history.
- Real global/Morocco/game leaderboards; no placeholder players. Classic and daily scores are separated from relaxed practice.
- Deterministic ten-round daily challenges with first-attempt account/device uniqueness and resume behavior.
- Restricted persistent dataset editor, active/inactive publication state, source/date/scope validation, public source inventory and JSON downloads.
- Working D1 storage, SQL migrations, optional Prisma/PostgreSQL HTTP adapter, PostgreSQL schema/migration and setup instructions.
- REA catalog and representative reference gameplay investigation; REA replay of local mobile quiz; Playwright coverage of all published game APIs, catalog, language persistence, mobile gameplay, authentication, score validation and sharing download.

## Completed games

| Group | Modes |
| --- | --- |
| Morocco | Commune population, mountain elevations, post-independence Botola titles, UNESCO inscription chronology, Morocco true/false facts, Moroccan World Heritage culture quiz |
| World | Country area, 2023 country population, 2023 population density, land-border neighbours, completed-building heights |
| Sports | Historical World Cup scorers, World Cup titles through 2022 |
| Science | Atomic number, atomic mass, boiling point in kelvin, planet mass, planet diameter |
| Gaming | Pokémon base-stat sum, base speed, weight |
| Entertainment | Film theatrical runtime, film release year |

## Partial / requiring configuration

- The Moroccan history requirement is currently represented by **UNESCO inscription chronology**, not a comprehensive national historical-event timeline.
- The Moroccan culture quiz currently focuses on World Heritage rather than music, architecture, cuisine and history broadly.
- Arabic UI is present, but some game/editorial copy retains Darija phrasing; a complete MSA editorial pass is not finished.
- PostgreSQL schema/client generation and compilation are verified. A live PostgreSQL database has **not** been connected or integration-tested; D1 is the tested backend.
- Admin mutations require the operator to set `ADMIN_EMAIL` and create/sign into that matching account. There is no default admin account.
- Data refresh scripts exist, but scheduled production ingestion has not been configured.
- Reference inventory coverage is complete for the 112 cards discoverable on the captured catalog. Interactive behavior was sampled, not exhaustively audited across all 112 modes or reference mobile views.

## Unimplemented / unpublished

- Moroccan football-player market values, YouTube creator subscribers, celebrity follower counts and song views.
- Moroccan commune areas with consistent boundaries, standardized dish-calorie estimates and broader national-event chronology.
- The remaining reference modes: live social/search metrics, current market values/ratings/salaries, tennis, aviation, cars, animal metrics, box office/budgets/IMDb, rivers/islands, location-specific stores/populations, Eurovision, and other video-game datasets. See the per-mode inventory rather than assuming a category is complete.
- Password reset, email verification, account deletion UI, friend lists, multiplayer rooms, bot-resistant competition and moderation tools.

## Verification

The Playwright suite covers numerical comparison/ties, seeded decks, Moroccan daily-date boundaries, all 23 catalog datasets, every game's start/correct-answer API, wrong-answer/game-over behavior, relaxed lives, ownership, duplicate/concurrent submissions, forged score rejection, cross-origin rejection, daily resume/determinism, registration/login/logout, cross-device progress, real leaderboard publication, catalog interactions, all four language directions, scorecard download and mobile layout. Browser screenshots and HTML reports are generated under ignored `outputs/`.

Deployment and final verification details are recorded in README and the final handoff. No claim is made that the unimplemented catalog or live PostgreSQL path is complete.

Final production-artifact run: **12 passed**, with one duplicate mobile-only case intentionally skipped in the desktop project. TypeScript and the Worker production build pass. The production run includes actual link navigation, data/API validation, account persistence and mobile RTL/LTR. A local-proxy health GET is required after the intentional cross-origin rejection probe. PostgreSQL and configured-admin write access are not covered by these integration results.
