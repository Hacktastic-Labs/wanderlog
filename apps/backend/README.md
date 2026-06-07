# WanderLog Backend

Go HTTP API for WanderLog. Initialize the module from this directory:

```bash
cd apps/backend
go mod init github.com/<your-org>/wanderlog/apps/backend
```

Suggested next steps:

```bash
# add entrypoint in cmd/server/main.go
go run ./cmd/server
```

## Layout

```text
apps/backend/
├── cmd/server/          # main, wiring
├── internal/
│   ├── config/        # env, settings
│   ├── http/          # router, middleware
│   ├── handler/       # HTTP handlers (auth, visits, profile, location)
│   ├── service/       # business logic
│   └── repository/    # database / external clients
└── .env.example
```
