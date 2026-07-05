package auth

import "github.com/google/uuid"

type contextKey string

const ContextUserKey contextKey = "user_info"

type ContextUser struct {
	ID     uuid.UUID // Supabase auth user ID
	Email  string
	UserId int64
}
