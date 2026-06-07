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