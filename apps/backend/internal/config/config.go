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
