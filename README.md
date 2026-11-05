# signal-edge-site

The Signal-Edge AI website and, next, the Signal-Edge Steps member area.

- **Stack:** Next.js (App Router, TypeScript), self-hosted brand fonts, deployed as a container to Google Cloud Run. Supabase handles sign-in and data in a later update.
- **Brand:** Live Signal. Colors, type and copy rules come from the Signal-Edge brand kit; the home page is a port of the approved homepage prototype.

## Working on it

```bash
npm ci
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run lint && npm run typecheck && npm run build
```

## How changes ship

1. Every change is a branch and a pull request into `main`.
2. CI runs lint, type checks and a production build on each pull request.
3. Tony reviews and merges. Merging to `main` deploys to Cloud Run (see [docs/deploy-gcp.md](docs/deploy-gcp.md)).
4. No keys or passwords in the repo. Runtime settings live in Cloud Run and GitHub repository variables.

## Where things live

- `app/page.tsx` · the home page
- `app/components/` · nav, waveform, forms and the Steps lesson demo
- `app/globals.css` · Live Signal styles
- `app/fonts/` · Archivo and IBM Plex Mono (SIL Open Font License)
- `lib/site.ts` · names and settings used across the site (newsletter name and cadence, preview mode)
