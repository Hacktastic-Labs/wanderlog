# WanderLog

WanderLog is a privacy-first personal location journal that helps users log visits, explore movement patterns, and revisit memories on a beautiful world map.

This implementation ships a production-grade Version 1 centered on manual check-ins and full travel history, while preparing architecture for Version 2 background/automatic visit detection.

## Stack

- Expo SDK 56 + React Native + TypeScript
- Expo Router (native tabs)
- Zustand + AsyncStorage (local persistence)
- TanStack Query
- React Native Maps
- Expo Location + Expo Task Manager
- React Native Reanimated

## Features in this build

- Three native tabs: Home, Explore (Map / Timeline / Stats), Profile
- Manual check-ins with reverse geocoding and category inference
- Foreground location tracking + background tracking architecture
- Visit detection engine (radius + duration based)
- Interactive map with markers, clustering, heat circles, filters
- Timeline grouped by month and day with search
- Rich statistics, streaks, category breakdowns, rankings
- Profile privacy controls (pause tracking, background toggle, export, delete local data)
- Offline queue for pending check-ins and local state persistence
- Life replay component architecture for chronological map playback

## Data & auth (current)

The mobile app does **not** use Supabase. Visits and location points are stored locally via Zustand (`wanderlog-visits` in AsyncStorage). Database schema for the backend lives in the repo root at `supabase/schema.sql` (for `apps/api` when implemented).

Authentication is disabled by default (`AUTH_ENABLED = false` in `src/constants/features.ts`). The app opens directly to tabs with a local dev user. Set `AUTH_ENABLED` to `true` only after wiring `apps/api` auth in `src/services/api/auth.api.ts`.

No `.env` keys are required to run the app in local-only mode.

## Run locally

From the repository root:

```bash
pnpm install
pnpm android
```

Or from this directory: `pnpm start`, `pnpm android`, etc.

For background location testing, use a development build and not Expo Go.

## Scalable folder structure

```text
src/
   app/
      (auth)/
      (tabs)/
         home.tsx
         explore.tsx
         profile.tsx
   components/wanderlog/
   constants/
   hooks/
   services/
      api/
      location/
   stores/
   types/
   utils/
```
