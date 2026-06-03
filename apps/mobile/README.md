# WanderLog

WanderLog is a privacy-first personal location journal that helps users log visits, explore movement patterns, and revisit memories on a beautiful world map.

This implementation ships a production-grade Version 1 centered on manual check-ins and full travel history, while preparing architecture for Version 2 background/automatic visit detection.

## Stack

- Expo SDK 56 + React Native + TypeScript
- Expo Router
- NativeWind
- Zustand
- TanStack Query
- Supabase
- React Native Maps
- Expo Location + Expo Task Manager
- React Native Reanimated

## Features in this build

- Supabase authentication (login, signup, forgot password)
- Five-tab navigation: Home, Map, Timeline, Statistics, Profile
- Manual check-ins with reverse geocoding and category inference
- Foreground location tracking + background tracking architecture
- Visit detection engine (radius + duration based)
- Interactive map with markers, clustering, heat circles, filters
- Timeline grouped by month and day with search
- Rich statistics, streaks, category breakdowns, rankings
- Profile privacy controls (pause tracking, background toggle, export, delete data)
- Offline queue for pending check-ins and local state persistence
- Life replay component architecture for chronological map playback

## Environment setup

1. Copy `.env.example` to `.env`
2. Fill values:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Database setup

Run the SQL in `supabase/schema.sql` using Supabase SQL Editor.

This creates:

- `users`
- `visits`
- `location_points`
- RLS policies so users can only access their own data
- Trigger to auto-create profile rows for new auth users

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
   components/wanderlog/
   constants/
   hooks/
   lib/
   services/
      api/
      location/
   stores/
   types/
   utils/
supabase/
   schema.sql
```
