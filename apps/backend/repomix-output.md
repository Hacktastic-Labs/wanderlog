This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
internal/
  auth/
    handler.go
    service.go
    supabase.go
    types.go
  config/
    config.go
  database/
    migrations/
      00001_init_schema.sql
    conn.go
  places/
    model.go
  users/
    model.go
    repository.go
    service.go
  visits/
    model.go
go.mod
README.md
server.go
```

# Files

## File: internal/auth/handler.go
````go
package auth

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v5"
)

func SignUpPassHandler(c *echo.Context, authService *AuthService) error {
	req := new(UserSignUpRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	res, err := authService.SignUpWithEmailAndPassword(*req)
	if err != nil {
		fmt.Println("Failed to sign up", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to sign up",
		})
	}
	return c.JSON(http.StatusOK, res)
}
````

## File: internal/auth/service.go
````go
package auth

import (
	"fmt"

	"github.com/Hacktastic-Labs/wanderlog/internal/users"
	supabaseAuth "github.com/supabase-community/auth-go"
	"github.com/supabase-community/auth-go/types"
)

type AuthService struct {
	supabaseClient  supabaseAuth.Client
	usersRepository users.Repository
}

func NewAuthService(supabaseClient *supabaseAuth.Client, usersRepository users.Repository) *AuthService {
	return &AuthService{supabaseClient: *supabaseClient, usersRepository: usersRepository}
}

func (s *AuthService) SignUpWithEmailAndPassword(req UserSignUpRequest) (*types.SignupResponse, error) {
	res, err := s.supabaseClient.Signup(types.SignupRequest{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		fmt.Println("Failed to sign up supabase", err)
		return nil, err
	}
	user := &users.User{
		AuthUserID:  res.User.ID,
		Username:    req.Username,
		DisplayName: req.DisplayName,
	}
	err = s.usersRepository.CreateUser(user)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (s *AuthService) SignInWithEmailAndPassword(email string, password string) (*types.TokenResponse, error) {
	res, err := s.supabaseClient.Token(types.TokenRequest{
		GrantType: "password",
		Email:     email,
		Password:  password,
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}
````

## File: internal/auth/supabase.go
````go
package auth

import (
	"github.com/Hacktastic-Labs/wanderlog/internal/config"
	"github.com/supabase-community/auth-go"
)

func NewSupabaseClient(cfg *config.SupabaseConfig) *auth.Client {
	client := auth.New(
		cfg.ProjectReference,
		cfg.ApiKey,
	)
	return &client
}
````

## File: internal/auth/types.go
````go
package auth

type UserSignUpRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
}
````

## File: internal/config/config.go
````go
package config

import (
	"fmt"
	"log/slog"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/knadh/koanf/providers/env/v2"
	"github.com/knadh/koanf/v2"
)

type Config struct {
	Supabase SupabaseConfig `koanf:"supabase"`
	Database DatabaseConfig `koanf:"database"`
}

type SupabaseConfig struct {
	ProjectReference string `koanf:"project_reference" validate:"required"`
	ApiKey           string `koanf:"api_key" validate:"required"`
}

type DatabaseConfig struct {
	DbURL string `koanf:"db_url" validate:"required"`
}

func LoadConfig() (*Config, error) {
	_ = godotenv.Load()

	k := koanf.New(".")

	err := k.Load(env.Provider(".", env.Opt{
		Prefix: "DEV_",
		TransformFunc: func(k string, v string) (string, any) {
			s := strings.ToLower(strings.TrimPrefix(k, "DEV_"))
			prefix, rest, ok := strings.Cut(s, "_")
			if !ok {
				return s, v
			}
			return prefix + "." + rest, v
		},
	}), nil)
	if err != nil {
		return nil, fmt.Errorf("load env: %w", err)
	}

	mainConfig := &Config{}

	err = k.Unmarshal("", mainConfig)
	if err != nil {
		return nil, fmt.Errorf("unmarshal config: %w", err)
	}

	validate := validator.New()

	err = validate.Struct(mainConfig)
	if err != nil {
		return nil, fmt.Errorf("validate config: %w", err)
	}

	return mainConfig, nil
}

func (c *Config) LogValue() slog.Value {
	return slog.GroupValue(
		slog.String("supabase.project_reference", c.Supabase.ProjectReference),
		slog.String("supabase.api_key", redactSecret(c.Supabase.ApiKey)),
		slog.String("database.db_url", redactSecret(c.Database.DbURL)),
	)
}

func redactSecret(value string) string {
	if value == "" {
		return ""
	}
	if len(value) <= 8 {
		return "****"
	}
	return value[:4] + "****" + value[len(value)-4:]
}
````

## File: internal/database/migrations/00001_init_schema.sql
````sql
-- +goose Up

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    auth_user_id UUID NOT NULL UNIQUE,

    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,

    avatar_url TEXT,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE places (
    id BIGSERIAL PRIMARY KEY,

    name TEXT NOT NULL,

    description TEXT,

    address TEXT,

    city TEXT,
    state TEXT,
    country TEXT,

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    cover_image_url TEXT,

    created_by BIGINT REFERENCES users(id),

    source_type TEXT NOT NULL DEFAULT 'system',

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE visits (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL REFERENCES users(id),
    place_id BIGINT NOT NULL REFERENCES places(id),

    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),

    review TEXT,

    visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes

CREATE INDEX idx_users_auth_user_id
ON users(auth_user_id);

CREATE INDEX idx_users_username
ON users(username);

CREATE INDEX idx_places_city
ON places(city);

CREATE INDEX idx_places_state
ON places(state);

CREATE INDEX idx_places_country
ON places(country);

CREATE INDEX idx_visits_user_id
ON visits(user_id);

CREATE INDEX idx_visits_place_id
ON visits(place_id);

CREATE INDEX idx_visits_visited_at
ON visits(visited_at);

-- +goose Down

DROP TABLE IF EXISTS visits;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS users;
````

## File: internal/database/conn.go
````go
package database

import (
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

func Connect(dbURL string, logger *slog.Logger) *bun.DB {
    sqldb := sql.OpenDB(pgdriver.NewConnector(
        pgdriver.WithDSN(dbURL),
    ))
    db := bun.NewDB(sqldb, pgdialect.New())

    err := sqldb.Ping(); 
    if err != nil {
        panic(fmt.Errorf("failed to connect to database: %w", err))
    }
    logger.Info("connected to database", "dbURL", dbURL)

    return db
}
````

## File: internal/places/model.go
````go
package places

import (
	"time"

	"github.com/uptrace/bun"
)

type Place struct {
	bun.BaseModel `bun:"table:places,alias:p"`

	ID int64 `bun:"id,pk,autoincrement"`

	Name string `bun:"name"`

	Description *string `bun:"description"`

	Address *string `bun:"address"`

	City    *string `bun:"city"`
	State   *string `bun:"state"`
	Country *string `bun:"country"`

	Latitude  *float64 `bun:"latitude"`
	Longitude *float64 `bun:"longitude"`

	CoverImageURL *string `bun:"cover_image_url"`

	CreatedBy *int64 `bun:"created_by"`

	SourceType string `bun:"source_type"`

	IsDeleted bool `bun:"is_deleted"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}
````

## File: internal/users/model.go
````go
package users

import (
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type User struct {
	bun.BaseModel `bun:"table:users,alias:u"`

	ID int64 `bun:"id,pk,autoincrement"`

	AuthUserID uuid.UUID `bun:"auth_user_id"`

	Username    string `bun:"username"`
	DisplayName string `bun:"display_name"`

	AvatarURL *string `bun:"avatar_url"`

	IsDeleted bool `bun:"is_deleted"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}
````

## File: internal/users/repository.go
````go
package users

import (
	"context"
	"fmt"

	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreateUser(user *User) error {
	_, err := r.db.NewInsert().Model(user).Returning("*").Exec(context.Background())
	if err != nil {
		fmt.Println("Failed to create user db", err)
	}
	return err
}

func (r *Repository) GetUserByID(id int64) (*User, error) {
	user := &User{}
	err := r.db.NewSelect().Model(user).Where("id = ?", id).Scan(context.Background())
	if err != nil {
		return nil, err
	}
	return user, nil
}
````

## File: internal/users/service.go
````go
package users
````

## File: internal/visits/model.go
````go
package visits

import (
	"time"

	"github.com/uptrace/bun"
)

type Visit struct {
	bun.BaseModel `bun:"table:visits,alias:v"`

	ID int64 `bun:"id,pk,autoincrement"`

	UserID int64 `bun:"user_id"`

	PlaceID int64 `bun:"place_id"`

	Rating *int16 `bun:"rating"`

	Review *string `bun:"review"`

	VisitedAt time.Time `bun:"visited_at"`

	IsDeleted bool `bun:"is_deleted"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}
````

## File: go.mod
````
module github.com/Hacktastic-Labs/wanderlog

go 1.25.0

require (
	github.com/go-playground/validator/v10 v10.30.3
	github.com/joho/godotenv v1.5.1
	github.com/knadh/koanf/providers/env/v2 v2.0.0
	github.com/knadh/koanf/v2 v2.3.5
	github.com/labstack/echo/v5 v5.1.1
)

require (
	github.com/cespare/xxhash/v2 v2.3.0 // indirect
	github.com/gabriel-vasile/mimetype v1.4.13 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-viper/mapstructure/v2 v2.5.0 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/knadh/koanf/maps v0.1.2 // indirect
	github.com/leodido/go-urn v1.4.0 // indirect
	github.com/mitchellh/copystructure v1.2.0 // indirect
	github.com/mitchellh/reflectwalk v1.0.2 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.5.1 // indirect
	github.com/supabase-community/auth-go v1.5.0 // indirect
	github.com/tmthrgd/go-hex v0.0.0-20190904060850-447a3041c3bc // indirect
	github.com/tomnomnom/linkheader v0.0.0-20180905144013-02ca5825eb80 // indirect
	github.com/uptrace/bun v1.2.18 // indirect
	github.com/uptrace/bun/dialect/pgdialect v1.2.18 // indirect
	github.com/uptrace/bun/driver/pgdriver v1.2.18 // indirect
	github.com/vmihailenco/msgpack/v5 v5.4.1 // indirect
	github.com/vmihailenco/tagparser/v2 v2.0.0 // indirect
	go.opentelemetry.io/otel v1.40.0 // indirect
	go.opentelemetry.io/otel/trace v1.40.0 // indirect
	golang.org/x/crypto v0.52.0 // indirect
	golang.org/x/sys v0.45.0 // indirect
	golang.org/x/text v0.37.0 // indirect
	golang.org/x/time v0.14.0 // indirect
	mellium.im/sasl v0.3.2 // indirect
)
````

## File: README.md
````markdown
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
````

## File: server.go
````go
package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/Hacktastic-Labs/wanderlog/internal/auth"
	"github.com/Hacktastic-Labs/wanderlog/internal/config"
	"github.com/Hacktastic-Labs/wanderlog/internal/database"
	"github.com/Hacktastic-Labs/wanderlog/internal/users"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	cfg, err := config.LoadConfig()
	if err != nil {
		logger.Error("failed to load config", "error", err)
		os.Exit(1)
	}
	logger.Info("config loaded", "config", cfg.LogValue())

	dbConn := database.Connect(cfg.Database.DbURL, logger)
	defer dbConn.Close()

	e := echo.New()
	e.Use(middleware.RequestLogger())

	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	supabaseClient := auth.NewSupabaseClient(&cfg.Supabase)
	usersRepository := users.NewRepository(dbConn)
	authService := auth.NewAuthService(supabaseClient, *usersRepository)
	e.POST("/auth/signup", func(c *echo.Context) error {
		return auth.SignUpPassHandler(c, authService)
	})

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
````
