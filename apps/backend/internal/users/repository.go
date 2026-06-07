package users

import (
	"context"

	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetUserByID(id int64) (*User, error) {
	user := &User{}
	err := r.db.NewSelect().Model(user).Where("id = ?", id).Scan(context.Background())
	if err != nil {
		return nil, err
	}
	return user, nil
}
