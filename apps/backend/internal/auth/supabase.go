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
