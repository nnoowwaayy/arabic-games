# Reference analysis

Audited 5–6 November 2026. Reference: https://moreorless.io/games.

## Method and evidence

The connected REA `capture_browser_scenario` provider launched the installed Chrome executable with a new, temporary, headless profile. It captured public DOM/accessibility and selected network metadata, then terminated each owned browser. Initial schema mistakes were corrected from returned validation errors before any successful capture. No account, private endpoint, source-code copying, or access-control circumvention was involved.

Evidence identifiers, observed game titles, navigation and the representative game flow are retained in [reference-evidence.json](reference-evidence.json). The catalog contains **112 discoverable game modes** and **23 navigation categories**, including Trends and New. The complete inventory is in [GAME_INVENTORY.md](GAME_INVENTORY.md).

## Structure and navigation

- `/games`: trending catalog, with horizontally scrolling category links and a responsive image-card grid.
- `/games/{category}`: topic filters. Observed topics include World, People, YouTube, Movies, Spotify, Sports, Football, Country, Tennis, Cars, Weights, Eurovision, Social Media, Pokémon, Games, Aviation, Animals, Science, Twitch, Supermarkets and Anime.
- `/game/{slug}`: game introduction, description, category links, Play button, related games, item-count/data link, achievement thresholds.
- `/game/{slug}/data`: publicly linked item inventory; its existence was observed, but its contents were not copied into this application.
- `/career-profile`: publicly linked profile entry; authenticated profile behavior was not investigated.
- Footer: contact, privacy and terms links. A global leaderboard was not established by the audit.

## Observed comparison behavior

REA interactively opened Country Size and pressed Play. The game presented two comparison panels plus an additional queued panel in the accessibility tree. The first item showed a name, image and numerical value. The second hid its value and offered Bigger and Smaller. The interface advertised keyboard shortcuts `w` and `s`.

In a controlled observed round, Uzbekistan showed 447,400 km² and Switzerland was hidden. Choosing Bigger revealed Switzerland and led to game over; the final result stated 41,284 km² for Switzerland and score 0. The reveal initially passed through 0 while the counter animated. The result screen offered Try again (`r`), Choose Gamemode, Career Profile, and sharing links. No intermediate life counter or difficulty setting was observed in this game.

The introduction advertised Bronze at 5, Silver at 10, Gold at 20, and Champion at 149 for its 150-item dataset. A score and high score appeared in play. Persistence mechanics were not proven by the bounded capture. Tie behavior was not experimentally established; the Pokémon speed description explicitly warned about ties.

## Technical and network observations

The rendered document exposed Next.js chunk paths, React Server Component prefetch requests, responsive utility-class styling, and a horizontal-scroll menu wrapper. Public image requests targeted `https://api.moreorless.io/img/`. Ads and analytics domains were also observed. No gameplay API request was established in the captured window; this does not prove that the full application has no backend. Internal server architecture, anti-cheat implementation, database and authentication remain unknown.

## Coverage limits

The full catalog and a desktop Country Size landing/start/guess/game-over sequence were inspected. The reference's 112 modes were **not all played**. Mobile reference behavior, successful-answer transitions, cross-device profiles, leaderboard validation, tie handling, and all high-score persistence semantics remain unverified. Our mobile quiz was separately replayed through REA at 390 × 844, including start, answer, explanation and source link. Complete local flows were checked with Playwright.

## Independent implementation decisions

The new design, brand, source files, visual composition and datasets are independently authored. No More or Less code, thumbnails or proprietary gameplay datasets are redistributed. The general comparison rule is implemented once, with explicit tie acceptance, finite shuffled decks, classic/relaxed lives, true/false quizzes, accessible feedback and source attribution. Unsupported data-dependent modes remain unpublished rather than being represented by placeholder game cards.
