package places

import (
	"context"

	"github.com/uptrace/bun"
)

type PlacesRepository struct {
	db *bun.DB
}

func NewPlaceRepo(db *bun.DB) *PlacesRepository {
	return &PlacesRepository{db: db}
}

func (r *PlacesRepository) SavePlaces(place *Place) error {
	_, err := r.db.NewInsert().Model(place).Returning("*").Exec(context.Background())
	if err != nil {
		return err
	}
	return nil
}
