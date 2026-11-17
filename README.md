# Game Pulse

Live GA4 dashboard for my Firebase games, hosted on GitHub Pages. No backend:
the page signs in with Google (read-only `analytics.readonly`) and queries
the GA4 Data API and Admin API straight from the browser. Every GA4 property
the signed-in account can read shows up as a tab.

- "Все игры" (first tab): every game side by side - who is playing now,
  totals for the period, bar charts per metric (active, new, time and levels
  per player, uninstalls) against the previous period, players per day
  stacked by game, a summary table. Game names, order and colours come from
  `config.js > titles`.
- Every page has two sections: "Последние 30 минут" (Realtime API, refreshed
  every minute) and "За период" (regular reports for the selected period).
- Player journeys (`journey.js`), in both sections: one row per player - country,
  city, phone (brand, model, Android) - and a time strip on an axis shared by
  all rows: sessions as grey bars, steps as marks (ads above, play on the line,
  purchases below, a red cross = removed the game; hover = what happened).
  A click opens every step, split into sessions, with params
  (mode, floor, anomaly, where the ad was...). The period section also has a
  "what players did" funnel, search and sorting.
  GA4 gives no player id, so a player is country + city + phone model +
  Android version (in the last 30 minutes: city + game version - Realtime has no
  phone model, it is looked up in the last 7 days of regular reports). Regular
  reports lag 1-3 hours behind Realtime. Params shown per game: `config.js >
  games > journey` (or picked from the level funnel and breakdowns).
- Retention (`retention.js`): cohorts by day of first session for the last
  35 days, share active again on day 1...28 - a curve, cards (day 1/7/14/28)
  and a heat table by install week on a game tab; games side by side on
  "Все игры". Independent of the selected period.
- Today / yesterday / week / month: regular reports, refreshed every 5 minutes,
  each compared with the previous period of the same length.
- "Прохождение уровней": per-level funnel for games listed in `config.js > games`
  - players who started / passed each level, attempts, losses, averages
  (time, moves, score), the level where most players leave and the hardest one,
  plus small tables (boosters, stars, purchases...). Built from event params
  registered as custom dimensions / metrics in GA4 (registered 21.10.2026;
  GA4 doesn't backfill, older events show up as "(not set)" and are skipped).

Nothing in this repo is secret. The numbers are only visible to a Google
account that has access to the GA4 properties.

## Setup

1. Google Cloud console, project `booma-balls`:
   - APIs: *Google Analytics Data API* and *Google Analytics Admin API* enabled.
   - *OAuth consent screen*: External, Testing; add yourself under Test users.
   - *Credentials > Create credentials > OAuth client ID > Web application*.
     Authorized JavaScript origins: `https://<login>.github.io` and, for local
     testing, `http://localhost:8000`.
2. Put the client ID into `config.js`.
3. Repo settings > Pages > Deploy from branch `main`, folder `/ (root)`.

Local run: `python -m http.server 8000`, then open http://localhost:8000/.

## Notes

- Filters (developer's country, Play pre-launch robots) live in `config.js`.
- The per-game events table lists every event the game sends (GA4's automatic
  ones hidden), with a plain-words description from `config.js > events`.
  A new event shows up by itself; add a line there to describe it.
- A breakdown whose param isn't registered in GA4 says so on the page instead
  of failing. Lift 13 `from`, `code`, `step` were registered 25.10.2026; Cat Sort `code`, `step` on 03.11.2026 (1.6.2).
- A Google token lasts an hour; after that the page shows "Войти снова".
  With the consent screen in Testing mode Google may also ask to sign in
  again after 7 days.
