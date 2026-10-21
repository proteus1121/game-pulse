# Game Pulse

Live GA4 dashboard for my Firebase games, hosted on GitHub Pages. No backend:
the page signs in with Google (read-only `analytics.readonly`) and queries
the GA4 Data API and Admin API straight from the browser. Every GA4 property
the signed-in account can read shows up as a tab.

- "Сейчас в игре": Realtime API, last 30 minutes, refreshed every minute.
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
- A Google token lasts an hour; after that the page shows "Войти снова".
  With the consent screen in Testing mode Google may also ask to sign in
  again after 7 days.
