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