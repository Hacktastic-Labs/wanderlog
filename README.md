# WanderLog

Privacy-first personal location journal — log visits, explore movement patterns, and revisit memories on a map.

This repository is a **pnpm monorepo**. The Expo mobile app lives under `apps/mobile`. Database schema and migrations are under `supabase/`.

## Repository layout

```text
wanderlog/
├── apps/
│   ├── mobile/          # Expo SDK 56 app (@wanderlog/mobile)
│   └── backend/         # Go HTTP API (initialize with go mod init)
├── supabase/
│   └── schema.sql
├── package.json         # workspace root
└── pnpm-workspace.yaml
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/installation)
- Expo tooling (see [apps/mobile/README.md](./apps/mobile/README.md))

## Install

From the repository root:

```bash
pnpm install
```

## Run the mobile app

From the repository root:

```bash
pnpm start
# or
pnpm android
pnpm ios
pnpm web
```

You can also run commands from `apps/mobile` with `pnpm start`, etc.

## Backend API

Go service skeleton lives in [apps/backend](./apps/backend/). Run `go mod init` there when you are ready — see [apps/backend/README.md](./apps/backend/README.md).

## Database

`supabase/schema.sql` is the reference schema for the backend (Postgres/Supabase on the server). The mobile app stores data locally until `apps/backend` is connected — no Supabase keys required in the client.

## License

See [LICENSE](./LICENSE).
