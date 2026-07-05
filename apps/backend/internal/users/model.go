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

type Friendship struct {
	bun.BaseModel `bun:"table:friendships,alias:f"`

	ID int64 `bun:"id,pk,autoincrement"`

	UserID   int64 `bun:"user_id"`
	FriendID int64 `bun:"friend_id"`

	Status string `bun:"status"`

	RequestedBy int64     `bun:"requested_by"`
	RequestedAt time.Time `bun:"requested_at"`
	AcceptedAt  *time.Time `bun:"accepted_at"`

	IsDeleted bool `bun:"is_deleted"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}