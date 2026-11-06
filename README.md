# KTER WLA 9EL — كتر ولا قل

A playable Moroccan higher-or-lower platform: **23 sourced games**, six Moroccan modes, Darija-first RTL design, Arabic/French/English switching, server-validated gameplay, guest play, optional accounts, real leaderboards, daily challenges, achievements, favorites and score sharing.

## Run locally

Requirements: Node 22.13+ and npm. On Windows PowerShell, use `npm.cmd` / `npx.cmd` when script execution policy blocks npm.ps1.

```powershell
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run build
npm.cmd run db:migrate:local
npm.cmd run dev
```

Open **http://127.0.0.1:5173**. A migrated development database is already present in this workspace; it is ignored by Git. The migration helper records applied files and skips them on subsequent runs. To test the built Worker, stop the dev process and run `npm.cmd start`; Wrangler prints its local URL.

The local source is in the `kter-wla-9el` subdirectory of the supplied workspace. All photographs, flags and fonts used in normal play are stored locally; open-data refresh scripts require internet access. No service credentials are needed for the default D1 runtime.

## Technology

React 19, TypeScript, Next.js App Router APIs through the Sites-supported **Vinext** Worker runtime, Tailwind CSS 4, Motion, next-intl, Zustand and Zod. Cloudflare D1 is the working default database. An optional **PostgreSQL / Prisma Accelerate** adapter, Prisma schema and SQL migration are included. Standard `next dev` / `next start` is not the configured runtime; use the scripts above.

## Routes

- `/`: home and curated catalog.
- `/games`: all active games, category/search filters, favorites and sorting.
- `/morocco`: Moroccan collection.
- `/games/{id}`: full comparison/quiz flow, classic/relaxed difficulty, animated reveals, sound, restart and results.
- `/daily`: common ten-round challenge seeded by the Moroccan calendar date; first attempt resumes and counts.
- `/leaderboard`: local/global/Morocco rankings, with game/daily filters.
- `/profile`: guest/account progress, editable name/country, achievements and recent history.
- `/how-to-play`, `/about`, `/sources`, `/privacy`: help, source inventory and policies.
- `/admin`: restricted persistent dataset editor.

During play, use Higher/Lower buttons or the up/down arrows (`w`/`s`). Press Enter after feedback to continue. A correct answer earns one point. Equal values accept either choice. Classic has one life; relaxed has three. Decks do not repeat items within a run and finish at the last item.

## Accounts, scores and admin

Create an optional account on `/profile`. Passwords use salted PBKDF2 hashes; sessions use random HTTP-only cookies whose hashes are stored server-side. Scores are calculated from answers and the run’s snapshotted dataset, not accepted from the client. Only completed authenticated classic games enter public leaderboards; relaxed practice and daily results are separated. Empty leaderboards show an honest empty state.

Set **`ADMIN_EMAIL`** as a runtime secret to the email of an account you control, then sign in to that account. `/admin` can edit a source/date/scope and localized dataset as JSON, validate it, and enable/disable its game. No default administrator or password is shipped. Datasets require at least eight uniquely identified entries. Existing runs retain their original data when an administrator edits a game.

For local admin testing, put `ADMIN_EMAIL="you@example.com"` in ignored `.dev.vars` and restart the server. Set production values through Sites runtime environment settings. Never commit credentials.

## Optional PostgreSQL

The hosted Worker connects over HTTP using Prisma Accelerate / Prisma Postgres:

1. Provision a PostgreSQL database and a Prisma Accelerate/Prisma Postgres connection URL.
2. Apply `prisma/migrations/202611060001_initial/migration.sql`, or run `prisma migrate deploy` with a direct PostgreSQL URL supplied through your local environment.
3. Set the hosted **`DATABASE_URL`** runtime secret to its `prisma://` or `prisma+postgres://` HTTP connection URL and redeploy.
4. Verify registration, run creation and leaderboards against that database before switching existing traffic.

Without `DATABASE_URL`, D1 is used. Existing D1 records are not automatically migrated to PostgreSQL. Prisma schema validation, client generation and application compilation pass; live PostgreSQL integration remains untested because no database credentials were supplied.

## Tests and data

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

The tests expect a running migrated app on port 5173. Set `TEST_BASE_URL` for another address and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` for another installed Chromium binary. The supplied configuration uses installed Chrome on Windows. Tests create actual local test accounts and scored games; they do not seed a fictional production leaderboard. Screenshots, traces and HTML reports are written to ignored `outputs/`.

`npm.cmd run data:update` refreshes the permitted public countries, World Bank, elements and PokéAPI feeds. `data/manifest.json` preserves retrieval metadata and original-payload hashes. Manual snapshots are documented with their exact scope. There is no scheduled refresh or claim of live social statistics.

## Documentation and honest scope

- [Reference analysis](docs/REFERENCE_ANALYSIS.md): REA observations and explicit coverage limits.
- [Game inventory](docs/GAME_INVENTORY.md): all **112 discoverable reference modes**, comparison rules and implementation mapping.
- [Architecture](docs/ARCHITECTURE.md): modules, database, API, scoring and security.
- [Data sources](docs/DATA_SOURCES.md): definitions, snapshot dates, attribution and refresh behavior.
- [Implementation progress](docs/IMPLEMENTATION_PROGRESS.md): completed, partial and unimplemented work.

Unpublished work includes live follower/market statistics, Moroccan dish calories and commune areas, broader historical/cultural datasets, and most of the remaining reference catalog. No fake game cards or fabricated live statistics fill those gaps. Password recovery, email verification and advanced anti-bot competition are not implemented. The Arabic interface is functional, with some Moroccan phrasing still awaiting a full MSA editorial review.

## Hosting

The tracked `.openai/hosting.json` retains the private Sites project identity. The supplied Sites workflow builds a Worker artifact, synchronizes source and deploys a saved version. D1 migrations are applied separately to the hosted database; local test users and local runtime state are not uploaded. Preserve the configured audience and project ID on updates.
