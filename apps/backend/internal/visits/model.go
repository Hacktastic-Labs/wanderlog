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