# Architecture

## Runtime

React 19, TypeScript, Next.js App Router APIs, Tailwind CSS 4, Motion, next-intl, Zustand, and Zod. The supplied Sites Vinext runtime compiles the Next-compatible application to a Cloudflare Worker. This is a Next-compatible App Router implementation, rather than a standard Node-hosted `next start` deployment. Development uses port 5173.

The default working storage is the Sites-provisioned D1 database, accessed through prepared SQL. An optional **PostgreSQL + Prisma Accelerate** backend implements the same prepared-statement interface in `lib/postgres.ts`. `prisma/schema.prisma` and a generated PostgreSQL migration are included. PostgreSQL requires an external database/Accelerate URL; its schema and client generation have been validated, but an actual PostgreSQL connection has not been exercised in this environment.

## Modules

| Module | Responsibility |
| --- | --- |
| `lib/games.ts`, `lib/extra-games.ts`, `data/` | Typed, localized, source-attributed catalog and snapshots |
| `lib/engine.ts` | Pure comparison, deterministic shuffle, formatting and Moroccan daily key |
| `lib/server.ts` | Authentication, sessions, authoritative game state, scoring and leaderboards |
| `lib/auth.ts`, `lib/database.ts`, `lib/errors.ts` | Shared authentication context, database selection and API errors without circular dependencies |
| `lib/datasets.ts` | Publication state, validated dataset overrides and admin authorization |
| `lib/postgres.ts` | Parameterized SQL adapter through the Prisma HTTP edge client |
| `components/game.tsx` | Shared comparison/quiz controller, reveal, audio, results and sharing |
| `components/catalog.tsx` | Search, categories, saved games, sorting and daily entry |
| `components/account.tsx` | Authentication, profile, achievements and leaderboards |
| `components/admin.tsx` | Restricted JSON dataset editor and active/inactive management |
| `components/player-provider.tsx`, `lib/store.ts` | Locale, preferences, local progress and account context |
| `app/api/[...route]/route.ts` | JSON API, request validation and origin checks |

## Data model

`users` stores profile identity and salted PBKDF2 hashes. `sessions` stores only SHA-256 hashes of random session tokens and expirations. `runs` stores ownership, shuffled item IDs, a complete dataset snapshot, current turn, score, lives, difficulty, daily date and completion status. `auth_attempts` implements request-rate windows. `datasets` stores administrator-authored overrides, publication status and the updating account/time.

Local/hosted D1 schemas are managed by Drizzle SQL migrations. PostgreSQL schemas are managed by Prisma migrations. Do not run the D1 migrations against PostgreSQL or switch an existing production database backend without a separate data-migration plan.

## Authoritative gameplay

1. `POST /api/runs` creates or resumes a daily run. The server chooses a shuffled deck and snapshots the dataset.
2. The response includes the known value, hidden item identity, current turn and score. It omits the hidden comparison value or quiz answer.
3. `POST /api/runs/{id}/answer` accepts only a choice and expected turn. It computes correctness from the stored snapshot.
4. A conditional update (`WHERE turn = ? AND status = 'playing'`) advances exactly once. Concurrent/stale submissions receive 409.
5. The reveal and next round are returned together. The UI waits for the player's Next action.
6. Only completed authenticated classic games enter public leaderboards. Relaxed practice scores remain separate. Daily and ordinary rankings are separate; daily uniqueness applies per account/device and date.

Every deck contains unique IDs and ends after its final comparison/question. Ties accept either comparison answer. Live dataset edits cannot change the rules of a run already in progress. Daily questions are seeded from the Africa/Casablanca calendar date. New device cookies do not provide strong guest identity; daily account identity is stronger.

## API

| Endpoint | Methods | Behavior |
| --- | --- | --- |
| `/api/catalog` | GET | Active catalog with validated overrides |
| `/api/account` | GET, PATCH | Current account and profile updates |
| `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` | POST | Optional account lifecycle |
| `/api/runs` | POST | Server-owned new/resumed run |
| `/api/runs/{id}/answer` | POST | Validate an answer once |
| `/api/progress` | GET | Authenticated cross-device history |
| `/api/leaderboard` | GET | Game, country and daily filters |
| `/api/admin/datasets` | GET | Configured administrator catalog |
| `/api/admin/datasets/{gameId}` | PUT | Validate and persist a dataset/publication update |

## Security and practical limits

HTTP-only SameSite cookies, secure production cookies, salted PBKDF2 password hashes, server-side score calculation, ownership checks, bounded inputs, rate windows, parameterized queries, React text escaping and same-origin mutation checks are implemented. Admin access requires both a signed-in account and a matching `ADMIN_EMAIL` runtime secret. There is no default administrator or demo password.

This prevents basic submitted-score manipulation, duplicate answers and cross-account run access. It does not prove a player is human: public datasets allow knowledgeable players or bots to compute answers. Advanced bot detection, password reset, email verification, account deletion and an operational moderation workflow remain future work.

Production browser QA exposed a Vinext beta link-prefetch failure. Application links use native anchors, and category changes navigate to ordinary query URLs. This retains functional browser back/forward and avoids the faulty prefetch path. In the local Wrangler proxy, a deliberate foreign-Origin security probe can restart origin routing; the test validates its 403 and waits for a healthy GET before continuing. This proxy behavior is separate from application error handling.

## Localization and persistence

Darija is the default. Arabic and Darija set document RTL; French and English set LTR. Messages, item names, units and dataset scopes have explicit locale slots. Some game names and editorial descriptions intentionally retain Moroccan phrasing in the Arabic variant; the full Modern Standard Arabic copy review remains partial. Local storage keeps locale, mute, bookmarks and guest progress. Signed-in history is fetched from the database on each device. A keyed post-hydration root avoids persisted-locale mismatches across deferred server-rendered boundaries.
